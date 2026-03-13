import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/book_provider.dart';
import '../../widgets/book_grid.dart';
import '../../widgets/search_bar.dart';
import '../../widgets/pagination_controls.dart';
import '../../widgets/error_state.dart';
import '../../widgets/skeleton_loader.dart';
import '../../widgets/empty_state.dart';
import '../../utils/exceptions.dart';
import '../../models/api_response.dart';
import '../../models/book.dart';

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
              data: (paginated) {
                final books = paginated.data;
                if (books.isEmpty) {
                  return EmptyState(
                    title: 'Aucun livre trouvé',
                    message: _searchQuery != null && _searchQuery!.isNotEmpty
                        ? 'Aucun résultat pour "$_searchQuery"'
                        : 'Le catalogue est actuellement vide.',
                    onAction: _searchQuery != null && _searchQuery!.isNotEmpty
                        ? () {
                            _searchController.clear();
                            _onSearch('');
                          }
                        : null,
                    actionLabel: 'Effacer la recherche',
                  );
                }
                return BookGrid(books: books);
              },
              loading: () => const BookGrid(books: [], isLoading: true),
              error: (err, stack) => ErrorState(
                message: err is AppException ? err.message : err.toString(),
                onRetry: () => ref.refresh(booksProvider(filters)),
              ),
            ),
          ),
          // Pagination dynamique utilisant les données de l'API
          if (booksAsync.hasValue && booksAsync.value!.data.isNotEmpty)
            PaginationControls(
              currentPage: _currentPage,
              totalPages: booksAsync.value!.pagination.totalPages,
              onPageChanged: _onPageChanged,
            ),
        ],
      ),
    );
  }
}
