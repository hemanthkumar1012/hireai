"""Add application integrity constraints and query indexes."""

from alembic import op
from sqlalchemy import inspect


revision = "002_application_constraints"
down_revision = "001_saved_jobs_lifecycle"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    inspector = inspect(connection)

    if inspector.has_table("applications"):
        existing_constraints = {
            constraint["name"]
            for constraint in inspector.get_unique_constraints("applications")
            if constraint.get("name")
        }

        if "uq_application_job_seeker" not in existing_constraints:
            with op.batch_alter_table("applications") as batch:
                batch.create_unique_constraint(
                    "uq_application_job_seeker",
                    ["job_id", "seeker_id"],
                )

        existing_indexes = {
            index["name"]
            for index in inspector.get_indexes("applications")
        }

        if "ix_applications_job_id" not in existing_indexes:
            op.create_index(
                "ix_applications_job_id",
                "applications",
                ["job_id"],
            )

        if "ix_applications_seeker_id" not in existing_indexes:
            op.create_index(
                "ix_applications_seeker_id",
                "applications",
                ["seeker_id"],
            )

        if "ix_applications_status" not in existing_indexes:
            op.create_index(
                "ix_applications_status",
                "applications",
                ["status"],
            )

    inspector = inspect(connection)

    if inspector.has_table("jobs"):
        existing_job_indexes = {
            index["name"]
            for index in inspector.get_indexes("jobs")
        }

        if "ix_jobs_recruiter_id" not in existing_job_indexes:
            op.create_index(
                "ix_jobs_recruiter_id",
                "jobs",
                ["recruiter_id"],
            )


def downgrade() -> None:
    connection = op.get_bind()
    inspector = inspect(connection)

    if inspector.has_table("jobs"):
        existing_job_indexes = {
            index["name"]
            for index in inspector.get_indexes("jobs")
        }

        if "ix_jobs_recruiter_id" in existing_job_indexes:
            op.drop_index(
                "ix_jobs_recruiter_id",
                table_name="jobs",
            )

    inspector = inspect(connection)

    if inspector.has_table("applications"):
        existing_indexes = {
            index["name"]
            for index in inspector.get_indexes("applications")
        }

        if "ix_applications_status" in existing_indexes:
            op.drop_index(
                "ix_applications_status",
                table_name="applications",
            )

        if "ix_applications_seeker_id" in existing_indexes:
            op.drop_index(
                "ix_applications_seeker_id",
                table_name="applications",
            )

        if "ix_applications_job_id" in existing_indexes:
            op.drop_index(
                "ix_applications_job_id",
                table_name="applications",
            )

        inspector = inspect(connection)

        existing_constraints = {
            constraint["name"]
            for constraint in inspector.get_unique_constraints("applications")
            if constraint.get("name")
        }

        if "uq_application_job_seeker" in existing_constraints:
            with op.batch_alter_table("applications") as batch:
                batch.drop_constraint(
                    "uq_application_job_seeker",
                    type_="unique",
                )
