import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', // Cambia esto por tu ID único
  appName: 'ar-taller',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'], // ✅ IMPORTANTE para AR.js
    cleartext: true
  },
  plugins: {
    Camera: {
      iosPermissions: {
        cameraUsageDescription: 'Esta app necesita acceso a la cámara para AR'
      }
    }
  }
};

export default config;