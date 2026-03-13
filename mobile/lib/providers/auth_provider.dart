import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../repositories/auth_repository.dart';
import '../repositories/profile_repository.dart';
import 'repository_providers.dart';

sealed class AuthState {}

class AuthInitial extends AuthState {}

class AuthAuthenticated extends AuthState {
  final User user;
  final String token;

  AuthAuthenticated({required this.user, required this.token});
}

class AuthUnauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;

  AuthError(this.message);
}

class AuthNotifier extends Notifier<AuthState> {
  late final AuthRepository _authRepository;

  @override
  AuthState build() {
    _authRepository = ref.watch(authRepositoryProvider);
    _checkStatus();
    return AuthInitial();
  }

  Future<void> _checkStatus() async {
    final hasToken = await _authRepository.hasToken();
    if (!hasToken) {
      state = AuthUnauthenticated();
      return;
    }

    // ARCHITECTURE.md §9 : Si token existe → Valider via GET /profile
    try {
      final profileRepository = ref.read(profileRepositoryProvider);
      final user = await profileRepository.getProfile();
      final token = await _authRepository.getToken();
      if (user != null && token != null) {
        state = AuthAuthenticated(user: user, token: token);
      } else {
        state = AuthUnauthenticated();
      }
    } catch (e) {
      // Token expiré ou invalide → déconnexion silencieuse
      await _authRepository.logout();
      state = AuthUnauthenticated();
    }
  }

  Future<void> login(String email, String password) async {
    try {
      state = AuthInitial();
      final authResponse = await _authRepository.login(email, password);
      state = AuthAuthenticated(user: authResponse.user, token: authResponse.token);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> register(String name, String email, String password) async {
    try {
      state = AuthInitial();
      final authResponse = await _authRepository.register(name, email, password);
      state = AuthAuthenticated(user: authResponse.user, token: authResponse.token);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> logout() async {
    await _authRepository.logout();
    state = AuthUnauthenticated();
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});

