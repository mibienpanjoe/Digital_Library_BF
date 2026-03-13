import '../models/user.dart';
import '../models/api_response.dart';
import 'api_client.dart';

class ProfileService {
  final ApiClient _apiClient;

  ProfileService(this._apiClient);

  Future<User> getProfile() async {
    final response = await _apiClient.dio.get('/profile');

    final apiResponse = ApiResponse<User>.fromJson(
      response.data as Map<String, dynamic>,
      (json) => User.fromJson(json as Map<String, dynamic>),
    );

    if (apiResponse.success && apiResponse.data != null) {
      return apiResponse.data!;
    } else {
      throw Exception(apiResponse.message ?? 'Failed to fetch profile');
    }
  }

  Future<User> updateProfile(Map<String, dynamic> data) async {
    final response = await _apiClient.dio.put(
      '/profile',
      data: data,
    );

    final apiResponse = ApiResponse<User>.fromJson(
      response.data as Map<String, dynamic>,
      (json) => User.fromJson(json as Map<String, dynamic>),
    );

    if (apiResponse.success && apiResponse.data != null) {
      return apiResponse.data!;
    } else {
      throw Exception(apiResponse.message ?? 'Failed to update profile');
    }
  }

  Future<void> updatePassword(String currentPassword, String newPassword) async {
    final response = await _apiClient.dio.put(
      '/profile/password',
      data: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      },
    );

    final apiResponse = ApiResponse<void>.fromJson(
      response.data as Map<String, dynamic>,
      (json) => null,
    );

    if (!apiResponse.success) {
      throw Exception(apiResponse.message ?? 'Failed to update password');
    }
  }
}
