import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import '../models/book.dart';
import '../models/api_response.dart';
import '../services/book_service.dart';
import '../utils/exceptions.dart';


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
    // Demande de permission de stockage sur Android (SDK < 33)
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
    // Sur Android 13+ (SDK 33+) les permissions de stockage ne sont plus nécessaires
    // pour le répertoire documents de l'app. On garde la vérification pour compatibilité.
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
    final directory = await getApplicationDocumentsDirectory();
    final entities = await directory.list().toList();
    return entities.whereType<File>().toList();
  }

  Future<void> deleteDownloadedFile(String filePath) async {
    final file = File(filePath);
    if (await file.exists()) {
      await file.delete();
    }
  }

  String _sanitizeFileName(String name) {
    return name.replaceAll(RegExp(r'[^\w\s\-]'), '').replaceAll(' ', '_').toLowerCase();
  }
}
