import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../repositories/auth_repository.dart';
import '../repositories/book_repository.dart';
import '../repositories/profile_repository.dart';
import 'service_providers.dart';

final secureStorageProvider = Provider<FlutterSecureStorage>((ref) => const FlutterSecureStorage());

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final authService = ref.watch(authServiceProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthRepository(authService, storage);
});

final bookRepositoryProvider = Provider<BookRepository>((ref) {
  final bookService = ref.watch(bookServiceProvider);
  return BookRepository(bookService);
});

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  final profileService = ref.watch(profileServiceProvider);
  return ProfileRepository(profileService);
});
