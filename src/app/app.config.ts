import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'fashion-trends-tracker',
        appId: '1:265038459688:web:7625fb4e4d26917f43161d',
        storageBucket: 'fashion-trends-tracker.firebasestorage.app',
        apiKey: 'AIzaSyCraPW2IGX9xooQu5o3pw9MofhBWEa7ZXc',
        authDomain: 'fashion-trends-tracker.firebaseapp.com',
        messagingSenderId: '265038459688',
        measurementId: 'G-20QGWQD66B',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
