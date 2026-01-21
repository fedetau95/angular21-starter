export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  user_id?: number;
  created_at?: string;
}
