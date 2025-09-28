from alembic import op
import sqlalchemy as sa

revision = '20250926_add_txid'
down_revision = '20250925_init'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('decisions', sa.Column('tx_id', sa.String, nullable=True, index=True))

def downgrade():
    op.drop_column('decisions', 'tx_id')
