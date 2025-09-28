from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = '20250925_init'
down_revision = None
branch_labels = None
depends_on = None
def upgrade():
    op.create_table(
        'sensor_readings',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('sensor_id', sa.String(), nullable=False),
        sa.Column('queue_len', sa.Float(), nullable=False),
        sa.Column('payload', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('timestamp', sa.TIMESTAMP(timezone=True), server_default=sa.text('NOW()'))
    )
    op.create_index('ix_sensor_readings_sensor_id', 'sensor_readings', ['sensor_id'])
    op.create_index('ix_sensor_readings_timestamp', 'sensor_readings', ['timestamp'])


    op.create_table(
        'decisions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('sensor_id', sa.String(), nullable=False),
        sa.Column('decision', sa.String(), nullable=False),
        sa.Column('timestamp', sa.TIMESTAMP(timezone=True), server_default=sa.text('NOW()'))
    )
    op.create_index('ix_decisions_sensor_id', 'decisions', ['sensor_id'])
    op.create_index('ix_decisions_timestamp', 'decisions', ['timestamp'])



def downgrade():
    op.drop_index('ix_decisions_timestamp', table_name='decisions')
    op.drop_index('ix_decisions_sensor_id', table_name='decisions')
    op.drop_table('decisions')
    op.drop_index('ix_sensor_readings_timestamp', table_name='sensor_readings')
    op.drop_index('ix_sensor_readings_sensor_id', table_name='sensor_readings')
    op.drop_table('sensor_readings')