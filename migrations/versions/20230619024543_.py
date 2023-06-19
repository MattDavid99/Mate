"""empty message

Revision ID: c8cd15e875a5
Revises: 4670ceb78a05
Create Date: 2023-06-19 02:45:43.847584

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8cd15e875a5'
down_revision = '4670ceb78a05'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('matches', schema=None) as batch_op:
        batch_op.add_column(sa.Column('board_state', sa.Text(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('matches', schema=None) as batch_op:
        batch_op.drop_column('board_state')

    # ### end Alembic commands ###
