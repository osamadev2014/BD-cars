export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string
          full_name: string | null
          avatar_url: string | null
          locale: string
          is_active: boolean
          created_at: string
          updated_at: string
          last_sign_in_at: string | null
        }
        Insert: {
          id?: string
          phone: string
          full_name?: string | null
          avatar_url?: string | null
          locale?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
        }
        Update: {
          id?: string
          phone?: string
          full_name?: string | null
          avatar_url?: string | null
          locale?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_system: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          slug: string
          group: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          group?: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          group?: string
          description?: string | null
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      login_events: {
        Row: {
          id: string
          user_id: string | null
          phone: string
          event_type: string
          ip_address: string | null
          user_agent: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          phone: string
          event_type: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          phone?: string
          event_type?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          metadata: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      app_settings: {
        Row: {
          id: string
          category: string
          key: string
          value: Json
          type: string
          label: string
          description: string | null
          is_public: boolean
          is_dangerous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          key: string
          value: Json
          type?: string
          label?: string
          description?: string | null
          is_public?: boolean
          is_dangerous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          key?: string
          value?: Json
          type?: string
          label?: string
          description?: string | null
          is_public?: boolean
          is_dangerous?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      settings_history: {
        Row: {
          id: string
          setting_id: string
          old_value: Json | null
          new_value: Json
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          setting_id: string
          old_value?: Json | null
          new_value: Json
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          setting_id?: string
          old_value?: Json | null
          new_value?: Json
          changed_by?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
