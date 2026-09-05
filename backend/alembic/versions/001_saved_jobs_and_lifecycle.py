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
        inspector = sa.inspect(connection)

    job_columns = {
        column["name"]
        for column in inspector.get_columns("jobs")
    }

    if "status" not in job_columns:
        op.add_column(
            "jobs",
            sa.Column(
                "status",
                sa.String(length=20),
                nullable=False,
                server_default="PUBLISHED",
            ),
        )

    inspector = sa.inspect(connection)

    existing_job_indexes = {
        index["name"]
        for index in inspector.get_indexes("jobs")
    }

    if "ix_jobs_status" not in existing_job_indexes:
        op.create_index(
            "ix_jobs_status",
            "jobs",
            ["status"],
        )

    if not inspector.has_table("saved_jobs"):
        op.create_table(
            "saved_jobs",
            sa.Column(
                "id",
                sa.Integer(),
                primary_key=True,
            ),
            sa.Column(
                "job_id",
                sa.Integer(),
                sa.ForeignKey("jobs.id", ondelete="CASCADE"),
                nullable=False,
            ),
            sa.Column(
                "user_id",
                sa.Integer(),
                sa.ForeignKey("users.id", ondelete="CASCADE"),
                nullable=False,
            ),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.UniqueConstraint(
                "user_id",
                "job_id",
                name="uq_saved_job",
            ),
        )

    inspector = sa.inspect(connection)

    existing_saved_job_indexes = {
        index["name"]
        for index in inspector.get_indexes("saved_jobs")
    }

    if "ix_saved_jobs_job_id" not in existing_saved_job_indexes:
        op.create_index(
            "ix_saved_jobs_job_id",
            "saved_jobs",
            ["job_id"],
        )

    if "ix_saved_jobs_user_id" not in existing_saved_job_indexes:
        op.create_index(
            "ix_saved_jobs_user_id",
            "saved_jobs",
            ["user_id"],
        )


def downgrade() -> None:
    connection = op.get_bind()
    inspector = sa.inspect(connection)

    if inspector.has_table("saved_jobs"):
        existing_indexes = {
            index["name"]
            for index in inspector.get_indexes("saved_jobs")
        }

        if "ix_saved_jobs_user_id" in existing_indexes:
            op.drop_index(
                "ix_saved_jobs_user_id",
                table_name="saved_jobs",
            )

        if "ix_saved_jobs_job_id" in existing_indexes:
            op.drop_index(
                "ix_saved_jobs_job_id",
                table_name="saved_jobs",
            )

        op.drop_table("saved_jobs")

    inspector = sa.inspect(connection)

    if inspector.has_table("jobs"):
        existing_job_indexes = {
            index["name"]
            for index in inspector.get_indexes("jobs")
        }

        if "ix_jobs_status" in existing_job_indexes:
            op.drop_index(
                "ix_jobs_status",
                table_name="jobs",
            )

        job_columns = {
            column["name"]
            for column in inspector.get_columns("jobs")
        }

        if "status" in job_columns:
            op.drop_column("jobs", "status")
