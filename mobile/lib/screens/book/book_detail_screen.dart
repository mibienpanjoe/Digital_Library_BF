import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/book_provider.dart';
import '../../widgets/download_button.dart';
import '../../widgets/error_state.dart';
import '../../utils/file_helper.dart';
import '../../config/colors.dart';
import '../../config/theme.dart';

class BookDetailScreen extends ConsumerWidget {
  final String id;

  const BookDetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookAsync = ref.watch(bookDetailProvider(id));
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Détails du livre'),
      ),
      body: bookAsync.when(
        data: (book) => SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Hero(
                  tag: 'book-cover-${book.id}',
                  child: ClipRRect(
                    borderRadius: AppShapes.cardRadius,
                    child: book.coverUrl != null
                        ? CachedNetworkImage(
                            imageUrl: book.coverUrl!,
                            height: 300,
                            fit: BoxFit.cover,
                          )
                        : Container(
                            height: 300,
                            width: 200,
                            color: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
                            child: const Icon(Icons.book_rounded, size: 80),
                          ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                book.title,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                book.author,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.primaryBlue,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildInfoBadge(context, 'Format', book.fileFormat.toUpperCase()),
                  _buildInfoBadge(context, 'Taille', FileHelper.formatBytes(book.fileSize)),
                  _buildInfoBadge(context, 'Catégorie', book.category ?? '—'),
                ],
              ),
              const SizedBox(height: 32),
              DownloadButton(book: book),
              const SizedBox(height: 32),
              Text(
                'Description',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              Text(
                book.description,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      height: 1.5,
                      color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
                    ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => ErrorState(
          message: err.toString(),
          onRetry: () => ref.refresh(bookDetailProvider(id)),
        ),
      ),
    );
  }

  Widget _buildInfoBadge(BuildContext context, String label, String value) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      children: [
        Text(
          label,
          style: TextStyle(
            color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            ),
          ),
          child: Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: isDark ? AppColors.darkTextPri : AppColors.lightTextPri,
            ),
          ),
        ),
      ],
    );
  }
}
