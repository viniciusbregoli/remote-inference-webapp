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
key: string;
name: string;
is_active: boolean;
created_at: string;
expires_at?: string;
}