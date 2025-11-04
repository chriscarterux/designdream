// Placeholder database types
// This will be properly generated in the P1 Supabase Setup worktree
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Add your table types here
    };
    Views: {
      // Add your view types here
    };
    Functions: {
      // Add your function types here
    };
    Enums: {
      // Add your enum types here
    };
  };
}
