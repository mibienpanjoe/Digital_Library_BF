import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/book.dart';
import 'repository_providers.dart';

// Filter model to keep parameters together
class BookFilters {
  final int page;
  final int limit;
  final String? search;
  final String? category;

  BookFilters({
    this.page = 1,
    this.limit = 10,
    this.search,
    this.category,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BookFilters &&
          runtimeType == other.runtimeType &&
          page == other.page &&
          limit == other.limit &&
          search == other.search &&
          category == other.category;

  @override
  int get hashCode => page.hashCode ^ limit.hashCode ^ search.hashCode ^ category.hashCode;
}

// Provider for the list of books
final booksProvider = FutureProvider.family<List<Book>, BookFilters>((ref, filters) async {
  final repository = ref.watch(bookRepositoryProvider);
  final response = await repository.getBooks(
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    category: filters.category,
  );
  return response.data;
});

// Provider for a single book's details
final bookDetailProvider = FutureProvider.family<Book, String>((ref, id) async {
  final repository = ref.watch(bookRepositoryProvider);
  return await repository.getBookDetails(id);
});

// Provider for tracking download progress (bookId -> percentage 0.0 to 1.0)
final downloadProgressProvider = StateProvider<Map<String, double>>((ref) => {});
