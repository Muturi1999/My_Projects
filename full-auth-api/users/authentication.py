from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.request import Request
from typing import Optional, Tuple

from full_auth import settings


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: Request) -> Optional[Tuple[object, object]]:
        try:
            # Extract the Authorization header
            header = self.get_header(request)
            if header is None:
                raw_token = request.COOKIES.get(settings.AUTH_COOKIE)

            else:
                # Extract the raw token from the header
                raw_token = self.get_raw_token(header)


            if raw_token is None:
                return None

            # Validate the token
            validated_token = self.get_validated_token(raw_token)

            # Return user and token
            return self.get_user(validated_token), validated_token

        except Exception:
            return None
