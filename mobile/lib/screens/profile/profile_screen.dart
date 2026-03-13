import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/profile_provider.dart';
import '../../providers/theme_provider.dart';
import '../../config/colors.dart';
import '../../config/theme.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);
    final themeMode = ref.watch(themeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Modifier le profil',
            onPressed: () => context.push('/profile/edit'),
          ),
        ],
      ),
      body: profileAsync.when(
        data: (user) => SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 24),
              CircleAvatar(
                radius: 50,
                backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                child: Text(
                  user?.name.substring(0, 1).toUpperCase() ?? '?',
                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                user?.name ?? 'Utilisateur',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              Text(
                user?.email ?? '',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
                    ),
              ),
              const SizedBox(height: 32),
              _buildSection(
                context,
                title: 'Compte',
                isDark: isDark,
                items: [
                  _buildListTile(
                    icon: Icons.person_outline,
                    title: 'Informations personnelles',
                    isDark: isDark,
                    onTap: () {},
                  ),
                  _buildListTile(
                    icon: Icons.lock_outline,
                    title: 'Sécurité et mot de passe',
                    isDark: isDark,
                    onTap: () {},
                  ),
                ],
              ),
              _buildSection(
                context,
                title: 'Préférences',
                isDark: isDark,
                items: [
                  SwitchListTile(
                    secondary: const Icon(Icons.dark_mode_outlined, color: AppColors.primaryBlue),
                    title: const Text('Mode Sombre', style: TextStyle(fontWeight: FontWeight.w500)),
                    value: themeMode == ThemeMode.dark,
                    onChanged: (val) => ref.read(themeProvider.notifier).toggleTheme(),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: ElevatedButton.icon(
                  onPressed: () => ref.read(authProvider.notifier).logout(),
                  icon: const Icon(Icons.logout, color: Colors.white),
                  label: const Text('Se déconnecter'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                  ),
                ),
              ),
              const SizedBox(height: 48),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Erreur: $err')),
      ),
    );
  }

  Widget _buildSection(BuildContext context,
      {required String title, required List<Widget> items, required bool isDark}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
          child: Text(
            title.toUpperCase(),
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
          ),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16.0),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            borderRadius: AppShapes.cardRadius,
            border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
          ),
          child: Column(children: items),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildListTile(
      {required IconData icon, required String title, required VoidCallback onTap, required bool isDark}) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primaryBlue),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: Icon(Icons.chevron_right, color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec),
      onTap: onTap,
    );
  }
}
