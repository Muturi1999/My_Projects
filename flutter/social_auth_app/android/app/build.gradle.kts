plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

// Apply Google Services plugin AFTER the plugins block
apply plugin: 'com.google.gms.google-services'

android {
    namespace = "com.example.social_auth_app"
    compileSdkVersion 34
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.social_auth_app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    // Use AndroidX multidex instead of the old support library
    implementation 'androidx.multidx:multidx:2.0.1'
    
    // Firebase dependencies (these will be added automatically by the plugin)
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-core'
    
    // Google Sign-In
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
