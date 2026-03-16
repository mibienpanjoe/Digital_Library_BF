import 'package:dio/dio.dart';
import '../models/book.dart';
import '../models/api_response.dart';
import 'api_client.dart';

class BookService {
  final ApiClient _apiClient;

  BookService(this._apiClient);

  Future<PaginatedResponse<Book>> getAll({
    int page = 1,
    int limit = 10,
    String? search,
    String? category,
  }) async {
    final Map<String, dynamic> queryParameters = {
      'page': page,
      'limit': limit,
    };

    if (search != null && search.isNotEmpty) {
      queryParameters['search'] = search;
    }
    if (category != null && category.isNotEmpty) {
      queryParameters['category'] = category;
    }

    final response = await _apiClient.dio.get(
      '/books',
      queryParameters: queryParameters,
    );

    final json = response.data as Map<String, dynamic>;

    if (json['success'] == true) {
      return PaginatedResponse<Book>.fromJson(
        json,
        (item) => Book.fromJson(item as Map<String, dynamic>),
      );
    } else {
      throw Exception(json['message'] ?? 'Failed to fetch books');
    }
  }

  Future<Book> getById(String id) async {
    final response = await _apiClient.dio.get('/books/$id');

    final apiResponse = ApiResponse<Book>.fromJson(
      response.data as Map<String, dynamic>,
      (json) => Book.fromJson(json as Map<String, dynamic>),
    );

    if (apiResponse.success && apiResponse.data != null) {
      return apiResponse.data!;
    } else {
      throw Exception(apiResponse.message ?? 'Failed to fetch book details');
    }
  }

  Future<void> download(
    String id,
    String savePath, {
    ProgressCallback? onProgress,
  }) async {
    await _apiClient.dio.download(
      '/books/$id/download',
      savePath,
      onReceiveProgress: onProgress,
    );
  }
}
