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
  final DateTime updatedAt;

  Book({
    required this.id,
    required this.title,
    required this.author,
    required this.description,
    this.coverUrl,
    required this.fileFormat,
    required this.fileSize,
    this.category,
    required this.downloadCount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['id'] as String,
      title: json['title'] as String,
      author: json['author'] as String,
      description: json['description'] as String,
      coverUrl: json['coverUrl'] as String?,
      fileFormat: json['fileFormat'] as String,
      fileSize: json['fileSize'] as int,
      category: json['category'] as String?,
      downloadCount: json['downloadCount'] as int,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
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
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
