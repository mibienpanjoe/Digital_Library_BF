import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../config/colors.dart';

class SkeletonLoader extends StatelessWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const SkeletonLoader({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkSurfaceHov : AppColors.lightSurfaceHov,
      highlightColor: isDark ? AppColors.darkBorder : AppColors.lightBorder,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
      ),
    );
  }
}

class BookCardSkeleton extends StatelessWidget {
  const BookCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AspectRatio(
          aspectRatio: 3 / 4,
          child: SkeletonLoader(
            width: double.infinity,
            height: double.infinity,
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        const SizedBox(height: 12),
        const SkeletonLoader(width: 120, height: 16),
        const SizedBox(height: 4),
        const SkeletonLoader(width: 80, height: 14),
      ],
    );
  }
}
