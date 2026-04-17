export interface Ingredient {
  product: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id?: number;
  title: string;
  description: string;
  type: 'Dairy' | 'Meat' | 'Parve';
  image_url?: string;         // לגלריה
  image_original_url?: string; // לדף פירוט
  image_variations?: string[]; // כל האפקטים
  author_email?: string;
  ingredients: Ingredient[];
  score?: number;             // עבור תוצאות החיפוש
}

export interface User {
  id: number;
  email: string;
  role: 'Admin' | 'Uploader' | 'Reader';
  is_approved_uploader: boolean;
  token?: string;
}