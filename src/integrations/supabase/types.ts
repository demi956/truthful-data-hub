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
      addresses: {
        Row: {
          address_line: string | null
          city: string | null
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          label: string | null
          landmark: string | null
          region: string | null
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          label?: string | null
          landmark?: string | null
          region?: string | null
        }
        Update: {
          address_line?: string | null
          city?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          label?: string | null
          landmark?: string | null
          region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bundle_orders: {
        Row: {
          amount: number
          bundle_id: string
          created_at: string
          customer_id: string | null
          id: string
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          receiving_phone: string
          status: Database["public"]["Enums"]["bundle_order_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          bundle_id: string
          created_at?: string
          customer_id?: string | null
          id?: string
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          receiving_phone: string
          status?: Database["public"]["Enums"]["bundle_order_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          bundle_id?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          receiving_phone?: string
          status?: Database["public"]["Enums"]["bundle_order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_orders_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "data_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buy_swap_requests: {
        Row: {
          admin_notes: string | null
          admin_offer: number | null
          admin_status: string
          battery_health_percent: number | null
          created_at: string
          current_brand: string | null
          current_condition: string | null
          current_model: string | null
          current_storage: string | null
          customer_id: string | null
          customer_name: string | null
          customer_notes: string | null
          customer_phone: string
          desired_product_id: string | null
          desired_variant_id: string | null
          id: string
          imei_or_serial: string | null
          ownership_confirmed: boolean | null
          photo_urls: Json
          request_number: string
          request_type: Database["public"]["Enums"]["request_type"]
          updated_at: string
          witness_contact: string | null
          witness_name: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_offer?: number | null
          admin_status?: string
          battery_health_percent?: number | null
          created_at?: string
          current_brand?: string | null
          current_condition?: string | null
          current_model?: string | null
          current_storage?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_notes?: string | null
          customer_phone: string
          desired_product_id?: string | null
          desired_variant_id?: string | null
          id?: string
          imei_or_serial?: string | null
          ownership_confirmed?: boolean | null
          photo_urls?: Json
          request_number: string
          request_type: Database["public"]["Enums"]["request_type"]
          updated_at?: string
          witness_contact?: string | null
          witness_name?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_offer?: number | null
          admin_status?: string
          battery_health_percent?: number | null
          created_at?: string
          current_brand?: string | null
          current_condition?: string | null
          current_model?: string | null
          current_storage?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_notes?: string | null
          customer_phone?: string
          desired_product_id?: string | null
          desired_variant_id?: string | null
          id?: string
          imei_or_serial?: string | null
          ownership_confirmed?: boolean | null
          photo_urls?: Json
          request_number?: string
          request_type?: Database["public"]["Enums"]["request_type"]
          updated_at?: string
          witness_contact?: string | null
          witness_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buy_swap_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buy_swap_requests_desired_product_id_fkey"
            columns: ["desired_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buy_swap_requests_desired_variant_id_fkey"
            columns: ["desired_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          quantity: number
          variant_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          quantity: number
          variant_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          quantity?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          customer_id: string | null
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_bundles: {
        Row: {
          activation_time: string | null
          active: boolean
          created_at: string
          data_gb: number
          id: string
          name: string
          network: string
          price: number
          updated_at: string
          validity: string | null
        }
        Insert: {
          activation_time?: string | null
          active?: boolean
          created_at?: string
          data_gb: number
          id?: string
          name: string
          network: string
          price: number
          updated_at?: string
          validity?: string | null
        }
        Update: {
          activation_time?: string | null
          active?: boolean
          created_at?: string
          data_gb?: number
          id?: string
          name?: string
          network?: string
          price?: number
          updated_at?: string
          validity?: string | null
        }
        Relationships: []
      }
      delivery_locations: {
        Row: {
          active: boolean
          city: string | null
          created_at: string
          fee: number | null
          id: string
          label: string
          region: string | null
        }
        Insert: {
          active?: boolean
          city?: string | null
          created_at?: string
          fee?: number | null
          id?: string
          label: string
          region?: string | null
        }
        Update: {
          active?: boolean
          city?: string | null
          created_at?: string
          fee?: number | null
          id?: string
          label?: string
          region?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          sku_snapshot: string | null
          subtotal: number
          unit_price_snapshot: number
          variant_id: string | null
          variant_snapshot: Json
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name_snapshot: string
          quantity: number
          sku_snapshot?: string | null
          subtotal: number
          unit_price_snapshot: number
          variant_id?: string | null
          variant_snapshot?: Json
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          sku_snapshot?: string | null
          subtotal?: number
          unit_price_snapshot?: number
          variant_id?: string | null
          variant_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          city: string | null
          created_at: string
          customer_id: string | null
          delivery_address: string | null
          delivery_fee: number | null
          delivery_fee_confirmed: boolean
          email: string | null
          fulfillment_method: string
          full_name: string
          id: string
          landmark: string | null
          notes: string | null
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          region: string | null
          subtotal: number
          total: number | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_fee_confirmed?: boolean
          email?: string | null
          fulfillment_method?: string
          full_name: string
          id?: string
          landmark?: string | null
          notes?: string | null
          order_number: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          region?: string | null
          subtotal?: number
          total?: number | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_fee_confirmed?: boolean
          email?: string | null
          fulfillment_method?: string
          full_name?: string
          id?: string
          landmark?: string | null
          notes?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          region?: string | null
          subtotal?: number
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          metadata: Json
          order_id: string | null
          payment_method: string | null
          provider: string | null
          reference: string | null
          status: Database["public"]["Enums"]["payment_status"]
          verified_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
          metadata?: Json
          order_id?: string | null
          payment_method?: string | null
          provider?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          verified_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          metadata?: Json
          order_id?: string | null
          payment_method?: string | null
          provider?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
          sort_order: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          availability_status: string
          battery_health_percent: number | null
          color: string | null
          condition: string | null
          cost_price: number | null
          created_at: string
          id: string
          low_stock_threshold: number
          network_lock: string | null
          price: number
          product_id: string
          sale_price: number | null
          sealed_in_box: boolean | null
          sku: string
          stock_quantity: number | null
          stock_tracking_mode: string
          stock_type: string | null
          storage: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          availability_status?: string
          battery_health_percent?: number | null
          color?: string | null
          condition?: string | null
          cost_price?: number | null
          created_at?: string
          id?: string
          low_stock_threshold?: number
          network_lock?: string | null
          price: number
          product_id: string
          sale_price?: number | null
          sealed_in_box?: boolean | null
          sku: string
          stock_quantity?: number | null
          stock_tracking_mode?: string
          stock_type?: string | null
          storage?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          availability_status?: string
          battery_health_percent?: number | null
          color?: string | null
          condition?: string | null
          cost_price?: number | null
          created_at?: string
          id?: string
          low_stock_threshold?: number
          network_lock?: string | null
          price?: number
          product_id?: string
          sale_price?: number | null
          sealed_in_box?: boolean | null
          sku?: string
          stock_quantity?: number | null
          stock_tracking_mode?: string
          stock_type?: string | null
          storage?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          model: string | null
          name: string
          sku: string | null
          slug: string
          specifications: Json
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          model?: string | null
          name: string
          sku?: string | null
          slug: string
          specifications?: Json
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          model?: string | null
          name?: string
          sku?: string | null
          slug?: string
          specifications?: Json
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          code: string | null
          created_at: string
          discount_type: string | null
          discount_value: number | null
          ends_at: string | null
          id: string
          name: string
          starts_at: string | null
        }
        Insert: {
          active?: boolean
          code?: string | null
          created_at?: string
          discount_type?: string | null
          discount_value?: number | null
          ends_at?: string | null
          id?: string
          name: string
          starts_at?: string | null
        }
        Update: {
          active?: boolean
          code?: string | null
          created_at?: string
          discount_type?: string | null
          discount_value?: number | null
          ends_at?: string | null
          id?: string
          name?: string
          starts_at?: string | null
        }
        Relationships: []
      }
      service_offers: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          network: string | null
          price: number
          service_code: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          network?: string | null
          price: number
          service_code: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          network?: string | null
          price?: number
          service_code?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          order_id: string | null
          source: string
          status: string
          subject: string | null
          summary: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          order_id?: string | null
          source?: string
          status?: string
          subject?: string | null
          summary?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          order_id?: string | null
          source?: string
          status?: string
          subject?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      bundle_order_status:
        | "pending"
        | "payment_confirmed"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      order_status:
        | "pending"
        | "payment_pending_verification"
        | "payment_confirmed"
        | "processing"
        | "ready"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      payment_status:
        | "pending"
        | "pending_verification"
        | "successful"
        | "failed"
        | "refunded"
      request_type: "sell" | "swap"
      user_role: "customer" | "admin"
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
    Enums: {
      bundle_order_status: [
        "pending",
        "payment_confirmed",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      order_status: [
        "pending",
        "payment_pending_verification",
        "payment_confirmed",
        "processing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_status: [
        "pending",
        "pending_verification",
        "successful",
        "failed",
        "refunded",
      ],
      request_type: ["sell", "swap"],
      user_role: ["customer", "admin"],
    },
  },
} as const
