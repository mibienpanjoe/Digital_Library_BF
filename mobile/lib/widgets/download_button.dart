import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:open_filex/open_filex.dart';
import '../models/book.dart';
import '../providers/auth_provider.dart';
import '../providers/book_provider.dart';
import '../providers/repository_providers.dart';
import '../config/colors.dart';

class DownloadButton extends ConsumerStatefulWidget {
  final Book book;

  const DownloadButton({super.key, required this.book});

  @override
  ConsumerState<DownloadButton> createState() => _DownloadButtonState();
}

class _DownloadButtonState extends ConsumerState<DownloadButton> {
  bool _isOpening = false;
  bool _isDownloading = false;

  Future<void> _handleDownload() async {
    final repository = ref.read(bookRepositoryProvider);
    final progressNotifier = ref.read(downloadProgressProvider.notifier);

    setState(() => _isDownloading = true);

    try {
      if (kIsWeb) {
        // On web, the browser handles the download natively
        await repository.downloadBook(widget.book, (a, b) {});

        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Téléchargement lancé par le navigateur !')),
        );
      } else {
        // On mobile, track progress
        await repository.downloadBook(
          widget.book,
          (count, total) {
            final progress = count / total;
            progressNotifier.updateProgress(widget.book.id, progress);
          },
        );

        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Téléchargement terminé !')),
        );
        
        // Update progress to 1.1 to signify "Downloaded and ready to open"
        progressNotifier.updateProgress(widget.book.id, 1.1);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur de téléchargement: $e')),
      );
      progressNotifier.updateProgress(widget.book.id, 0.0);
    } finally {
      if (mounted) setState(() => _isDownloading = false);
    }
  }

  Future<void> _openFile() async {
    setState(() => _isOpening = true);
    try {
      final repository = ref.read(bookRepositoryProvider);
      final files = await repository.getDownloadedFiles();
      final file = files.firstWhere(
        (f) => f.path.contains(widget.book.id),
        orElse: () => throw Exception('Fichier non trouvé'),
      );
      
      await OpenFilex.open(file.path);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Impossible d\'ouvrir le fichier: $e')),
      );
    } finally {
      if (mounted) setState(() => _isOpening = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final downloadProgress = ref.watch(downloadProgressProvider)[widget.book.id] ?? 0.0;

    // Case 1: Downloading (0.0 < progress < 1.0) — mobile only
    if (!kIsWeb && downloadProgress > 0.0 && downloadProgress < 1.0) {
      return Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            height: 48,
            width: 48,
            child: CircularProgressIndicator(
              value: downloadProgress,
              backgroundColor: AppColors.lightBorder,
              color: AppColors.primaryBlue,
              strokeWidth: 4,
            ),
          ),
          Text(
            '${(downloadProgress * 100).toInt()}%',
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          ),
        ],
      );
    }

    // Case 2: Downloaded (progress >= 1.0) — mobile only (open file)
    if (!kIsWeb && downloadProgress >= 1.0) {
      return ElevatedButton.icon(
        onPressed: _isOpening ? null : _openFile,
        icon: _isOpening 
            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2))
            : const Icon(Icons.menu_book_rounded),
        label: Text(_isOpening ? 'Ouverture...' : 'Lire le livre'),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green,
        ),
      );
    }

    // Case 3: Authenticated - Show Download Button
    if (authState is AuthAuthenticated) {
      return ElevatedButton.icon(
        onPressed: _isDownloading ? null : _handleDownload,
        icon: _isDownloading
            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2))
            : const Icon(Icons.download_rounded),
        label: Text(_isDownloading ? 'Téléchargement...' : 'Télécharger'),
      );
    }

    // Case 4: Guest - Redirect to Login
    return OutlinedButton.icon(
      onPressed: () => Navigator.of(context).pushNamed('/login'),
      icon: const Icon(Icons.login_rounded),
      label: const Text('Se connecter pour lire'),
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primaryBlue,
        side: const BorderSide(color: AppColors.primaryBlue),
      ),
    );
  }
}
