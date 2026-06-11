import 'dart:js_interop';
import 'dart:js_interop_unsafe';

void setJitsiCallEndedCallback(void Function() callback) {
  globalContext['onJitsiCallEnded'] = callback.toJS;
}

void startJitsiCall(String roomName, String displayName, bool isVideo) {
  globalContext.callMethod(
    'startJitsiCall'.toJS,
    roomName.toJS,
    displayName.toJS,
    isVideo.toJS,
  );
}

void endJitsiCall() {
  globalContext.callMethod('endJitsiCall'.toJS);
}

void muteJitsiAudio(bool isMuted) {
  globalContext.callMethod('muteJitsiAudio'.toJS, isMuted.toJS);
}

void toggleJitsiVideo() {
  globalContext.callMethod('toggleJitsiVideo'.toJS);
}
