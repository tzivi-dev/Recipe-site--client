import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  // פונקציה שמאזינה לגלילה של המשתמש
  //OnDestroy מטפל בעזיבת הדף (בתוך האתר), בזמן ש-@HostListener יכול לטפל באירועים של הדפדפן עצמו (כמו סגירת הטאב או רענון הדף).
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const featureSection = document.getElementById('slidingBox');
    if (featureSection) {
      const rect = featureSection.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // אם האלמנט נכנס לטווח הראייה
      if (rect.top <= viewHeight * 0.8 && rect.bottom >= 0) {
        featureSection.classList.add('visible');
      } else {
        // אם גוללים חזרה למעלה - הוא זז החוצה
        featureSection.classList.remove('visible');
      }
    }
  }
  goToRegister(emailValue: string) {
    if (emailValue) {
      // ניווט לדף ההרשמה עם הפרמטר email
      this.router.navigate(['/register'], { queryParams: { email: emailValue } });
    } else {
      // אם לא כתבו כלום, פשוט נעבור לדף הרשמה רגיל
      this.router.navigate(['/register']);
    }
  }
}