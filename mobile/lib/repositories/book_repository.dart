import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import '../models/book.dart';
import '../models/api_response.dart';
import '../services/book_service.dart';
import '../utils/exceptions.dart';
import '../config/env.dart';
import '../utils/web_download_helper.dart';


class BookRepository {
  final BookService _bookService;

  BookRepository(this._bookService);

  Future<PaginatedResponse<Book>> getBooks({
    int page = 1,
    int limit = 10,
    String? search,
    String? category,
  }) async {
    return await _bookService.getAll(
      page: page,
      limit: limit,
      search: search,
      category: category,
    );
  }

  Future<Book> getBookDetails(String id) async {
    return await _bookService.getById(id);
  }

  Future<String> downloadBook(Book book, Function(int, int) onProgress) async {
    if (kIsWeb) {
      return _downloadBookWeb(book);
    } else {
      return _downloadBookNative(book, onProgress);
    }
  }

  /// Web: trigger browser-native download via anchor tag
  Future<String> _downloadBookWeb(Book book) async {
    final downloadUrl = '${Env.apiBaseUrl}/books/${book.id}/download';
    final fileName = '${_sanitizeFileName(book.title)}.${book.fileFormat}';
    await downloadFileWeb(downloadUrl, fileName);
    return fileName;
  }

  /// Mobile: download to local file system using Dio
  Future<String> _downloadBookNative(Book book, Function(int, int) onProgress) async {
    await _requestStoragePermission();

    final directory = await getApplicationDocumentsDirectory();
    final fileName = '${book.id}_${_sanitizeFileName(book.title)}.${book.fileFormat}';
    final filePath = '${directory.path}/$fileName';

    await _bookService.download(
      book.id,
      filePath,
      onProgress: onProgress,
    );

    return filePath;
  }

  Future<void> _requestStoragePermission() async {
    final status = await Permission.storage.status;
    if (status.isDenied) {
      final result = await Permission.storage.request();
      if (result.isPermanentlyDenied) {
        throw AppException(
          code: 'PERMISSION_DENIED',
          message: 'Permission de stockage refusée. Activez-la dans les paramètres.',
        );
      }
    }
  }

  Future<List<File>> getDownloadedFiles() async {
    if (kIsWeb) return []; // No file listing on web
    final directory = await getApplicationDocumentsDirectory();
    final entities = await directory.list().toList();
    return entities.whereType<File>().toList();
  }

  Future<void> deleteDownloadedFile(String filePath) async {
    if (kIsWeb) return; // No file deletion on web
    final file = File(filePath);
    if (await file.exists()) {
      await file.delete();
    }
  }

  String _sanitizeFileName(String name) {
    return name.replaceAll(RegExp(r'[^\w\s\-]'), '').replaceAll(' ', '_').toLowerCase();
  }
}
