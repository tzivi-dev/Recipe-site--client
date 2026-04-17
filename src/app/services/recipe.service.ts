import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // כתובת הבסיס של השרת
  private baseUrl = 'http://localhost:5000';
  // כתובת ספציפית למתכונים
  private apiUrl = 'http://localhost:5000/recipes';

  constructor(
    private http: HttpClient,
    // הזרקת PLATFORM_ID לזיהוי סביבת הריצה
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 1. קבלת כל המתכונים
  getRecipes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. קבלת מתכון בודד לפי ID
  getRecipeById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. חיפוש מתכונים לפי רכיבים (Matching Score) - מותאם בדיוק ל-app.py
  searchRecipesByIngredients(ingredientsString: string): Observable<any[]> {
    // הפיכת המחרוזת לרשימה (מערך) כפי שהפייתון מצפה
    const ingredientsList = ingredientsString.split(',').map(i => i.trim());
    
    // שימוש בנתיב המדויק מהפייתון: /search/ingredients
    return this.http.post<any[]>(`${this.baseUrl}/search/ingredients`, {
      ingredients: ingredientsList
    });
  }

  // 4. הוספת מתכון חדש (עם שליחת טוקן JWT)
addRecipe(formData: FormData): Observable<any> {
  let headers = new HttpHeaders();
  
  // בדיקה שאנחנו בדפדפן כדי לגשת ל-localStorage
  // isPlatformBrowser- פונקציה שמוודאת שהקוד רץ בדפדפן
  if (isPlatformBrowser(this.platformId)) {
    // קבלת הטוקן מהזיכרון המקומי
    const token = localStorage.getItem('token');
    if (token) {
      // הוספת הטוקן לכותרות הבקשה
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  return this.http.post(this.apiUrl, formData, { headers });
}

  // 5. מחיקת מתכון (למנהלים בלבד)
  deleteRecipe(id: any): Observable<any> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        // הוספת הטוקן לכותרות הבקשה
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    // שימוש ב-http.delete עם הכותרות המכילות את הטוקן
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}