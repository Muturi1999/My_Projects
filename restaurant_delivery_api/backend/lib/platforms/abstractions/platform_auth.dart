abstract class PlatformAuth {
  Future<String> getClientCredentialsToken(List<String> scopes);
  Future<String> getAuthorizationCodeToken(String code, String redirectUri);
  Future<bool> validateToken(String token);
  Future<void> refreshToken(String refreshToken);
}