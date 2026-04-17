import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs'; // כלי לביצוע מספר בקשות HTTP במקביל
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  standalone: true, // חשוב מאוד!
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  allRecipes: any[] = []; // המאגר המלא של המתכונים שקיבלנו מהשרת
  filteredRecipes: any[] = []; // מה שמוצג למשתמש בפועל (אחרי סינון/חיפוש)
  searchIngredients: string = ''; // מחרוזת החיפוש שמקושרת ל-Input ב-HTML

  constructor(
    private recipeService: RecipeService,
    public authService: AuthService, // חשוב שזה public כדי שה-HTML יוכל לגשת אליו
    private route: ActivatedRoute // הזרקה של ה-Route האקטיבי
  ) {}

  ngOnInit() {
    this.loadRecipes();
  }

  /**
   * טעינת מתכונים בצורה חכמה:
   * 1. קודם מקבלים רשימה בסיסית (ID ותמונה בלבד).
   * 2. מייצרים "תור" של בקשות לכל מתכון כדי לקבל פרטים מלאים (זמן וסוג).
   * 3. משתמשים ב-forkJoin כדי להציג הכל רק כשכל הנתונים מוכנים.
   */
  /**
   * טעינת מתכונים בגישת "Detailed Fetch":
   * השרת מחזיר רשימה בסיסית, ואנחנו מבקשים פרטים מלאים לכל אחד כדי להציג זמן וסוג.
   */
  loadRecipes() {
    this.recipeService.getRecipes().subscribe((basicRecipes) => {
      // יצירת מערך של Observable-ים עבור כל מתכון בנפרד
      const detailRequests = basicRecipes.map((r) =>
        this.recipeService.getRecipeById(r.id)
      );
      // שימוש ב-forkJoin כדי להמתין שכל הבקשות יסתיימו
      // ולקבל מערך של מתכונים מלאים
      //אם אחד הבקשות נכשלת, השגיאה תטופל במנוי למטה
      forkJoin(detailRequests).subscribe((fullRecipes) => {
        // איחוד הנתונים והוספת "הגנה" למקרה ששדות חסרים
        this.allRecipes = fullRecipes.map((recipe) => ({
          ...recipe,
          // מוודאים שזמן ההכנה הוא תמיד מספר, גם אם חזר null מהשרת
          prep_time: recipe.prep_time || recipe.preparation_time || 0,
          // מוודאים שה-type תואם לערכי הכשרות שלנו
          type: recipe.type || 'Parve',
          ingredients_count: recipe.ingredients ? recipe.ingredients.length : 0
        }));
        // --- 3. כאן קורה הקסם: האזנה לפרמטרים מה-URL ---
        this.route.queryParams.subscribe((params) => {
          const typeFilter = params['type']; // האם כתוב בכתובת ?type=...
          const isFast = params['fast']; // בדיקה אם ביקשו מתכון מהיר
          if (typeFilter) {
            // אם המשתמש הגיע מדף הבית אחרי שלחץ על "בשרי" למשל
            this.filteredRecipes = this.allRecipes.filter(
              (r) => r.type === typeFilter
            );
          } else if (isFast === 'true') {
            // סינון של מתכונים שלוקחים 30 דקות או פחות
            this.filteredRecipes = this.allRecipes.filter(
              (r) => r.prep_time <= 30
            );
          } else {
            this.filteredRecipes = [...this.allRecipes];
          }
        });
        // ---------------------------------------------
      });
    });
  }

  /**
   * סינון המתכונים בזיכרון (Client-side filtering)
   * מאפשר למשתמש לעבור בין קטגוריות ללא השהייה.
   */
  onFilterChange(event: any) {
    const val = event.target.value;
    if (val === 'הכל' || val === 'All') {
      this.filteredRecipes = this.allRecipes;
    } else {
      this.filteredRecipes = this.allRecipes.filter((r) => r.type === val);
    }
  }

  /**
   * מיון המתכונים:
   * משתמש ב-localeCompare עבור שמות (עברית) ובחיסור מספרים עבור זמן.
   */
  onSortChange(event: any) {
    // קבלת הערך שנבחר ב-Select
    const sortBy = event.target.value;
    if (sortBy === 'time') {
      this.filteredRecipes.sort(
        (a, b) => (a.prep_time || 0) - (b.prep_time || 0)
      );
    } else {
      this.filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  /**
   * חיפוש לפי רכיבים מול השרת (Server-side search)
   * שולח את מחרוזת הרכיבים ל-API של הפייתון שבנית.
   */
  searchByIngredients() {
    if (!this.searchIngredients.trim()) {
      this.loadRecipes(); // אם החיפוש ריק, טוענים הכל מחדש
      return;
    }
    // שליחת מחרוזת הרכיבים ל-API של הפייתון
    this.recipeService
      .searchRecipesByIngredients(this.searchIngredients)
      .subscribe({
        next: (results) => {
          this.filteredRecipes = results;
        },
        // הצגת שגיאה למשתמש במקרה של כישלון
        error: (err) =>
          alert('שגיאה בחיפוש: וודאי שרשימת הרכיבים מופרדת בפסיקים'),
      });
  }
  // מחיקת מתכון (למנהלים בלבד)
  deleteRecipe(id: number) {
    if (confirm('בטוח שברצונך למחוק מתכון זה?')) {
      this.recipeService.deleteRecipe(id).subscribe(() => this.loadRecipes());
    }
  }
}
