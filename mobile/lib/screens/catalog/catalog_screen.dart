import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/book_provider.dart';
import '../../widgets/book_grid.dart';
import '../../widgets/search_bar.dart';
import '../../widgets/pagination_controls.dart';
import '../../widgets/error_state.dart';
import '../../widgets/skeleton_loader.dart';

class CatalogScreen extends ConsumerStatefulWidget {
  const CatalogScreen({super.key});

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  final _searchController = TextEditingController();
  int _currentPage = 1;
  String? _searchQuery;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) {
    setState(() {
      _searchQuery = value;
      _currentPage = 1; // Reset to first page on search
    });
  }

  void _onPageChanged(int page) {
    setState(() {
      _currentPage = page;
    });
  }

  @override
  Widget build(BuildContext context) {
    final filters = BookFilters(
      page: _currentPage,
      search: _searchQuery,
    );

    final booksAsync = ref.watch(booksProvider(filters));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Library'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: CustomSearchBar(
              controller: _searchController,
              hintText: 'Rechercher un livre...',
              onSearch: _onSearch,
              onClear: () => _onSearch(''),
            ),
          ),
          Expanded(
            child: booksAsync.when(
              data: (books) {
                if (books.isEmpty) {
                  return const Center(child: Text('Aucun livre trouvé'));
                }
                return BookGrid(books: books);
              },
              loading: () => const BookGrid(books: [], isLoading: true),
              error: (err, stack) => ErrorState(
                message: err.toString(),
                onRetry: () => ref.refresh(booksProvider(filters)),
              ),
            ),
          ),
          // Simple pagination - in a real app, we'd get totalPages from the API
          // For now, we assume 5 pages if there are books
          if (booksAsync.hasValue && booksAsync.value!.isNotEmpty)
            PaginationControls(
              currentPage: _currentPage,
              totalPages: 5, 
              onPageChanged: _onPageChanged,
            ),
        ],
      ),
    );
  }
}
