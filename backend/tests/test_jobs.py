def _register_recruiter(client, email="recruiter@test.com"):
    res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "first_name": "Test", "last_name": "Recruiter", "role": "RECRUITER"}
    )
    assert res.status_code == 201
    return res.json()["access_token"]


def _register_seeker(client, email="seeker@test.com"):
    res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "first_name": "Test", "last_name": "Seeker", "role": "JOB_SEEKER"}
    )
    assert res.status_code == 201
    return res.json()["access_token"]


def test_job_lifecycle(client):
    recruiter_token = _register_recruiter(client)
    seeker_token = _register_seeker(client)
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}
    seeker_headers = {"Authorization": f"Bearer {seeker_token}"}

    # Recruiter creates job
    job_payload = {
        "title": "Python Engineer",
        "description": "Build APIs using FastAPI",
        "company_name": "AI Solutions Ltd",
        "location": "Remote",
        "work_mode": "REMOTE",
        "employment_type": "FULL_TIME",
        "min_salary": 100000,
        "max_salary": 120000,
        "skills_needed": ["Python", "FastAPI", "PostgreSQL"],
        "requirements": ["3+ years experience"],
        "status": "PUBLISHED"
    }
    create_res = client.post("/api/v1/jobs/", json=job_payload, headers=recruiter_headers)
    assert create_res.status_code == 200
    job_id = create_res.json()["id"]
    assert create_res.json()["status"] == "PUBLISHED"

    # Search jobs returns paginated response
    list_res = client.get("/api/v1/jobs/")
    assert list_res.status_code == 200
    data = list_res.json()
    assert "jobs" in data
    assert data["total"] == 1
    assert data["jobs"][0]["title"] == "Python Engineer"

    # Search with filters
    filtered = client.get("/api/v1/jobs/?work_mode=REMOTE&salary_min=90000")
    assert filtered.status_code == 200
    assert filtered.json()["total"] == 1

    filtered_miss = client.get("/api/v1/jobs/?work_mode=ONSITE")
    assert filtered_miss.status_code == 200
    assert filtered_miss.json()["total"] == 0

    # Seeker cannot delete job
    delete_res_seeker = client.delete(f"/api/v1/jobs/{job_id}", headers=seeker_headers)
    assert delete_res_seeker.status_code == 403

    # Recruiter closes job
    close_res = client.post(f"/api/v1/jobs/{job_id}/close", headers=recruiter_headers)
    assert close_res.status_code == 200
    assert close_res.json()["status"] == "CLOSED"

    # Re-publish
    pub_res = client.post(f"/api/v1/jobs/{job_id}/publish", headers=recruiter_headers)
    assert pub_res.status_code == 200
    assert pub_res.json()["status"] == "PUBLISHED"

    # Recruiter deletes job
    delete_res_recruiter = client.delete(f"/api/v1/jobs/{job_id}", headers=recruiter_headers)
    assert delete_res_recruiter.status_code == 204


<<<<<<< HEAD
def test_application_workflow(client):
    recruiter_token = _register_recruiter(client, "rec2@test.com")
    seeker_token = _register_seeker(client, "seek2@test.com")
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}
    seeker_headers = {"Authorization": f"Bearer {seeker_token}"}

    # Create published job
    job = client.post("/api/v1/jobs/", json={
        "title": "Backend Dev",
        "description": "Build APIs",
        "company_name": "TestCo",
        "location": "NYC",
        "skills_needed": ["Python"],
        "status": "PUBLISHED"
    }, headers=recruiter_headers).json()
    job_id = job["id"]

    # Seeker applies
    apply_res = client.post("/api/v1/applications/", json={"job_id": job_id}, headers=seeker_headers)
    assert apply_res.status_code == 200
    app_id = apply_res.json()["id"]
    assert apply_res.json()["status"] == "APPLIED"

    # Duplicate application should fail
    dup_res = client.post("/api/v1/applications/", json={"job_id": job_id}, headers=seeker_headers)
    assert dup_res.status_code == 400

    # Close job, new seeker should not be able to apply
    client.post(f"/api/v1/jobs/{job_id}/close", headers=recruiter_headers)
    seeker2_token = _register_seeker(client, "seek3@test.com")
    seeker2_headers = {"Authorization": f"Bearer {seeker2_token}"}
    closed_res = client.post("/api/v1/applications/", json={"job_id": job_id}, headers=seeker2_headers)
    assert closed_res.status_code == 400

    # Recruiter updates status
    client.post(f"/api/v1/jobs/{job_id}/publish", headers=recruiter_headers)  # reopen for other tests
    status_res = client.patch(f"/api/v1/applications/{app_id}/status?status=SCREENING", headers=recruiter_headers)
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "SCREENING"

    # Seeker sees updated status
    my_apps = client.get("/api/v1/applications/seeker", headers=seeker_headers)
    assert my_apps.status_code == 200
    assert len(my_apps.json()) == 1
    assert my_apps.json()[0]["status"] == "SCREENING"


