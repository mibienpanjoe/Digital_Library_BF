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
}
