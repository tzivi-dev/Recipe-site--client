import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // נפריד את הכתובות כדי שלא יהיו שגיאות 404
  // כתובות ה-API של שרת ה-Flask (Python)
  private authUrl = 'http://16.192.7.177:5000'; // כתובת הבסיס ללוגין/רישום
  private adminUrl = 'http://16.192.7.177:5000/admin/requests'; // כתובת לניהול

constructor(
    private http: HttpClient, // לביצוע בקשות HTTP לשרת
    private router: Router,     // לניווט בין דפים
    @Inject(PLATFORM_ID) private platformId: Object // זיהוי האם הקוד רץ בדפדפן או בשרת
  ) {}
  // --- הרשמה וכניסה ---
// שליחת נתוני רישום לשרת
  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData);
  }

  // התחברות: שליחת אימייל וסיסמה וקבלת Token ופרטי משתמש
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials).pipe(
      tap((res: any) => {
        // שימוש ב-tap לביצוע "פעולת צד": שמירת הנתונים בזיכרון המקומי
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  // התנתקות: מחיקת הנתונים מהזיכרון המקומי וניווט לדף ההתחברות
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      // הסרת הנתונים מהזיכרון המקומי
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // ניווט לדף ההתחברות לאחר התנתקות
      this.router.navigate(['/login']);
    }
  }

  // --- ניהול משתמשים (פרופיל) ---
  // בדיקה אם המשתמש מחובר
  isLoggedIn(): boolean {
    // הגנה מפני קריסת SSR: בודקים שאנחנו בדפדפן
    if (isPlatformBrowser(this.platformId)) {
      // בדיקה האם יש טוקן בזיכרון המקומי
      return !!localStorage.getItem('token');
    }
    return false;
  }
// קבלת תפקיד המשתמש הנוכחי
  getUserRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).role : 'Guest';
    }
    return 'Guest';
  }
// בקשת הרשאת העלאת תוכן
  requestUploadPermission(): Observable<any> {
    const token = localStorage.getItem('token');
    // שימוש ב-HttpHeaders (הייבוא למעלה קריטי)
    // כדי שהשרת יזהה את המשתמש הוספת הטוקן לכותרות הבקשה
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // שימוש ב-api_url (עם קו תחתון, כפי שמוגדר אצלך ב-Service)
    return this.http.post(
      `${this.authUrl}/request-upload-permission`,
      {},
      { headers }
    );
  }
// --- אזור מנהל ---
  getPendingRequests(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
// שימוש ב-http.get עם טיפוס מחזיר מפורש של Observable<any[]>
    return this.http.get<any[]>(`${this.authUrl}/admin/requests`, { headers });
  }
// אימות משתמש
// (למנהל) אישור משתמש ספציפי לפי ה-ID שלו
  approveUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    // HTTPHeaders כדי לשלוח את הטוקן עם הבקשה
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
      `${this.authUrl}/admin/requests`,
      { user_id: userId },
      { headers }
    );
  }

  //   approveUser(userId: number): Observable<any> {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       const headers = { Authorization: `Bearer ${token}` };
  //       return this.http.post(this.adminUrl, { user_id: userId }, { headers });
  //     }
  //   }
  //   return of(null);
  // }

  // --- אזור מנהל (התיקון כאן) ---
// קבלת משתמשים ממתינים לאישור
  getPendingUsers(): Observable<any[]> {
    // הגנה מפני קריסת SSR: בודקים שאנחנו בדפדפן
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<any[]>(this.adminUrl, { headers });
      }
    }
    // אם אנחנו בשרת או אין טוקן, מחזירים מערך ריק בבטחה
    return of([]);
  }

// בדיקה אם למשתמש יש הרשאה להעלות מתכונים
  canUpload(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        // בדיקה אם התפקיד הוא Admin או Uploader
        return user.role === 'Admin' || user.role === 'Uploader';
      }
    }
    return false;
  }
}
