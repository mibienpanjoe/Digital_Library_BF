import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/colors.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightSurface,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png',
              height: 100,
            ),
            const SizedBox(height: 24),
            Text(
              'Digital Library BF',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: AppColors.primaryBlue,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Votre bibliothèque nomade',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppColors.lightTextSec,
                  ),
            ),
            const SizedBox(height: 48),
            const CircularProgressIndicator(color: AppColors.sahelGold),
          ],
        ),
      ),
    );
  }
}
