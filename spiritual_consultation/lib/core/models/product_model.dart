class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String? imageUrl;
  final String category;
  final int stock;
  final double rating;
  final int reviewsCount;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.imageUrl,
    required this.category,
    this.stock = 0,
    this.rating = 0.0,
    this.reviewsCount = 0,
  });

  static String _inferCategory(String? cat, String name) {
    if (cat != null && cat != 'عام' && cat != 'null' && cat.isNotEmpty) return cat;
    
    if (name.contains('عسل')) return 'عسل طبيعي';
    if (name.contains('زيت')) return 'زيوت طبية';
    if (name.contains('شاي')) return 'شاي أعشاب';
    if (name.contains('مكمل') || name.contains('فيتامين') || name.contains('Omega') || name.contains('زنك') || name.contains('كولاجين') || name.contains('بيوتين') || name.contains('مغنيسيوم')) {
      return 'مكملات غذائية';
    }
    
    return 'أعشاب طبية'; // Default fallback
  }

  // قاعدة الصور في Supabase Storage
  static const String _base =
      'https://fvtkbnoodktzumzkxtkv.supabase.co/storage/v1/object/public/products';

  static String _inferImage(String name, String category) {
    final n = name.toLowerCase();

    // ── شاي أعشاب (herbal-tea) — صور حقيقية من Supabase ────
    if (n.contains('يانسون') || n.contains('anise') || n.contains('anis')) {
      return '$_base/herbal-tea/anise-herb.jpg';
    }
    if (n.contains('بابونج') || n.contains('chamomile') || n.contains('camomile')) {
      return '$_base/herbal-tea/camomile-herb.jpg';
    }
    if (n.contains('قرفة') || n.contains('cinnamon')) {
      return '$_base/herbal-tea/cinnamon-herb.jpg';
    }
    if (n.contains('زنجبيل') || n.contains('ginger')) {
      return '$_base/herbal-tea/ginger-herb.jpg';
    }
    if (n.contains('كركديه') || n.contains('hibiscus')) {
      return '$_base/herbal-tea/hibiscus-herb.jpg';
    }
    if (n.contains('خزامى') || n.contains('lavender') || n.contains('خزامى')) {
      return '$_base/herbal-tea/lavender-herb.jpg';
    }
    if (n.contains('لويزة') || n.contains('verbena') || n.contains('lemon verbena')) {
      return '$_base/herbal-tea/lemon-verbena-herb.jpg';
    }
    if (n.contains('نعناع') || n.contains('mint')) {
      return '$_base/herbal-tea/mint-herb.jpg';
    }
    if (n.contains('إكليل') || n.contains('rosemary')) {
      return '$_base/herbal-tea/rosemary-herb.jpg';
    }
    if (n.contains('مريمية') || n.contains('sage')) {
      return '$_base/herbal-tea/sage-herb.jpg';
    }
    if (n.contains('زعتر') || n.contains('thyme')) {
      return '$_base/herbal-tea/thyme-herb.jpg';
    }
    if (n.contains('كركم') || n.contains('turmeric')) {
      return '$_base/herbal-tea/turmeric-herb.jpg';
    }
    if (category == 'شاي أعشاب' || n.contains('شاي')) {
      return '$_base/herbal-tea/mint-herb.jpg';
    }

    // ── عسل طبيعي (natural-honey) ──────────────────────────
    if (n.contains('داغموس') || n.contains('daghmos')) {
      return '$_base/natural-honey/daghmos-honey.jpg';
    }
    if (n.contains('مانوكا') || n.contains('manuka')) {
      return '$_base/natural-honey/manuka-honey.jpg';
    }
    if (n.contains('wildflower') || n.contains('برية')) {
      return '$_base/natural-honey/wildflower-honey.jpg';
    }
    if (n.contains('orange blossom') || n.contains('زهر البرتقال')) {
      return '$_base/natural-honey/orange-blossom-honey.jpg';
    }
    if (n.contains('forest') || n.contains('غابة') || n.contains('حراج')) {
      return '$_base/natural-honey/forest-honey.jpg';
    }
    if (n.contains('flower') || n.contains('أزهار') || n.contains('زهور')) {
      return '$_base/natural-honey/flower-honey.jpg';
    }
    if (n.contains('thyme honey') || (n.contains('زعتر') && (n.contains('عسل') || category == 'عسل طبيعي'))) {
      return '$_base/natural-honey/thyme-honey.jpg';
    }
    if (n.contains('blackseed honey') || (n.contains('حبة السوداء') && (n.contains('عسل') || category == 'عسل طبيعي'))) {
      return '$_base/natural-honey/blackseed-honey.jpg';
    }
    if (n.contains('carob') || n.contains('خروب')) {
      return '$_base/natural-honey/carob-honey.jpg';
    }
    if (n.contains('كافور') || n.contains('camphor') || (n.contains('eucalyptus') && (n.contains('عسل') || category == 'عسل طبيعي'))) {
      return '$_base/natural-honey/eucalyptus-honey.jpg';
    }
    if (n.contains('طلح') || n.contains('acacia')) {
      return '$_base/natural-honey/acacia-honey.jpg';
    }
    if ((n.contains('سدر') || n.contains('sidr')) && (n.contains('عسل') || category == 'عسل طبيعي')) {
      return '$_base/natural-honey/sidr-honey.jpg';
    }
    if (n.contains('عسل')) {
      return '$_base/natural-honey/flower-honey.jpg';
    }

    // ── زيوت طبية (medicinal-oils) ──────────────────────────
    if (n.contains('أرغان') || n.contains('argan')) {
      return '$_base/medicinal-oils/argan-oil.jpg';
    }
    if (n.contains('خروع') || n.contains('castor')) {
      return '$_base/medicinal-oils/castor-oil.jpg';
    }
    if (n.contains('خزامى') || n.contains('lavender') || n.contains('lanvender')) {
      return '$_base/medicinal-oils/lanvender-oil.jpg';
    }
    if (n.contains('rose') || n.contains('ورد') || n.contains('وردة')) {
      return '$_base/medicinal-oils/rose-oil.jpg';
    }
    if (n.contains('musk') || n.contains('مسك')) {
      return '$_base/medicinal-oils/musk-oil.jpg';
    }
    if (n.contains('black seed') || n.contains('nigella') || (n.contains('حبة') && n.contains('سوداء') && (n.contains('زيت') || category == 'زيوت طبية'))) {
      return '$_base/medicinal-oils/premium-black-seed-oil.png';
    }
    if (n.contains('زيت زيتون') || n.contains('زيتون') || n.contains('olive oil')) {
      return '$_base/medicinal-oils/olive-oil.jpg';
    }
    if (n.contains('زنجبيل') && n.contains('زيت')) {
      return '$_base/medicinal-oils/ginger-oil.jpg';
    }
    if (n.contains('لوز') || n.contains('almond')) {
      return '$_base/medicinal-oils/almond-oil.jpg';
    }
    if ((n.contains('سدر') || n.contains('sidr')) && (n.contains('زيت') || category == 'زيوت طبية')) {
      return '$_base/medicinal-oils/sidr-oil.jpg';
    }
    if (n.contains('زيت')) {
      return '$_base/medicinal-oils/olive-oil.jpg';
    }

    // ── مكملات غذائية (dietary-supplements) ────────────────
    if (n.contains('أشواجاندا') || n.contains('ashwagandha')) {
      return '$_base/dietary-supplements/ashwagandha.jpg';
    }
    if (n.contains('بيوتين') || n.contains('biotin')) {
      return '$_base/dietary-supplements/biotin.jpg';
    }
    if (n.contains('كولاجين') || n.contains('collagen')) {
      return '$_base/dietary-supplements/collagen.jpg';
    }
    if (n.contains('جلوتاثيون') || n.contains('glutathione')) {
      return '$_base/dietary-supplements/l-glutathione.jpg';
    }
    if (n.contains('مغنيسيوم') || n.contains('magnesium')) {
      return '$_base/dietary-supplements/magnesium.jpg';
    }
    if (n.contains('مستكة') || n.contains('mastic')) {
      return '$_base/dietary-supplements/mastic-gum.jpg';
    }
    if (n.contains('فيتامينات متعددة') || n.contains('multivitamin')) {
      return '$_base/dietary-supplements/multivitamins.jpg';
    }
    if (n.contains('omega 3 fish') || n.contains('fish oil')) {
      return '$_base/dietary-supplements/omega-3-fish-oil.jpg';
    }
    if (n.contains('omega') || n.contains('أوميغا') || n.contains('أوميجا')) {
      return '$_base/dietary-supplements/omega3-supplement.jpg';
    }
    if (n.contains('بروبيوتيك') || n.contains('probiotic')) {
      return '$_base/dietary-supplements/probiotic.jpg';
    }
    if (n.contains('شيلاجيت') || n.contains('shilajit')) {
      return '$_base/dietary-supplements/shilajit.jpg';
    }
    if (n.contains('فيتامين d') || n.contains('vitamin d') || n.contains('d3')) {
      return '$_base/dietary-supplements/vitamin-d3-k2.jpg';
    }
    if (n.contains('زنك') || n.contains('zinc')) {
      return '$_base/dietary-supplements/zinc.jpg';
    }
    if (n.contains('مكمل')) {
      return '$_base/dietary-supplements/multivitamins.jpg';
    }

    // ── أعشاب طبية (medicinal-herbs) ────────────────────────
    if (n.contains('ألوفيرا') || n.contains('aloe vera') || n.contains('صبار')) {
      return '$_base/medicinal-herbs/Aloe vera.jpg';
    }
    if (n.contains('بابونج') || n.contains('chamomile') || n.contains('camomile')) {
      return '$_base/medicinal-herbs/camomile-herb.jpg';
    }
    if (n.contains('إشنسا') || n.contains('echinacea')) {
      return '$_base/medicinal-herbs/Echinacea.jpg';
    }
    if (n.contains('كافور') || n.contains('eucalyptus') || n.contains('إكاليبتوس')) {
      return '$_base/medicinal-herbs/Eucalyptus.jpg';
    }
    if (n.contains('شمر') || n.contains('فينيكول') || n.contains('foeniculum') || n.contains('fennel')) {
      return '$_base/medicinal-herbs/Foeniculum.jpg';
    }
    if (n.contains('زنجبيل') || n.contains('ginger')) {
      return '$_base/medicinal-herbs/ginger-herb.jpg';
    }
    if (n.contains('جنسنغ') || n.contains('ginseng')) {
      return '$_base/medicinal-herbs/Ginseng.jpg';
    }
    if (n.contains('ماكا') || n.contains('maca')) {
      return '$_base/medicinal-herbs/Maca.jpg';
    }
    if (n.contains('مورينجا') || n.contains('moringa')) {
      return '$_base/medicinal-herbs/Moringa.jpg';
    }
    if (n.contains('أوراق الزيتون') || n.contains('olive leaves')) {
      return '$_base/medicinal-herbs/Olive leaves.jpg';
    }
    if (n.contains('القديسين') || n.contains('saints') || n.contains('st. john')) {
      return '$_base/medicinal-herbs/Saints.jpg';
    }
    if (n.contains('سدر') || n.contains('sidr')) {
      return '$_base/medicinal-herbs/Sidr.jpg';
    }
    if (n.contains('زعتر') || n.contains('thyme')) {
      return '$_base/medicinal-herbs/Thyme.jpg';
    }

    if (category == 'شاي أعشاب' || n.contains('شاي')) {
      return '$_base/herbal-tea/mint-herb.jpg';
    }

    // ── Fallback حسب التصنيف ─────────────────────────────────
    if (category == 'عسل طبيعي')      return '$_base/natural-honey/flower-honey.jpg';
    if (category == 'زيوت طبية')      return '$_base/medicinal-oils/olive-oil.jpg';
    if (category == 'مكملات غذائية') return '$_base/dietary-supplements/multivitamins.jpg';
    if (category == 'شاي أعشاب')     return '$_base/herbal-tea/mint-herb.jpg';
    if (category == 'أعشاب طبية')    return '$_base/medicinal-herbs/Moringa.jpg';

    return '$_base/medicinal-herbs/Moringa.jpg';
  }

  factory Product.fromMap(Map<String, dynamic> map) {
    final name = map['name']?.toString() ?? 'منتج غير معروف';
    final category = _inferCategory(map['category']?.toString(), name);
    
    return Product(
      id: map['id']?.toString() ?? '',
      name: name,
      description: map['description']?.toString() ?? '',
      price: (map['price'] as num?)?.toDouble() ?? 0.0,
      imageUrl: _inferImage(name, category),
      category: category,
      stock: (map['stock_quantity'] ?? map['stock']) as int? ?? 0,
      rating: (map['rating'] as num?)?.toDouble() ?? 0.0,
      reviewsCount: map['reviews_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'image_url': imageUrl,
      'category': category,
      'stock_quantity': stock,
    };
  }
}
