"""WebSocket connection manager for real-time features and event broadcasting."""

import asyncio
import json
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


@dataclass
class LogStreamConnection:
    """Represents a single log streaming connection."""

    websocket: WebSocket
    namespace: str
    pod_name: str
    container: str
    timestamps: bool = False
    task: asyncio.Task = None


@dataclass
class EventStreamConnection:
    """Represents an authenticated client subscribed to cluster security events."""

    websocket: WebSocket
    user_id: str
    username: str
    role: str
    cluster_ids: Set[str] = field(default_factory=lambda: {"*"})  # '*' means all clusters


class WebSocketManager:
    """Manages WebSocket connections for real-time log streaming and event broadcasting."""

    def __init__(self):
        self._connections: Dict[str, LogStreamConnection] = {}
        self._event_subscribers: Dict[str, EventStreamConnection] = {}
        self._lock = asyncio.Lock()
        self._redis_listener_task: Optional[asyncio.Task] = None

    def _get_connection_id(self, websocket: WebSocket) -> str:
        """Generate unique ID for a connection."""
        return f"{id(websocket)}"

    async def connect(
        self, websocket: WebSocket, namespace: str, pod_name: str, container: str, timestamps: bool = False
    ) -> str:
        """Accept a new WebSocket connection."""
        await websocket.accept()
        connection_id = self._get_connection_id(websocket)

        async with self._lock:
            self._connections[connection_id] = LogStreamConnection(
                websocket=websocket, namespace=namespace, pod_name=pod_name, container=container, timestamps=timestamps
            )

        logger.info("WebSocket connected: %s", connection_id)
        return connection_id

    async def connect_event_subscriber(
        self,
        websocket: WebSocket,
        user_id: str,
        username: str,
        role: str,
        cluster_ids: Optional[Set[str]] = None,
    ) -> str:
        """Register an already accepted authenticated event subscriber."""
        connection_id = self._get_connection_id(websocket)

        async with self._lock:
            self._event_subscribers[connection_id] = EventStreamConnection(
                websocket=websocket,
                user_id=user_id,
                username=username,
                role=role,
                cluster_ids=cluster_ids or {"*"},
            )

        logger.info("Authenticated event subscriber connected: %s (user: %s, role: %s)", connection_id, username, role)
        # Ensure the Redis background listener is active if Redis is enabled
        self.ensure_redis_listener()
        return connection_id

    async def disconnect_event_subscriber(self, connection_id: str):
        """Deregister an event subscriber."""
        async with self._lock:
            if connection_id in self._event_subscribers:
                del self._event_subscribers[connection_id]
                logger.info("Event subscriber disconnected: %s", connection_id)

    async def broadcast_event(self, event_type: str, data: dict, cluster_id: str = "default"):
        """Broadcast an event locally to authorized connected subscribers."""
        payload = {
            "type": event_type,
            "cluster_id": cluster_id,
            "data": data,
        }

        async with self._lock:
            subscribers = list(self._event_subscribers.items())

        for conn_id, sub in subscribers:
            # Check cluster authorization: allow if '*' or specific cluster matches
            if "*" not in sub.cluster_ids and cluster_id not in sub.cluster_ids:
                continue

            try:
                await sub.websocket.send_json(payload)
            except Exception as e:
                logger.debug("Failed sending event to subscriber %s: %s", conn_id, e)
                await self.disconnect_event_subscriber(conn_id)

    def ensure_redis_listener(self):
        """Start background task listening to Redis pub/sub if not running."""
        if self._redis_listener_task is None or self._redis_listener_task.done():
            self._redis_listener_task = asyncio.create_task(self._listen_redis_events())

    async def _listen_redis_events(self):
        """Listen to Redis channel 'cloudguard:events' and broadcast received events."""
        from app.core.cache import get_redis
        from app.core.config import settings

        if not settings.REDIS_ENABLED:
            return

        while True:
            try:
                client = await get_redis()
                if not client:
                    await asyncio.sleep(5)
                    continue

                pubsub = client.pubsub()
                await pubsub.subscribe("cloudguard:events")
                logger.info("Subscribed to Redis channel 'cloudguard:events'")

                async for message in pubsub.listen():
                    if message and message.get("type") == "message":
                        try:
                            raw_data = message.get("data")
                            if isinstance(raw_data, str):
                                parsed = json.loads(raw_data)
                                await self.broadcast_event(
                                    event_type=parsed.get("type", "event"),
                                    data=parsed.get("data", {}),
                                    cluster_id=parsed.get("cluster_id", "default")
                                )
                        except Exception as parse_err:
                            logger.error("Error processing Redis pubsub event: %s", parse_err)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.warning("Redis pubsub listener exception: %s. Retrying in 5s...", e)
                await asyncio.sleep(5)

    async def disconnect(self, connection_id: str):
        """Remove a WebSocket connection."""
        async with self._lock:
            if connection_id in self._connections:
                conn = self._connections[connection_id]
                if conn.task and not conn.task.done():
                    conn.task.cancel()
                    try:
                        await conn.task
                    except asyncio.CancelledError:
                        pass
                del self._connections[connection_id]
                logger.info(f"WebSocket disconnected: {connection_id}")

    async def send_log(self, connection_id: str, log_line: str):
        """Send a log line to a specific connection."""
        async with self._lock:
            conn = self._connections.get(connection_id)

        if conn:
            try:
                await conn.websocket.send_json({"type": "log", "content": log_line})
            except Exception:
                logger.error("Error sending log to WebSocket connection")
                await self.disconnect(connection_id)

    async def send_status(self, connection_id: str, status: str, message: str = ""):
        """Send a status message to a connection."""
        async with self._lock:
            conn = self._connections.get(connection_id)

        if conn:
            try:
                await conn.websocket.send_json({"type": "status", "status": status, "message": message})
            except Exception:
                logger.error("Error sending status to WebSocket connection")

    async def send_error(self, connection_id: str, error: str, code: int = 500):
        """Send an error message to a connection."""
        async with self._lock:
            conn = self._connections.get(connection_id)

        if conn:
            try:
                await conn.websocket.send_json({"type": "error", "error": error, "code": code})
            except Exception:
                logger.error("Error sending error to WebSocket connection")

    def get_connection(self, connection_id: str) -> LogStreamConnection:
        """Get connection details."""
        return self._connections.get(connection_id)

    def set_task(self, connection_id: str, task: asyncio.Task):
        """Associate a streaming task with a connection."""
        if connection_id in self._connections:
            self._connections[connection_id].task = task

    @property
    def active_connections(self) -> int:
        """Get count of active connections."""
        return len(self._connections) + len(self._event_subscribers)


# Global instance
ws_manager = WebSocketManager()
