/// Exception unifiée conforme à ARCHITECTURE.md §13.
/// Les Services capturent les DioException et les transforment en AppException.
/// Les Repositories les propagent, les Providers mettent à jour l'état d'erreur.
class AppException implements Exception {
  final String code;
  final String message;
  final int? statusCode;

  const AppException({
    required this.code,
    required this.message,
    this.statusCode,
  });

  factory AppException.fromApiResponse(Map<String, dynamic> json, {int? statusCode}) {
    final error = json['error'] as Map<String, dynamic>?;
    return AppException(
      code: error?['code'] as String? ?? 'UNKNOWN_ERROR',
      message: error?['message'] as String? ?? json['message'] as String? ?? 'Une erreur est survenue.',
      statusCode: statusCode,
    );
  }

  factory AppException.network() {
    return const AppException(
      code: 'NETWORK_ERROR',
      message: 'Pas de connexion internet. Vérifiez votre réseau et réessayez.',
    );
  }

  factory AppException.unauthorized() {
    return const AppException(
      code: 'UNAUTHORIZED',
      message: 'Session expirée. Veuillez vous reconnecter.',
      statusCode: 401,
    );
  }

  factory AppException.unknown(Object error) {
    return AppException(
      code: 'UNKNOWN_ERROR',
      message: error.toString(),
    );
  }

  @override
  String toString() => 'AppException[$code]: $message';
}
