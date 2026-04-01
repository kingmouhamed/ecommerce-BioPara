import 'package:flutter/material.dart';

class ProductRecommendationCard extends StatelessWidget {
  final String id;
  final String name;
  final double price;
  final String? imageUrl;
  final VoidCallback onTap;

  const ProductRecommendationCard({
    super.key,
    required this.id,
    required this.name,
    required this.price,
    this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(8),
        leading: imageUrl != null && imageUrl!.isNotEmpty
            ? ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  imageUrl!,
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                  errorBuilder: (ctx, err, stack) =>
                      const Icon(Icons.broken_image),
                ),
              )
            : const Icon(Icons.local_florist, size: 40, color: Colors.green),
        title: Text(
          name,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        subtitle: Text(
          '$price MAD', // Adjust currency as needed
          style: TextStyle(color: Colors.green.shade800),
        ),
        trailing: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.green.shade800,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          onPressed: onTap,
          child: const Text('أضف للسلة', style: TextStyle(fontSize: 12)),
        ),
      ),
    );
  }
}
