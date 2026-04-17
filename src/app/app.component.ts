import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// ייבוא כלים לניהול ניתובים (שינוי דפים ללא רענון האתר)
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
// ייבוא השירות שאחראי על אבטחה והתחברות
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root', // השם של התגית שבה הקומפוננטה תוצג ב-index.html
  standalone: true,     // מציין שזו קומפוננטה עצמאית (מודרני באנגולר)
  // רשימת הכלים שבהם נשתמש בתוך ה-HTML של הקומפוננטה
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html', // הנתיב לקובץ העיצוב (HTML)
  styleUrls: ['./app.component.css'],    // הנתיב לקובץ העיצוב (CSS)
})
export class AppComponent {
  
  // הזרקה של ה-AuthService. חשוב שזה public כדי שה-HTML יוכל לגשת אליו
  constructor(public authService: AuthService) {}

  // GETTERS- פונקציות שמחזירות ערכים לשימוש ב-HTML
  // Getter שבודק האם למשתמש יש הרשאה להוסיף מתכון
  get canUpload(): boolean {
    // בדיקה שאנחנו בדפדפן ולא בשרת (למניעת שגיאות SSR)
    if (typeof window !== 'undefined' && window.localStorage) {
      // שולף את פרטי המשתמש מהזיכרון המקומי
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        // הרשאה ניתנת רק למנהל או למעלה תוכן מאושר
        return user.role === 'Admin' || user.role === 'Uploader';
      }
    }
    return false;
  }

  // Getter ששולף את המייל של המשתמש מהזיכרון המקומי
  get userEmail(): string | null {
    // בדיקה שאנחנו בדפדפן ולא בשרת (למניעת שגיאות SSR)
    if (typeof window !== 'undefined' && window.localStorage) {
      // שולף את פרטי המשתמש מהזיכרון המקומי
      const userJson = localStorage.getItem('user');
      // הופך את מחרוזת ה-JSON לאובייקט ושולף את שדה ה-email
      return userJson ? JSON.parse(userJson).email : null;
    }
    return null;
  }

  // Getter שמחזיר את כל אובייקט המשתמש הנוכחי
  get currentUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem('user');
      // הופך את מחרוזת ה-JSON לאובייקט ומחזיר את פרטי המשתמש
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
}