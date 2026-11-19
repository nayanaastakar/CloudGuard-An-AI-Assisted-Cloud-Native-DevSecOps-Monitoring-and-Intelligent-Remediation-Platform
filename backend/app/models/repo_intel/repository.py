"""SQLAlchemy models for Repository Intelligence module.

These models are added to the existing CloudGuard backend. They live under
`backend/app/models/repo_intel/`.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import relationship

from app.models.base import Base


class RepoIntelRepository(Base):
    """A GitHub repository imported by a user."""

    __tablename__ = "repo_intel_repository"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    github_owner = Column(String, nullable=False)
    repo_name = Column(String, nullable=False)
    github_url = Column(String, nullable=False)
    default_branch = Column(String, nullable=True)
    imported_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id", "github_owner", "repo_name", name="uq_user_repo"),)

    analyses = relationship("RepoIntelAnalysis", back_populates="repository", cascade="all, delete-orphan")


class RepoIntelAnalysis(Base):
    """An analysis run against a specific repository import."""

    __tablename__ = "repo_intel_analysis"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repo_intel_repository.id"), nullable=False, index=True)
    branch = Column(String, nullable=True)
    commit_sha = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending, running, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)  # Full analysis JSON payload

    repository = relationship("RepoIntelRepository", back_populates="analyses")
