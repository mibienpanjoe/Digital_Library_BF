import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:open_filex/open_filex.dart';
import '../../providers/repository_providers.dart';
import '../../widgets/empty_state.dart';
import '../../config/colors.dart';
import '../../config/theme.dart';
import '../../utils/file_helper.dart';

class DownloadsScreen extends ConsumerWidget {
  const DownloadsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final repository = ref.read(bookRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes Livres'),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: Future.wait([
          repository.getDownloadedFiles(),
          repository.getBookMetadata(),
        ]),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final files = (snapshot.data?[0] as List<File>?) ?? [];
          final metadata = (snapshot.data?[1] as Map<String, dynamic>?) ?? {};

          if (files.isEmpty) {
            return const EmptyState(
              title: 'Aucun livre téléchargé',
              message: 'Vos livres téléchargés apparaîtront ici.',
              icon: Icons.download_done_rounded,
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16.0),
            itemCount: files.length,
            itemBuilder: (context, index) {
              final file = files[index];
              final rawFileName = FileHelper.getFileNameFromPath(file.path);
              final fileExtension = FileHelper.getFileExtension(file.path);
              
              // Use metadata for display name if available, otherwise derive from filename
              final meta = metadata[rawFileName] as Map<String, dynamic>?;
              final displayName = meta?['title'] as String? ?? FileHelper.getDisplayName(file.path);
              final author = meta?['author'] as String?;

              return Container(
                margin: const EdgeInsets.only(bottom: 12.0),
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                  borderRadius: AppShapes.cardRadius,
                  border: Border.all(
                    color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        fileExtension == 'EPUB' ? Icons.auto_stories_rounded : Icons.picture_as_pdf_rounded,
                        color: AppColors.primaryBlue,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            displayName,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              if (author != null) ...[
                                Flexible(
                                  child: Text(
                                    author,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                          color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
                                        ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                              ],
                              FutureBuilder<int>(
                                future: file.length(),
                                builder: (context, sizeSnapshot) {
                                  final size = sizeSnapshot.data != null
                                      ? FileHelper.formatBytes(sizeSnapshot.data!)
                                      : '...';
                                  return Text(
                                    size,
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                          color: isDark ? AppColors.darkTextSec : AppColors.lightTextSec,
                                        ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.menu_book_rounded, color: AppColors.primaryBlue),
                          tooltip: 'Ouvrir',
                          onPressed: () => OpenFilex.open(file.path),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent),
                          tooltip: 'Supprimer',
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                title: const Text('Supprimer le fichier ?'),
                                content: const Text('Cette action est irréversible.'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(ctx, false),
                                    child: const Text('Annuler'),
                                  ),
                                  TextButton(
                                    onPressed: () => Navigator.pop(ctx, true),
                                    child: const Text('Supprimer', style: TextStyle(color: Colors.red)),
                                  ),
                                ],
                              ),
                            );
                            if (confirm == true) {
                              await ref.read(bookRepositoryProvider).deleteDownloadedFile(file.path);
                              // Rebuild the screen
                              (context as Element).markNeedsBuild();
                            }
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

