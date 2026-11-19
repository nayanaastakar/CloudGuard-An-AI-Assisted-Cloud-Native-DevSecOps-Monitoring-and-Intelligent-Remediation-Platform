"""CloudGuard Provenance and Evidence Schemas.

Represents data provenance across all security signals:
- live: Collected directly from real infrastructure or scanners
- stale: Previously collected live data that has exceeded freshness TTL
- demo: Simulated/mock data used when real components are unavailable
- unavailable: Target system unreachable or scanner not installed
- error: A collection attempt failed or returned invalid data
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ProvenanceState(str, Enum):
    LIVE = "live"
    STALE = "stale"
    DEMO = "demo"
    UNAVAILABLE = "unavailable"
    ERROR = "error"


class ProvenanceMetadata(BaseModel):
    state: ProvenanceState = Field(
        default=ProvenanceState.DEMO,
        description="Data provenance: live, stale, demo, unavailable, or error"
    )
    source: str = Field(..., description="Origin of the data (e.g., k8s-api, trivy, prowler, demo-generator)")
    last_synced_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of the last successful data collection"
    )
    last_attempted_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp of the last attempted synchronization"
    )
    is_fresh: bool = Field(default=True, description="Whether data freshness is within TTL")
    ttl_seconds: int = Field(default=120, description="Freshness TTL in seconds")
    error_message: Optional[str] = Field(
        default=None,
        description="Error details if state is unavailable or degraded"
    )
    collector_version: Optional[str] = Field(default=None, description="Version of the scanner or collector tool")


def determine_provenance(
    is_live_source: bool,
    last_sync: Optional[datetime] = None,
    ttl_seconds: int = 120,
    error: Optional[str] = None,
    source_name: str = "cluster",
) -> ProvenanceMetadata:
    """Helper to compute deterministic provenance metadata."""
    now = datetime.now(timezone.utc)
    if error and not is_live_source:
        return ProvenanceMetadata(
            state=ProvenanceState.UNAVAILABLE,
            source=source_name,
            last_synced_at=last_sync or now,
            last_attempted_at=now,
            is_fresh=False,
            ttl_seconds=ttl_seconds,
            error_message=error
        )
    if not is_live_source:
        return ProvenanceMetadata(
            state=ProvenanceState.DEMO,
            source="demo-engine",
            last_synced_at=now,
            last_attempted_at=now,
            is_fresh=True,
            ttl_seconds=ttl_seconds
        )
    
    # Live source: verify freshness against TTL
    sync_time = last_sync or now
    age = (now - sync_time).total_seconds()
    is_fresh = age <= ttl_seconds

    return ProvenanceMetadata(
        state=ProvenanceState.LIVE if is_fresh else ProvenanceState.STALE,
        source=source_name,
        last_synced_at=sync_time,
        last_attempted_at=now,
        is_fresh=is_fresh,
        ttl_seconds=ttl_seconds,
        error_message=error
    )
