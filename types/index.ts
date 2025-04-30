export interface DetectionState {
  selectedImage: File | null;
  preview: string | null;
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
}
export interface ApiKey {
  id: number;
  user_id: number;
  user_username?: string; // Add this field
  key: string;
  name: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}
export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
