import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:async';
import '../../core/providers/shop_provider.dart';
import '../../core/providers/cart_provider.dart';
import '../../core/models/product_model.dart';
import 'cart_screen.dart';

// ── COLORS & DESIGN SYSTEM ──────────────────────────────────
const Color primary = Color(0xFF2D4A2E);
const Color primaryLight = Color(0xFF4A7C4E);
const Color accent = Color(0xFFC8963E);
const Color background = Color(0xFFF5F0E8);
const Color surface = Color(0xFFFDFAF5);
const Color textPrimary = Color(0xFF1A2E1B);
const Color textSecondary = Color(0xFF6B7B6C);
const Color inputBorder = Color(0xFFD4C9B0);
const Color success = Color(0xFF2D7A4E);
const Color danger = Color(0xFFB94040);
const Color accent2 = Color(0xFFE8D5B0);
const Color shadowColor = Color(0x15000000);

class ShopScreen extends ConsumerStatefulWidget {
  const ShopScreen({super.key});

  @override
  ConsumerState<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends ConsumerState<ShopScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'الكل 🌿';
  final List<String> _categories = [
    'الكل 🌿',
    'أعشاب طبية 🌱',
    'شاي اعشاب ðŸµ',
    'Ù…Ùƒملات غذائية 💊',
    'Ø²ÙŠÙˆت طبية 🫙',
    'عسل طبيعي ðŸ¯'
  ];

  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productsAsync = ref.watch(productsProvider);
    final cartCount = ref.watch(cartItemCount);
    final cartItems = ref.watch(cartProvider);
    
    double totalPrice = 0;
    for (var item in cartItems) {
      totalPrice += item.productPrice * item.quantity;
    }

    return Scaffold(
      backgroundColor: background,
      body: Stack(
        children: [
          CustomScrollView(
            controller: _scrollController,
            slivers: [
              const StoreHeaderWidget(),

              SliverToBoxAdapter(
                child: Column(
                  children: [
                    _buildSearchBar(),
                    const HeroBannerCarousel(),
                    _buildCategorySection(productsAsync),
                    _buildSectionHeader(context),
                  ],
                ),
              ),

              productsAsync.when(
                data: (allProducts) {
                  final filteredProducts = allProducts.where((p) {
                    final cleanCat = _selectedCategory.split(' ')[0];
                    final matchSearch = p.name.contains(_searchQuery);
                    final matchCat = cleanCat == 'الكل' || p.category.contains(cleanCat);
                    return matchSearch && matchCat;
                  }).toList();

                  if (filteredProducts.isEmpty) {
                    return SliverFillRemaining(
                      hasScrollBody: false,
                      child: StoreEmptyState(onReset: () {
                        setState(() {
                          _selectedCategory = 'الكل 🌿';
                          _searchQuery = '';
                        });
                      }),
                    );
                  }

                  return SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.6,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) => ProductCard(
                          product: filteredProducts[index],
                          index: index,
                        ).animate().fade(delay: (index * 50).ms).slideY(begin: 0.1, curve: Curves.easeOutQuad),
                        childCount: filteredProducts.length,
                      ),
                    ),
                  );
                },
                loading: () => SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.65,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => const ProductSkeletonCard(),
                      childCount: 4,
                    ),
                  ),
                ),
                error: (err, stack) => SliverFillRemaining(
                  child: Center(child: Text('خطأ: $err')),
                ),
              ),
              
              const SliverToBoxAdapter(child: SizedBox(height: 120)),
            ],
          ),
          
          if (cartCount > 0)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: FloatingCartBar(count: cartCount, total: totalPrice)
                  .animate()
                  .slideY(begin: 1, end: 0, curve: Curves.easeOutBack, duration: 400.ms),
            ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: inputBorder, width: 1.5),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, 4)),
          ],
        ),
        child: TextField(
          textAlign: TextAlign.right,
          onChanged: (v) => setState(() => _searchQuery = v),
          style: GoogleFonts.tajawal(color: textPrimary, fontSize: 14),
          decoration: InputDecoration(
            hintText: 'ابحث Ø¹Ù† أعشاب، Ø²ÙŠÙˆت، Ø£Ùˆ Ù…Ù†تجات Ø±Ùˆحية...',
            hintStyle: GoogleFonts.tajawal(color: textSecondary, fontStyle: FontStyle.italic, fontSize: 13),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            suffixIcon: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Container(
                width: 36,
                height: 36,
                decoration: const BoxDecoration(color: primaryLight, shape: BoxShape.circle),
                child: const Icon(Icons.search, color: Colors.white, size: 18),
              ),
            ),
            prefixIcon: const Icon(Icons.mic_none_rounded, color: textSecondary),
          ),
        ),
      ),
    ).animate().fade(duration: 400.ms).slideY(begin: -0.2);
  }

  Widget _buildCategorySection(AsyncValue<List<Product>> productsAsync) {
    return SizedBox(
      height: 70,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final cat = _categories[index];
          final isSelected = _selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.only(left: 12),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () => setState(() => _selectedCategory = cat),
                  child: AnimatedContainer(
                    duration: 200.ms,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      gradient: isSelected 
                        ? const LinearGradient(colors: [primary, primaryLight])
                        : null,
                      color: isSelected ? null : Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: isSelected ? null : Border.all(color: inputBorder),
                      boxShadow: isSelected 
                        ? [BoxShadow(color: accent.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4))]
                        : null,
                    ),
                    child: Text(
                      cat,
                      style: GoogleFonts.tajawal(
                        color: isSelected ? Colors.white : textSecondary,
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                if (!isSelected)
                  Builder(
                    builder: (context) {
                      final count = productsAsync.when(
                        data: (prods) {
                          final cleanCat = cat.split(' ')[0];
                          if (cleanCat == 'الكل') return prods.length;
                          return prods.where((p) => p.category.contains(cleanCat)).length;
                        },
                        loading: () => 0,
                        error: (err, stack) => 0,
                      );
                      return Text(
                        "($count)",
                        style: GoogleFonts.tajawal(fontSize: 10, color: textSecondary),
                      );
                    }
                  ),
              ],
            ),
          );
        },
      ),
    ).animate().fade(delay: 200.ms).slideX(begin: 0.1);
  }

  Widget _buildSectionHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () => _showFilterSheet(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: primary),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: primary),
                      const SizedBox(width: 4),
                      Text('ترتيب', style: GoogleFonts.tajawal(color: primary, fontSize: 13, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text('عرض Ø§Ù„Ùƒل â†', style: GoogleFonts.tajawal(color: accent, fontSize: 14, fontWeight: FontWeight.bold)),
            ],
          ),
          Text(
            'Ø§Ù„Ù…Ù†تجات Ø§Ù„Ø£Ùƒثر مبيعاً',
            style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary),
          ),
        ],
      ),
    );
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => const FilterBottomSheet(),
    );
  }
}

