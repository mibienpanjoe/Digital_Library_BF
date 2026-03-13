import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/env.dart';
import '../utils/exceptions.dart';

class ApiClient {
  late final Dio _dio;
  static const _tokenKey = 'auth_token';
  final _storage = const FlutterSecureStorage();

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: Env.apiBaseUrl,
      headers: {'Content-Type': 'application/json'},
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    _dio.interceptors.addAll([
      _AuthInterceptor(_storage, _tokenKey),
      _ErrorInterceptor(),
      LogInterceptor(requestBody: false, responseBody: false),
    ]);
  }

  Dio get dio => _dio;
}

/// Injecte automatiquement le JWT Bearer sur chaque requête.
/// En cas de 401 UNAUTHORIZED, lève une AppException.unauthorized().
class _AuthInterceptor extends Interceptor {
  final FlutterSecureStorage _storage;
  final String _tokenKey;

  _AuthInterceptor(this._storage, this._tokenKey);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: _tokenKey);
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // Token expiré ou invalide — supprimer et propager comme AppException
      await _storage.delete(key: _tokenKey);
      return handler.reject(
        DioException(
          requestOptions: err.requestOptions,
          error: AppException.unauthorized(),
          type: DioExceptionType.badResponse,
          response: err.response,
        ),
      );
    }
    handler.next(err);
  }
}

/// Transforme toutes les DioException en AppException unifié.
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppException exception;

    if (err.error is AppException) {
      // Déjà transformé par AuthInterceptor
      exception = err.error as AppException;
    } else if (err.type == DioExceptionType.connectionError ||
        err.type == DioExceptionType.receiveTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.connectionTimeout) {
      exception = AppException.network();
    } else if (err.response != null) {
      exception = AppException.fromApiResponse(
        err.response!.data is Map<String, dynamic>
            ? err.response!.data as Map<String, dynamic>
            : {'message': 'Erreur serveur'},
        statusCode: err.response!.statusCode,
      );
    } else {
      exception = AppException.unknown(err.message ?? 'Erreur inconnue');
    }

    handler.reject(
      DioException(
        requestOptions: err.requestOptions,
        error: exception,
        message: exception.message,
        type: err.type,
        response: err.response,
      ),
    );
  }
}

