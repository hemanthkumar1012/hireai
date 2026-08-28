def test_root_endpoint(client):
    """Root endpoint returns service info and links."""
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "running"
    assert data["service"] == "ApplyRight API"
    assert "health" in data
    assert "docs" in data


def test_health_endpoint(client):
    """Health endpoint reports database connectivity."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert data["service"] == "ApplyRight"
