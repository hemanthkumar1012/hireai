def test_register_and_login(client):
    # Register JOB_SEEKER
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker@test.com",
            "password": "password123",
            "first_name": "Test",
            "last_name": "Seeker",
            "role": "JOB_SEEKER"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "seeker@test.com"
    assert data["user"]["role"] == "JOB_SEEKER"

    # Register duplicate email
    dup_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker@test.com",
            "password": "password123",
            "first_name": "Another",
            "last_name": "Seeker",
            "role": "JOB_SEEKER"
        }
    )
    assert dup_res.status_code == 400

    # Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={
            "email": "seeker@test.com",
            "password": "password123"
        }
    )
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    token = data["access_token"]
    refresh = data["refresh_token"]

    # Read user details
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "seeker@test.com"

    # Refresh Token
    refresh_res = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh}
    )
    assert refresh_res.status_code == 200
    assert "access_token" in refresh_res.json()

    # Invalid login
    bad_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "seeker@test.com",
            "password": "wrongpassword"
        }
    )
    assert bad_login.status_code == 400
