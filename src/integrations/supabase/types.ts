export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          calendly_event_uri: string | null
          calendly_invitee_uri: string | null
          company: string | null
          created_at: string
          destination: string | null
          email: string | null
          event_name: string | null
          gclid: string | null
          id: string
          kind: string
          landing_path: string | null
          message: string | null
          name: string | null
          page_path: string | null
          phone: string | null
          receptionist_id: string | null
          referrer: string | null
          scheduled_at: string | null
          search_query: string | null
          status: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          calendly_event_uri?: string | null
          calendly_invitee_uri?: string | null
          company?: string | null
          created_at?: string
          destination?: string | null
          email?: string | null
          event_name?: string | null
          gclid?: string | null
          id?: string
          kind?: string
          landing_path?: string | null
          message?: string | null
          name?: string | null
          page_path?: string | null
          phone?: string | null
          receptionist_id?: string | null
          referrer?: string | null
          scheduled_at?: string | null
          search_query?: string | null
          status?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          calendly_event_uri?: string | null
          calendly_invitee_uri?: string | null
          company?: string | null
          created_at?: string
          destination?: string | null
          email?: string | null
          event_name?: string | null
          gclid?: string | null
          id?: string
          kind?: string
          landing_path?: string | null
          message?: string | null
          name?: string | null
          page_path?: string | null
          phone?: string | null
          receptionist_id?: string | null
          referrer?: string | null
          scheduled_at?: string | null
          search_query?: string | null
          status?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_receptionist_id_fkey"
            columns: ["receptionist_id"]
            isOneToOne: false
            referencedRelation: "receptionists"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          gclid: string | null
          id: string
          landing_path: string | null
          language: string | null
          message: string
          name: string
          phone: string
          receptionist_id: string
          referrer: string | null
          search_query: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          gclid?: string | null
          id?: string
          landing_path?: string | null
          language?: string | null
          message: string
          name: string
          phone: string
          receptionist_id: string
          referrer?: string | null
          search_query?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          gclid?: string | null
          id?: string
          landing_path?: string | null
          language?: string | null
          message?: string
          name?: string
          phone?: string
          receptionist_id?: string
          referrer?: string | null
          search_query?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_receptionist_id_fkey"
            columns: ["receptionist_id"]
            isOneToOne: false
            referencedRelation: "receptionists"
            referencedColumns: ["id"]
          },
        ]
      }
      receptionists: {
        Row: {
          business_name: string
          calendly_15: string | null
          calendly_30: string | null
          created_at: string
          description: string
          faqs: string
          id: string
          notif_email: string | null
          sheet_url: string | null
          slug: string
          updated_at: string
          user_id: string | null
          webhook_url: string | null
          whatsapp_enabled: boolean
          whatsapp_number: string | null
        }
        Insert: {
          business_name?: string
          calendly_15?: string | null
          calendly_30?: string | null
          created_at?: string
          description?: string
          faqs?: string
          id?: string
          notif_email?: string | null
          sheet_url?: string | null
          slug: string
          updated_at?: string
          user_id?: string | null
          webhook_url?: string | null
          whatsapp_enabled?: boolean
          whatsapp_number?: string | null
        }
        Update: {
          business_name?: string
          calendly_15?: string | null
          calendly_30?: string | null
          created_at?: string
          description?: string
          faqs?: string
          id?: string
          notif_email?: string | null
          sheet_url?: string | null
          slug?: string
          updated_at?: string
          user_id?: string | null
          webhook_url?: string | null
          whatsapp_enabled?: boolean
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
