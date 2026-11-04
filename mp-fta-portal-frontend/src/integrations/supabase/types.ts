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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      fta_tariff_lines: {
        Row: {
          agreement_code: string
          agreement_name: string
          agreement_type: string
          country_code: string
          created_at: string
          description: string | null
          footnote: string | null
          fta_rate: string | null
          id: string
          mfn_rate: string | null
          rules_of_origin: string | null
          six_digit: string
          source_date: string | null
          source_file: string
          tariff_line: string
        }
        Insert: {
          agreement_code: string
          agreement_name: string
          agreement_type: string
          country_code: string
          created_at?: string
          description?: string | null
          footnote?: string | null
          fta_rate?: string | null
          id?: string
          mfn_rate?: string | null
          rules_of_origin?: string | null
          six_digit: string
          source_date?: string | null
          source_file: string
          tariff_line: string
        }
        Update: {
          agreement_code?: string
          agreement_name?: string
          agreement_type?: string
          country_code?: string
          created_at?: string
          description?: string | null
          footnote?: string | null
          fta_rate?: string | null
          id?: string
          mfn_rate?: string | null
          rules_of_origin?: string | null
          six_digit?: string
          source_date?: string | null
          source_file?: string
          tariff_line?: string
        }
        Relationships: []
      }
      india_export_policy: {
        Row: {
          chapter: string | null
          created_at: string
          export_policy: string | null
          hs_code: string
          id: string
          item_description: string | null
          notification_number: string | null
          policy_condition: string | null
          raw_data: Json | null
          restriction_type: string | null
          search_vector: unknown
          updated_at: string
        }
        Insert: {
          chapter?: string | null
          created_at?: string
          export_policy?: string | null
          hs_code: string
          id?: string
          item_description?: string | null
          notification_number?: string | null
          policy_condition?: string | null
          raw_data?: Json | null
          restriction_type?: string | null
          search_vector?: unknown
          updated_at?: string
        }
        Update: {
          chapter?: string | null
          created_at?: string
          export_policy?: string | null
          hs_code?: string
          id?: string
          item_description?: string | null
          notification_number?: string | null
          policy_condition?: string | null
          raw_data?: Json | null
          restriction_type?: string | null
          search_vector?: unknown
          updated_at?: string
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          created_at: string
          excerpt: string
          external_url: string | null
          id: string
          published_at: string
          source: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          excerpt: string
          external_url?: string | null
          id?: string
          published_at?: string
          source?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          excerpt?: string
          external_url?: string | null
          id?: string
          published_at?: string
          source?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      saved_calculations: {
        Row: {
          api_response: Json | null
          cif_value: number | null
          created_at: string
          currency_code: string
          exporting_country: string
          exporting_country_flag: string | null
          hs_code: string
          hs_description: string | null
          id: string
          importing_country: string
          importing_country_flag: string | null
          incoterm: string | null
          origin_country: string
          origin_country_flag: string | null
          product_value: number
          total_duty: number | null
          total_duty_foreign: number | null
          total_landed_cost: number | null
          total_landed_cost_foreign: number | null
          transport_mode: string
          user_id: string
        }
        Insert: {
          api_response?: Json | null
          cif_value?: number | null
          created_at?: string
          currency_code: string
          exporting_country: string
          exporting_country_flag?: string | null
          hs_code: string
          hs_description?: string | null
          id?: string
          importing_country: string
          importing_country_flag?: string | null
          incoterm?: string | null
          origin_country: string
          origin_country_flag?: string | null
          product_value: number
          total_duty?: number | null
          total_duty_foreign?: number | null
          total_landed_cost?: number | null
          total_landed_cost_foreign?: number | null
          transport_mode: string
          user_id: string
        }
        Update: {
          api_response?: Json | null
          cif_value?: number | null
          created_at?: string
          currency_code?: string
          exporting_country?: string
          exporting_country_flag?: string | null
          hs_code?: string
          hs_description?: string | null
          id?: string
          importing_country?: string
          importing_country_flag?: string | null
          incoterm?: string | null
          origin_country?: string
          origin_country_flag?: string | null
          product_value?: number
          total_duty?: number | null
          total_duty_foreign?: number | null
          total_landed_cost?: number | null
          total_landed_cost_foreign?: number | null
          transport_mode?: string
          user_id?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          created_at: string
          district: string | null
          email: string
          id: string
          message: string
          name: string
          organisation: string | null
          request_type: string
          status: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          email: string
          id?: string
          message: string
          name: string
          organisation?: string | null
          request_type: string
          status?: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          organisation?: string | null
          request_type?: string
          status?: string
          topic?: string | null
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
