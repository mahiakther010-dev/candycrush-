import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.candyrescue.saga',
  appName: 'Candy Rescue Saga',
  webDir: 'dist',
  android: {
    // Keep the Android app launchable offline-first and portrait-friendly
    allowMixedContent: false,
    backgroundColor: '#0b1322',
  },
};

export default config;
