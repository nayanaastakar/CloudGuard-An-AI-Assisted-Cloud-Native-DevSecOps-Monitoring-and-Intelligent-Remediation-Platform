"""Repo‑Intel API routes.

Provides a minimal set of endpoints:
* GET /repo‑intel/ – health status of the module
* GET /repo‑intel/repositories – list repositories imported by the current user
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.repo_intel.repository import RepoIntelRepository
from app.models.user import User  # type: ignore  # User model exists in the project

router = APIRouter(prefix="/repo-intel", tags=["Repo Intel"])

# -------------------------------------------------------------------
# Module status
# -------------------------------------------------------------------
@router.get("/", summary="Repo‑Intel module status")
async def repo_intel_status(current_user: User = Depends(get_current_user)):
    return {"status": "ok", "module": "repo_intel"}

# -------------------------------------------------------------------
# List repositories for the authenticated user
# -------------------------------------------------------------------
@router.get("/repositories", summary="List user's imported repositories")
async def list_user_repositories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(RepoIntelRepository).where(RepoIntelRepository.user_id == current_user.id)
    result = await db.execute(stmt)
    repos = result.scalars().all()
    # Return a lightweight representation
    return [
        {
            "id": repo.id,
            "github_owner": repo.github_owner,
            "repo_name": repo.repo_name,
            "github_url": repo.github_url,
            "imported_at": repo.imported_at.isoformat() if repo.imported_at else None,
        }
        for repo in repos
    ]
