class Book {
  final String id;
  final String title;
  final String author;
  final String description;
  final String? coverUrl;
  final String fileFormat; // 'pdf' | 'epub'
  final int fileSize;
  final String? category;
  final int downloadCount;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Book({
    required this.id,
    required this.title,
    required this.author,
    required this.description,
    this.coverUrl,
    required this.fileFormat,
    this.fileSize = 0,
    this.category,
    this.downloadCount = 0,
    required this.createdAt,
    this.updatedAt,
  });

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['id'] as String,
      title: json['title'] as String,
      author: json['author'] as String,
      description: json['description'] as String? ?? '',
      coverUrl: json['coverUrl'] as String?,
      fileFormat: (json['fileFormat'] as String?) ?? 'pdf',
      fileSize: (json['fileSize'] as int?) ?? 0,
      category: json['category'] as String?,
      downloadCount: (json['downloadCount'] as int?) ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'author': author,
      'description': description,
      'coverUrl': coverUrl,
      'fileFormat': fileFormat,
      'fileSize': fileSize,
      'category': category,
      'downloadCount': downloadCount,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
