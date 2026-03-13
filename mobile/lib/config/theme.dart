import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';
import 'typography.dart';

class AppShapes {
  static const cardRadius = BorderRadius.all(Radius.circular(12));
  static const buttonRadius = BorderRadius.all(Radius.circular(8));
}

class AppTheme {
  // --- Mode Clair ---
  static ThemeData light = ThemeData(
    useMaterial3: true,
    fontFamily: GoogleFonts.inter().fontFamily,
    colorScheme: const ColorScheme.light(
      primary: AppColors.primaryBlue,       // Primary Blue
      onPrimary: Colors.white,
      secondary: AppColors.sahelGold,     // Sahel Gold
      surface: AppColors.lightSurface,       // Slate 50
      onSurface: AppColors.lightTextPri,     // Slate 900
      outline: AppColors.lightBorder,       // Slate 200
    ),
    scaffoldBackgroundColor: AppColors.lightBg,
    textTheme: TextTheme(
      displayLarge: AppTypography.h1,
      displayMedium: AppTypography.h2,
      displaySmall: AppTypography.h3,
      bodyLarge: AppTypography.body,
      bodyMedium: AppTypography.small,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primaryBlue,
        foregroundColor: Colors.white,
        shape: const RoundedRectangleBorder(borderRadius: AppShapes.buttonRadius),
        minimumSize: const Size(double.infinity, 48),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.lightSurface,
      border: OutlineInputBorder(
        borderRadius: AppShapes.buttonRadius,
        borderSide: const BorderSide(color: AppColors.lightBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppShapes.buttonRadius,
        borderSide: const BorderSide(color: AppColors.lightBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppShapes.buttonRadius,
        borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
      ),
    ),
  );

  // --- Mode Sombre ---
  static ThemeData dark = ThemeData(
    useMaterial3: true,
    fontFamily: GoogleFonts.inter().fontFamily,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primaryBlue,       // Primary Blue
      onPrimary: Colors.white,
      secondary: AppColors.sahelGold,     // Sahel Gold
      surface: AppColors.darkSurface,       // Slate 800
      onSurface: AppColors.darkTextPri,     // Slate 50
      outline: AppColors.darkBorder,       // Slate 700
    ),
    scaffoldBackgroundColor: AppColors.darkBg, // Slate 900
    textTheme: TextTheme(
      displayLarge: AppTypography.h1.copyWith(color: AppColors.darkTextPri),
      displayMedium: AppTypography.h2.copyWith(color: AppColors.darkTextPri),
      displaySmall: AppTypography.h3.copyWith(color: AppColors.darkTextPri),
      bodyLarge: AppTypography.body.copyWith(color: AppColors.darkTextPri),
      bodyMedium: AppTypography.small.copyWith(color: AppColors.darkTextPri),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primaryBlue,
        foregroundColor: Colors.white,
        shape: const RoundedRectangleBorder(borderRadius: AppShapes.buttonRadius),
        minimumSize: const Size(double.infinity, 48),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.darkSurface,
      border: OutlineInputBorder(
        borderRadius: AppShapes.buttonRadius,
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppShapes.buttonRadius,
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppShapes.buttonRadius,
        borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
      ),
    ),
  );
}
