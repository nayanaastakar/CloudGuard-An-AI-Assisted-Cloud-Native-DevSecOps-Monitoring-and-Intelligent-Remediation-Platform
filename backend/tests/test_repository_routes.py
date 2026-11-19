import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_repository_scan_invalid_url():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/cloudguard/repository/scan", json={"url": "not-a-valid-url"})
        assert response.status_code == 400
        assert "Invalid GitHub repository format" in response.json()["detail"] or "Only github.com" in response.json()["detail"]


@pytest.mark.asyncio
async def test_repository_scan_gitlab_rejected():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/cloudguard/repository/scan", json={"url": "https://gitlab.com/owner/repo"})
        assert response.status_code == 400
        assert "Only github.com repositories are supported" in response.json()["detail"]


@pytest.mark.asyncio
async def test_repository_scan_history_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/cloudguard/repository/history")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
