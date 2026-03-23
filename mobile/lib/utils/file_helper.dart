import 'dart:io';
import 'package:path_provider/path_provider.dart';

class FileHelper {
  static Future<String> getLocalPath() async {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  }

  static Future<File> getFile(String fileName) async {
    final path = await getLocalPath();
    return File('$path/$fileName');
  }

  static Future<bool> fileExists(String fileName) async {
    final file = await getFile(fileName);
    return await file.exists();
  }

  static String formatBytes(int bytes, {int decimals = 2}) {
    if (bytes <= 0) return "0 B";
    const suffixes = ["B", "KB", "MB", "GB", "TB"];
    var i = (bytes.toString().length - 1) ~/ 3;
    var res = bytes / (1 << (i * 10));
    return "${res.toStringAsFixed(decimals)} ${suffixes[i]}";
  }

  static String getFileNameFromPath(String path) {
    return path.split('/').last;
  }

  /// Returns a human-readable display name from a file path.
  /// Strips the extension and converts underscores to spaces with title case.
  /// Example: "la_belle_histoire.pdf" -> "La Belle Histoire"
  static String getDisplayName(String path) {
    final fileName = getFileNameFromPath(path);
    // Remove file extension
    final nameWithoutExt = fileName.contains('.')
        ? fileName.substring(0, fileName.lastIndexOf('.'))
        : fileName;
    // Convert underscores to spaces and apply title case
    return nameWithoutExt
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => word.isEmpty ? '' : '${word[0].toUpperCase()}${word.substring(1)}')
        .join(' ')
        .trim();
  }

  /// Returns the file extension (without dot) from a file path.
  static String getFileExtension(String path) {
    final fileName = getFileNameFromPath(path);
    if (fileName.contains('.')) {
      return fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase();
    }
    return '';
  }
}
