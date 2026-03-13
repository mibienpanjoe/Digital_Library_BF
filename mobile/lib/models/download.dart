enum DownloadStatus {
  queued,
  downloading,
  completed,
  failed,
  cancelled
}

class Download {
  final String id;
  final String bookId;
  final String title;
  final String filePath;
  final DownloadStatus status;
  final double progress; // 0.0 to 1.0
  final DateTime timestamp;
  final String? errorMessage;

  Download({
    required this.id,
    required this.bookId,
    required this.title,
    required this.filePath,
    required this.status,
    required this.progress,
    required this.timestamp,
    this.errorMessage,
  });

  Download copyWith({
    String? id,
    String? bookId,
    String? title,
    String? filePath,
    DownloadStatus? status,
    double? progress,
    DateTime? timestamp,
    String? errorMessage,
  }) {
    return Download(
      id: id ?? this.id,
      bookId: bookId ?? this.bookId,
      title: title ?? this.title,
      filePath: filePath ?? this.filePath,
      status: status ?? this.status,
      progress: progress ?? this.progress,
      timestamp: timestamp ?? this.timestamp,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  factory Download.fromJson(Map<String, dynamic> json) {
    return Download(
      id: json['id'] as String,
      bookId: json['bookId'] as String,
      title: json['title'] as String,
      filePath: json['filePath'] as String,
      status: DownloadStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => DownloadStatus.failed,
      ),
      progress: (json['progress'] as num).toDouble(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      errorMessage: json['errorMessage'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bookId': bookId,
      'title': title,
      'filePath': filePath,
      'status': status.name,
      'progress': progress,
      'timestamp': timestamp.toIso8601String(),
      'errorMessage': errorMessage,
    };
  }
}
