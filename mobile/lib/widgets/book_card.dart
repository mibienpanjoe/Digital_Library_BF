import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../models/book.dart';
import '../config/colors.dart';
import '../config/theme.dart';

class BookCard extends StatelessWidget {
  final Book book;

  const BookCard({
    super.key,
    required this.book,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: () => context.push('/book/${book.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: AppShapes.cardRadius,
          border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                child: Hero(
                  tag: 'book-cover-${book.id}',
                  child: book.coverUrl != null
                      ? CachedNetworkImage(
                          imageUrl: book.coverUrl!,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
                            child: const Icon(Icons.broken_image_rounded),
                          ),
                        )
                      : Container(
                          color: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
                          child: const Icon(Icons.book_rounded),
                        ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    book.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    book.author,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildBadge(book.fileFormat.toUpperCase(), isDark),
                      if (book.category != null) ...[
                        const SizedBox(width: 6),
                        Expanded(
                          child: _buildBadge(book.category!, isDark, flex: true),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String label, bool isDark, {bool flex = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
        ),
      ),
    );
  }
}

