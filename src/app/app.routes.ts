import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { authGuard } from './guards/auth.guard'; // הגארד שיצרנו
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

// הגדרת מערך הניתובים של האפליקציה
export const routes: Routes = [
  { path: '', component: HomeComponent }, // דף הבית לכולם
  { path: 'login', component: LoginComponent }, // דף התחברות לכולם
  { path: 'register', component: RegisterComponent }, // דף הרשמה לכולם
  { path: 'recipes', component: RecipeListComponent }, // גלריה פתוחה לצפייה
  { path: 'recipes/:id', component: RecipeDetailComponent }, // פרטי מתכון פתוח

  // נתיב מוגן: רק משתמש מחובר יכול לראות פרופיל
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // נתיב מוגן למנהל בלבד: הוספנו data עם ה-role הנדרש
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },

  // נתיב מוגן למעלי מתכונים (Admin או Uploader - נבדוק זאת בתוך הגארד או הקומפוננטה)
  {
    path: 'add-recipe',
    component: AddRecipeComponent,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' }, // ניתוב לכל כתובת לא מוכרת חזרה הביתה
];
