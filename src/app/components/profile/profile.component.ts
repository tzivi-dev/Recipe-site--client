import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //  הגדרת המשתמש והמצב שליחת הבקשה true/false  
  user: any = null;// הגדרת משתנה שיכיל את נתוני המשתמש (מייל, תפקיד וכו')
  requestSent: boolean = false; // משתנה בוליאני למעקב אחרי מצב שליחת הבקשה (שימושי לשינוי עיצוב הכפתור)

  constructor(
    private authService: AuthService,
    // הזרקת PLATFORM_ID כדי לבדוק את הפלטפורמה כדי שנדע אם אנחנו רצים בדפדפן או בשרת 
    // זו "תעודת ביטוח" שמונעת מהקוד שלך לקרוס כשהוא מחפש כלים של דפדפן במקום שהם לא קיימים.
    // platformId- הוא יהיה משתנה שדרכו יהיה אפשר לבדוק אם אנחנו בדפדפן או בשרת
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // בדיקה בטוחה שאנחנו בדפדפן לפני שניגשים ל-LocalStorage
    if (isPlatformBrowser(this.platformId)) {
      // שליפת פרטי המשתמש מהזיכרון המקומי
      const userJson = localStorage.getItem('user');
      if (userJson) {
        // המרת מחרוזת ה-JSON לאובייקט ושמירתו במשתנה המקומי
        this.user = JSON.parse(userJson);
      }
    }
  }
// פונקציה שמופעלת בלחיצה על הכפתור "בקשת אישור העלאה"
  requestPermission() {
// קריאה לבקשת הרשאת העלאה
this.authService.requestUploadPermission().subscribe({
  // אם הבקשה הצליחה
  next: (res) => {
    alert('הבקשה נשלחה בהצלחה!');
    if (this.user) {
        this.user.request_date = new Date(); 
        // עדכון ה-LocalStorage כדי שהמצב יישמר גם בריענון
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    this.requestSent = true; // עדכון המצב שהבקשה נשלחה
  },
  // אם הייתה שגיאה בבקשה
  error: (err) => {
    console.error(err);
    alert('שגיאה בשליחת הבקשה.');
  }
});
  }
}