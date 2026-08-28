import httpx
import logging
import hashlib
from typing import List
from app.core.config import settings
from app.schemas.job import JobOut
from datetime import datetime

logger = logging.getLogger(__name__)

def generate_external_id(prefix: str, external_id: str) -> int:
    # Create a deterministic negative integer ID from the string
    hash_obj = hashlib.md5(f"{prefix}_{external_id}".encode('utf-8'))
    # Use first 8 bytes for a 64-bit int, make it negative to avoid internal ID collision
    int_val = int.from_bytes(hash_obj.digest()[:8], byteorder='big')
    # ensure it fits in 32-bit signed int just in case frontend JS precision issues
    return -1 * (int_val % 2147483647)

async def fetch_external_jobs(search: str = None, location: str = None, limit: int = 10) -> List[JobOut]:
    provider = (settings.EXTERNAL_JOBS_PROVIDER or "").lower()
    
    if not provider:
        return []
        
    if provider == "remotive":
        return await _fetch_remotive_jobs(search, location, limit)
    elif provider == "arbeitnow":
        return await _fetch_arbeitnow_jobs(search, location, limit)
    
    logger.warning(f"Unknown external jobs provider: {provider}")
    return []

async def _fetch_remotive_jobs(search: str = None, location: str = None, limit: int = 10) -> List[JobOut]:
    # Remotive API: https://remotive.com/api/remote-jobs
    # It has a "search" parameter which searches titles, companies, etc.
    url = "https://remotive.com/api/remote-jobs"
    params = {"limit": limit}
    
    # Merge search and location into one query for Remotive
    query_parts = []
    if search:
        query_parts.append(search)
    if location:
        query_parts.append(location)
        
    if query_parts:
        params["search"] = " ".join(query_parts)
        
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            jobs_data = data.get("jobs", [])
            results = []
            
            for job in jobs_data:
                # Map Remotive job to our JobOut schema
                try:
                    pub_date = job.get("publication_date")
                    if pub_date:
                        try:
                            created_at = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
                        except:
                            created_at = datetime.utcnow()
                    else:
                        created_at = datetime.utcnow()
                        
                    results.append(JobOut(
                        id=generate_external_id("remotive", str(job.get('id', ''))),
                        title=job.get("title", "Unknown Title"),
                        company_name=job.get("company_name", "Unknown Company"),
                        location=job.get("candidate_required_location", "Remote"),
                        description=job.get("description", ""),
                        work_mode="REMOTE",
                        employment_type="FULL_TIME",
                        status="PUBLISHED",
                        is_active=True,
                        created_at=created_at,
                        updated_at=created_at,
                        source="remotive",
                        apply_url=job.get("url")
                    ))
                except Exception as e:
                    logger.error(f"Error parsing remotive job: {e}")
                    
            return results
    except Exception as e:
        logger.error(f"Error fetching from Remotive API: {e}")
        return []

async def _fetch_arbeitnow_jobs(search: str = None, location: str = None, limit: int = 10) -> List[JobOut]:
    url = "https://www.arbeitnow.com/api/job-board-api"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            jobs_data = data.get("data", [])
            results = []
            
            # Arbeitnow doesn't support search params on the free public endpoint easily, 
            # so we'll filter locally for demo purposes.
            for job in jobs_data:
                # Basic local filtering
                title = job.get("title", "").lower()
                loc = job.get("location", "").lower()
                
                if search and search.lower() not in title:
                    continue
                if location and location.lower() not in loc:
                    continue
                    
                created_at = datetime.fromtimestamp(job.get("created_at", datetime.utcnow().timestamp()))
                
                results.append(JobOut(
                    id=generate_external_id("arbeitnow", str(job.get('slug', ''))),
                    title=job.get("title", "Unknown Title"),
                    company_name=job.get("company_name", "Unknown Company"),
                    location=job.get("location", "Unknown Location"),
                    description=job.get("description", ""),
                    work_mode="REMOTE" if job.get("remote") else "ONSITE",
                    employment_type="FULL_TIME",
                    status="PUBLISHED",
                    is_active=True,
                    created_at=created_at,
                    updated_at=created_at,
                    source="arbeitnow",
                    apply_url=job.get("url")
                ))
                
                if len(results) >= limit:
                    break
                    
            return results
    except Exception as e:
        logger.error(f"Error fetching from Arbeitnow API: {e}")
        return []
