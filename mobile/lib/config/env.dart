import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class Env {
  static String get apiBaseUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL', defaultValue: '');
    if (fromEnv.isNotEmpty) return fromEnv;
    
    if (kIsWeb) {
      return 'https://digital-library-bf-api.onrender.com/api/v1';
    } else {
      // Use Platform carefully because it throws on Web
      if (Platform.isAndroid) {
        return 'https://digital-library-bf-api.onrender.com/api/v1';
      } else {
        return 'https://digital-library-bf-api.onrender.com/api/v1';
      }
    }
  }
}
