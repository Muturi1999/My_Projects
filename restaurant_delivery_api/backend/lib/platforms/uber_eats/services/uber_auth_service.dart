// import 'dart:convert';
// import 'dart:io';

// import 'package:backend/platforms/abstractions/platform_auth.dart';

// // class UberAuthService implements PlatformAuth {
// //   final String clientId;
// //   final String clientSecret;
// //   final String baseUrl;
// //   late final HttpClient _httpClient;

// //   UberAuthService({
// //     required this.clientId,
// //     required this.clientSecret,
// //     this.baseUrl = 'https://auth.uber.com',
// //   }) {
// //     _httpClient = HttpClient();
// //   }

// //   @override
// //   Future<String> getClientCredentialsToken(List<String> scopes) async {
// //     try {
// //       final uri = Uri.parse('$baseUrl/oauth/v2/token');
// //       final request = await _httpClient.postUrl(uri);
      
// //       // Set content type for form data
// //       request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      
// //       // Prepare form data
// //       final formData = {
// //         'client_id': clientId,
// //         'client_secret': clientSecret,
// //         'grant_type': 'client_credentials',
// //         'scope': scopes.join(' '),
// //       };
      
// //       // Convert to URL encoded string
// //       final body = formData.entries
// //           .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
// //           .join('&');
      
// //       request.write(body);
      
// //       final response = await request.close();
// //       final responseBody = await response.transform(utf8.decoder).join();
      
// //       if (response.statusCode == 200) {
// //         final data = jsonDecode(responseBody);
// //         return data['access_token'];
// //       } else {
// //         throw Exception('Failed to get token: $responseBody');
// //       }
// //     } catch (e) {
// //       throw Exception('Auth error: $e');
// //     }
// //   }

// //   @override
// //   Future<String> getAuthorizationCodeToken(String code, String redirectUri) async {
// //     try {
// //       final uri = Uri.parse('$baseUrl/oauth/v2/token');
// //       final request = await _httpClient.postUrl(uri);
      
// //       request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      
// //       final formData = {
// //         'client_id': clientId,
// //         'client_secret': clientSecret,
// //         'grant_type': 'authorization_code',
// //         'code': code,
// //         'redirect_uri': redirectUri,
// //       };
      
// //       final body = formData.entries
// //           .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
// //           .join('&');
      
// //       request.write(body);
      
// //       final response = await request.close();
// //       final responseBody = await response.transform(utf8.decoder).join();
      
// //       if (response.statusCode == 200) {
// //         final data = jsonDecode(responseBody);
// //         return data['access_token'];
// //       } else {
// //         throw Exception('Failed to exchange code for token: $responseBody');
// //       }
// //     } catch (e) {
// //       throw Exception('Token exchange error: $e');
// //     }
// //   }

// //   @override
// //   Future<bool> validateToken(String token) async {
// //     // Implementation for token validation
// //     // This would typically involve making a test API call
// //     return true; // Simplified for now
// //   }

// //   @override
// //   Future<void> refreshToken(String refreshToken) async {
// //     // Uber Eats tokens are long-lived (30 days), refresh logic here if needed
// //     throw UnimplementedError('Uber Eats uses long-lived tokens');
// //   }
// // }

// class UberAuthService implements PlatformAuth {
//   final String clientId;
//   final String clientSecret;
//   final String baseUrl;
//   late final HttpClient _httpClient;

//   UberAuthService({
//     required this.clientId,
//     required this.clientSecret,
//     this.baseUrl = 'https://auth.uber.com',
//   }) {
//     _httpClient = HttpClient();
//   }

//   @override
//   Future<String> getClientCredentialsToken(List<String> scopes) async {
//     try {
//       final uri = Uri.parse('$baseUrl/oauth/v2/token');
//       final request = await _httpClient.postUrl(uri);
      
//       // Set content type for form data
//       request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      
//       // Prepare form data
//       final formData = {
//         'client_id': clientId,
//         'client_secret': clientSecret,
//         'grant_type': 'client_credentials',
//         'scope': scopes.join(' '),
//       };
      
//       // Convert to URL encoded string
//       final body = formData.entries
//           .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
//           .join('&');
      
//       request.write(body);
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         final data = jsonDecode(responseBody);
//         return data['access_token'];
//       } else {
//         throw Exception('Failed to get token: $responseBody');
//       }
//     } catch (e) {
//       throw Exception('Auth error: $e');
//     }
//   }

//   @override
//   Future<String> getAuthorizationCodeToken(String code, String redirectUri) async {
//     try {
//       final uri = Uri.parse('$baseUrl/oauth/v2/token');
//       final request = await _httpClient.postUrl(uri);
      
//       request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      
//       final formData = {
//         'client_id': clientId,
//         'client_secret': clientSecret,
//         'grant_type': 'authorization_code',
//         'code': code,
//         'redirect_uri': redirectUri,
//       };
      
//       final body = formData.entries
//           .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
//           .join('&');
      
//       request.write(body);
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         final data = jsonDecode(responseBody);
//         return data['access_token'];
//       } else {
//         throw Exception('Failed to exchange code for token: $responseBody');
//       }
//     } catch (e) {
//       throw Exception('Token exchange error: $e');
//     }
//   }

//   @override
//   Future<bool> validateToken(String token) async {
//     // Implementation for token validation
//     // This would typically involve making a test API call
//     return true; // Simplified for now
//   }

//   @override
//   Future<void> refreshToken(String refreshToken) async {
//     // Uber Eats tokens are long-lived (30 days), refresh logic here if needed
//     throw UnimplementedError('Uber Eats uses long-lived tokens');
//   }
// }

import 'dart:convert';
import 'dart:io';

import 'package:backend/platforms/abstractions/platform_auth.dart';

class UberAuthService implements PlatformAuth {
  final String clientId;
  final String clientSecret;
  final String baseUrl;
  late final HttpClient _httpClient;

  UberAuthService({
    required this.clientId,
    required this.clientSecret,
    this.baseUrl = 'https://auth.uber.com',
  }) {
    _httpClient = HttpClient();
  }

  @override
  Future<String> getClientCredentialsToken(List<String> scopes) async {
    try {
      final uri = Uri.parse('$baseUrl/oauth/v2/token');
      final request = await _httpClient.postUrl(uri);
      
      // Set content type for form data
      request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      
      // Prepare form data
      final formData = {
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'client_credentials',
        'scope': scopes.join(' '),
      };
      
      // Convert to URL encoded string
      final body = formData.entries
          .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
          .join('&');
      
      request.write(body);
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        return data['access_token'];
      } else {
        throw Exception('Failed to get token: $responseBody');
      }
    } catch (e) {
      throw Exception('Auth error: $e');
    }
  }

  @override
  Future<String> getAuthorizationCodeToken(String code, String redirectUri) async {
    try {
      final uri = Uri.parse('$baseUrl/oauth/v2/token');
      final request = await _httpClient.postUrl(uri);
      
      request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      
      final formData = {
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri,
      };
      
      final body = formData.entries
          .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
          .join('&');
      
      request.write(body);
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        return data['access_token'];
      } else {
        throw Exception('Failed to exchange code for token: $responseBody');
      }
    } catch (e) {
      throw Exception('Token exchange error: $e');
    }
  }

  @override
  Future<bool> validateToken(String token) async {
    // Implementation for token validation
    // This would typically involve making a test API call
    return true; // Simplified for now
  }

  @override
  Future<void> refreshToken(String refreshToken) async {
    // Uber Eats tokens are long-lived (30 days), refresh logic here if needed
    throw UnimplementedError('Uber Eats uses long-lived tokens');
  }
}
