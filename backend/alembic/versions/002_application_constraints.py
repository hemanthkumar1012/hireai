"""Add application integrity constraints and query indexes."""
from alembic import op
from sqlalchemy import inspect


revision = "002_application_constraints"
down_revision = "001_saved_jobs_lifecycle"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    database_inspector = inspect(connection)
    existing_indexes = {index["name"] for index in database_inspector.get_indexes("applications")}
    existing_job_indexes = {index["name"] for index in database_inspector.get_indexes("jobs")}
    with op.batch_alter_table("applications") as batch:
        batch.create_unique_constraint("uq_application_job_seeker", ["job_id", "seeker_id"])
    if "ix_applications_job_id" not in existing_indexes:
        op.create_index("ix_applications_job_id", "applications", ["job_id"])
    if "ix_applications_seeker_id" not in existing_indexes:
        op.create_index("ix_applications_seeker_id", "applications", ["seeker_id"])
    if "ix_applications_status" not in existing_indexes:
        op.create_index("ix_applications_status", "applications", ["status"])
    if "ix_jobs_recruiter_id" not in existing_job_indexes:
        op.create_index("ix_jobs_recruiter_id", "jobs", ["recruiter_id"])


def downgrade() -> None:
    op.drop_index("ix_jobs_recruiter_id", table_name="jobs")
    op.drop_index("ix_applications_status", table_name="applications")
    op.drop_index("ix_applications_seeker_id", table_name="applications")
    op.drop_index("ix_applications_job_id", table_name="applications")
    with op.batch_alter_table("applications") as batch:
        batch.drop_constraint("uq_application_job_seeker", type_="unique")