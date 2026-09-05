from alembic import op
import sqlalchemy as sa


revision = "003_resume_analysis"
down_revision = "002_application_constraints"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    inspector = sa.inspect(connection)

    if "resume_analysis" not in {
        column["name"]
        for column in inspector.get_columns("job_seeker_profiles")
    }:
        op.add_column(
            "job_seeker_profiles",
            sa.Column("resume_analysis", sa.JSON(), nullable=True),
        )


def downgrade() -> None:
    connection = op.get_bind()
    inspector = sa.inspect(connection)

    if "resume_analysis" in {
        column["name"]
        for column in inspector.get_columns("job_seeker_profiles")
    }:
        op.drop_column("job_seeker_profiles", "resume_analysis")
