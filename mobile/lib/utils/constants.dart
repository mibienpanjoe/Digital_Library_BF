class AppConstants {
  // API URLs
  static const String apiBaseUrl = 'API_BASE_URL'; // To be used with String.fromEnvironment
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  
  // Design system constants
  static const double cardRadius = 12.0;
  static const double buttonRadius = 8.0;
  static const double screenPadding = 24.0;
  static const double elementSpacing = 16.0;
  
  // Durations
  static const Duration splashDelay = Duration(seconds: 2);
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration snackBarDuration = Duration(seconds: 4);
  
  // Pagination
  static const int defaultPageSize = 10;
}
