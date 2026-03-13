import '../models/user.dart';
import '../services/profile_service.dart';

class ProfileRepository {
  final ProfileService _profileService;

  ProfileRepository(this._profileService);

  Future<User> getProfile() async {
    return await _profileService.getProfile();
  }

  Future<User> updateProfile({
    required String name,
    required String email,
  }) async {
    return await _profileService.updateProfile({
      'name': name,
      'email': email,
    });
  }

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    await _profileService.updatePassword(currentPassword, newPassword);
  }
}
