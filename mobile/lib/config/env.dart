import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class Env {
  static String get apiBaseUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL', defaultValue: '');
    if (fromEnv.isNotEmpty) return fromEnv;
    
    if (kIsWeb) {
      return 'http://127.0.0.1:3000/api/v1';
    } else {
      // Use Platform carefully because it throws on Web
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3000/api/v1';
      } else {
        return 'http://127.0.0.1:3000/api/v1';
      }
    }
  }
}
