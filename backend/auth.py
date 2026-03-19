import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Firebase Admin SDK
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

security = HTTPBearer(auto_error=False)

# ---------------------------------------------------------------------------
# Initialise Firebase Admin (only once).
# Set the env var  FIREBASE_SERVICE_ACCOUNT  to the path of your
# service-account JSON file. If the file is missing we run in
# "dev mode" — every request is treated as an anonymous demo user.
# ---------------------------------------------------------------------------
_firebase_initialised = False
_dev_mode = False

_sa_path = os.getenv("FIREBASE_SERVICE_ACCOUNT", "")

if _sa_path and os.path.isfile(_sa_path):
    cred = credentials.Certificate(_sa_path)
    firebase_admin.initialize_app(cred)
    _firebase_initialised = True
else:
    _dev_mode = True
    print("⚠️  Firebase service-account not found — running in DEV MODE (no auth).")


# ---------------------------------------------------------------------------
# Dependency
# ---------------------------------------------------------------------------
async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Return decoded Firebase token dict, or a dev-mode stub."""

    if _dev_mode:
        # In dev mode, allow unauthenticated access with a demo UID
        return {"uid": "dev-user", "email": "dev@smartcar.local", "name": "Developer"}

    if creds is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )

    token = creds.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
        )
