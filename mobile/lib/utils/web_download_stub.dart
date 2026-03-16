/// Web download helper - stub for non-web platforms.
Future<void> downloadFileWeb(String url, String fileName) async {
  throw UnsupportedError('Web download is not supported on this platform');
}
