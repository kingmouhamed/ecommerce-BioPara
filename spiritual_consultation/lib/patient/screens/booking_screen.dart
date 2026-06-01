import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../widgets/booking/booking_widgets.dart';
import '../../core/theme/app_theme.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> with TickerProviderStateMixin {
  // الألوان من نظام التصميم المركزي
  static const Color primary        = AppColors.primary;
  static const Color primaryLight   = AppColors.primaryLight;
  static const Color accent         = AppColors.accent;
  static const Color background     = AppColors.background;
  static const Color surface        = AppColors.surface;
  static const Color textPrimary    = AppColors.textPrimary;
  static const Color textSecondary  = AppColors.textSecondary;
  static const Color inputBorder    = AppColors.border;
  static const Color success        = AppColors.success;
  static const Color danger         = AppColors.danger;
  static const Color shadowColor    = Color(0x15000000);

  // حالة الخطوات
  int _currentStep = 0;
  final PageController _pageController = PageController();

  // اختيارات المستخدم
  String? _selectedType; // فيديو، صوت، نص
  int? _selectedDuration; // ٣٠، ٤٥، ٦٠ دقيقة
  DateTime? _selectedDate;
  String? _selectedTime;
  final TextEditingController _notesController = TextEditingController();
  bool _isBooking = false;
  bool _isSuccess = false;

  @override
  void dispose() {
    _pageController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_validateCurrentStep()) {
      setState(() {
        _currentStep++;
        _pageController.animateToPage(
          _currentStep,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      });
    }
  }

  void _prevStep() {
    setState(() {
      _currentStep--;
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    });
  }

  bool _validateCurrentStep() {
    if (_currentStep == 0) {
      if (_selectedType == null || _selectedDuration == null) {
        _showError("الرجاء اختيار نوع الاستشارة ومدة الجلسة");
        return false;
      }
    } else if (_currentStep == 1) {
      if (_selectedDate == null || _selectedTime == null) {
        _showError("الرجاء تحديد التاريخ والوقت المناسب");
        return false;
      }
    }
    return true;
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: GoogleFonts.tajawal()),
        backgroundColor: danger,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _confirmBooking() async {
    setState(() => _isBooking = true);
    
    try {
      final userId = Supabase.instance.client.auth.currentUser?.id;
      if (userId == null) throw Exception('غير مسجل دخول');

      // دمج تفاصيل الحجز في حقل الملاحظات لضمان التوافق مع قاعدة البيانات الحالية
      final bookingDetails = """
نوع الجلسة: $_selectedType
المدة: $_selectedDuration دقيقة
الوقت: $_selectedTime
---
الملاحظات: ${_notesController.text.trim()}
""";
      
      await Supabase.instance.client.from('appointments').insert({
        'patient_id': userId,
        'appointment_date': _selectedDate!.toIso8601String(),
        'notes': bookingDetails,
        'status': 'pending',
      });

      setState(() {
        _isBooking = false;
        _isSuccess = true;
      });

      await Future.delayed(const Duration(seconds: 2));
      if (mounted) Navigator.pop(context);
      
    } catch (e) {
      _showError("حدث خطأ أثناء الحجز: $e");
      setState(() => _isBooking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: background,
      body: Column(
        children: [
          // 1. الهيدر المتميز (Header)
          _buildHeader(),

          // 2. مؤشر الخطوات (Step Progress)
          _buildProgressIndicator(),

          // 3. المحتوى المتغير (Steps Content)
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStep1(),
                _buildStep2(),
                _buildStep3(),
              ],
            ),
          ),

          // 4. أزرار التنقل (Navigation)
          _buildBottomNavigation(),
        ],
      ),
    );
  }

  // --- مكونات الهيدر ---
  Widget _buildHeader() {
    return Stack(
      children: [
        ClipPath(
          clipper: HeaderWaveClipper(),
          child: Container(
            height: 140,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
                colors: [primary, primaryLight],
              ),
            ),
            child: Stack(
              children: [
                // نقش الأعشاب الخفيف
                Positioned.fill(
                  child: Opacity(
                    opacity: 0.05,
                    child: CustomPaint(painter: HerbPatternPainter()),
                  ),
                ),
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        Directionality(
                          textDirection: TextDirection.ltr,
                          child: IconButton(
                            icon: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                        Expanded(
                          child: Center(
                            child: Text(
                              "حجز استشارة",
                              style: GoogleFonts.cairo(
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 40), // للموازنة مع زر الرجوع
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        // الخط الذهبي الصغير أسفل التموج
        Positioned(
          bottom: 20,
          left: 0,
          right: 0,
          child: Center(
            child: Container(
              width: 60,
              height: 2.5,
              decoration: BoxDecoration(
                color: accent,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // --- مؤشر الخطوات ---
  Widget _buildProgressIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 32),
      child: Row(
        children: [
          _buildStepNode(0, "اختيار النوع"),
          _buildStepLine(0),
          _buildStepNode(1, "التفاصيل"),
          _buildStepLine(1),
          _buildStepNode(2, "التأكيد"),
        ],
      ),
    );
  }

  Widget _buildStepNode(int stepIndex, String label) {
    bool isActive = _currentStep == stepIndex;
    bool isCompleted = _currentStep > stepIndex;

    return Column(
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isCompleted ? success : (isActive ? accent : Colors.transparent),
            border: Border.all(
              color: isCompleted ? success : (isActive ? accent : inputBorder),
              width: 2,
            ),
          ),
          child: Center(
            child: isCompleted
                ? const Icon(Icons.check, color: Colors.white, size: 18)
                : Text(
                    "${stepIndex + 1}",
                    style: GoogleFonts.cairo(
                      color: isActive ? Colors.white : textSecondary,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: GoogleFonts.tajawal(
            fontSize: 11,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            color: isActive ? textPrimary : textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildStepLine(int afterStep) {
    bool isCompleted = _currentStep > afterStep;
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 24, left: 8, right: 8),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: isCompleted 
                ? [success, success] 
                : [inputBorder.withValues(alpha: 0.5), inputBorder.withValues(alpha: 0.2)],
          ),
        ),
      ),
    );
  }

  // --- محتوى الخطوة الأولى ---
  Widget _buildStep1() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // بطاقة المستشار
        _buildConsultantCard(),
        const SizedBox(height: 32),

        // اختيار نوع الجلسة
        Text("نوع الاستشارة", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 16),
        _buildTypeSelector(),
        const SizedBox(height: 32),

        // اختيار مدة الجلسة والأسعار
        Text("مدة الجلسة والأسعار", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 16),
        _buildDurationSelector(),
        const SizedBox(height: 40),
        _buildTipCard("🌿 المواعيد المتاحة تظهر باللون الأخضر؛ تفضل باختيار ما يناسبك"),
      ],
    );
  }

  Widget _buildConsultantCard() {
    return ConsultantCard(
      primary: primary,
      accent: accent,
      success: success,
      textPrimary: textPrimary,
      textSecondary: textSecondary,
      surface: surface,
      inputBorder: inputBorder,
      shadowColor: shadowColor,
    );
  }

  Widget _buildTypeSelector() {
    final types = [
      {'label': 'فيديو', 'icon': Icons.videocam_rounded, 'id': 'video'},
      {'label': 'صوت', 'icon': Icons.mic_rounded, 'id': 'audio'},
      {'label': 'نص', 'icon': Icons.chat_rounded, 'id': 'chat'},
    ];

    return Row(
      children: types.map((type) {
        bool isSelected = _selectedType == type['id'];
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _selectedType = type['id'] as String),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                gradient: isSelected ? const LinearGradient(colors: [primary, primaryLight]) : null,
                color: isSelected ? null : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isSelected ? accent : inputBorder, width: 1.5),
                boxShadow: isSelected ? [const BoxShadow(color: Color(0x33C8963E), blurRadius: 10, offset: Offset(0, 4))] : null,
              ),
              child: Column(
                children: [
                  Icon(type['icon'] as IconData, color: isSelected ? Colors.white : primary, size: 28),
                  const SizedBox(height: 8),
                  Text(type['label'] as String, style: GoogleFonts.tajawal(color: isSelected ? Colors.white : textPrimary, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDurationSelector() {
    final options = [
      {'label': '30 دقيقة', 'price': '150 درهم', 'val': 30},
      {'label': '45 دقيقة', 'price': '200 درهم', 'val': 45},
      {'label': '60 دقيقة', 'price': '250 درهم', 'val': 60},
    ];

    return Row(
      children: options.map((opt) {
        bool isSelected = _selectedDuration == opt['val'];
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _selectedDuration = opt['val'] as int),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: isSelected ? accent : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: isSelected ? accent : inputBorder),
              ),
              child: Column(
                children: [
                  Text(opt['label'] as String, style: GoogleFonts.cairo(color: isSelected ? Colors.white : textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
                  Text(opt['price'] as String, style: GoogleFonts.tajawal(color: isSelected ? Colors.white70 : textSecondary, fontSize: 11)),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  // --- محتوى الخطوة الثانية ---
  Widget _buildStep2() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // التقويم الأسبوعي
        Text("تاريخ الموعد", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 16),
        _buildWeeklyCalendar(),
        const SizedBox(height: 32),

        // الأوقات المتاحة
        Text("الوقت المناسب", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 16),
        _buildTimeSlotGrid(),
        const SizedBox(height: 32),

        // ملاحظات إضافية
        Text("ملاحظات الموعد أو الأعراض", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 16),
        _buildNotesField(),
        
        const SizedBox(height: 40),
        _buildTipCard("🌿 المواعيد الصباحية هي الأكثر طلباً، احجز مبكراً لضمان وقتك"),
      ],
    );
  }

  Widget _buildWeeklyCalendar() {
    // توليد الأيام السبعة القادمة
    final days = List.generate(7, (index) => DateTime.now().add(Duration(days: index)));
    final arabicDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: 7,
        itemBuilder: (context, index) {
          final day = days[index];
          bool isSelected = _selectedDate != null && 
              _selectedDate!.day == day.day && 
              _selectedDate!.month == day.month;
          
          return GestureDetector(
            onTap: () => setState(() => _selectedDate = day),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 70,
              margin: const EdgeInsets.only(left: 12),
              decoration: BoxDecoration(
                gradient: isSelected ? const LinearGradient(colors: [primary, primaryLight]) : null,
                color: isSelected ? null : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isSelected ? accent : inputBorder),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(arabicDays[day.weekday % 7], style: GoogleFonts.tajawal(fontSize: 11, color: isSelected ? Colors.white70 : textSecondary)),
                  const SizedBox(height: 4),
                  Text("${day.day}", style: GoogleFonts.cairo(fontSize: 18, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : textPrimary)),
                  if (index == 0) ...[
                    const SizedBox(height: 4),
                    Container(width: 4, height: 4, decoration: const BoxDecoration(color: accent, shape: BoxShape.circle)),
                  ]
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimeSlotGrid() {
    final slots = ["09:00 ص", "10:30 ص", "12:00 م", "02:00 م", "04:30 م", "06:00 م"];
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 3.2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        bool isSelected = _selectedTime == slots[index];
        bool isFull = index == 2; // محاكاة وقت محجوز

        return GestureDetector(
          onTap: isFull ? null : () => setState(() => _selectedTime = slots[index]),
          child: Container(
            decoration: BoxDecoration(
              color: isFull ? inputBorder.withValues(alpha: 0.2) : (isSelected ? primaryLight : Colors.white),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: isSelected ? primaryLight : inputBorder),
            ),
            child: Center(
              child: Text(
                isFull ? "محجوز" : slots[index],
                style: GoogleFonts.cairo(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: isFull ? textSecondary : (isSelected ? Colors.white : textPrimary),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNotesField() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: inputBorder),
        boxShadow: const [BoxShadow(color: shadowColor, blurRadius: 10, offset: Offset(0, 2))],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 12, right: 16),
            child: Row(
              children: [
                const Icon(Icons.description_outlined, color: primaryLight, size: 20),
                const SizedBox(width: 8),
                Text("الأعراض أو الملاحظات", style: GoogleFonts.tajawal(fontSize: 12, color: textSecondary)),
              ],
            ),
          ),
          TextField(
            controller: _notesController,
            maxLines: 4,
            style: GoogleFonts.tajawal(fontSize: 14, color: textPrimary),
            decoration: InputDecoration(
              hintText: "اكتب باختصار ما تعاني منه أو سبب الاستشارة...",
              hintStyle: GoogleFonts.tajawal(fontSize: 13, color: textSecondary.withValues(alpha: 0.6), fontStyle: FontStyle.italic),
              contentPadding: const EdgeInsets.all(16),
              border: InputBorder.none,
            ),
            onChanged: (v) => setState(() {}),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text("${_notesController.text.length} / 300", style: GoogleFonts.tajawal(fontSize: 11, color: textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- محتوى الخطوة الثالثة ---
  Widget _buildStep3() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // ملخص الحجز
        Text("ملخص الحجز", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
        const SizedBox(height: 16),
        _buildSummaryCard(),
        const SizedBox(height: 24),

        // سياسة الإلغاء
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: accent.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: accent.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              const Icon(Icons.info_outline_rounded, color: accent, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  "يمكن إلغاء الحجز مجاناً قبل 24 ساعة من موعد الجلسة",
                  style: GoogleFonts.tajawal(fontSize: 13, color: textSecondary),
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 40),
        _buildTipCard("🔒 دفعك محمي ومشفر بالكامل لضمان خصوصيتك"),
      ],
    );
  }

  Widget _buildSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: inputBorder.withValues(alpha: 0.5)),
        boxShadow: const [BoxShadow(color: shadowColor, blurRadius: 20, offset: Offset(0, 5))],
      ),
      child: Column(
        children: [
          _buildSummaryRow(Icons.person_outline, "المستشار", "إلياس المساوي"),
          _buildDivider(),
          _buildSummaryRow(Icons.videocam_outlined, "نوع الجلسة", _selectedType == 'video' ? "فيديو" : (_selectedType == 'audio' ? "صوت" : "نص")),
          _buildDivider(),
          _buildSummaryRow(Icons.calendar_today_outlined, "التاريخ", "${_selectedDate?.day}/${_selectedDate?.month}/${_selectedDate?.year}"),
          _buildDivider(),
          _buildSummaryRow(Icons.access_time_rounded, "الوقت", _selectedTime ?? "-"),
          _buildDivider(),
          _buildSummaryRow(Icons.timer_outlined, "المدة", "$_selectedDuration دقيقة"),
          _buildDivider(),
          _buildSummaryRow(Icons.payments_outlined, "السعر", _selectedDuration == 30 ? "150 درهم" : (_selectedDuration == 45 ? "200 درهم" : "250 درهم")),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("الإجمالي", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold, color: textPrimary)),
              Text(_selectedDuration == 30 ? "150 درهم" : (_selectedDuration == 45 ? "200 درهم" : "250 درهم"), 
                  style: GoogleFonts.cairo(fontSize: 20, fontWeight: FontWeight.w800, color: accent)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: background, shape: BoxShape.circle),
            child: Icon(icon, size: 18, color: primaryLight),
          ),
          const SizedBox(width: 12),
          Text(label, style: GoogleFonts.tajawal(fontSize: 13, color: textSecondary)),
          const Spacer(),
          Text(value, style: GoogleFonts.cairo(fontSize: 15, fontWeight: FontWeight.w600, color: textPrimary)),
        ],
      ),
    );
  }

  Widget _buildDivider() => Divider(height: 1, color: inputBorder.withValues(alpha: 0.3));

  // --- شريط التنقل السفلي ---
  Widget _buildBottomNavigation() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: surface,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))],
      ),
      child: Row(
        children: [
          if (_currentStep > 0)
            TextButton(
              onPressed: _prevStep,
              child: Text("السابق", style: GoogleFonts.cairo(color: textSecondary, fontWeight: FontWeight.bold)),
            ),
          const Spacer(),
          SizedBox(
            width: _currentStep == 2 ? 200 : 140,
            height: 56,
            child: ElevatedButton(
              onPressed: _isBooking ? null : (_currentStep == 2 ? _confirmBooking : _nextStep),
              style: ElevatedButton.styleFrom(
                backgroundColor: primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 4,
                shadowColor: primary.withValues(alpha: 0.4),
              ),
              child: _isBooking 
                ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : (_isSuccess 
                  ? const Icon(Icons.check_circle_outline, color: Colors.white, size: 28)
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_currentStep == 2 ? "تأكيد الحجز" : "التالي", style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 8),
                        Icon(_currentStep == 2 ? Icons.check_circle_outline : Icons.arrow_back_ios, size: 18),
                      ],
                    )),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTipCard(String tip) {
    return TipCard(
      tip: tip,
      accent: accent,
      textSecondary: textSecondary,
    );
  }
}