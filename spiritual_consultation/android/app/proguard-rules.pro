# Flutter ProGuard Rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Stripe ProGuard Rules
-dontwarn com.stripe.android.**
-keep class com.stripe.android.** { *; }

# Zego ProGuard Rules
-dontwarn im.zego.**
-keep class im.zego.** { *; }

# Play Core (Fixes R8 missing class errors)
-dontwarn com.google.android.play.core.**
-keep class com.google.android.play.core.** { *; }

# Google Generative AI
-dontwarn com.google.generativeai.**
-keep class com.google.generativeai.** { *; }

# General
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
