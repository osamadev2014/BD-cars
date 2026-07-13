export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          advertiser_id: string
          budget: number | null
          clicks_target: number | null
          created_at: string
          end_date: string | null
          id: string
          impressions_target: number | null
          media_url: string | null
          name: string
          org_id: string | null
          placement: string
          spent: number | null
          start_date: string | null
          status: string
          target_url: string | null
          type: string
          updated_at: string
        }
        Insert: {
          advertiser_id: string
          budget?: number | null
          clicks_target?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions_target?: number | null
          media_url?: string | null
          name: string
          org_id?: string | null
          placement: string
          spent?: number | null
          start_date?: string | null
          status?: string
          target_url?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          advertiser_id?: string
          budget?: number | null
          clicks_target?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions_target?: number | null
          media_url?: string | null
          name?: string
          org_id?: string | null
          placement?: string
          spent?: number | null
          start_date?: string | null
          status?: string
          target_url?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertisers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_campaigns_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_clicks: {
        Row: {
          campaign_id: string
          clicked_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id: string
          clicked_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string
          clicked_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_impressions: {
        Row: {
          campaign_id: string
          id: string
          ip_address: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          campaign_id: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          campaign_id?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_placements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      advertiser_users: {
        Row: {
          advertiser_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          advertiser_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id: string
        }
        Update: {
          advertiser_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_users_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertisers"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          org_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          org_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          org_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_dangerous: boolean
          is_public: boolean
          key: string
          label: string
          type: string
          updated_at: string
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_dangerous?: boolean
          is_public?: boolean
          key: string
          label?: string
          type?: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_dangerous?: boolean
          is_public?: boolean
          key?: string
          label?: string
          type?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at: string
          id: string
          is_winning: boolean
        }
        Insert: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at?: string
          id?: string
          is_winning?: boolean
        }
        Update: {
          amount?: number
          auction_id?: string
          bidder_id?: string
          created_at?: string
          id?: string
          is_winning?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_results: {
        Row: {
          auction_id: string
          created_at: string
          id: string
          payment_status: string | null
          status: string
          updated_at: string
          winner_id: string | null
          winning_bid: number | null
        }
        Insert: {
          auction_id: string
          created_at?: string
          id?: string
          payment_status?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
          winning_bid?: number | null
        }
        Update: {
          auction_id?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
          winning_bid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_results_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_rules: {
        Row: {
          auction_id: string
          created_at: string
          id: string
          rule_key: string
          rule_value: Json
        }
        Insert: {
          auction_id: string
          created_at?: string
          id?: string
          rule_key: string
          rule_value: Json
        }
        Update: {
          auction_id?: string
          created_at?: string
          id?: string
          rule_key?: string
          rule_value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "auction_rules_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_status_history: {
        Row: {
          auction_id: string
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          auction_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          auction_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_status_history_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_vehicles: {
        Row: {
          auction_id: string
          created_at: string
          id: string
          listing_id: string
        }
        Insert: {
          auction_id: string
          created_at?: string
          id?: string
          listing_id: string
        }
        Update: {
          auction_id?: string
          created_at?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_vehicles_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_vehicles_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_watchers: {
        Row: {
          auction_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          auction_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          auction_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_watchers_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          auction_type: string
          bid_increment: number
          buy_now_price: number | null
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string
          dealer_id: string | null
          deposit_amount: number | null
          end_time: string
          extended_duration_minutes: number | null
          id: string
          org_id: string | null
          participation_fee: number | null
          reserve_price: number | null
          seller_id: string
          slug: string
          start_price: number
          start_time: string
          status: string
          terms: string | null
          terms_ar: string | null
          title: string
          title_ar: string | null
          updated_at: string
          winner_id: string | null
          winning_bid: number | null
        }
        Insert: {
          auction_type?: string
          bid_increment?: number
          buy_now_price?: number | null
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          dealer_id?: string | null
          deposit_amount?: number | null
          end_time: string
          extended_duration_minutes?: number | null
          id?: string
          org_id?: string | null
          participation_fee?: number | null
          reserve_price?: number | null
          seller_id: string
          slug: string
          start_price: number
          start_time: string
          status?: string
          terms?: string | null
          terms_ar?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string
          winner_id?: string | null
          winning_bid?: number | null
        }
        Update: {
          auction_type?: string
          bid_increment?: number
          buy_now_price?: number | null
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          dealer_id?: string | null
          deposit_amount?: number | null
          end_time?: string
          extended_duration_minutes?: number | null
          id?: string
          org_id?: string | null
          participation_fee?: number | null
          reserve_price?: number | null
          seller_id?: string
          slug?: string
          start_price?: number
          start_time?: string
          status?: string
          terms?: string | null
          terms_ar?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string
          winner_id?: string | null
          winning_bid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_auctions_dealer"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      body_types: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      car_colors: {
        Row: {
          created_at: string
          hex_code: string | null
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          hex_code?: string | null
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          hex_code?: string | null
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      car_generations: {
        Row: {
          created_at: string
          id: string
          model_id: string
          name: string
          name_ar: string
          slug: string
          year_end: number | null
          year_start: number
        }
        Insert: {
          created_at?: string
          id?: string
          model_id: string
          name: string
          name_ar: string
          slug: string
          year_end?: number | null
          year_start: number
        }
        Update: {
          created_at?: string
          id?: string
          model_id?: string
          name?: string
          name_ar?: string
          slug?: string
          year_end?: number | null
          year_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "car_generations_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
        ]
      }
      car_makes: {
        Row: {
          country: string | null
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      car_models: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          make_id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          make_id: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          make_id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      car_specs: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      car_trims: {
        Row: {
          body_type_id: string | null
          created_at: string
          drivetrain_id: string | null
          engine_size: number | null
          engine_type: string | null
          fuel_type_id: string | null
          generation_id: string | null
          horsepower: number | null
          id: string
          is_active: boolean
          model_id: string
          name: string
          name_ar: string
          slug: string
          transmission_id: string | null
        }
        Insert: {
          body_type_id?: string | null
          created_at?: string
          drivetrain_id?: string | null
          engine_size?: number | null
          engine_type?: string | null
          fuel_type_id?: string | null
          generation_id?: string | null
          horsepower?: number | null
          id?: string
          is_active?: boolean
          model_id: string
          name: string
          name_ar: string
          slug: string
          transmission_id?: string | null
        }
        Update: {
          body_type_id?: string | null
          created_at?: string
          drivetrain_id?: string | null
          engine_size?: number | null
          engine_type?: string | null
          fuel_type_id?: string | null
          generation_id?: string | null
          horsepower?: number | null
          id?: string
          is_active?: boolean
          model_id?: string
          name?: string
          name_ar?: string
          slug?: string
          transmission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_trims_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_trims_drivetrain_id_fkey"
            columns: ["drivetrain_id"]
            isOneToOne: false
            referencedRelation: "drivetrain_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_trims_fuel_type_id_fkey"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_trims_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "car_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_trims_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_trims_transmission_id_fkey"
            columns: ["transmission_id"]
            isOneToOne: false
            referencedRelation: "transmission_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
          region_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
          region_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
          region_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          applies_to: string | null
          category: string | null
          created_at: string
          description: string | null
          fixed_amount: number | null
          id: string
          is_active: boolean
          max_amount: number | null
          min_amount: number | null
          name: string
          percentage: number | null
          priority: number
          rule_type: string
          updated_at: string
        }
        Insert: {
          applies_to?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean
          max_amount?: number | null
          min_amount?: number | null
          name: string
          percentage?: number | null
          priority?: number
          rule_type: string
          updated_at?: string
        }
        Update: {
          applies_to?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean
          max_amount?: number | null
          min_amount?: number | null
          name?: string
          percentage?: number | null
          priority?: number
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_pages: {
        Row: {
          content: string
          content_ar: string
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          meta_description_ar: string | null
          slug: string
          title: string
          title_ar: string
          updated_at: string
        }
        Insert: {
          content: string
          content_ar: string
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_description_ar?: string | null
          slug: string
          title: string
          title_ar: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_ar?: string
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_description_ar?: string | null
          slug?: string
          title?: string
          title_ar?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_active: boolean
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_flagged: boolean
          is_moderated: boolean
          listing_id: string | null
          order_id: string | null
          part_request_id: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_flagged?: boolean
          is_moderated?: boolean
          listing_id?: string | null
          order_id?: string | null
          part_request_id?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_flagged?: boolean
          is_moderated?: boolean
          listing_id?: string | null
          order_id?: string | null
          part_request_id?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
          phone_code: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
          phone_code: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
          phone_code?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          discount_amount: number
          id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount_amount: number
          id?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount_amount?: number
          id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          max_uses_per_user: number | null
          min_order_amount: number | null
          starts_at: string | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_order_amount?: number | null
          starts_at?: string | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_order_amount?: number | null
          starts_at?: string | null
          used_count?: number
        }
        Relationships: []
      }
      crm_customers: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          last_contacted_at: string | null
          notes: string | null
          tags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          last_contacted_at?: string | null
          notes?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          last_contacted_at?: string | null
          notes?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          added_by: string
          content: string
          created_at: string
          customer_id: string
          id: string
          is_private: boolean
        }
        Insert: {
          added_by: string
          content: string
          created_at?: string
          customer_id: string
          id?: string
          is_private?: boolean
        }
        Update: {
          added_by?: string
          content?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_private?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "crm_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_timeline: {
        Row: {
          created_at: string
          description: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      customer_vehicle_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          description: string | null
          id: string
          make: string | null
          model: string | null
          status: string
          updated_at: string
          user_id: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description?: string | null
          id?: string
          make?: string | null
          model?: string | null
          status?: string
          updated_at?: string
          user_id: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description?: string | null
          id?: string
          make?: string | null
          model?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: []
      }
      dealer_branches: {
        Row: {
          address: string | null
          address_ar: string | null
          city_id: string | null
          created_at: string
          dealer_id: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          name_ar: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          dealer_id: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          name_ar?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          dealer_id?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_ar?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_branches_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_branches_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_financial_rules: {
        Row: {
          commission_fixed: number | null
          commission_percentage: number | null
          created_at: string
          dealer_id: string
          deposit_percentage: number | null
          id: string
          payment_terms: string | null
          updated_at: string
        }
        Insert: {
          commission_fixed?: number | null
          commission_percentage?: number | null
          created_at?: string
          dealer_id: string
          deposit_percentage?: number | null
          id?: string
          payment_terms?: string | null
          updated_at?: string
        }
        Update: {
          commission_fixed?: number | null
          commission_percentage?: number | null
          created_at?: string
          dealer_id?: string
          deposit_percentage?: number | null
          id?: string
          payment_terms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_financial_rules_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_inventory: {
        Row: {
          created_at: string
          dealer_id: string
          id: string
          listing_id: string
          purchase_price: number | null
          status: string
          stock_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          id?: string
          listing_id: string
          purchase_price?: number | null
          status?: string
          stock_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          id?: string
          listing_id?: string
          purchase_price?: number | null
          status?: string
          stock_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_inventory_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_inventory_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_pages: {
        Row: {
          about: string | null
          about_ar: string | null
          created_at: string
          dealer_id: string
          id: string
          is_published: boolean
          seo_description: string | null
          seo_title: string | null
          services: Json | null
          social_links: Json | null
          updated_at: string
          working_hours: Json | null
        }
        Insert: {
          about?: string | null
          about_ar?: string | null
          created_at?: string
          dealer_id: string
          id?: string
          is_published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          services?: Json | null
          social_links?: Json | null
          updated_at?: string
          working_hours?: Json | null
        }
        Update: {
          about?: string | null
          about_ar?: string | null
          created_at?: string
          dealer_id?: string
          id?: string
          is_published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          services?: Json | null
          social_links?: Json | null
          updated_at?: string
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_pages_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_ratings: {
        Row: {
          created_at: string
          dealer_id: string
          id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          id?: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_ratings_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_stats: {
        Row: {
          created_at: string
          date: string
          dealer_id: string
          id: string
          inquiries_count: number
          listings_count: number
          revenue: number | null
          sales_count: number
          views_count: number
        }
        Insert: {
          created_at?: string
          date: string
          dealer_id: string
          id?: string
          inquiries_count?: number
          listings_count?: number
          revenue?: number | null
          sales_count?: number
          views_count?: number
        }
        Update: {
          created_at?: string
          date?: string
          dealer_id?: string
          id?: string
          inquiries_count?: number
          listings_count?: number
          revenue?: number | null
          sales_count?: number
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "dealer_stats_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          has_analytics: boolean
          has_api: boolean
          has_auctions: boolean
          has_delivery: boolean
          has_featured: boolean
          has_parts: boolean
          has_wholesale: boolean
          id: string
          is_active: boolean
          max_branches: number | null
          max_listings: number | null
          max_staff: number | null
          name: string
          name_ar: string | null
          price_monthly: number
          price_yearly: number | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          has_analytics?: boolean
          has_api?: boolean
          has_auctions?: boolean
          has_delivery?: boolean
          has_featured?: boolean
          has_parts?: boolean
          has_wholesale?: boolean
          id?: string
          is_active?: boolean
          max_branches?: number | null
          max_listings?: number | null
          max_staff?: number | null
          name: string
          name_ar?: string | null
          price_monthly?: number
          price_yearly?: number | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          has_analytics?: boolean
          has_api?: boolean
          has_auctions?: boolean
          has_delivery?: boolean
          has_featured?: boolean
          has_parts?: boolean
          has_wholesale?: boolean
          id?: string
          is_active?: boolean
          max_branches?: number | null
          max_listings?: number | null
          max_staff?: number | null
          name?: string
          name_ar?: string | null
          price_monthly?: number
          price_yearly?: number | null
          slug?: string
        }
        Relationships: []
      }
      dealer_subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          dealer_id: string
          end_date: string | null
          id: string
          plan_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          dealer_id: string
          end_date?: string | null
          id?: string
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          dealer_id?: string
          end_date?: string | null
          id?: string
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_subscriptions_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "dealer_subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_trust_badges: {
        Row: {
          badge_type: string
          created_at: string
          dealer_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          issued_at: string
        }
        Insert: {
          badge_type: string
          created_at?: string
          dealer_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          issued_at?: string
        }
        Update: {
          badge_type?: string
          created_at?: string
          dealer_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          issued_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_trust_badges_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_users: {
        Row: {
          created_at: string
          dealer_id: string
          id: string
          is_active: boolean
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          id?: string
          is_active?: boolean
          permissions?: Json | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          id?: string
          is_active?: boolean
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_users_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          address: string | null
          address_ar: string | null
          city_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          description_ar: string | null
          email: string | null
          id: string
          is_active: boolean
          is_approved: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          name_ar: string | null
          org_id: string | null
          owner_id: string
          phone: string | null
          rating: number | null
          review_count: number
          slug: string
          trust_badge: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          name_ar?: string | null
          org_id?: string | null
          owner_id: string
          phone?: string | null
          rating?: number | null
          review_count?: number
          slug: string
          trust_badge?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          name_ar?: string | null
          org_id?: string | null
          owner_id?: string
          phone?: string | null
          rating?: number | null
          review_count?: number
          slug?: string
          trust_badge?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_addresses: {
        Row: {
          address: string
          address_ar: string | null
          city_id: string | null
          created_at: string
          district_id: string | null
          id: string
          is_default: boolean
          label: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          district_id?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          district_id?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_addresses_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_addresses_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_methods: {
        Row: {
          created_at: string
          description: string | null
          estimated_days_max: number | null
          estimated_days_min: number | null
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_days_max?: number | null
          estimated_days_min?: number | null
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_days_max?: number | null
          estimated_days_min?: number | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          slug?: string
        }
        Relationships: []
      }
      delivery_orders: {
        Row: {
          actual_delivery_date: string | null
          created_at: string
          delivery_address_id: string | null
          delivery_fee: number
          estimated_delivery_date: string | null
          id: string
          method_id: string | null
          notes: string | null
          order_id: string | null
          order_type: string
          org_id: string | null
          pickup_address_id: string | null
          provider_id: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string
          delivery_address_id?: string | null
          delivery_fee?: number
          estimated_delivery_date?: string | null
          id?: string
          method_id?: string | null
          notes?: string | null
          order_id?: string | null
          order_type: string
          org_id?: string | null
          pickup_address_id?: string | null
          provider_id?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string
          delivery_address_id?: string | null
          delivery_fee?: number
          estimated_delivery_date?: string | null
          id?: string
          method_id?: string | null
          notes?: string | null
          order_id?: string | null
          order_type?: string
          org_id?: string | null
          pickup_address_id?: string | null
          provider_id?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "delivery_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_orders_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "delivery_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_orders_pickup_address_id_fkey"
            columns: ["pickup_address_id"]
            isOneToOne: false
            referencedRelation: "delivery_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_orders_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_pricing_rules: {
        Row: {
          base_fee: number
          created_at: string
          fee_per_km: number | null
          free_threshold: number | null
          id: string
          is_active: boolean
          max_fee: number | null
          method_id: string | null
          min_fee: number | null
          provider_id: string | null
          weight_fee_per_kg: number | null
          zone_id: string | null
        }
        Insert: {
          base_fee?: number
          created_at?: string
          fee_per_km?: number | null
          free_threshold?: number | null
          id?: string
          is_active?: boolean
          max_fee?: number | null
          method_id?: string | null
          min_fee?: number | null
          provider_id?: string | null
          weight_fee_per_kg?: number | null
          zone_id?: string | null
        }
        Update: {
          base_fee?: number
          created_at?: string
          fee_per_km?: number | null
          free_threshold?: number | null
          id?: string
          is_active?: boolean
          max_fee?: number | null
          method_id?: string | null
          min_fee?: number | null
          provider_id?: string | null
          weight_fee_per_kg?: number | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_pricing_rules_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "delivery_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_pricing_rules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_pricing_rules_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_provider_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          provider_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_provider_users_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "delivery_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_providers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          name_ar: string | null
          org_id: string | null
          phone: string | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          name_ar?: string | null
          org_id?: string | null
          phone?: string | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          name_ar?: string | null
          org_id?: string | null
          phone?: string | null
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_providers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          delivery_order_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          delivery_order_id: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          delivery_order_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_status_history_delivery_order_id_fkey"
            columns: ["delivery_order_id"]
            isOneToOne: false
            referencedRelation: "delivery_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tracking_events: {
        Row: {
          created_at: string
          delivery_order_id: string
          id: string
          location: string | null
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          delivery_order_id: string
          id?: string
          location?: string | null
          notes?: string | null
          status: string
        }
        Update: {
          created_at?: string
          delivery_order_id?: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_events_delivery_order_id_fkey"
            columns: ["delivery_order_id"]
            isOneToOne: false
            referencedRelation: "delivery_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          city_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zones_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          city_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      drivetrain_types: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      employee_commissions: {
        Row: {
          amount: number
          commission_type: string
          created_at: string
          id: string
          paid_at: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          commission_type: string
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          commission_type?: string
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_targets: {
        Row: {
          achieved_value: number | null
          created_at: string
          id: string
          period_end: string
          period_start: string
          target_type: string
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achieved_value?: number | null
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          target_type: string
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achieved_value?: number | null
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          target_type?: string
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_offers: {
        Row: {
          approved_amount: number | null
          created_at: string
          id: string
          interest_rate: number | null
          monthly_payment: number | null
          notes: string | null
          org_id: string | null
          partner_id: string
          request_id: string
          status: string
          term_months: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          approved_amount?: number | null
          created_at?: string
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          notes?: string | null
          org_id?: string | null
          partner_id: string
          request_id: string
          status?: string
          term_months?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          approved_amount?: number | null
          created_at?: string
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          notes?: string | null
          org_id?: string | null
          partner_id?: string
          request_id?: string
          status?: string
          term_months?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_offers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_offers_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "finance_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "finance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_partner_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          partner_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          partner_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          partner_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "finance_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_partners: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          name_ar: string
          org_id: string | null
          revenue_model: string
          revenue_per_approved: number | null
          revenue_per_lead: number | null
          revenue_percentage: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          name_ar: string
          org_id?: string | null
          revenue_model?: string
          revenue_per_approved?: number | null
          revenue_per_lead?: number | null
          revenue_percentage?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          name_ar?: string
          org_id?: string | null
          revenue_model?: string
          revenue_per_approved?: number | null
          revenue_per_lead?: number | null
          revenue_percentage?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_partners_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_requests: {
        Row: {
          created_at: string
          customer_id: string
          down_payment: number | null
          id: string
          listing_id: string | null
          notes: string | null
          partner_id: string | null
          requested_amount: number | null
          status: string
          updated_at: string
          vehicle_price: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          down_payment?: number | null
          id?: string
          listing_id?: string | null
          notes?: string | null
          partner_id?: string | null
          requested_amount?: number | null
          status?: string
          updated_at?: string
          vehicle_price: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          down_payment?: number | null
          id?: string
          listing_id?: string | null
          notes?: string | null
          partner_id?: string | null
          requested_amount?: number | null
          status?: string
          updated_at?: string
          vehicle_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "finance_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "finance_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          request_id: string
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_id: string
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "finance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_types: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      homepage_banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          sort_order: number
          subtitle: string | null
          subtitle_ar: string | null
          title: string
          title_ar: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          subtitle?: string | null
          subtitle_ar?: string | null
          title: string
          title_ar: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          subtitle?: string | null
          subtitle_ar?: string | null
          title?: string
          title_ar?: string
        }
        Relationships: []
      }
      inspection_appointments: {
        Row: {
          appointment_date: string
          branch_id: string | null
          center_id: string
          created_at: string
          customer_id: string
          id: string
          listing_id: string | null
          notes: string | null
          org_id: string | null
          payment_status: string
          price: number | null
          service_id: string | null
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          appointment_date: string
          branch_id?: string | null
          center_id: string
          created_at?: string
          customer_id: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          org_id?: string | null
          payment_status?: string
          price?: number | null
          service_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          appointment_date?: string
          branch_id?: string | null
          center_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          org_id?: string | null
          payment_status?: string
          price?: number | null
          service_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_appointments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "inspection_center_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_appointments_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "inspection_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_appointments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_appointments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "inspection_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_center_branches: {
        Row: {
          address: string | null
          address_ar: string | null
          center_id: string
          city_id: string | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          name_ar: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          center_id: string
          city_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          name_ar: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          center_id?: string
          city_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_ar?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_center_branches_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "inspection_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_center_branches_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_center_users: {
        Row: {
          center_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          center_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id: string
        }
        Update: {
          center_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_center_users_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "inspection_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_centers: {
        Row: {
          address: string | null
          address_ar: string | null
          city_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          description_ar: string | null
          email: string | null
          id: string
          is_active: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          name_ar: string
          org_id: string | null
          phone: string | null
          revenue_share_percentage: number | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          name_ar: string
          org_id?: string | null
          phone?: string | null
          revenue_share_percentage?: number | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          name_ar?: string
          org_id?: string | null
          phone?: string | null
          revenue_share_percentage?: number | null
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_centers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_centers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_defects: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          estimated_repair_cost: number | null
          id: string
          item_id: string | null
          name: string
          name_ar: string
          position_x: number | null
          position_y: number | null
          report_id: string
          severity: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          estimated_repair_cost?: number | null
          id?: string
          item_id?: string | null
          name: string
          name_ar: string
          position_x?: number | null
          position_y?: number | null
          report_id: string
          severity?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          estimated_repair_cost?: number | null
          id?: string
          item_id?: string | null
          name?: string
          name_ar?: string
          position_x?: number | null
          position_y?: number | null
          report_id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_defects_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inspection_report_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_defects_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          item_id: string | null
          media_type: string
          report_id: string | null
          section_id: string | null
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          media_type?: string
          report_id?: string | null
          section_id?: string | null
          thumbnail_url?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          media_type?: string
          report_id?: string | null
          section_id?: string | null
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_media_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inspection_report_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_media_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_media_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "inspection_report_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_report_approval_history: {
        Row: {
          action: string
          created_at: string
          id: string
          notes: string | null
          performed_by: string
          report_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          notes?: string | null
          performed_by: string
          report_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          notes?: string | null
          performed_by?: string
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_report_approval_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_report_items: {
        Row: {
          created_at: string
          estimated_repair_cost: number | null
          id: string
          name: string
          name_ar: string
          notes: string | null
          notes_ar: string | null
          score: number | null
          section_id: string
          severity: string | null
          sort_order: number
          status: string | null
        }
        Insert: {
          created_at?: string
          estimated_repair_cost?: number | null
          id?: string
          name: string
          name_ar: string
          notes?: string | null
          notes_ar?: string | null
          score?: number | null
          section_id: string
          severity?: string | null
          sort_order?: number
          status?: string | null
        }
        Update: {
          created_at?: string
          estimated_repair_cost?: number | null
          id?: string
          name?: string
          name_ar?: string
          notes?: string | null
          notes_ar?: string | null
          score?: number | null
          section_id?: string
          severity?: string | null
          sort_order?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_report_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "inspection_report_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_report_sections: {
        Row: {
          created_at: string
          id: string
          max_score: number | null
          name: string
          name_ar: string
          report_id: string
          score: number | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          max_score?: number | null
          name: string
          name_ar: string
          report_id: string
          score?: number | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          max_score?: number | null
          name?: string
          name_ar?: string
          report_id?: string
          score?: number | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "inspection_report_sections_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_reports: {
        Row: {
          admin_approved: boolean
          appointment_id: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          estimated_repair_cost: number | null
          id: string
          inspector_id: string | null
          is_public: boolean
          listing_id: string | null
          max_score: number | null
          org_id: string | null
          outcome: string | null
          recommendation: string | null
          recommendation_ar: string | null
          score: number | null
          share_token: string | null
          status: string
          summary: string | null
          summary_ar: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          admin_approved?: boolean
          appointment_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          estimated_repair_cost?: number | null
          id?: string
          inspector_id?: string | null
          is_public?: boolean
          listing_id?: string | null
          max_score?: number | null
          org_id?: string | null
          outcome?: string | null
          recommendation?: string | null
          recommendation_ar?: string | null
          score?: number | null
          share_token?: string | null
          status?: string
          summary?: string | null
          summary_ar?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          admin_approved?: boolean
          appointment_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          estimated_repair_cost?: number | null
          id?: string
          inspector_id?: string | null
          is_public?: boolean
          listing_id?: string | null
          max_score?: number | null
          org_id?: string | null
          outcome?: string | null
          recommendation?: string | null
          recommendation_ar?: string | null
          score?: number | null
          share_token?: string | null
          status?: string
          summary?: string | null
          summary_ar?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_reports_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "inspection_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_revenue_shares: {
        Row: {
          appointment_id: string
          center_id: string
          center_share: number
          created_at: string
          id: string
          ryon_share: number
          share_percentage: number
          total_amount: number
        }
        Insert: {
          appointment_id: string
          center_id: string
          center_share: number
          created_at?: string
          id?: string
          ryon_share: number
          share_percentage: number
          total_amount: number
        }
        Update: {
          appointment_id?: string
          center_id?: string
          center_share?: number
          created_at?: string
          id?: string
          ryon_share?: number
          share_percentage?: number
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "inspection_revenue_shares_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "inspection_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_revenue_shares_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "inspection_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_service_pricing: {
        Row: {
          car_make_id: string | null
          center_id: string | null
          city_id: string | null
          created_at: string
          id: string
          is_active: boolean
          price: number
          service_id: string
        }
        Insert: {
          car_make_id?: string | null
          center_id?: string | null
          city_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          price: number
          service_id: string
        }
        Update: {
          car_make_id?: string | null
          center_id?: string | null
          city_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          price?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_service_pricing_car_make_id_fkey"
            columns: ["car_make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_service_pricing_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "inspection_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_service_pricing_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_service_pricing_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "inspection_services"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_services: {
        Row: {
          created_at: string
          default_price: number | null
          description: string | null
          description_ar: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          default_price?: number | null
          description?: string | null
          description_ar?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          default_price?: number | null
          description?: string | null
          description_ar?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      inspection_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          report_id: string
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          report_id: string
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          report_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_status_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      instant_buy_requests: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          payment_intent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          payment_intent_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          payment_intent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instant_buy_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_offers: {
        Row: {
          coverage_details: Json | null
          created_at: string
          id: string
          org_id: string | null
          partner_id: string
          premium: number
          request_id: string
          status: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          coverage_details?: Json | null
          created_at?: string
          id?: string
          org_id?: string | null
          partner_id: string
          premium: number
          request_id: string
          status?: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          coverage_details?: Json | null
          created_at?: string
          id?: string
          org_id?: string | null
          partner_id?: string
          premium?: number
          request_id?: string
          status?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_offers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_offers_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "insurance_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "insurance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_partner_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          partner_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          partner_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          partner_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "insurance_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_partners: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          name_ar: string
          org_id: string | null
          revenue_model: string
          revenue_per_lead: number | null
          revenue_percentage: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          name_ar: string
          org_id?: string | null
          revenue_model?: string
          revenue_per_lead?: number | null
          revenue_percentage?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          name_ar?: string
          org_id?: string | null
          revenue_model?: string
          revenue_per_lead?: number | null
          revenue_percentage?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_partners_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_requests: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          insurance_type: string | null
          listing_id: string | null
          partner_id: string | null
          status: string
          updated_at: string
          vehicle_price: number | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          insurance_type?: string | null
          listing_id?: string | null
          partner_id?: string | null
          status?: string
          updated_at?: string
          vehicle_price?: number | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          insurance_type?: string | null
          listing_id?: string | null
          partner_id?: string | null
          status?: string
          updated_at?: string
          vehicle_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "insurance_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_notifications: {
        Row: {
          body: string
          body_ar: string | null
          created_at: string
          id: string
          is_read: boolean
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          title_ar: string | null
          type: string
          user_id: string
        }
        Insert: {
          body: string
          body_ar?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          title_ar?: string | null
          type?: string
          user_id: string
        }
        Update: {
          body?: string
          body_ar?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          title_ar?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          description_ar: string | null
          id: string
          invoice_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          description_ar?: string | null
          id?: string
          invoice_id: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          description_ar?: string | null
          id?: string
          invoice_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          invoice_type: string
          notes: string | null
          paid_at: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string
          vat_amount: number
          vat_percentage: number
        }
        Insert: {
          created_at?: string
          currency?: string
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          invoice_type: string
          notes?: string | null
          paid_at?: string | null
          status?: string
          subtotal: number
          total_amount: number
          updated_at?: string
          user_id: string
          vat_amount: number
          vat_percentage?: number
        }
        Update: {
          created_at?: string
          currency?: string
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
          vat_amount?: number
          vat_percentage?: number
        }
        Relationships: []
      }
      listing_approval_requests: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          requested_by: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          requested_by: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          requested_by?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_approval_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_change_requests: {
        Row: {
          changes: Json
          created_at: string
          id: string
          listing_id: string
          requested_by: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          changes: Json
          created_at?: string
          id?: string
          listing_id: string
          requested_by: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          changes?: Json
          created_at?: string
          id?: string
          listing_id?: string
          requested_by?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_change_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_reviews: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          rating: number
          review: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          review?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          review?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          listing_id: string
          notes: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          listing_id: string
          notes?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_status_history_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          address_ar: string | null
          city_id: string | null
          created_at: string
          district_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          district_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          district_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      login_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          phone: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          phone: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          phone?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_read_receipts: {
        Row: {
          id: string
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_receipts_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean
          is_edited: boolean
          message_type: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          message_type?: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          message_type?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_flags: {
        Row: {
          conversation_id: string | null
          created_at: string
          flagged_by: string | null
          id: string
          message_id: string | null
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          flagged_by?: string | null
          id?: string
          message_id?: string | null
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          flagged_by?: string | null
          id?: string
          message_id?: string | null
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_flags_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_flags_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_deliveries: {
        Row: {
          channel: string
          created_at: string
          error: string | null
          id: string
          notification_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          error?: string | null
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "internal_notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          channel_email: boolean
          channel_in_app: boolean
          channel_push: boolean
          channel_sms: boolean
          created_at: string
          id: string
          pref_admin_alerts: boolean
          pref_auctions: boolean
          pref_delivery: boolean
          pref_finance: boolean
          pref_inspection: boolean
          pref_listing_updates: boolean
          pref_marketing: boolean
          pref_messages: boolean
          pref_purchase_requests: boolean
          pref_spare_parts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_email?: boolean
          channel_in_app?: boolean
          channel_push?: boolean
          channel_sms?: boolean
          created_at?: string
          id?: string
          pref_admin_alerts?: boolean
          pref_auctions?: boolean
          pref_delivery?: boolean
          pref_finance?: boolean
          pref_inspection?: boolean
          pref_listing_updates?: boolean
          pref_marketing?: boolean
          pref_messages?: boolean
          pref_purchase_requests?: boolean
          pref_spare_parts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_email?: boolean
          channel_in_app?: boolean
          channel_push?: boolean
          channel_sms?: boolean
          created_at?: string
          id?: string
          pref_admin_alerts?: boolean
          pref_auctions?: boolean
          pref_delivery?: boolean
          pref_finance?: boolean
          pref_inspection?: boolean
          pref_listing_updates?: boolean
          pref_marketing?: boolean
          pref_messages?: boolean
          pref_purchase_requests?: boolean
          pref_spare_parts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body: string
          body_ar: string | null
          channels: Json
          created_at: string
          id: string
          key: string
          title: string
          title_ar: string | null
          updated_at: string
        }
        Insert: {
          body: string
          body_ar?: string | null
          channels?: Json
          created_at?: string
          id?: string
          key: string
          title: string
          title_ar?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          body_ar?: string | null
          channels?: Json
          created_at?: string
          id?: string
          key?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organization_branches: {
        Row: {
          address: string | null
          address_ar: string | null
          city_id: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_active: boolean
          is_headquarters: boolean
          latitude: number | null
          longitude: number | null
          name_ar: string
          name_en: string
          organization_id: string
          phone: string | null
          slug: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_headquarters?: boolean
          latitude?: number | null
          longitude?: number | null
          name_ar: string
          name_en: string
          organization_id: string
          phone?: string | null
          slug: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_headquarters?: boolean
          latitude?: number | null
          longitude?: number | null
          name_ar?: string
          name_en?: string
          organization_id?: string
          phone?: string | null
          slug?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_branches_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean
          joined_at: string | null
          organization_id: string
          role: string
          status: Database["public"]["Enums"]["org_member_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string | null
          organization_id: string
          role?: string
          status?: Database["public"]["Enums"]["org_member_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string | null
          organization_id?: string
          role?: string
          status?: Database["public"]["Enums"]["org_member_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_permissions: {
        Row: {
          category: string
          description: string | null
          id: string
          name_ar: string
          name_en: string
          slug: string
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          name_ar: string
          name_en: string
          slug: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
        }
        Relationships: []
      }
      organization_role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "organization_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "organization_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name_ar: string
          name_en: string
          organization_id: string
          priority: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name_ar: string
          name_en: string
          organization_id: string
          priority?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name_ar?: string
          name_en?: string
          organization_id?: string
          priority?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          address_ar: string | null
          city_id: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          description_ar: string | null
          email: string | null
          id: string
          is_active: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          name_ar: string | null
          org_type: Database["public"]["Enums"]["org_type"]
          phone: string | null
          registration_number: string | null
          slug: string
          status: Database["public"]["Enums"]["org_status"]
          status_notes: string | null
          tax_number: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          name_ar?: string | null
          org_type: Database["public"]["Enums"]["org_type"]
          phone?: string | null
          registration_number?: string | null
          slug: string
          status?: Database["public"]["Enums"]["org_status"]
          status_notes?: string | null
          tax_number?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          address_ar?: string | null
          city_id?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          name_ar?: string | null
          org_type?: Database["public"]["Enums"]["org_type"]
          phone?: string | null
          registration_number?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["org_status"]
          status_notes?: string | null
          tax_number?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      part_brands: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          name_ar: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          name_ar?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          name_ar?: string | null
          slug?: string
        }
        Relationships: []
      }
      part_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "part_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
          provider_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
          provider_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
          provider_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "payment_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_providers: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean
          is_sandbox: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          transaction_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status: string
          transaction_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_status_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          fee_amount: number | null
          id: string
          metadata: Json | null
          payment_method_id: string | null
          reference_id: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
          vat_amount: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          fee_amount?: number | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          reference_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
          vat_amount?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          fee_amount?: number | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          reference_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          last_sign_in_at: string | null
          locale: string
          phone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_sign_in_at?: string | null
          locale?: string
          phone: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_sign_in_at?: string | null
          locale?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchase_requests: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          message: string | null
          proposed_price: number | null
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          proposed_price?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          proposed_price?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          country_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
        }
        Insert: {
          country_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
        }
        Update: {
          country_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
        }
        Relationships: [
          {
            foreignKeyName: "regions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      report_exports: {
        Row: {
          completed_at: string | null
          created_at: string
          file_url: string | null
          filters: Json | null
          format: string
          id: string
          report_type: string
          requested_by: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          file_url?: string | null
          filters?: Json | null
          format?: string
          id?: string
          report_type: string
          requested_by: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          file_url?: string | null
          filters?: Json | null
          format?: string
          id?: string
          report_type?: string
          requested_by?: string
          status?: string
        }
        Relationships: []
      }
      request_offer_items: {
        Row: {
          created_at: string
          description: string
          id: string
          listing_id: string | null
          offer_id: string
          price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          listing_id?: string | null
          offer_id: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          listing_id?: string | null
          offer_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "request_offer_items_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_offer_items_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "request_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      request_offers: {
        Row: {
          created_at: string
          dealer_id: string | null
          id: string
          notes: string | null
          offerer_id: string
          request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dealer_id?: string | null
          id?: string
          notes?: string | null
          offerer_id: string
          request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dealer_id?: string | null
          id?: string
          notes?: string | null
          offerer_id?: string
          request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "customer_vehicle_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_search_alerts: {
        Row: {
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          last_sent_at: string | null
          saved_search_id: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          saved_search_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          saved_search_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_search_alerts_saved_search_id_fkey"
            columns: ["saved_search_id"]
            isOneToOne: false
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string | null
          notify: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters: Json
          id?: string
          name?: string | null
          notify?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string | null
          notify?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sell_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sell_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_zones: {
        Row: {
          city_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_ar: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_ar: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_zones_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_value: Json
          old_value: Json | null
          setting_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value: Json
          old_value?: Json | null
          setting_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: Json
          old_value?: Json | null
          setting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_history_setting_id_fkey"
            columns: ["setting_id"]
            isOneToOne: false
            referencedRelation: "app_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_compatibility: {
        Row: {
          created_at: string
          engine_type: string | null
          id: string
          make_id: string | null
          model_id: string | null
          notes: string | null
          part_id: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          created_at?: string
          engine_type?: string | null
          id?: string
          make_id?: string | null
          model_id?: string | null
          notes?: string | null
          part_id: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          created_at?: string
          engine_type?: string | null
          id?: string
          make_id?: string | null
          model_id?: string | null
          notes?: string | null
          part_id?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_compatibility_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_compatibility_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_compatibility_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "spare_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          part_id: string
          sort_order: number
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          part_id: string
          sort_order?: number
          thumbnail_url?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          part_id?: string
          sort_order?: number
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_images_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "spare_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_inventory: {
        Row: {
          batch_number: string | null
          created_at: string
          expiry_date: string | null
          id: string
          location: string | null
          part_id: string
          quantity: number
          supplier_id: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          location?: string | null
          part_id: string
          quantity?: number
          supplier_id: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          location?: string | null
          part_id?: string
          quantity?: number
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_inventory_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "spare_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_order_items: {
        Row: {
          description: string
          id: string
          order_id: string
          part_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          order_id: string
          part_id?: string | null
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          order_id?: string
          part_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "spare_part_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_order_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "spare_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_fee: number | null
          grand_total: number
          id: string
          notes: string | null
          payment_status: string
          quote_id: string | null
          request_id: string | null
          status: string
          supplier_id: string | null
          total_amount: number
          updated_at: string
          vat_amount: number | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_fee?: number | null
          grand_total: number
          id?: string
          notes?: string | null
          payment_status?: string
          quote_id?: string | null
          request_id?: string | null
          status?: string
          supplier_id?: string | null
          total_amount: number
          updated_at?: string
          vat_amount?: number | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_fee?: number | null
          grand_total?: number
          id?: string
          notes?: string | null
          payment_status?: string
          quote_id?: string | null
          request_id?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "spare_part_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_orders_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "spare_part_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "spare_part_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_quotes: {
        Row: {
          availability: string | null
          created_at: string
          dealer_id: string | null
          delivery_fee: number | null
          estimated_delivery_days: number | null
          id: string
          notes: string | null
          price: number
          quoted_by: string
          request_id: string
          status: string
          supplier_id: string | null
          total_price: number
          updated_at: string
          valid_until: string | null
          warranty_months: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          dealer_id?: string | null
          delivery_fee?: number | null
          estimated_delivery_days?: number | null
          id?: string
          notes?: string | null
          price: number
          quoted_by: string
          request_id: string
          status?: string
          supplier_id?: string | null
          total_price: number
          updated_at?: string
          valid_until?: string | null
          warranty_months?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          dealer_id?: string | null
          delivery_fee?: number | null
          estimated_delivery_days?: number | null
          id?: string
          notes?: string | null
          price?: number
          quoted_by?: string
          request_id?: string
          status?: string
          supplier_id?: string | null
          total_price?: number
          updated_at?: string
          valid_until?: string | null
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "spare_part_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_quotes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "spare_part_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_request_items: {
        Row: {
          id: string
          notes: string | null
          part_id: string | null
          quantity: number
          request_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          part_id?: string | null
          quantity?: number
          request_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          part_id?: string | null
          quantity?: number
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_request_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "spare_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "spare_part_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category_id: string | null
          city_id: string | null
          created_at: string
          customer_id: string
          delivery_address_id: string | null
          description: string | null
          id: string
          make: string | null
          model: string | null
          oem_number: string | null
          part_name: string
          part_number: string | null
          plate_number: string | null
          status: string
          trim: string | null
          updated_at: string
          urgency: string
          vin: string | null
          year: number | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          customer_id: string
          delivery_address_id?: string | null
          description?: string | null
          id?: string
          make?: string | null
          model?: string | null
          oem_number?: string | null
          part_name: string
          part_number?: string | null
          plate_number?: string | null
          status?: string
          trim?: string | null
          updated_at?: string
          urgency?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          customer_id?: string
          delivery_address_id?: string | null
          description?: string | null
          id?: string
          make?: string | null
          model?: string | null
          oem_number?: string | null
          part_name?: string
          part_number?: string | null
          plate_number?: string | null
          status?: string
          trim?: string | null
          updated_at?: string
          urgency?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "part_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_requests_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          order_id: string | null
          request_id: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          request_id?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          request_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "spare_part_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "spare_part_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_supplier_parts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          part_id: string
          price: number | null
          stock_quantity: number | null
          supplier_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          part_id: string
          price?: number | null
          stock_quantity?: number | null
          supplier_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          part_id?: string
          price?: number | null
          stock_quantity?: number | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_supplier_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "spare_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_supplier_parts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "spare_part_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_supplier_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          role: string
          supplier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          supplier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          supplier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_supplier_users_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "spare_part_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_part_suppliers: {
        Row: {
          city_id: string | null
          created_at: string
          description: string | null
          description_ar: string | null
          email: string | null
          id: string
          is_active: boolean
          is_approved: boolean
          logo_url: string | null
          name: string
          name_ar: string | null
          org_id: string | null
          phone: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          logo_url?: string | null
          name: string
          name_ar?: string | null
          org_id?: string | null
          phone?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          logo_url?: string | null
          name?: string
          name_ar?: string | null
          org_id?: string | null
          phone?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spare_part_suppliers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_part_suppliers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_parts: {
        Row: {
          brand_id: string | null
          category_id: string | null
          city_id: string | null
          condition: string
          created_at: string
          currency: string
          description: string | null
          description_ar: string | null
          id: string
          is_active: boolean
          is_approved: boolean
          min_order_quantity: number
          oem_number: string | null
          org_id: string | null
          part_number: string | null
          part_type: string
          price: number
          return_days: number | null
          slug: string
          stock_quantity: number
          stock_status: string
          title: string
          title_ar: string | null
          updated_at: string
          warranty_months: number | null
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          city_id?: string | null
          condition?: string
          created_at?: string
          currency?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          min_order_quantity?: number
          oem_number?: string | null
          org_id?: string | null
          part_number?: string | null
          part_type?: string
          price: number
          return_days?: number | null
          slug: string
          stock_quantity?: number
          stock_status?: string
          title: string
          title_ar?: string | null
          updated_at?: string
          warranty_months?: number | null
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          city_id?: string | null
          condition?: string
          created_at?: string
          currency?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          min_order_quantity?: number
          oem_number?: string | null
          org_id?: string | null
          part_number?: string | null
          part_type?: string
          price?: number
          return_days?: number | null
          slug?: string
          stock_quantity?: number
          stock_status?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_parts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "part_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "part_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_parts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spare_parts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_packages: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          price: number
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          price: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          price?: number
          slug?: string
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          created_at: string
          department: string | null
          employee_id: string | null
          id: string
          is_active: boolean
          job_title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          id: string
          priority: string
          reference_id: string | null
          reference_type: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          reference_id: string | null
          reference_type: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          message_id: string | null
          ticket_id: string | null
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          message_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_internal: boolean
          sender_id: string
          ticket_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          sender_id: string
          ticket_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      transmission_types: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_comparisons: {
        Row: {
          created_at: string
          id: string
          listings: Json
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listings?: Json
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listings?: Json
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_condition_types: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          created_at: string
          document_type: string
          file_url: string
          id: string
          title: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          title: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          title?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          sort_order: number
          thumbnail_url: string | null
          url: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          url: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_listings: {
        Row: {
          avg_rating: number
          created_at: string
          currency: string
          dealer_id: string | null
          description: string | null
          description_ar: string | null
          expires_at: string | null
          favorite_count: number
          featured_until: string | null
          has_inspection: boolean
          id: string
          inquiry_count: number
          inspection_report_id: string | null
          instant_buy_price: number | null
          is_auction: boolean
          is_dealer_only: boolean
          is_featured: boolean
          is_instant_buy: boolean
          is_wholesale: boolean
          org_id: string | null
          original_price: number | null
          price: number
          published_at: string | null
          review_count: number
          seller_id: string
          seller_type: string
          slug: string
          status: string
          title: string
          title_ar: string | null
          updated_at: string
          vehicle_id: string
          views_count: number
        }
        Insert: {
          avg_rating?: number
          created_at?: string
          currency?: string
          dealer_id?: string | null
          description?: string | null
          description_ar?: string | null
          expires_at?: string | null
          favorite_count?: number
          featured_until?: string | null
          has_inspection?: boolean
          id?: string
          inquiry_count?: number
          inspection_report_id?: string | null
          instant_buy_price?: number | null
          is_auction?: boolean
          is_dealer_only?: boolean
          is_featured?: boolean
          is_instant_buy?: boolean
          is_wholesale?: boolean
          org_id?: string | null
          original_price?: number | null
          price: number
          published_at?: string | null
          review_count?: number
          seller_id: string
          seller_type?: string
          slug: string
          status?: string
          title: string
          title_ar?: string | null
          updated_at?: string
          vehicle_id: string
          views_count?: number
        }
        Update: {
          avg_rating?: number
          created_at?: string
          currency?: string
          dealer_id?: string | null
          description?: string | null
          description_ar?: string | null
          expires_at?: string | null
          favorite_count?: number
          featured_until?: string | null
          has_inspection?: boolean
          id?: string
          inquiry_count?: number
          inspection_report_id?: string | null
          instant_buy_price?: number | null
          is_auction?: boolean
          is_dealer_only?: boolean
          is_featured?: boolean
          is_instant_buy?: boolean
          is_wholesale?: boolean
          org_id?: string | null
          original_price?: number | null
          price?: number
          published_at?: string | null
          review_count?: number
          seller_id?: string
          seller_type?: string
          slug?: string
          status?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
          vehicle_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle_listings_dealer"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_listings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_listings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_price_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_price: number
          old_price: number | null
          reason: string | null
          vehicle_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price: number
          old_price?: number | null
          reason?: string | null
          vehicle_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price?: number
          old_price?: number | null
          reason?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_price_history_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_requests: {
        Row: {
          admin_notes: string | null
          body_type_id: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          id: string
          make_id: string | null
          make_name: string | null
          model_id: string | null
          model_name: string | null
          notes: string | null
          status: string
          updated_at: string
          user_id: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          admin_notes?: string | null
          body_type_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          make_id?: string | null
          make_name?: string | null
          model_id?: string | null
          model_name?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          admin_notes?: string | null
          body_type_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          make_id?: string | null
          make_name?: string | null
          model_id?: string | null
          model_name?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_requests_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_requests_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_requests_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          vehicle_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status: string
          vehicle_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_status_history_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_statuses: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          slug?: string
        }
        Relationships: []
      }
      vehicle_videos: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          thumbnail_url: string | null
          url: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          thumbnail_url?: string | null
          url: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          thumbnail_url?: string | null
          url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_videos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_views: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          listing_id: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          listing_id: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          listing_id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_views_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          body_type_id: string | null
          chassis_number: string | null
          city_id: string | null
          color: string | null
          color_id: string | null
          condition_id: string | null
          created_at: string
          cylinders: number | null
          description: string | null
          description_ar: string | null
          district_id: string | null
          doors: number | null
          drivetrain_id: string | null
          engine_number: string | null
          engine_size: number | null
          fuel_type_id: string | null
          generation_id: string | null
          has_accident_history: boolean
          has_service_history: boolean
          horsepower: number | null
          id: string
          interior_color: string | null
          is_agency: boolean
          is_imported: boolean
          make_id: string | null
          mileage: number | null
          mileage_unit: string
          model_id: string | null
          org_id: string | null
          owner_id: string
          plate_number: string | null
          seats: number | null
          transmission_id: string | null
          trim_id: string | null
          updated_at: string
          vin: string | null
          warranty_months: number | null
          year: number | null
        }
        Insert: {
          body_type_id?: string | null
          chassis_number?: string | null
          city_id?: string | null
          color?: string | null
          color_id?: string | null
          condition_id?: string | null
          created_at?: string
          cylinders?: number | null
          description?: string | null
          description_ar?: string | null
          district_id?: string | null
          doors?: number | null
          drivetrain_id?: string | null
          engine_number?: string | null
          engine_size?: number | null
          fuel_type_id?: string | null
          generation_id?: string | null
          has_accident_history?: boolean
          has_service_history?: boolean
          horsepower?: number | null
          id?: string
          interior_color?: string | null
          is_agency?: boolean
          is_imported?: boolean
          make_id?: string | null
          mileage?: number | null
          mileage_unit?: string
          model_id?: string | null
          org_id?: string | null
          owner_id: string
          plate_number?: string | null
          seats?: number | null
          transmission_id?: string | null
          trim_id?: string | null
          updated_at?: string
          vin?: string | null
          warranty_months?: number | null
          year?: number | null
        }
        Update: {
          body_type_id?: string | null
          chassis_number?: string | null
          city_id?: string | null
          color?: string | null
          color_id?: string | null
          condition_id?: string | null
          created_at?: string
          cylinders?: number | null
          description?: string | null
          description_ar?: string | null
          district_id?: string | null
          doors?: number | null
          drivetrain_id?: string | null
          engine_number?: string | null
          engine_size?: number | null
          fuel_type_id?: string | null
          generation_id?: string | null
          has_accident_history?: boolean
          has_service_history?: boolean
          horsepower?: number | null
          id?: string
          interior_color?: string | null
          is_agency?: boolean
          is_imported?: boolean
          make_id?: string | null
          mileage?: number | null
          mileage_unit?: string
          model_id?: string | null
          org_id?: string | null
          owner_id?: string
          plate_number?: string | null
          seats?: number | null
          transmission_id?: string | null
          trim_id?: string | null
          updated_at?: string
          vin?: string | null
          warranty_months?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "car_colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_condition_id_fkey"
            columns: ["condition_id"]
            isOneToOne: false
            referencedRelation: "vehicle_condition_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_drivetrain_id_fkey"
            columns: ["drivetrain_id"]
            isOneToOne: false
            referencedRelation: "drivetrain_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_fuel_type_id_fkey"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "car_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_transmission_id_fkey"
            columns: ["transmission_id"]
            isOneToOne: false
            referencedRelation: "transmission_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "car_trims"
            referencedColumns: ["id"]
          },
        ]
      }
      viewing_appointments: {
        Row: {
          appointment_date: string
          created_at: string
          id: string
          listing_id: string
          location: string | null
          notes: string | null
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          id?: string
          listing_id: string
          location?: string | null
          notes?: string | null
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          id?: string
          listing_id?: string
          location?: string | null
          notes?: string | null
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_appointments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_accounts: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_contracts: {
        Row: {
          completed_at: string | null
          created_at: string
          dealer_id: string
          deposit_amount: number | null
          id: string
          offer_id: string
          request_id: string
          signed_at: string | null
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          dealer_id: string
          deposit_amount?: number | null
          id?: string
          offer_id: string
          request_id: string
          signed_at?: string | null
          status?: string
          supplier_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          dealer_id?: string
          deposit_amount?: number | null
          id?: string
          offer_id?: string
          request_id?: string
          signed_at?: string | null
          status?: string
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_contracts_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_contracts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "wholesale_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_contracts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "wholesale_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_offer_items: {
        Row: {
          description: string
          id: string
          notes: string | null
          offer_id: string
          quantity: number
          source_type: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          notes?: string | null
          offer_id: string
          quantity?: number
          source_type?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          notes?: string | null
          offer_id?: string
          quantity?: number
          source_type?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_offer_items_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "wholesale_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_offers: {
        Row: {
          created_at: string
          deposit_required: number | null
          estimated_delivery_days: number | null
          id: string
          notes: string | null
          offerer_id: string
          request_id: string
          status: string
          total_price: number
          updated_at: string
          validity_days: number | null
        }
        Insert: {
          created_at?: string
          deposit_required?: number | null
          estimated_delivery_days?: number | null
          id?: string
          notes?: string | null
          offerer_id: string
          request_id: string
          status?: string
          total_price: number
          updated_at?: string
          validity_days?: number | null
        }
        Update: {
          created_at?: string
          deposit_required?: number | null
          estimated_delivery_days?: number | null
          id?: string
          notes?: string | null
          offerer_id?: string
          request_id?: string
          status?: string
          total_price?: number
          updated_at?: string
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "wholesale_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_request_items: {
        Row: {
          color: string | null
          condition: string | null
          id: string
          make_id: string | null
          mileage_max: number | null
          model_id: string | null
          notes: string | null
          quantity: number
          request_id: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          color?: string | null
          condition?: string | null
          id?: string
          make_id?: string | null
          mileage_max?: number | null
          model_id?: string | null
          notes?: string | null
          quantity?: number
          request_id: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          color?: string | null
          condition?: string | null
          id?: string
          make_id?: string | null
          mileage_max?: number | null
          model_id?: string | null
          notes?: string | null
          quantity?: number
          request_id?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_request_items_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_request_items_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "wholesale_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          deadline: string | null
          dealer_id: string
          delivery_city_id: string | null
          description: string | null
          id: string
          notes: string | null
          org_id: string | null
          requester_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          deadline?: string | null
          dealer_id: string
          delivery_city_id?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          org_id?: string | null
          requester_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          deadline?: string | null
          dealer_id?: string
          delivery_city_id?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          org_id?: string | null
          requester_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_requests_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_requests_delivery_city_id_fkey"
            columns: ["delivery_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_requests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          offer_id: string | null
          request_id: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          offer_id?: string | null
          request_id?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          offer_id?: string | null
          request_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_status_history_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "wholesale_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "wholesale_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_org_permission: {
        Args: { org_id: string; permission_slug: string }
        Returns: boolean
      }
      has_permission: { Args: { permission_slug: string }; Returns: boolean }
      has_role: { Args: { role_slug: string }; Returns: boolean }
      is_org_member: { Args: { org_id: string }; Returns: boolean }
      is_org_role: {
        Args: { org_id: string; role_slug: string }
        Returns: boolean
      }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      org_member_status: "active" | "invited" | "suspended" | "left"
      org_status:
        | "pending_approval"
        | "active"
        | "suspended"
        | "rejected"
        | "closed"
      org_type:
        | "car_dealer"
        | "inspection_center"
        | "wholesale_vehicle_trader"
        | "spare_parts_supplier"
        | "finance_company"
        | "insurance_company"
        | "advertising_marketing_company"
        | "car_rental_company"
        | "product_shipping_company"
        | "vehicle_transport_company"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      org_member_status: ["active", "invited", "suspended", "left"],
      org_status: [
        "pending_approval",
        "active",
        "suspended",
        "rejected",
        "closed",
      ],
      org_type: [
        "car_dealer",
        "inspection_center",
        "wholesale_vehicle_trader",
        "spare_parts_supplier",
        "finance_company",
        "insurance_company",
        "advertising_marketing_company",
        "car_rental_company",
        "product_shipping_company",
        "vehicle_transport_company",
      ],
    },
  },
} as const

