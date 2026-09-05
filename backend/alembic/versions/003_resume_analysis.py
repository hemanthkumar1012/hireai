from alembic import op
import sqlalchemy as sa


revision = "003_resume_analysis"
down_revision = "002_application_constraints"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "job_seeker_profiles",
        sa.Column("resume_analysis", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("job_seeker_profiles", "resume_analysis")