class StoreHeaderWidget extends StatelessWidget {
  const StoreHeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 140,
      pinned: true,
      elevation: 0,
      backgroundColor: primary,
      flexibleSpace: FlexibleSpaceBar(
        background: ClipPath(
          clipper: WaveClipper(),
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [primary, primaryLight],
              ),
            ),
            child: Stack(
              children: [
                Positioned.fill(
                  child: Opacity(
                    opacity: 0.05,
                    child: Icon(Icons.eco, size: 300, color: Colors.white.withValues(alpha: 0.5)),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 50, 20, 0),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // سلة التسوق (Ø¹Ù„Ù‰ اليسار في RTL)
                          Consumer(builder: (context, ref, _) {
                            final count = ref.watch(cartItemCount);
                            return GestureDetector(
                              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen())),
                              child: _buildIconBadge(Icons.shopping_cart_outlined, count, accent),
                            );
                          }),
                          // Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ÙÙŠ Ø§Ù„Ù…Ù†تصف
                          Text(
                            'متجر BioPara',
                            style: GoogleFonts.cairo(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                          ),
                          // Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡ات Ùˆزر Ø§Ù„Ø±Ø¬Ùˆع (Ø¹Ù„Ù‰ Ø§Ù„ÙŠÙ…ÙŠÙ† في RTL)
                          Row(
                            children: [
                              GestureDetector(
                                onTap: () => _showNotificationsSheet(context),
                                child: _buildIconBadge(Icons.notifications_outlined, 3, Colors.red),
                              ),
                              const SizedBox(width: 15),
                              GestureDetector(
                                onTap: () => Navigator.maybePop(context),
                                child: const Icon(
                                  Icons.arrow_forward_rounded, // Ø³Ù‡م Ø§Ù„Ø±Ø¬Ùˆع Ø§Ù„Ù…Ù†اسب للـ RTL
                                  color: Colors.white,
                                  size: 28,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'أعشاب طبيعية أصيلة',
                        style: GoogleFonts.tajawal(color: Colors.white.withValues(alpha: 0.7), fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showNotificationsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: inputBorder, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            Text('Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡ات', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary)),
            const SizedBox(height: 20),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildNotificationItem(
                    'تم ØªØ£Ùƒيد طلبك #8234',
                    'جاري ØªØ¬Ù‡يز Ø£Ø¹Ø´Ø§Ø¨Ùƒ الطبية وسيتم الشحن قريباً.',
                    'Ù…Ù†ذ ١٠ دقائق',
                    Icons.check_circle,
                    success,
                  ),
                  _buildNotificationItem(
                    'ØªØ°Ùƒير Ø¨Ù…Ùˆعد استشارة',
                    'Ù„Ø¯ÙŠÙƒ استشارة ÙÙŠØ¯ÙŠÙˆ Ø§Ù„ÙŠÙˆم الساعة ٤:٣٠ مساءً.',
                    'Ù…Ù†ذ ساعتين',
                    Icons.calendar_today,
                    accent,
                  ),
                  _buildNotificationItem(
                    'Ø®ØµÙˆمات جديدة! 🌿',
                    'استخدم ÙƒÙˆد BIOPARA Ù„Ù„Ø­ØµÙˆل Ø¹Ù„Ù‰ خصم إضافي.',
                    'Ù…Ù†ذ ÙŠÙˆم Ùˆاحد',
                    Icons.local_offer,
                    primary,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationItem(String title, String sub, String time, IconData icon, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: background.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: inputBorder.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.cairo(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary)),
                Text(sub, style: GoogleFonts.tajawal(fontSize: 12, color: textSecondary)),
                const SizedBox(height: 4),
                Text(time, style: GoogleFonts.tajawal(fontSize: 10, color: textSecondary.withValues(alpha: 0.7))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIconBadge(IconData icon, int count, Color badgeColor) {
    return Stack(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        if (count > 0)
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(color: badgeColor, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 1.5)),
              constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
              child: Text(
                '$count',
                style: GoogleFonts.cairo(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.2, 1.2), duration: 1.seconds),
          ),
      ],
    );
  }
}

class WaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();
    path.lineTo(0, size.height - 40);
    var firstControlPoint = Offset(size.width / 4, size.height);
    var firstEndPoint = Offset(size.width / 2.25, size.height - 30);
    path.quadraticBezierTo(firstControlPoint.dx, firstControlPoint.dy, firstEndPoint.dx, firstEndPoint.dy);
    var secondControlPoint = Offset(size.width - (size.width / 3.25), size.height - 65);
    var secondEndPoint = Offset(size.width, size.height - 40);
    path.quadraticBezierTo(secondControlPoint.dx, secondControlPoint.dy, secondEndPoint.dx, secondEndPoint.dy);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }
  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

class HeroBannerCarousel extends StatefulWidget {
  const HeroBannerCarousel({super.key});

  @override
  State<HeroBannerCarousel> createState() => _HeroBannerCarouselState();
}

class _HeroBannerCarouselState extends State<HeroBannerCarousel> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;
  final List<Map<String, String>> _slides = [
    {'title': 'Ø¹Ø±Ùˆض الموسم 🌿', 'subtitle': 'خصم ٢٠٪ Ø¹Ù„Ù‰ جميع الأعشاب'},
    {'title': 'عسل السدر الطبيعي ðŸ¯', 'subtitle': 'Ø§Ù„Ø¢Ù† Ù…ØªÙˆفر Ø¨Ùƒميات Ù…Ø­Ø¯Ùˆدة'},
    {'title': 'استشارة Ù…Ø¬Ø§Ù†ية ðŸ‘¨â€âš•️', 'subtitle': 'مع Ùƒل طلب ÙÙˆÙ‚ ٢٠٠ درهم'},
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 4), (Timer timer) {
      if (_currentPage < 2) {
        _currentPage++;
      } else {
        _currentPage = 0;
      }
      if (_pageController.hasClients) {
        _pageController.animateToPage(_currentPage, duration: 800.ms, curve: Curves.easeInOutExpo);
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 160,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          PageView.builder(
            controller: _pageController,
            onPageChanged: (v) => setState(() => _currentPage = v),
            itemCount: _slides.length,
            itemBuilder: (context, index) {
              return Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: const LinearGradient(colors: [primary, primaryLight]),
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_slides[index]['title']!, style: GoogleFonts.cairo(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(_slides[index]['subtitle']!, style: GoogleFonts.tajawal(color: Colors.white.withValues(alpha: 0.8), fontSize: 14)),
                  ],
                ),
              );
            },
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_slides.length, (index) => AnimatedContainer(
                duration: 300.ms,
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: _currentPage == index ? 20 : 6,
                height: 6,
                decoration: BoxDecoration(color: _currentPage == index ? accent : Colors.white, borderRadius: BorderRadius.circular(3)),
              )),
            ),
          ),
        ],
      ),
    ).animate().fade(delay: 100.ms).scale(begin: const Offset(0.95, 0.95));
  }
}

