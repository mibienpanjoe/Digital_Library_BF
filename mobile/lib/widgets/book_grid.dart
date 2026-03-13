import 'package:flutter/material.dart';
import '../models/book.dart';
import 'book_card.dart';
import 'skeleton_loader.dart';

class BookGrid extends StatelessWidget {
  final List<Book> books;
  final bool isLoading;
  final ScrollController? controller;

  const BookGrid({
    super.key,
    required this.books,
    this.isLoading = false,
    this.controller,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading && books.isEmpty) {
      return GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.65,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: 6,
        itemBuilder: (context, index) => const BookCardSkeleton(),
      );
    }

    return GridView.builder(
      controller: controller,
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.65,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: books.length,
      itemBuilder: (context, index) {
        return BookCard(book: books[index]);
      },
    );
  }
}
