def test_job_lifecycle(client):
    # Register recruiter
    recruiter_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "recruiter@test.com",
            "password": "password123",
            "first_name": "Test",
            "last_name": "Recruiter",
            "role": "RECRUITER"
        }
    )
    assert recruiter_res.status_code == 201
    recruiter_token = recruiter_res.json()["access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}

    # Register seeker
    seeker_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker@test.com",
            "password": "password123",
            "first_name": "Test",
            "last_name": "Seeker",
            "role": "JOB_SEEKER"
        }
    )
    assert seeker_res.status_code == 201
    seeker_token = seeker_res.json()["access_token"]
    seeker_headers = {"Authorization": f"Bearer {seeker_token}"}

    # Recruiter creates job
    job_payload = {
        "title": "Python Engineer",
        "description": "Build APIs using FastAPI",
        "company_name": "AI Solutions Ltd",
        "location": "Remote",
        "salary_range": "$100k - $120k",
        "skills_needed": ["Python", "FastAPI", "PostgreSQL"],
        "requirements": ["3+ years experience", "Strong DB understanding"]
    }
    create_res = client.post("/api/v1/jobs/", json=job_payload, headers=recruiter_headers)
    assert create_res.status_code == 200
    job_id = create_res.json()["id"]

    # Seeker gets job listings
    list_res = client.get("/api/v1/jobs/")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1
    assert list_res.json()[0]["title"] == "Python Engineer"

    # Seeker attempts to delete job (should be forbidden)
    delete_res_seeker = client.delete(f"/api/v1/jobs/{job_id}", headers=seeker_headers)
    assert delete_res_seeker.status_code == 403

    # Recruiter deletes job
    delete_res_recruiter = client.delete(f"/api/v1/jobs/{job_id}", headers=recruiter_headers)
    assert delete_res_recruiter.status_code == 204


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
