import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})

export class AddRecipeComponent {
  // משתנה להצגת תצוגה מקדימה של התמונה שנבחרה
  imagePreview: string | ArrayBuffer | null = null;
  // משתנה לטופס הוספת מתכון
  recipeForm: FormGroup;
  // משתנה לאחסון קובץ תמונה שנבחר
  selectedFile: File | null = null;
  isUploading: boolean = false; // משתנה לאפקט טעינה

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {
    // הגדרת הטופס פעם אחת בלבד עם כל השדות
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      prepTime: [30, [Validators.required, Validators.min(1)]],
      type: ['Parve', Validators.required],
      ingredients: this.fb.array([]),
    });
    
    this.addIngredient(); // הוספת שורת רכיב ראשונה כברירת מחדל
  }
//  לרשימת הרכיבים בטופס
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }
// פונקציה שטוענת את התמונה שנבחרה
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      // onload- אירוע שמתרחש כשהקריאה לקובץ מסתיימת בהצלחה  
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      // קריאה אסינכרונית של הקובץ כ-Data URL
      reader.readAsDataURL(file);
    }
  }

  addIngredient() {
    // הוספת שורת רכיב חדשה לטופס
    const ingredientForm = this.fb.group({
      product: ['', Validators.required],
      amount: [1, [Validators.required, Validators.min(0.1)]],
      unit: ['גרם', Validators.required],
    });
    // הוספת שורת רכיב חדשה לטופס
    this.ingredients.push(ingredientForm);
  }
// פונקציה להסרת שורת רכיב מהטופס
  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }
// פונקציה שמטפלת בשליחת הטופס
  onSubmit() {
    if (this.recipeForm.invalid || this.isUploading) return;

    this.isUploading = true; // הפעלת מצב טעינה
    const formData = new FormData();
    // הוספת קובץ התמונה אם נבחרה
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
// יצירת אובייקט עם נתוני המתכון מהטופס
    const recipeData = {
      title: this.recipeForm.value.title,
      description: this.recipeForm.value.description,
      prep_time: Number(this.recipeForm.value.prepTime),
      type: this.recipeForm.value.type,
      ingredients: this.recipeForm.value.ingredients,
    };
// הוספת נתוני המתכון כ-JSON ל-FormData
    formData.append('data', JSON.stringify(recipeData));
// קריאה לשירות להוספת המתכון
    this.recipeService.addRecipe(formData).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        alert('איזה כיף! המתכון פורסם בהצלחה ✨');
        this.router.navigate(['/recipes']);
      },
      error: (err: any) => {
        this.isUploading = false;
        console.error('שגיאה:', err);
        alert('אופס, חלה שגיאה בפרסום. נסה שנית.');
      },
    });
  }
}