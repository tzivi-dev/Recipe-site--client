import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * הגדרת ה-AuthGuard כפונקציה (Functional Guard) - הגישה המודרנית באנגולר.
 * הפונקציה מקבלת את ה-route (הנתיב המבוקש) ואת ה-state (מצב הניתוב).
 */
export const authGuard: CanActivateFn = (route, state) => {
  // שימוש ב-inject כדי להביא את השירותים הדרושים (במקום ב-Constructor)
  const authService = inject(AuthService);
  const router = inject(Router);

  // שלב א': בדיקה האם המשתמש בכלל מחובר למערכת
  if (authService.isLoggedIn()) {
    
    // שלב ב': בדיקה האם הנתיב דורש תפקיד ספציפי (למשל 'Admin')
    // המידע הזה מגיע משדה ה-data שהגדרנו בקובץ ה-routes
    const expectedRole = route.data['role'];

    // אם הוגדר תפקיד נדרש, והתפקיד של המשתמש לא תואם לו
    if (expectedRole && authService.getUserRole() !== expectedRole) {
      // חסימת הגישה והפניה לדף הבית
      router.navigate(['/']); 
      return false; // הגישה נדחתה
    }

    // אם הכל תקין (מחובר ובעל תפקיד מתאים או שלא נדרש תפקיד)
    return true; // הגישה מאושרת
  }

  // שלב ג': אם המשתמש בכלל לא מחובר, נפנה אותו לדף ההתחברות
  router.navigate(['/login']);
  return false; // הגישה נדחתה
};