class ProductCard extends ConsumerStatefulWidget {
  final Product product;
  final int index;
  const ProductCard({super.key, required this.product, required this.index});

  @override
  ConsumerState<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends ConsumerState<ProductCard> {
  bool _isWishlisted = false;

  @override
  Widget build(BuildContext context) {
    final isInCart = ref.watch(cartProvider).any((item) => item.productId == widget.product.id);

    return Container(
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: inputBorder.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Column(
          children: [
            Expanded(
              flex: 55,
              child: Stack(
                children: [
                  Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0xFFF5F0E8), Color(0xFFEDE8DC)],
                      ),
                    ),
                    padding: const EdgeInsets.all(12),
                    child: Hero(
                      tag: 'prod_${widget.product.id}',
                      child: widget.product.imageUrl != null
                          ? Image.network(widget.product.imageUrl!, fit: BoxFit.contain)
                          : const Icon(Icons.eco, size: 50, color: primary),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    left: 8,
                    child: GestureDetector(
                      onTap: () => setState(() => _isWishlisted = !_isWishlisted),
                      child: CircleAvatar(
                        radius: 16,
                        backgroundColor: Colors.white,
                        child: Icon(
                          _isWishlisted ? Icons.favorite : Icons.favorite_border,
                          size: 18,
                          color: _isWishlisted ? Colors.red : textSecondary,
                        ).animate(target: _isWishlisted ? 1 : 0).scale(begin: const Offset(1, 1), end: const Offset(1.3, 1.3), duration: 200.ms),
                      ),
                    ),
                  ),
                  if (widget.index < 3)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: accent, borderRadius: BorderRadius.circular(10)),
                        child: Text('Ø§Ù„Ø£Ùƒثر مبيعاً', style: GoogleFonts.cairo(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  if (widget.product.stock <= 0)
                    Container(
                      color: Colors.black.withValues(alpha: 0.4),
                      child: Center(child: Text('Ù†فد المخزون', style: GoogleFonts.cairo(color: Colors.white, fontWeight: FontWeight.bold))),
                    ),
                ],
              ),
            ),
            Expanded(
              flex: 45,
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.product.name,
                      style: GoogleFonts.cairo(fontSize: 13, fontWeight: FontWeight.bold, color: textPrimary, height: 1.2),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'أعشاب طبيعية مختارة',
                      style: GoogleFonts.tajawal(fontSize: 10, color: textSecondary, fontStyle: FontStyle.italic),
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        ...List.generate(3, (i) => const Icon(Icons.star, color: Colors.amber, size: 10)),
                        const SizedBox(width: 4),
                        Text('(٢٤)', style: GoogleFonts.tajawal(fontSize: 10, color: textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${widget.product.price} درهم', style: GoogleFonts.cairo(fontSize: 15, fontWeight: FontWeight.w900, color: primary)),
                            if (widget.index % 4 == 0)
                              Text('٢٠٠ درهم', style: GoogleFonts.cairo(fontSize: 11, color: textSecondary, decoration: TextDecoration.lineThrough)),
                          ],
                        ),
                        if (widget.index % 4 == 0)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                            decoration: BoxDecoration(color: danger, borderRadius: BorderRadius.circular(4)),
                            child: Text('٢٠٪-', style: GoogleFonts.cairo(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    GestureDetector(
                      onTap: () {
                        if (widget.product.stock > 0) {
                          ref.read(cartProvider.notifier).addToCart(
                                productId: widget.product.id,
                                productName: widget.product.name,
                                productPrice: widget.product.price,
                                imageUrl: widget.product.imageUrl,
                              );
                        }
                      },
                      child: AnimatedContainer(
                        duration: 300.ms,
                        height: 36,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          gradient: isInCart ? null : const LinearGradient(colors: [primary, primaryLight]),
                          color: isInCart ? success : null,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(isInCart ? Icons.check_circle_outline : Icons.add_shopping_cart, color: Colors.white, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              isInCart ? 'ÙÙŠ السلة' : 'أضف للسلة',
                              style: GoogleFonts.cairo(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key});

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  String _selectedSort = 'Ø§Ù„Ø£Ùƒثر Ù…Ø¨ÙŠØ¹Ø§Ù‹ ⭐';
  double _priceRange = 500;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.95),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 40, height: 4, decoration: BoxDecoration(color: inputBorder, borderRadius: BorderRadius.circular(2))),
          const SizedBox(height: 20),
          Text('ÙÙ„ترة Ùˆترتيب', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary)),
          const SizedBox(height: 20),
          RadioGroup<String>(
            groupValue: _selectedSort,
            onChanged: (v) => setState(() => _selectedSort = v!),
            child: Column(
              children: [
                _buildSortOption('Ø§Ù„Ø£Ùƒثر Ù…Ø¨ÙŠØ¹Ø§Ù‹ ⭐'),
                _buildSortOption('السعر: من الأقل للأعلى ↑'),
                _buildSortOption('السعر: من الأعلى للأقل ↓'),
                _buildSortOption('الأحدث 🆕'),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('السعر الأقصى: $_priceRange درهم', style: GoogleFonts.tajawal(color: textPrimary, fontWeight: FontWeight.bold)),
              Text('Ø§Ù„Ù…ÙŠØ²Ø§Ù†ية', style: GoogleFonts.cairo(color: textSecondary)),
            ],
          ),
          Slider(
            value: _priceRange,
            min: 10,
            max: 1000,
            activeColor: accent,
            onChanged: (v) => setState(() => _priceRange = v.roundToDouble()),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: primary,
              minimumSize: const Size(double.infinity, 54),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Text('ØªØ·Ø¨ÙŠÙ‚ Ø§Ù„ÙÙ„ترة', style: GoogleFonts.cairo(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    ).animate().slideY(begin: 1, end: 0, curve: Curves.easeOut);
  }

  Widget _buildSortOption(String title) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(title, style: GoogleFonts.tajawal(fontSize: 14)),
      leading: Radio<String>(
        value: title,
        activeColor: primary,
      ),
      onTap: () => setState(() => _selectedSort = title),
    );
  }
}

class FloatingCartBar extends StatelessWidget {
  final int count;
  final double total;
  const FloatingCartBar({super.key, required this.count, required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 74,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(colors: [primary, primaryLight]),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [BoxShadow(color: Color(0x402D4A2E), blurRadius: 20, offset: Offset(0, -4))],
      ),
      child: Row(
        children: [
          Stack(
            children: [
              const Icon(Icons.shopping_cart, color: Colors.white, size: 30),
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(color: accent, shape: BoxShape.circle),
                  child: Text('$count', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
          const SizedBox(width: 12),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$count Ù…Ù†تجات ÙÙŠ السلة', style: GoogleFonts.cairo(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
              Text('الإجمالي: $total درهم', style: GoogleFonts.tajawal(color: Colors.white70, fontSize: 12)),
            ],
          ),
          const Spacer(),
          GestureDetector(
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen())),
            child: Row(
              children: [
                Text('إتمام الطلب', style: GoogleFonts.cairo(color: accent, fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(width: 4),
                const Icon(Icons.arrow_forward_rounded, color: accent),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ProductSkeletonCard extends StatelessWidget {
  const ProductSkeletonCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          Expanded(
            flex: 55,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(color: Colors.grey[200], borderRadius: const BorderRadius.vertical(top: Radius.circular(20))),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(height: 14, width: 100, color: Colors.grey[200]),
                const SizedBox(height: 8),
                Container(height: 10, width: 60, color: Colors.grey[100]),
                const Spacer(),
                Container(height: 36, width: double.infinity, color: Colors.grey[200]),
              ],
            ),
          ),
        ],
      ),
    ).animate(onPlay: (c) => c.repeat()).shimmer(color: accent2.withValues(alpha: 0.2), duration: 1500.ms);
  }
}

class StoreEmptyState extends StatelessWidget {
  final VoidCallback onReset;
  const StoreEmptyState({super.key, required this.onReset});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.eco_rounded, size: 100, color: primary.withValues(alpha: 0.2)),
          const SizedBox(height: 20),
          Text('لا ØªÙˆجد Ù…Ù†تجات ÙÙŠ Ù‡ذا Ø§Ù„ØªØµÙ†يف', style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary)),
          const SizedBox(height: 8),
          Text('جرب ØªØµÙ†ÙŠÙØ§Ù‹ آخر Ø£Ùˆ ابحث Ø¹Ù† Ù…Ù†تج محدد', style: GoogleFonts.tajawal(color: textSecondary, fontSize: 14)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: onReset,
            style: ElevatedButton.styleFrom(
              backgroundColor: primary,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('عرض جميع Ø§Ù„Ù…Ù†تجات', style: GoogleFonts.cairo(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    ).animate().fade().scale();
  }
}
