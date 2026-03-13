import '../models/api_response.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient;

  AuthService(this._apiClient);

  Future<AuthResponse> login(String email, String password) async {
    final response = await _apiClient.dio.post(
      '/auth/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    final apiResponse = ApiResponse<AuthResponse>.fromJson(
      response.data as Map<String, dynamic>,
      (json) => AuthResponse.fromJson(json as Map<String, dynamic>),
    );

    if (apiResponse.success && apiResponse.data != null) {
      return apiResponse.data!;
    } else {
      throw Exception(apiResponse.message ?? 'Login failed');
    }
  }

  Future<AuthResponse> register(String name, String email, String password) async {
    final response = await _apiClient.dio.post(
      '/auth/register',
      data: {
        'name': name,
        'email': email,
        'password': password,
      },
    );

    final apiResponse = ApiResponse<AuthResponse>.fromJson(
      response.data as Map<String, dynamic>,
      (json) => AuthResponse.fromJson(json as Map<String, dynamic>),
    );

    if (apiResponse.success && apiResponse.data != null) {
      return apiResponse.data!;
    } else {
      throw Exception(apiResponse.message ?? 'Registration failed');
    }
  }
}
