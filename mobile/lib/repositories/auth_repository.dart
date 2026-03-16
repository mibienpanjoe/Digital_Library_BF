import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/api_response.dart';
import '../services/auth_service.dart';

class AuthRepository {
  final AuthService _authService;
  final FlutterSecureStorage _storage;
  static const String _tokenKey = 'auth_token';

  AuthRepository(this._authService, this._storage);

  Future<AuthResponse> login(String email, String password) async {
    final authResponse = await _authService.login(email, password);
    await _storage.write(key: _tokenKey, value: authResponse.token);
    return authResponse;
  }

  Future<AuthResponse> register(String name, String email, String password) async {
    final authResponse = await _authService.register(name, email, password);
    await _storage.write(key: _tokenKey, value: authResponse.token);
    return authResponse;
  }

  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
