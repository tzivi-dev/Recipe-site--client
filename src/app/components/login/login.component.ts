import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // הגדרת טופס התחברות ומשתנה שיכיל את ההודעה שולחת אם יש שגיאה
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    // הזרקת הכלים הדרושים
    // FormBuilder- לבניית הטופס
    private fb: FormBuilder,
    // AuthService- לשירות האבטחה
    private authService: AuthService,
    // Router- לניהול ניתובים
    private router: Router
  ) {
    // הגדרת הטופס ובדיקות התקינות
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // חובה ומבנה של מייל
      password: ['', [Validators.required, Validators.minLength(6)]] // חובה ולפחות 6 תווים
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // קריאה לשירות האבטחה עם נתוני הטופס
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // אם התחברות הצליחה
          console.log('Login success!', res);
          this.router.navigate(['/recipes']); // מעבר לגלריה אחרי כניסה
        },
        error: (err) => {
          this.errorMessage = 'Email or password incorrect';
        }
      });
    }
  }
}