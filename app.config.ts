import type { ExpoConfig } from "expo/config";

const bundleId = "com.manopro.mobile";
const scheme = "manopro";

const config: ExpoConfig = {
  name: "ManoPro",
  slug: "manopro-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E8F4F0",
      foregroundImage: "./assets/images/adaptive-icon.png",
    },
    edgeToEdgeEnabled: true,
    package: bundleId,
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#072A20",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 24,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
