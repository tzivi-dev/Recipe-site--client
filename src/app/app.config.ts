import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // הקובץ שיצרנו קודם
import { provideHttpClient } from '@angular/common/http'; // נצטרך את זה לקריאות שרת
import { provideClientHydration } from '@angular/platform-browser';
import { withFetch } from '@angular/common/http'; // אפשרות להשתמש ב-fetch במקום XMLHttpRequest

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),provideHttpClient(withFetch())]
};
