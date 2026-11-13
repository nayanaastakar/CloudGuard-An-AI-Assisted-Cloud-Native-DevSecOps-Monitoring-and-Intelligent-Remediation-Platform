<#
 CloudGuard control script (Windows PowerShell 5.1+ / 7).
 Usage:  .\scripts\cg.ps1 <ports|start|stop|status|logs|backup> [core|frontend|monitoring|all]
 Safety: never runs down/prune/-v. 'ports' is strictly read-only (no docker changes, no process control).
#>
param(
  [Parameter(Position=0, Mandatory=$true)][ValidateSet('ports','start','stop','status','logs','backup')][string]$Action,
  [Parameter(Position=1)][ValidateSet('core','frontend','monitoring','all')][string]$Target = 'core'
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

# Reads one non-secret setting from .env (never prints or returns anything else).
function Get-EnvValue([string]$Name, [string]$Default) {
  if (-not (Test-Path .env)) { return $Default }
  $line = Get-Content .env | Where-Object { $_ -match "^\s*$Name\s*=" } | Select-Object -First 1
  if (-not $line) { return $Default }
  $v = (($line -split '=', 2)[1] -replace '\s+#.*$', '').Trim()
  if ([string]::IsNullOrWhiteSpace($v)) { return $Default }
  return $v
}

# service, .env variable, default port
$PortTable = @(
  @{ Svc = 'frontend'; Var = 'CG_FRONTEND_PORT'; Def = 3001 },
  @{ Svc = 'backend';  Var = 'CG_BACKEND_PORT';  Def = 8001 },
  @{ Svc = 'postgres'; Var = 'CG_POSTGRES_PORT'; Def = 5433 },
  @{ Svc = 'redis';    Var = 'CG_REDIS_PORT';    Def = 6380 }
)

function Get-PortOwner([int]$Port) {   # read-only lookup
  $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $c) { return $null }
  $p = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
  if ($p) { return "$($p.ProcessName) (PID $($c.OwningProcess))" } else { return "PID $($c.OwningProcess)" }
}
function Test-CgRunning([string]$Svc) {   # read-only; false if Docker is not running
  try { return ((docker ps --filter "name=^cloudguard-$Svc$" --format '{{.Names}}' 2>$null) -eq "cloudguard-$Svc") } catch { return $false }
}
function Show-Ports([string[]]$Only) {
  $conflict = $false
  foreach ($e in $PortTable) {
    if ($Only -and $Only -notcontains $e.Svc) { continue }
    $port = [int](Get-EnvValue $e.Var $e.Def)
    $owner = Get-PortOwner $port
    if (-not $owner)                    { $state = 'free' }
    elseif (Test-CgRunning $e.Svc)      { $state = "in use by CloudGuard container ($owner)" }
    else                                { $state = "BUSY - $owner"; $conflict = $true }
    '{0,-9} {1,-17} port {2,-5} {3}' -f $e.Svc, $e.Var, $port, $state
  }
  return $conflict
}

$Targets = @{
  core       = @{ Profile = $null;         Services = @('postgres','redis','backend'); PortSvcs = @('postgres','redis','backend') }
  frontend   = @{ Profile = 'frontend';    Services = @('frontend');                   PortSvcs = @('frontend') }
  monitoring = @{ Profile = 'monitoring';  Services = @('prometheus','grafana','loki'); PortSvcs = @() }   # Phase 2
}

switch ($Action) {
  'ports' {   # 'core' and 'all' both report all four agreed ports: 3001, 8001, 5433, 6380
    if ($Target -eq 'monitoring') { 'Monitoring ports are defined in Phase 2.'; break }
    if ($Target -eq 'frontend')   { [void](Show-Ports @('frontend')); break }
    [void](Show-Ports $null)
    'Note: 3001 is normally used by the native Vite dev server, so "BUSY (node)" there is expected during UI development.'
  }
  'start' {
    if ($Target -eq 'all') { throw "Start targets one integration at a time. Use core, frontend or monitoring." }
    if (-not (Test-Path .env)) { throw "Missing .env. Copy .env.example to .env and fill in the secrets." }
    $t = $Targets[$Target]
    if ($t.PortSvcs.Count -gt 0 -and (Show-Ports $t.PortSvcs)) { throw "Port conflict. Change the port in .env or free it yourself; this script will not stop other processes." }
    $pa = @(); if ($t.Profile) { $pa = @('--profile', $t.Profile) }
    docker compose @pa up -d $t.Services
  }
  'stop' {
    if ($Target -eq 'all') { $list = @('frontend','monitoring','core') } else { $list = @($Target) }
    foreach ($n in $list) {
      $t = $Targets[$n]; $pa = @(); if ($t.Profile) { $pa = @('--profile', $t.Profile) }
      docker compose @pa stop $t.Services   # 'stop' keeps containers and named volumes
    }
  }
  'status' {
    docker compose --profile frontend --profile monitoring ps
    docker stats --no-stream --format 'table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}'
  }
  'logs' {
    if ($Target -eq 'all') { throw "Choose core, frontend or monitoring." }
    $t = $Targets[$Target]; $pa = @(); if ($t.Profile) { $pa = @('--profile', $t.Profile) }
    docker compose @pa logs --tail 100 -f $t.Services
  }
  'backup' {
    New-Item -ItemType Directory -Force backups | Out-Null
    $user = Get-EnvValue 'CG_POSTGRES_USER' 'cloudguard'; $db = Get-EnvValue 'CG_POSTGRES_DB' 'cloudguard'
    $file = "cloudguard-$(Get-Date -Format 'yyyyMMdd-HHmmss').dump"
    docker exec cloudguard-postgres pg_dump -U $user -d $db -Fc -f "/tmp/$file"
    docker cp "cloudguard-postgres:/tmp/$file" "backups\$file"
    docker exec cloudguard-postgres rm "/tmp/$file"
    "Backup written to backups\$file"
  }
}