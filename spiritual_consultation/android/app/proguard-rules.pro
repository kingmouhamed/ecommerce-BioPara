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

# General
-dontwarn okio.**
-dontwarn javax.annotation.**
