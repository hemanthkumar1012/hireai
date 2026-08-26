"""Add saved jobs and explicit job lifecycle state."""
from alembic import op
import sqlalchemy as sa

revision = "001_saved_jobs_lifecycle"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    if not inspector.has_table("jobs"):
        from app.core.database import Base
        from app import models  # noqa: F401

        Base.metadata.create_all(bind=connection)
        return

    if "status" not in {column["name"] for column in inspector.get_columns("jobs")}:
        op.add_column("jobs", sa.Column("status", sa.String(length=20), nullable=False, server_default="PUBLISHED"))
        op.create_index("ix_jobs_status", "jobs", ["status"])
    if not inspector.has_table("saved_jobs"):
        op.create_table(
            "saved_jobs",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
            sa.Column("seeker_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.UniqueConstraint("job_id", "seeker_id", name="uq_saved_job_seeker"),
        )
        op.create_index("ix_saved_jobs_job_id", "saved_jobs", ["job_id"])
        op.create_index("ix_saved_jobs_seeker_id", "saved_jobs", ["seeker_id"])
        return



def downgrade() -> None:
    op.drop_index("ix_saved_jobs_seeker_id", table_name="saved_jobs")
    op.drop_index("ix_saved_jobs_job_id", table_name="saved_jobs")
    op.drop_table("saved_jobs")
    op.drop_index("ix_jobs_status", table_name="jobs")
    op.drop_column("jobs", "status")