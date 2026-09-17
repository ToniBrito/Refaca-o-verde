import time
from typing import Any, Optional, Dict

class SimpleMemoryCache:
    """Cache em memória thread-safe com Time-To-Live (TTL) em segundos."""
    def __init__(self, default_ttl_seconds: int = 600):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._default_ttl = default_ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        item = self._cache.get(key)
        if not item:
            return None
        if time.time() > item["expires_at"]:
            del self._cache[key]
            return None
        return item["data"]

    def set(self, key: str, data: Any, ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
        self._cache[key] = {
            "data": data,
            "expires_at": time.time() + ttl
        }

    def clear(self) -> None:
        self._cache.clear()

# Instância global do cache (TTL padrão de 10 minutos)
api_cache = SimpleMemoryCache(default_ttl_seconds=600)
