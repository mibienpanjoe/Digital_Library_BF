import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/catalog/catalog_screen.dart';
import '../screens/book/book_detail_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/downloads/downloads_screen.dart';
import '../widgets/main_shell.dart';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/catalog/catalog_screen.dart';
import '../screens/book/book_detail_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/edit_profile_screen.dart';
import '../screens/downloads/downloads_screen.dart';
import '../widgets/main_shell.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final isLoggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/register';
      final isSplashing = state.matchedLocation == '/splash';

      if (authState is AuthInitial) return isSplashing ? null : '/splash';

      if (authState is AuthAuthenticated) {
        if (isLoggingIn || isSplashing) return '/';
        return null;
      }

      if (authState is AuthUnauthenticated) {
        // Protected routes
        final isProtected = state.matchedLocation == '/profile' || state.matchedLocation == '/downloads';
        if (isProtected) return '/login';
        if (isSplashing) return '/'; // Go to Catalog as guest
        return null;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (_, __) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (_, __) => const RegisterScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (_, __) => const CatalogScreen(),
          ),
          GoRoute(
            path: '/book/:id',
            builder: (_, state) => BookDetailScreen(id: state.pathParameters['id']!),
          ),
          GoRoute(
            path: '/downloads',
            builder: (_, __) => const DownloadsScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (_, __) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/profile/edit',
            builder: (_, __) => const EditProfileScreen(),
          ),
        ],
      ),
    ],
  );
});

