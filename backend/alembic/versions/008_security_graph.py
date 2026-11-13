"""Add security graph nodes and relationships tables

Revision ID: 008_security_graph
Revises: 007_provenance_and_assets
Create Date: 2026-11-09 23:55:00.000000
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '008_security_graph'
down_revision: Union[str, None] = '007_provenance_and_assets'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create security_graph_nodes table
    op.create_table(
        'security_graph_nodes',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('cluster_id', sa.String(100), default="default", nullable=False, index=True),
        sa.Column('node_id', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('entity_type', sa.String(50), nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=False, index=True),
        sa.Column('namespace', sa.String(100), nullable=True, index=True),
        sa.Column('properties_json', sa.Text(), nullable=True),
        sa.Column('criticality', sa.String(20), default="medium", nullable=False, index=True),
        sa.Column('provenance', sa.String(20), default="demo", nullable=False, index=True),
        sa.Column('source', sa.String(100), default="graph-engine", nullable=False),
        sa.Column('first_observed', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('last_observed', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 2. Create security_graph_relationships table
    op.create_table(
        'security_graph_relationships',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('cluster_id', sa.String(100), default="default", nullable=False, index=True),
        sa.Column('source_node_id', sa.String(255), nullable=False, index=True),
        sa.Column('target_node_id', sa.String(255), nullable=False, index=True),
        sa.Column('relationship_type', sa.String(50), nullable=False, index=True),
        sa.Column('evidence_reference', sa.Text(), nullable=True),
        sa.Column('source_integration', sa.String(100), default="cloudguard-discovery", nullable=False),
        sa.Column('confidence', sa.Float(), default=1.0, nullable=False),
        sa.Column('is_inferred', sa.Boolean(), default=False, nullable=False),
        sa.Column('provenance', sa.String(20), default="demo", nullable=False, index=True),
        sa.Column('first_observed', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('last_observed', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('source_node_id', 'target_node_id', 'relationship_type', name='uq_graph_rel_src_tgt_type'),
    )
    op.create_index('idx_graph_rel_tgt_type', 'security_graph_relationships', ['target_node_id', 'relationship_type'])


def downgrade() -> None:
    op.drop_index('idx_graph_rel_tgt_type', table_name='security_graph_relationships')
    op.drop_table('security_graph_relationships')
    op.drop_table('security_graph_nodes')
