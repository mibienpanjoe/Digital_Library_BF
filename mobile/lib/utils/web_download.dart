import 'package:web/web.dart' as web;

/// Web download helper - triggers browser-native file download.
Future<void> downloadFileWeb(String url, String fileName) async {
  final anchor = web.document.createElement('a') as web.HTMLAnchorElement;
  anchor.href = url;
  anchor.download = fileName;
  anchor.target = '_blank';
  web.document.body?.append(anchor);
  anchor.click();
  anchor.remove();
}
