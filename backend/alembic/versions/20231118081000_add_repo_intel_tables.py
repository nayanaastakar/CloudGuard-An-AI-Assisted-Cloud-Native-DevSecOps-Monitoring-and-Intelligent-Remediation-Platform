"""Add repo_intel tables

Revision ID: 20231118081000
Revises: 8dfcaf130a4a_add_pipeline_approval_system
Create Date: 2023-11-18 08:10:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20231118081000"
down_revision = "8dfcaf130a4a"
branch_labels = None
depends_on = None


def upgrade():
    # ------------------------------------------------------------
    # repo_intel_repository table (matches the SQLAlchemy model)
    # ------------------------------------------------------------
    op.create_table(
        "repo_intel_repository",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column(
            "user_id",
            sa.String(length=36),
            sa.ForeignKey("users.id"),  # no cascade – aligns with model
            nullable=False,
        ),
        sa.Column("github_owner", sa.String(), nullable=False),
        sa.Column("repo_name", sa.String(), nullable=False),
        sa.Column("github_url", sa.String(), nullable=False),
        sa.Column("default_branch", sa.String(), nullable=True),
        sa.Column(
            "imported_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.UniqueConstraint(
            "user_id", "github_owner", "repo_name", name="uq_user_repo"
        ),
    )
    # explicit index for user_id (SQLAlchemy model defines index=True)
    op.create_index(
        "ix_repo_intel_repository_user_id", "repo_intel_repository", ["user_id"], unique=False
    )

    # ------------------------------------------------------------
    # repo_intel_analysis table (matches the model)
    # ------------------------------------------------------------
    op.create_table(
        "repo_intel_analysis",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("repository_id", sa.Integer(), nullable=False),
        sa.Column("branch", sa.String(), nullable=True),
        sa.Column("commit_sha", sa.String(), nullable=True),
        sa.Column(
            "status",
            sa.String(),
            nullable=False,
            server_default="pending",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("finished_at", sa.DateTime(), nullable=True),
        sa.Column("result", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint([
            "repository_id"], ["repo_intel_repository.id"]  # no cascade – aligns with model
        ),
    )
    # explicit index for repository_id (SQLAlchemy model defines index=True)
    op.create_index(
        "ix_repo_intel_analysis_repository_id", "repo_intel_analysis", ["repository_id"], unique=False
    )


def downgrade():
    # Drop indexes first (Alembic will drop them automatically when tables are dropped,
    # but we define them explicitly for clarity)
    op.drop_index("ix_repo_intel_analysis_repository_id", table_name="repo_intel_analysis")
    op.drop_index("ix_repo_intel_repository_user_id", table_name="repo_intel_repository")
    # Then drop tables
    op.drop_table("repo_intel_analysis")
    op.drop_table("repo_intel_repository")
