
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // הוספנו ActivatedRoute
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute // הזרקנו את ה-Route כדי לקרוא פרמטרים מה-URL
  ) { 
       this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }
ngOnInit() {
    // כאן קורה הקסם: אנחנו בודקים אם יש מייל בכתובת (URL)
    this.route.queryParams.subscribe(params => {
      const emailParam = params['email'];
      if (emailParam) {
        // אם נמצא מייל, אנחנו שותלים אותו אוטומטית בטופס
        this.registerForm.patchValue({
          email: emailParam
        });
      }
    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.errorMessage = "הסיסמאות אינן תואמות!";
        return;
      }
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('נרשמת בהצלחה!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = "שגיאה בהרשמה: ודאי שהמייל לא קיים במערכת";
          console.error(err);
        }
      });
    }
  }
}