def test_saved_jobs(client):
    recruiter_token = _register_recruiter(client, "rec3@test.com")
    seeker_token = _register_seeker(client, "seek4@test.com")
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}
    seeker_headers = {"Authorization": f"Bearer {seeker_token}"}

    # Create job
    job = client.post("/api/v1/jobs/", json={
        "title": "ML Engineer",
        "description": "Build ML pipelines",
        "company_name": "DataCo",
        "location": "SF",
        "skills_needed": ["Python", "PyTorch"],
        "status": "PUBLISHED"
    }, headers=recruiter_headers).json()
    job_id = job["id"]

    # Save job
    save_res = client.post(f"/api/v1/jobs/{job_id}/save", headers=seeker_headers)
    assert save_res.status_code == 201

    # Duplicate save should fail
    dup_save = client.post(f"/api/v1/jobs/{job_id}/save", headers=seeker_headers)
    assert dup_save.status_code == 400

    # List saved jobs
    saved = client.get("/api/v1/applications/saved-jobs", headers=seeker_headers)
    assert saved.status_code == 200
    assert len(saved.json()) == 1

    # Unsave
    unsave = client.delete(f"/api/v1/jobs/{job_id}/save", headers=seeker_headers)
    assert unsave.status_code == 204

    # Verify removed
    saved2 = client.get("/api/v1/applications/saved-jobs", headers=seeker_headers)
    assert len(saved2.json()) == 0
=======
def test_job_status_transitions_and_application_block(client):
    recruiter = client.post(
        "/api/v1/auth/register",
        json={"email": "lifecycle-recruiter@test.com", "password": "password123", "first_name": "Lifecycle", "last_name": "Recruiter", "role": "RECRUITER"},
    ).json()
    seeker = client.post(
        "/api/v1/auth/register",
        json={"email": "lifecycle-seeker@test.com", "password": "password123", "first_name": "Lifecycle", "last_name": "Seeker", "role": "JOB_SEEKER"},
    ).json()
    recruiter_headers = {"Authorization": f"Bearer {recruiter['access_token']}"}
    seeker_headers = {"Authorization": f"Bearer {seeker['access_token']}"}

    job = client.post(
        "/api/v1/jobs/",
        headers=recruiter_headers,
        json={"title": "Lifecycle Engineer", "description": "Build systems", "company_name": "HireAI", "location": "Remote"},
    ).json()
    assert job["status"] == "PUBLISHED"

    close_response = client.post(
        f"/api/v1/jobs/{job['id']}/lifecycle?new_status=CLOSED",
        headers=recruiter_headers,
    )
    assert close_response.status_code == 200
    assert close_response.json()["status"] == "CLOSED"
    assert client.post("/api/v1/applications/", headers=seeker_headers, json={"job_id": job["id"]}).status_code == 404

    reopen_response = client.post(
        f"/api/v1/jobs/{job['id']}/lifecycle?new_status=PUBLISHED",
        headers=recruiter_headers,
    )
    assert reopen_response.status_code == 200
    assert client.post("/api/v1/applications/", headers=seeker_headers, json={"job_id": job["id"]}).status_code == 201
>>>>>>> 3c63cab110d4253a265397bfe318e47047dcb95a
