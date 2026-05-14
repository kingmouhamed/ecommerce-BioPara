import 'package:flutter_riverpod/flutter_riverpod.dart';

enum ConsultationState { idle, active, bookingRequired }

class ConsultationNotifier extends StateNotifier<ConsultationState> {
  ConsultationNotifier() : super(ConsultationState.idle);

  void startConsultation() => state = ConsultationState.active;
  
  void requireBooking() => state = ConsultationState.bookingRequired;
  
  void reset() => state = ConsultationState.idle;
}

final consultationProvider = StateNotifierProvider<ConsultationNotifier, ConsultationState>((ref) {
  return ConsultationNotifier();
});
