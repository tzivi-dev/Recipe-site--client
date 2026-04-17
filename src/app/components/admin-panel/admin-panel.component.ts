import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule], // ייבוא CommonModule כדי להשתמש ב-ngIf ו-ngFor ב-HTML
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  // משתנה שיחזיק את רשימת המשתמשים שביקשו הרשאה
  pendingUsers: any[] = [];
  // משתנה להצגת הודעות הצלחה זמניות למנהל
  message: string = '';

  constructor(private authService: AuthService) {}

  // פונקציה שרצה ברגע שהקומפוננטה עולה
  ngOnInit(): void {
    this.loadPendingUsers();
  }

  // שליפת המשתמשים ה-"ממתינים" מהשרת
  loadPendingUsers() {
    this.authService.getPendingUsers().subscribe({
      next: (users) => {
        // המרת נתוני המשתמשים לתוך המערך המקומי
        this.pendingUsers = users;
      },
      error: (err) => console.error('שגיאה בטעינת משתמשים:', err)
    });
  }

  // פונקציה לאישור משתמש והפיכתו ל-Uploader
  approveUser(userId: number) {
    this.authService.approveUser(userId).subscribe({
      next: () => {
        // עדכון הודעת הצלחה למשתמש
        this.message = 'המשתמש אושר בהצלחה והפך ל-Uploader!';
        
        // רענון הרשימה כדי שהמשתמש שאושר ייעלם ממנה
        this.loadPendingUsers();
        
        // העלמת הודעת ההצלחה אחרי 3 שניות
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error(err);
        alert('חלה שגיאה בתהליך אישור המשתמש');
      }
    });
  }
}