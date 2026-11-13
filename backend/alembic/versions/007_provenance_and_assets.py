"""Add provenance and asset SBOM models

Revision ID: 007_provenance_and_assets
Revises: 38db47245c05
Create Date: 2026-11-09 23:30:00.000000
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '007_provenance_and_assets'
down_revision: Union[str, None] = '38db47245c05'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create discovered_assets table
    op.create_table(
        'discovered_assets',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('cluster_id', sa.String(100), default="default", nullable=False, index=True),
        sa.Column('asset_id', sa.String(200), unique=True, nullable=False, index=True),
        sa.Column('resource_type', sa.String(50), nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=False, index=True),
        sa.Column('namespace', sa.String(100), nullable=True, index=True),
        sa.Column('status', sa.String(50), default="active", nullable=False),
        sa.Column('provenance', sa.String(20), default="demo", nullable=False, index=True),
        sa.Column('source', sa.String(100), default="kubernetes-api", nullable=False),
        sa.Column('metadata_json', sa.Text(), nullable=True),
        sa.Column('relationships_json', sa.Text(), nullable=True),
        sa.Column('first_discovered', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('last_discovered', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('last_synced_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 2. Create sbom_packages table
    op.create_table(
        'sbom_packages',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('cluster_id', sa.String(100), default="default", nullable=False, index=True),
        sa.Column('image_tag', sa.String(500), nullable=False, index=True),
        sa.Column('package_name', sa.String(255), nullable=False, index=True),
        sa.Column('version', sa.String(100), nullable=False),
        sa.Column('package_type', sa.String(50), default="os", nullable=False, index=True),
        sa.Column('license', sa.String(100), nullable=True),
        sa.Column('vulnerability_count', sa.Integer(), default=0, nullable=False),
        sa.Column('has_critical_vuln', sa.Boolean(), default=False, nullable=False),
        sa.Column('provenance', sa.String(20), default="demo", nullable=False),
        sa.Column('source', sa.String(100), default="trivy-sbom", nullable=False),
        sa.Column('scanned_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('sbom_packages')
    op.drop_table('discovered_assets')
