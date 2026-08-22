from .base import *  # noqa: F403


DEBUG = True
SECRET_KEY = SECRET_KEY or "development-only-insecure-key"  # noqa: F405
ALLOWED_HOSTS = ALLOWED_HOSTS or ["localhost", "127.0.0.1", "testserver"]  # noqa: F405
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS or ["http://localhost:3000"]  # noqa: F405
CSRF_TRUSTED_ORIGINS = CSRF_TRUSTED_ORIGINS or ["http://localhost:3000"]  # noqa: F405
