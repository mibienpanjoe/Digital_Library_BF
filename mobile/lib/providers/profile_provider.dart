import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import 'repository_providers.dart';

class ProfileNotifier extends AsyncNotifier<User?> {
  @override
  Future<User?> build() async {
    return _fetchProfile();
  }

  Future<User?> _fetchProfile() async {
    try {
      final repository = ref.watch(profileRepositoryProvider);
      return await repository.getProfile();
    } catch (e) {
      return null;
    }
  }

  Future<void> updateProfile({required String name, required String email}) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.watch(profileRepositoryProvider);
      return await repository.updateProfile(name: name, email: email);
    });
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _fetchProfile());
  }
}

final profileProvider = AsyncNotifierProvider<ProfileNotifier, User?>(() {
  return ProfileNotifier();
});
