import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { CommonModule } from '@angular/common';
// קומפוננטה להצגת פרטי מתכון בודד
@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
// מחלקת הקומפוננטה
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}
// טעינת פרטי המתכון בעת אתחול הקומפוננטה
  ngOnInit(): void {
    // קבלת מזהה המתכון מהנתיב
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // בקשה לשרת לקבלת פרטי המתכון לפי המזהה
    this.recipeService.getRecipeById(id).subscribe({
      // הצלחה - שמירת הנתונים במשתנה המקומי
      next: (data: any) => this.recipe = data,
      // שגיאה - הדפסת השגיאה לקונסול
      error: (err: any) => console.error('Error loading recipe:', err)
    });
  }
}
