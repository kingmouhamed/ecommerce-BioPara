// lib/patient/screens/product_detail_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/models/product_model.dart';
import '../../core/providers/cart_provider.dart';
import '../../core/theme/app_theme.dart';
import 'cart_screen.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  final Product product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  ConsumerState<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen>
    with TickerProviderStateMixin {
  int _qty = 1;
  bool _isWishlisted = false;
  late TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
  }

  void _addToCart() {
    if (widget.product.stock <= 0) return;
    HapticFeedback.mediumImpact();
    for (var i = 0; i < _qty; i++) {
      ref.read(cartProvider.notifier).addToCart(
        productId: widget.product.id,
        productName: widget.product.name,
        productPrice: widget.product.price,
        imageUrl: widget.product.imageUrl,
      );
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Text(
              'تمت الإضافة للسلة ($_qty ${_qty == 1 ? "قطعة" : "قطع"})',
              style: GoogleFonts.tajawal(color: Colors.white),
            ),
          ],
        ),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        action: SnackBarAction(
          label: 'عرض السلة',
          textColor: AppColors.accent,
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CartScreen()),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isInCart = ref.watch(cartProvider).any((item) => item.productId == widget.product.id);
    final p = widget.product;
    final rating = p.rating > 0 ? p.rating : 4.2;
    final reviews = p.reviewsCount > 0 ? p.reviewsCount : 24;

    return Scaffold(
      backgroundColor: AppColors.background,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8),
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.9),
                shape: BoxShape.circle,
                boxShadow: AppShadows.subtle,
              ),
              child: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.primary, size: 18),
            ),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: GestureDetector(
              onTap: () => setState(() => _isWishlisted = !_isWishlisted),
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                  boxShadow: AppShadows.subtle,
                ),
                child: Icon(
                  _isWishlisted ? Icons.favorite : Icons.favorite_border,
                  color: _isWishlisted ? Colors.red : AppColors.textSecondary,
                  size: 20,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 8, left: 8),
            child: GestureDetector(
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen())),
              child: Stack(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                      boxShadow: AppShadows.subtle,
                    ),
                    child: const Icon(Icons.shopping_cart_outlined, color: AppColors.primary, size: 20),
                  ),
                  if (isInCart)
                    Positioned(
                      top: 2,
                      right: 2,
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(color: AppColors.accent, shape: BoxShape.circle),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // صورة المنتج
                  Hero(
                    tag: 'prod_${p.id}',
                    child: Container(
                      height: 340,
                      width: double.infinity,
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFFF5F0E8), Color(0xFFEDE8DC)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                      child: Stack(
                        children: [
                          Center(
                            child: Padding(
                              padding: const EdgeInsets.all(32),
                              child: p.imageUrl != null
                                  ? Image.network(p.imageUrl!, fit: BoxFit.contain,
                                      errorBuilder: (ctx, err, stack) => const Icon(Icons.eco, size: 120, color: AppColors.primary))
                                  : const Icon(Icons.eco, size: 120, color: AppColors.primary),
                            ),
                          ),
                          if (p.stock <= 0)
                            Container(
                              color: Colors.black.withValues(alpha: 0.5),
                              child: Center(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                  decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(8)),
                                  child: Text('نفد المخزون', style: GoogleFonts.cairo(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                                ),
                              ),
                            ),
                          Positioned(
                            top: 80,
                            right: 16,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withValues(alpha: 0.9),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(p.category, style: GoogleFonts.tajawal(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                            ),
                          ),
                          if (p.stock > 0 && p.stock <= 10)
                            Positioned(
                              top: 80,
                              left: 16,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppColors.warning.withValues(alpha: 0.9),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text('متبقي ${p.stock} فقط!', style: GoogleFonts.tajawal(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),

                  // معلومات المنتج
                  Container(
                    decoration: const BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: Container(
                            margin: const EdgeInsets.only(top: 12, bottom: 16),
                            width: 40,
                            height: 4,
                            decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2)),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Text(
                                      p.name,
                                      style: GoogleFonts.cairo(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary, height: 1.3),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: AppColors.accent.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.star_rounded, color: AppColors.accent, size: 16),
                                        const SizedBox(width: 4),
                                        Text(rating.toStringAsFixed(1),
                                            style: GoogleFonts.cairo(color: AppColors.accent, fontSize: 13, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text('$reviews مراجعة • ${p.category}',
                                  style: GoogleFonts.tajawal(fontSize: 13, color: AppColors.textSecondary)),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('${p.price.toStringAsFixed(0)} درهم',
                                          style: GoogleFonts.cairo(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.primary)),
                                      Text('شامل الضريبة', style: GoogleFonts.tajawal(fontSize: 11, color: AppColors.textSecondary)),
                                    ],
                                  ),
                                  const Spacer(),
                                  Container(
                                    decoration: BoxDecoration(
                                      color: AppColors.surface,
                                      borderRadius: BorderRadius.circular(14),
                                      border: Border.all(color: AppColors.border),
                                    ),
                                    child: Row(
                                      children: [
                                        _qtyButton(Icons.remove, () => setState(() { if (_qty > 1) _qty--; }), enabled: _qty > 1),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(horizontal: 16),
                                          child: Text('$_qty', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                                        ),
                                        _qtyButton(Icons.add, () => setState(() { if (_qty < p.stock) _qty++; }), enabled: _qty < p.stock),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              const Divider(color: AppColors.border),
                              const SizedBox(height: 16),
                              TabBar(
                                controller: _tabCtrl,
                                labelColor: AppColors.primary,
                                unselectedLabelColor: AppColors.textSecondary,
                                indicatorColor: AppColors.accent,
                                indicatorWeight: 2.5,
                                labelStyle: GoogleFonts.cairo(fontSize: 14, fontWeight: FontWeight.bold),
                                unselectedLabelStyle: GoogleFonts.cairo(fontSize: 13),
                                tabs: const [Tab(text: 'الوصف'), Tab(text: 'المكونات'), Tab(text: 'الاستخدام')],
                              ),
                              const SizedBox(height: 16),
                              SizedBox(
                                height: 160,
                                child: TabBarView(
                                  controller: _tabCtrl,
                                  children: [
                                    SingleChildScrollView(
                                      child: Text(
                                        p.description.isNotEmpty ? p.description
                                            : 'منتج طبيعي عالي الجودة من مجموعة BioPara المختارة بعناية من أجود المصادر الطبيعية. مناسب للاستخدام اليومي لدعم الصحة والعافية.',
                                        style: GoogleFonts.tajawal(fontSize: 14, color: AppColors.textSecondary, height: 1.8),
                                      ),
                                    ),
                                    SingleChildScrollView(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          _ingredientItem('✅ طبيعي 100%'),
                                          _ingredientItem('✅ خالٍ من المواد الحافظة'),
                                          _ingredientItem('✅ مختبر ومعتمد'),
                                          _ingredientItem('✅ ${p.category}'),
                                        ],
                                      ),
                                    ),
                                    SingleChildScrollView(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          _usageItem('1', 'اقرأ التعليمات على العبوة جيداً'),
                                          _usageItem('2', 'استشر مختصاً قبل الاستخدام إن لزم'),
                                          _usageItem('3', 'احفظ في مكان بارد وجاف بعيداً عن الضوء'),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 20),
                              _buildTrustRow(),
                              const SizedBox(height: 24),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // شريط الإضافة للسلة
          Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, -4))],
            ),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('الإجمالي', style: GoogleFonts.tajawal(fontSize: 12, color: AppColors.textSecondary)),
                    Text('${(p.price * _qty).toStringAsFixed(0)} درهم',
                        style: GoogleFonts.cairo(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.primary)),
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: GestureDetector(
                    onTap: p.stock > 0 ? _addToCart : null,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      height: 56,
                      decoration: BoxDecoration(
                        gradient: p.stock > 0 ? AppGradients.primaryHorizontal : null,
                        color: p.stock <= 0 ? AppColors.border : null,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        boxShadow: p.stock > 0 ? AppShadows.primaryGlow(AppColors.primary) : null,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isInCart ? Icons.check_circle_outline : Icons.add_shopping_cart_rounded,
                            color: Colors.white,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            p.stock <= 0 ? 'نفد المخزون' : isInCart ? 'في السلة – أضف المزيد' : 'أضف للسلة',
                            style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _qtyButton(IconData icon, VoidCallback onTap, {bool enabled = true}) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: enabled ? AppColors.primary.withValues(alpha: 0.08) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, size: 18, color: enabled ? AppColors.primary : AppColors.border),
      ),
    );
  }

  Widget _ingredientItem(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Text(text, style: GoogleFonts.tajawal(fontSize: 14, color: AppColors.textSecondary, height: 1.6)),
    );
  }

  Widget _usageItem(String num, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 22,
            height: 22,
            decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
            child: Center(child: Text(num, style: GoogleFonts.cairo(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white))),
          ),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: GoogleFonts.tajawal(fontSize: 14, color: AppColors.textSecondary, height: 1.5))),
        ],
      ),
    );
  }

  Widget _buildTrustRow() {
    return Row(
      children: [
        _trustBadge(Icons.verified_rounded, 'منتج أصلي'),
        const SizedBox(width: 8),
        _trustBadge(Icons.local_shipping_outlined, 'شحن سريع'),
        const SizedBox(width: 8),
        _trustBadge(Icons.replay_rounded, 'إرجاع مجاني'),
      ],
    );
  }

  Widget _trustBadge(IconData icon, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.15)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(height: 4),
            Text(label, style: GoogleFonts.tajawal(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
