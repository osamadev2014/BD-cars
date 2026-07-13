// Auto-generated from SQL migrations. Do not edit manually.
// Run: node scripts/generate-types.mjs

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
        id: string
        phone: string
        full_name: string
        avatar_url: string
        locale: string
        is_active: boolean
        created_at: string
        updated_at: string
        last_sign_in_at: string
        };
        Insert: Partial<{
        id: string
        phone: string
        full_name: string
        avatar_url: string
        locale: string
        is_active: boolean
        created_at: string
        updated_at: string
        last_sign_in_at: string
        }>;
        Update: Partial<{
        id: string
        phone: string
        full_name: string
        avatar_url: string
        locale: string
        is_active: boolean
        created_at: string
        updated_at: string
        last_sign_in_at: string
        }>;
      };
      roles: {
        Row: {
        id: string
        name: string
        slug: string
        description: string
        is_system: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        slug: string
        description: string
        is_system: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        slug: string
        description: string
        is_system: boolean
        created_at: string
        updated_at: string
        }>;
      };
      permissions: {
        Row: {
        id: string
        name: string
        slug: string
        group_name: string
        description: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        slug: string
        group_name: string
        description: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        slug: string
        group_name: string
        description: string
        created_at: string
        }>;
      };
      role_permissions: {
        Row: {
        id: string
        role_id: string
        permission_id: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        role_id: string
        permission_id: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        role_id: string
        permission_id: string
        created_at: string
        }>;
      };
      user_roles: {
        Row: {
        id: string
        user_id: string
        role_id: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        role_id: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        role_id: string
        created_at: string
        }>;
      };
      login_events: {
        Row: {
        id: string
        user_id: string
        phone: string
        event_type: string
        ip_address: string
        user_agent: string
        metadata: unknown
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        phone: string
        event_type: string
        ip_address: string
        user_agent: string
        metadata: unknown
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        phone: string
        event_type: string
        ip_address: string
        user_agent: string
        metadata: unknown
        created_at: string
        }>;
      };
      audit_logs: {
        Row: {
        id: string
        user_id: string
        action: string
        entity_type: string
        entity_id: string
        old_values: unknown
        new_values: unknown
        metadata: unknown
        ip_address: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        action: string
        entity_type: string
        entity_id: string
        old_values: unknown
        new_values: unknown
        metadata: unknown
        ip_address: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        action: string
        entity_type: string
        entity_id: string
        old_values: unknown
        new_values: unknown
        metadata: unknown
        ip_address: string
        created_at: string
        }>;
      };
      app_settings: {
        Row: {
        id: string
        category: string
        key: string
        value: unknown
        type: string
        label: string
        description: string
        is_public: boolean
        is_dangerous: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        category: string
        key: string
        value: unknown
        type: string
        label: string
        description: string
        is_public: boolean
        is_dangerous: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        category: string
        key: string
        value: unknown
        type: string
        label: string
        description: string
        is_public: boolean
        is_dangerous: boolean
        created_at: string
        updated_at: string
        }>;
      };
      settings_history: {
        Row: {
        id: string
        setting_id: string
        old_value: unknown
        new_value: unknown
        changed_by: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        setting_id: string
        old_value: unknown
        new_value: unknown
        changed_by: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        setting_id: string
        old_value: unknown
        new_value: unknown
        changed_by: string
        created_at: string
        }>;
      };
      staff_profiles: {
        Row: {
        id: string
        user_id: string
        employee_id: string
        department: string
        job_title: string
        is_active: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        employee_id: string
        department: string
        job_title: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        employee_id: string
        department: string
        job_title: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
      };
      countries: {
        Row: {
        id: string
        name: string
        name_ar: string
        code: string
        phone_code: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        code: string
        phone_code: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        code: string
        phone_code: string
        is_active: boolean
        created_at: string
        }>;
      };
      regions: {
        Row: {
        id: string
        country_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        country_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        country_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
      };
      cities: {
        Row: {
        id: string
        region_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        region_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        region_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
      };
      districts: {
        Row: {
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
      };
      locations: {
        Row: {
        id: string
        city_id: string
        district_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        city_id: string
        district_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        city_id: string
        district_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        created_at: string
        }>;
      };
      service_zones: {
        Row: {
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
      };
      body_types: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      fuel_types: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      transmission_types: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      drivetrain_types: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      car_colors: {
        Row: {
        id: string
        name: string
        name_ar: string
        hex_code: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        hex_code: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        hex_code: string
        slug: string
        created_at: string
        }>;
      };
      car_makes: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        country: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        country: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        country: string
        is_active: boolean
        created_at: string
        }>;
      };
      car_models: {
        Row: {
        id: string
        make_id: string
        name: string
        name_ar: string
        slug: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        make_id: string
        name: string
        name_ar: string
        slug: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        make_id: string
        name: string
        name_ar: string
        slug: string
        is_active: boolean
        created_at: string
        }>;
      };
      car_generations: {
        Row: {
        id: string
        model_id: string
        name: string
        name_ar: string
        year_start: number
        year_end: number
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        model_id: string
        name: string
        name_ar: string
        year_start: number
        year_end: number
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        model_id: string
        name: string
        name_ar: string
        year_start: number
        year_end: number
        slug: string
        created_at: string
        }>;
      };
      car_trims: {
        Row: {
        id: string
        generation_id: string
        model_id: string
        name: string
        name_ar: string
        slug: string
        engine_type: string
        engine_size: number
        horsepower: number
        fuel_type_id: string
        transmission_id: string
        drivetrain_id: string
        body_type_id: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        generation_id: string
        model_id: string
        name: string
        name_ar: string
        slug: string
        engine_type: string
        engine_size: number
        horsepower: number
        fuel_type_id: string
        transmission_id: string
        drivetrain_id: string
        body_type_id: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        generation_id: string
        model_id: string
        name: string
        name_ar: string
        slug: string
        engine_type: string
        engine_size: number
        horsepower: number
        fuel_type_id: string
        transmission_id: string
        drivetrain_id: string
        body_type_id: string
        is_active: boolean
        created_at: string
        }>;
      };
      car_specs: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      vehicle_condition_types: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      vehicle_statuses: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        created_at: string
        }>;
      };
      vehicles: {
        Row: {
        id: string
        owner_id: string
        make_id: string
        model_id: string
        trim_id: string
        generation_id: string
        year: number
        mileage: number
        mileage_unit: string
        color_id: string
        fuel_type_id: string
        transmission_id: string
        drivetrain_id: string
        body_type_id: string
        condition_id: string
        vin: string
        plate_number: string
        chassis_number: string
        engine_number: string
        cylinders: number
        horsepower: number
        engine_size: number
        doors: number
        seats: number
        color: string
        interior_color: string
        description: string
        description_ar: string
        city_id: string
        district_id: string
        is_imported: boolean
        is_agency: boolean
        has_accident_history: boolean
        has_service_history: boolean
        warranty_months: number
        org_id: string | null
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        owner_id: string
        make_id: string
        model_id: string
        trim_id: string
        generation_id: string
        year: number
        mileage: number
        mileage_unit: string
        color_id: string
        fuel_type_id: string
        transmission_id: string
        drivetrain_id: string
        body_type_id: string
        condition_id: string
        vin: string
        plate_number: string
        chassis_number: string
        engine_number: string
        cylinders: number
        horsepower: number
        engine_size: number
        doors: number
        seats: number
        color: string
        interior_color: string
        description: string
        description_ar: string
        city_id: string
        district_id: string
        is_imported: boolean
        is_agency: boolean
        has_accident_history: boolean
        has_service_history: boolean
        warranty_months: number
        org_id: string | null
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        owner_id: string
        make_id: string
        model_id: string
        trim_id: string
        generation_id: string
        year: number
        mileage: number
        mileage_unit: string
        color_id: string
        fuel_type_id: string
        transmission_id: string
        drivetrain_id: string
        body_type_id: string
        condition_id: string
        vin: string
        plate_number: string
        chassis_number: string
        engine_number: string
        cylinders: number
        horsepower: number
        engine_size: number
        doors: number
        seats: number
        color: string
        interior_color: string
        description: string
        description_ar: string
        city_id: string
        district_id: string
        is_imported: boolean
        is_agency: boolean
        has_accident_history: boolean
        has_service_history: boolean
        warranty_months: number
        org_id: string | null
        created_at: string
        updated_at: string
        }>;
      };
      vehicle_images: {
        Row: {
        id: string
        vehicle_id: string
        url: string
        thumbnail_url: string
        is_primary: boolean
        sort_order: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        vehicle_id: string
        url: string
        thumbnail_url: string
        is_primary: boolean
        sort_order: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        vehicle_id: string
        url: string
        thumbnail_url: string
        is_primary: boolean
        sort_order: number
        created_at: string
        }>;
      };
      vehicle_videos: {
        Row: {
        id: string
        vehicle_id: string
        url: string
        thumbnail_url: string
        sort_order: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        vehicle_id: string
        url: string
        thumbnail_url: string
        sort_order: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        vehicle_id: string
        url: string
        thumbnail_url: string
        sort_order: number
        created_at: string
        }>;
      };
      vehicle_documents: {
        Row: {
        id: string
        vehicle_id: string
        title: string
        file_url: string
        document_type: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        vehicle_id: string
        title: string
        file_url: string
        document_type: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        vehicle_id: string
        title: string
        file_url: string
        document_type: string
        created_at: string
        }>;
      };
      vehicle_status_history: {
        Row: {
        id: string
        vehicle_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        vehicle_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        vehicle_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      vehicle_price_history: {
        Row: {
        id: string
        vehicle_id: string
        old_price: number
        new_price: number
        changed_by: string
        reason: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        vehicle_id: string
        old_price: number
        new_price: number
        changed_by: string
        reason: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        vehicle_id: string
        old_price: number
        new_price: number
        changed_by: string
        reason: string
        created_at: string
        }>;
      };
      vehicle_listings: {
        Row: {
        id: string
        vehicle_id: string
        seller_id: string
        dealer_id: unknown
        org_id: string | null
        title: string
        title_ar: string
        slug: string
        description: string
        description_ar: string
        price: number
        original_price: number
        currency: string
        status: string
        seller_type: string
        is_featured: boolean
        featured_until: string
        is_instant_buy: boolean
        instant_buy_price: number
        has_inspection: boolean
        inspection_report_id: string
        is_auction: boolean
        is_wholesale: boolean
        is_dealer_only: boolean
        views_count: number
        inquiry_count: number
        favorite_count: number
        published_at: string
        expires_at: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        vehicle_id: string
        seller_id: string
        dealer_id: unknown
        org_id: string | null
        title: string
        title_ar: string
        slug: string
        description: string
        description_ar: string
        price: number
        original_price: number
        currency: string
        status: string
        seller_type: string
        is_featured: boolean
        featured_until: string
        is_instant_buy: boolean
        instant_buy_price: number
        has_inspection: boolean
        inspection_report_id: string
        is_auction: boolean
        is_wholesale: boolean
        is_dealer_only: boolean
        views_count: number
        inquiry_count: number
        favorite_count: number
        published_at: string
        expires_at: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        vehicle_id: string
        seller_id: string
        dealer_id: unknown
        org_id: string | null
        title: string
        title_ar: string
        slug: string
        description: string
        description_ar: string
        price: number
        original_price: number
        currency: string
        status: string
        seller_type: string
        is_featured: boolean
        featured_until: string
        is_instant_buy: boolean
        instant_buy_price: number
        has_inspection: boolean
        inspection_report_id: string
        is_auction: boolean
        is_wholesale: boolean
        is_dealer_only: boolean
        views_count: number
        inquiry_count: number
        favorite_count: number
        published_at: string
        expires_at: string
        created_at: string
        updated_at: string
        }>;
      };
      listing_status_history: {
        Row: {
        id: string
        listing_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      listing_approval_requests: {
        Row: {
        id: string
        listing_id: string
        requested_by: string
        status: string
        reviewed_by: string
        review_notes: string
        reviewed_at: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        requested_by: string
        status: string
        reviewed_by: string
        review_notes: string
        reviewed_at: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        requested_by: string
        status: string
        reviewed_by: string
        review_notes: string
        reviewed_at: string
        created_at: string
        }>;
      };
      listing_change_requests: {
        Row: {
        id: string
        listing_id: string
        requested_by: string
        changes: unknown
        status: string
        reviewed_by: string
        review_notes: string
        reviewed_at: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        requested_by: string
        changes: unknown
        status: string
        reviewed_by: string
        review_notes: string
        reviewed_at: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        requested_by: string
        changes: unknown
        status: string
        reviewed_by: string
        review_notes: string
        reviewed_at: string
        created_at: string
        }>;
      };
      vehicle_views: {
        Row: {
        id: string
        listing_id: string
        viewer_id: string
        ip_address: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        viewer_id: string
        ip_address: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        viewer_id: string
        ip_address: string
        created_at: string
        }>;
      };
      favorites: {
        Row: {
        id: string
        user_id: string
        listing_id: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        listing_id: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        listing_id: string
        created_at: string
        }>;
      };
      saved_searches: {
        Row: {
        id: string
        user_id: string
        name: string
        filters: unknown
        notify: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        name: string
        filters: unknown
        notify: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        name: string
        filters: unknown
        notify: boolean
        created_at: string
        updated_at: string
        }>;
      };
      saved_search_alerts: {
        Row: {
        id: string
        saved_search_id: string
        frequency: string
        last_sent_at: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        saved_search_id: string
        frequency: string
        last_sent_at: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        saved_search_id: string
        frequency: string
        last_sent_at: string
        is_active: boolean
        created_at: string
        }>;
      };
      vehicle_comparisons: {
        Row: {
        id: string
        user_id: string
        name: string
        listings: unknown
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        name: string
        listings: unknown
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        name: string
        listings: unknown
        created_at: string
        updated_at: string
        }>;
      };
      sell_requests: {
        Row: {
        id: string
        user_id: string
        vehicle_id: string
        status: string
        notes: string
        admin_notes: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        vehicle_id: string
        status: string
        notes: string
        admin_notes: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        vehicle_id: string
        status: string
        notes: string
        admin_notes: string
        created_at: string
        updated_at: string
        }>;
      };
      purchase_requests: {
        Row: {
        id: string
        listing_id: string
        buyer_id: string
        status: string
        message: string
        proposed_price: number
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        buyer_id: string
        status: string
        message: string
        proposed_price: number
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        buyer_id: string
        status: string
        message: string
        proposed_price: number
        created_at: string
        updated_at: string
        }>;
      };
      viewing_appointments: {
        Row: {
        id: string
        listing_id: string
        requester_id: string
        appointment_date: string
        location: string
        status: string
        notes: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        requester_id: string
        appointment_date: string
        location: string
        status: string
        notes: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        requester_id: string
        appointment_date: string
        location: string
        status: string
        notes: string
        created_at: string
        updated_at: string
        }>;
      };
      instant_buy_requests: {
        Row: {
        id: string
        listing_id: string
        buyer_id: string
        status: string
        payment_intent_id: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        buyer_id: string
        status: string
        payment_intent_id: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        buyer_id: string
        status: string
        payment_intent_id: string
        created_at: string
        updated_at: string
        }>;
      };
      customer_vehicle_requests: {
        Row: {
        id: string
        user_id: string
        make: string
        model: string
        year_from: number
        year_to: number
        budget_min: number
        budget_max: number
        description: string
        status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        make: string
        model: string
        year_from: number
        year_to: number
        budget_min: number
        budget_max: number
        description: string
        status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        make: string
        model: string
        year_from: number
        year_to: number
        budget_min: number
        budget_max: number
        description: string
        status: string
        created_at: string
        updated_at: string
        }>;
      };
      request_offers: {
        Row: {
        id: string
        request_id: string
        dealer_id: string
        offerer_id: string
        notes: string
        status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        dealer_id: string
        offerer_id: string
        notes: string
        status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        dealer_id: string
        offerer_id: string
        notes: string
        status: string
        created_at: string
        updated_at: string
        }>;
      };
      request_offer_items: {
        Row: {
        id: string
        offer_id: string
        listing_id: string
        description: string
        price: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        offer_id: string
        listing_id: string
        description: string
        price: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        offer_id: string
        listing_id: string
        description: string
        price: number
        created_at: string
        }>;
      };
      auctions: {
        Row: {
        id: string
        title: string
        title_ar: string
        slug: string
        auction_type: string
        status: string
        start_price: number
        reserve_price: number
        buy_now_price: number
        bid_increment: number
        participation_fee: number
        deposit_amount: number
        start_time: string
        end_time: string
        extended_duration_minutes: number
        seller_id: string
        dealer_id: string
        winner_id: string
        winning_bid: number
        commission_amount: number
        commission_percentage: number
        terms: string
        terms_ar: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        title: string
        title_ar: string
        slug: string
        auction_type: string
        status: string
        start_price: number
        reserve_price: number
        buy_now_price: number
        bid_increment: number
        participation_fee: number
        deposit_amount: number
        start_time: string
        end_time: string
        extended_duration_minutes: number
        seller_id: string
        dealer_id: string
        winner_id: string
        winning_bid: number
        commission_amount: number
        commission_percentage: number
        terms: string
        terms_ar: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        title: string
        title_ar: string
        slug: string
        auction_type: string
        status: string
        start_price: number
        reserve_price: number
        buy_now_price: number
        bid_increment: number
        participation_fee: number
        deposit_amount: number
        start_time: string
        end_time: string
        extended_duration_minutes: number
        seller_id: string
        dealer_id: string
        winner_id: string
        winning_bid: number
        commission_amount: number
        commission_percentage: number
        terms: string
        terms_ar: string
        created_at: string
        updated_at: string
        }>;
      };
      auction_vehicles: {
        Row: {
        id: string
        auction_id: string
        listing_id: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        auction_id: string
        listing_id: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        auction_id: string
        listing_id: string
        created_at: string
        }>;
      };
      auction_bids: {
        Row: {
        id: string
        auction_id: string
        bidder_id: string
        amount: number
        is_winning: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        auction_id: string
        bidder_id: string
        amount: number
        is_winning: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        auction_id: string
        bidder_id: string
        amount: number
        is_winning: boolean
        created_at: string
        }>;
      };
      auction_watchers: {
        Row: {
        id: string
        auction_id: string
        user_id: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        auction_id: string
        user_id: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        auction_id: string
        user_id: string
        created_at: string
        }>;
      };
      auction_rules: {
        Row: {
        id: string
        auction_id: string
        rule_key: string
        rule_value: unknown
        created_at: string
        };
        Insert: Partial<{
        id: string
        auction_id: string
        rule_key: string
        rule_value: unknown
        created_at: string
        }>;
        Update: Partial<{
        id: string
        auction_id: string
        rule_key: string
        rule_value: unknown
        created_at: string
        }>;
      };
      auction_results: {
        Row: {
        id: string
        auction_id: string
        winner_id: string
        winning_bid: number
        status: string
        payment_status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        auction_id: string
        winner_id: string
        winning_bid: number
        status: string
        payment_status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        auction_id: string
        winner_id: string
        winning_bid: number
        status: string
        payment_status: string
        created_at: string
        updated_at: string
        }>;
      };
      auction_status_history: {
        Row: {
        id: string
        auction_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        auction_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        auction_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      conversations: {
        Row: {
        id: string
        listing_id: string
        order_id: string
        part_request_id: string
        subject: string
        is_flagged: boolean
        is_moderated: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        order_id: string
        part_request_id: string
        subject: string
        is_flagged: boolean
        is_moderated: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        order_id: string
        part_request_id: string
        subject: string
        is_flagged: boolean
        is_moderated: boolean
        created_at: string
        updated_at: string
        }>;
      };
      conversation_participants: {
        Row: {
        id: string
        conversation_id: string
        user_id: string
        last_read_at: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        conversation_id: string
        user_id: string
        last_read_at: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        conversation_id: string
        user_id: string
        last_read_at: string
        is_active: boolean
        created_at: string
        }>;
      };
      messages: {
        Row: {
        id: string
        conversation_id: string
        sender_id: string
        content: string
        message_type: string
        is_edited: boolean
        is_deleted: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        conversation_id: string
        sender_id: string
        content: string
        message_type: string
        is_edited: boolean
        is_deleted: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        conversation_id: string
        sender_id: string
        content: string
        message_type: string
        is_edited: boolean
        is_deleted: boolean
        created_at: string
        updated_at: string
        }>;
      };
      message_attachments: {
        Row: {
        id: string
        message_id: string
        file_url: string
        file_type: string
        file_size: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        message_id: string
        file_url: string
        file_type: string
        file_size: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        message_id: string
        file_url: string
        file_type: string
        file_size: number
        created_at: string
        }>;
      };
      message_read_receipts: {
        Row: {
        id: string
        message_id: string
        user_id: string
        read_at: string
        };
        Insert: Partial<{
        id: string
        message_id: string
        user_id: string
        read_at: string
        }>;
        Update: Partial<{
        id: string
        message_id: string
        user_id: string
        read_at: string
        }>;
      };
      moderation_flags: {
        Row: {
        id: string
        message_id: string
        conversation_id: string
        flagged_by: string
        reason: string
        status: string
        resolved_by: string
        resolved_at: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        message_id: string
        conversation_id: string
        flagged_by: string
        reason: string
        status: string
        resolved_by: string
        resolved_at: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        message_id: string
        conversation_id: string
        flagged_by: string
        reason: string
        status: string
        resolved_by: string
        resolved_at: string
        created_at: string
        }>;
      };
      inspection_centers: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        cover_url: string
        phone: string
        email: string
        website: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        revenue_share_percentage: number
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        cover_url: string
        phone: string
        email: string
        website: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        revenue_share_percentage: number
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        cover_url: string
        phone: string
        email: string
        website: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        revenue_share_percentage: number
        created_at: string
        updated_at: string
        }>;
      };
      inspection_center_branches: {
        Row: {
        id: string
        center_id: string
        name: string
        name_ar: string
        phone: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        center_id: string
        name: string
        name_ar: string
        phone: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        center_id: string
        name: string
        name_ar: string
        phone: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        created_at: string
        }>;
      };
      inspection_center_users: {
        Row: {
        id: string
        center_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        center_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        center_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
      };
      inspection_services: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        default_price: number
        duration_minutes: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        default_price: number
        duration_minutes: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        default_price: number
        duration_minutes: number
        is_active: boolean
        created_at: string
        }>;
      };
      inspection_service_pricing: {
        Row: {
        id: string
        service_id: string
        center_id: string
        city_id: string
        car_make_id: string
        price: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        service_id: string
        center_id: string
        city_id: string
        car_make_id: string
        price: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        service_id: string
        center_id: string
        city_id: string
        car_make_id: string
        price: number
        is_active: boolean
        created_at: string
        }>;
      };
      inspection_appointments: {
        Row: {
        id: string
        listing_id: string
        vehicle_id: string
        center_id: string
        branch_id: string
        service_id: string
        customer_id: string
        appointment_date: string
        status: string
        notes: string
        price: number
        payment_status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        vehicle_id: string
        center_id: string
        branch_id: string
        service_id: string
        customer_id: string
        appointment_date: string
        status: string
        notes: string
        price: number
        payment_status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        vehicle_id: string
        center_id: string
        branch_id: string
        service_id: string
        customer_id: string
        appointment_date: string
        status: string
        notes: string
        price: number
        payment_status: string
        created_at: string
        updated_at: string
        }>;
      };
      inspection_reports: {
        Row: {
        id: string
        appointment_id: string
        listing_id: string
        vehicle_id: string
        inspector_id: string
        score: number
        max_score: number
        status: string
        outcome: string
        summary: string
        summary_ar: string
        recommendation: string
        recommendation_ar: string
        estimated_repair_cost: number
        is_public: boolean
        admin_approved: boolean
        approved_by: string
        approved_at: string
        share_token: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        appointment_id: string
        listing_id: string
        vehicle_id: string
        inspector_id: string
        score: number
        max_score: number
        status: string
        outcome: string
        summary: string
        summary_ar: string
        recommendation: string
        recommendation_ar: string
        estimated_repair_cost: number
        is_public: boolean
        admin_approved: boolean
        approved_by: string
        approved_at: string
        share_token: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        appointment_id: string
        listing_id: string
        vehicle_id: string
        inspector_id: string
        score: number
        max_score: number
        status: string
        outcome: string
        summary: string
        summary_ar: string
        recommendation: string
        recommendation_ar: string
        estimated_repair_cost: number
        is_public: boolean
        admin_approved: boolean
        approved_by: string
        approved_at: string
        share_token: string
        created_at: string
        updated_at: string
        }>;
      };
      inspection_report_sections: {
        Row: {
        id: string
        report_id: string
        name: string
        name_ar: string
        slug: string
        score: number
        max_score: number
        sort_order: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        report_id: string
        name: string
        name_ar: string
        slug: string
        score: number
        max_score: number
        sort_order: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        report_id: string
        name: string
        name_ar: string
        slug: string
        score: number
        max_score: number
        sort_order: number
        created_at: string
        }>;
      };
      inspection_report_items: {
        Row: {
        id: string
        section_id: string
        name: string
        name_ar: string
        status: string
        score: number
        notes: string
        notes_ar: string
        severity: string
        estimated_repair_cost: number
        sort_order: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        section_id: string
        name: string
        name_ar: string
        status: string
        score: number
        notes: string
        notes_ar: string
        severity: string
        estimated_repair_cost: number
        sort_order: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        section_id: string
        name: string
        name_ar: string
        status: string
        score: number
        notes: string
        notes_ar: string
        severity: string
        estimated_repair_cost: number
        sort_order: number
        created_at: string
        }>;
      };
      inspection_media: {
        Row: {
        id: string
        report_id: string
        section_id: string
        item_id: string
        url: string
        thumbnail_url: string
        media_type: string
        caption: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        report_id: string
        section_id: string
        item_id: string
        url: string
        thumbnail_url: string
        media_type: string
        caption: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        report_id: string
        section_id: string
        item_id: string
        url: string
        thumbnail_url: string
        media_type: string
        caption: string
        created_at: string
        }>;
      };
      inspection_defects: {
        Row: {
        id: string
        report_id: string
        item_id: string
        name: string
        name_ar: string
        severity: string
        description: string
        description_ar: string
        estimated_repair_cost: number
        position_x: number
        position_y: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        report_id: string
        item_id: string
        name: string
        name_ar: string
        severity: string
        description: string
        description_ar: string
        estimated_repair_cost: number
        position_x: number
        position_y: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        report_id: string
        item_id: string
        name: string
        name_ar: string
        severity: string
        description: string
        description_ar: string
        estimated_repair_cost: number
        position_x: number
        position_y: number
        created_at: string
        }>;
      };
      inspection_status_history: {
        Row: {
        id: string
        report_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        report_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        report_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      inspection_report_approval_history: {
        Row: {
        id: string
        report_id: string
        action: string
        performed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        report_id: string
        action: string
        performed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        report_id: string
        action: string
        performed_by: string
        notes: string
        created_at: string
        }>;
      };
      inspection_revenue_shares: {
        Row: {
        id: string
        appointment_id: string
        center_id: string
        total_amount: number
        center_share: number
        ryon_share: number
        share_percentage: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        appointment_id: string
        center_id: string
        total_amount: number
        center_share: number
        ryon_share: number
        share_percentage: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        appointment_id: string
        center_id: string
        total_amount: number
        center_share: number
        ryon_share: number
        share_percentage: number
        created_at: string
        }>;
      };
      dealers: {
        Row: {
        id: string
        owner_id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        cover_url: string
        phone: string
        email: string
        website: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        is_approved: boolean
        rating: number
        review_count: number
        trust_badge: string
        org_id: string | null
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        owner_id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        cover_url: string
        phone: string
        email: string
        website: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        is_approved: boolean
        rating: number
        review_count: number
        trust_badge: string
        org_id: string | null
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        owner_id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        cover_url: string
        phone: string
        email: string
        website: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        is_approved: boolean
        rating: number
        review_count: number
        trust_badge: string
        org_id: string | null
        created_at: string
        updated_at: string
        }>;
      };
      dealer_branches: {
        Row: {
        id: string
        dealer_id: string
        name: string
        name_ar: string
        phone: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        name: string
        name_ar: string
        phone: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        name: string
        name_ar: string
        phone: string
        city_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        is_active: boolean
        created_at: string
        }>;
      };
      dealer_users: {
        Row: {
        id: string
        dealer_id: string
        user_id: string
        role: string
        permissions: unknown
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        user_id: string
        role: string
        permissions: unknown
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        user_id: string
        role: string
        permissions: unknown
        is_active: boolean
        created_at: string
        }>;
      };
      dealer_subscription_plans: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        price_monthly: number
        price_yearly: number
        max_listings: number
        max_staff: number
        max_branches: number
        has_analytics: boolean
        has_wholesale: boolean
        has_auctions: boolean
        has_parts: boolean
        has_delivery: boolean
        has_featured: boolean
        has_api: boolean
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        price_monthly: number
        price_yearly: number
        max_listings: number
        max_staff: number
        max_branches: number
        has_analytics: boolean
        has_wholesale: boolean
        has_auctions: boolean
        has_parts: boolean
        has_delivery: boolean
        has_featured: boolean
        has_api: boolean
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        price_monthly: number
        price_yearly: number
        max_listings: number
        max_staff: number
        max_branches: number
        has_analytics: boolean
        has_wholesale: boolean
        has_auctions: boolean
        has_parts: boolean
        has_delivery: boolean
        has_featured: boolean
        has_api: boolean
        is_active: boolean
        created_at: string
        }>;
      };
      dealer_subscriptions: {
        Row: {
        id: string
        dealer_id: string
        plan_id: string
        status: string
        start_date: string
        end_date: string
        auto_renew: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        plan_id: string
        status: string
        start_date: string
        end_date: string
        auto_renew: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        plan_id: string
        status: string
        start_date: string
        end_date: string
        auto_renew: boolean
        created_at: string
        updated_at: string
        }>;
      };
      dealer_pages: {
        Row: {
        id: string
        dealer_id: string
        about: string
        about_ar: string
        working_hours: unknown
        services: unknown
        social_links: unknown
        seo_title: string
        seo_description: string
        is_published: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        about: string
        about_ar: string
        working_hours: unknown
        services: unknown
        social_links: unknown
        seo_title: string
        seo_description: string
        is_published: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        about: string
        about_ar: string
        working_hours: unknown
        services: unknown
        social_links: unknown
        seo_title: string
        seo_description: string
        is_published: boolean
        created_at: string
        updated_at: string
        }>;
      };
      dealer_inventory: {
        Row: {
        id: string
        dealer_id: string
        listing_id: string
        stock_number: string
        purchase_price: number
        status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        listing_id: string
        stock_number: string
        purchase_price: number
        status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        listing_id: string
        stock_number: string
        purchase_price: number
        status: string
        created_at: string
        updated_at: string
        }>;
      };
      dealer_financial_rules: {
        Row: {
        id: string
        dealer_id: string
        commission_percentage: number
        commission_fixed: number
        deposit_percentage: number
        payment_terms: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        commission_percentage: number
        commission_fixed: number
        deposit_percentage: number
        payment_terms: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        commission_percentage: number
        commission_fixed: number
        deposit_percentage: number
        payment_terms: string
        created_at: string
        updated_at: string
        }>;
      };
      dealer_stats: {
        Row: {
        id: string
        dealer_id: string
        date: string
        listings_count: number
        views_count: number
        inquiries_count: number
        sales_count: number
        revenue: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        date: string
        listings_count: number
        views_count: number
        inquiries_count: number
        sales_count: number
        revenue: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        date: string
        listings_count: number
        views_count: number
        inquiries_count: number
        sales_count: number
        revenue: number
        created_at: string
        }>;
      };
      dealer_ratings: {
        Row: {
        id: string
        dealer_id: string
        user_id: string
        rating: number
        review: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        user_id: string
        rating: number
        review: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        user_id: string
        rating: number
        review: string
        created_at: string
        }>;
      };
      dealer_trust_badges: {
        Row: {
        id: string
        dealer_id: string
        badge_type: string
        issued_at: string
        expires_at: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        badge_type: string
        issued_at: string
        expires_at: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        badge_type: string
        issued_at: string
        expires_at: string
        is_active: boolean
        created_at: string
        }>;
      };
      wholesale_requests: {
        Row: {
        id: string
        dealer_id: string
        requester_id: string
        title: string
        description: string
        status: string
        budget_min: number
        budget_max: number
        deadline: string
        delivery_city_id: string
        notes: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        dealer_id: string
        requester_id: string
        title: string
        description: string
        status: string
        budget_min: number
        budget_max: number
        deadline: string
        delivery_city_id: string
        notes: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        dealer_id: string
        requester_id: string
        title: string
        description: string
        status: string
        budget_min: number
        budget_max: number
        deadline: string
        delivery_city_id: string
        notes: string
        created_at: string
        updated_at: string
        }>;
      };
      wholesale_request_items: {
        Row: {
        id: string
        request_id: string
        make_id: string
        model_id: string
        year_from: number
        year_to: number
        quantity: number
        condition: string
        mileage_max: number
        color: string
        notes: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        make_id: string
        model_id: string
        year_from: number
        year_to: number
        quantity: number
        condition: string
        mileage_max: number
        color: string
        notes: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        make_id: string
        model_id: string
        year_from: number
        year_to: number
        quantity: number
        condition: string
        mileage_max: number
        color: string
        notes: string
        }>;
      };
      wholesale_offers: {
        Row: {
        id: string
        request_id: string
        offerer_id: string
        notes: string
        total_price: number
        validity_days: number
        deposit_required: number
        estimated_delivery_days: number
        status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        offerer_id: string
        notes: string
        total_price: number
        validity_days: number
        deposit_required: number
        estimated_delivery_days: number
        status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        offerer_id: string
        notes: string
        total_price: number
        validity_days: number
        deposit_required: number
        estimated_delivery_days: number
        status: string
        created_at: string
        updated_at: string
        }>;
      };
      wholesale_offer_items: {
        Row: {
        id: string
        offer_id: string
        description: string
        quantity: number
        unit_price: number
        total_price: number
        source_type: string
        notes: string
        };
        Insert: Partial<{
        id: string
        offer_id: string
        description: string
        quantity: number
        unit_price: number
        total_price: number
        source_type: string
        notes: string
        }>;
        Update: Partial<{
        id: string
        offer_id: string
        description: string
        quantity: number
        unit_price: number
        total_price: number
        source_type: string
        notes: string
        }>;
      };
      wholesale_contracts: {
        Row: {
        id: string
        request_id: string
        offer_id: string
        dealer_id: string
        supplier_id: string
        total_amount: number
        deposit_amount: number
        status: string
        signed_at: string
        completed_at: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        offer_id: string
        dealer_id: string
        supplier_id: string
        total_amount: number
        deposit_amount: number
        status: string
        signed_at: string
        completed_at: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        offer_id: string
        dealer_id: string
        supplier_id: string
        total_amount: number
        deposit_amount: number
        status: string
        signed_at: string
        completed_at: string
        created_at: string
        updated_at: string
        }>;
      };
      wholesale_status_history: {
        Row: {
        id: string
        request_id: string
        offer_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        offer_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        offer_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      finance_partners: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        description: string
        description_ar: string
        is_active: boolean
        revenue_model: string
        revenue_per_lead: number
        revenue_percentage: number
        revenue_per_approved: number
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        description: string
        description_ar: string
        is_active: boolean
        revenue_model: string
        revenue_per_lead: number
        revenue_percentage: number
        revenue_per_approved: number
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        description: string
        description_ar: string
        is_active: boolean
        revenue_model: string
        revenue_per_lead: number
        revenue_percentage: number
        revenue_per_approved: number
        created_at: string
        updated_at: string
        }>;
      };
      finance_partner_users: {
        Row: {
        id: string
        partner_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        partner_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        partner_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
      };
      finance_requests: {
        Row: {
        id: string
        listing_id: string
        customer_id: string
        partner_id: string
        vehicle_price: number
        down_payment: number
        requested_amount: number
        status: string
        notes: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        customer_id: string
        partner_id: string
        vehicle_price: number
        down_payment: number
        requested_amount: number
        status: string
        notes: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        customer_id: string
        partner_id: string
        vehicle_price: number
        down_payment: number
        requested_amount: number
        status: string
        notes: string
        created_at: string
        updated_at: string
        }>;
      };
      finance_offers: {
        Row: {
        id: string
        request_id: string
        partner_id: string
        monthly_payment: number
        interest_rate: number
        term_months: number
        approved_amount: number
        status: string
        notes: string
        valid_until: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        partner_id: string
        monthly_payment: number
        interest_rate: number
        term_months: number
        approved_amount: number
        status: string
        notes: string
        valid_until: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        partner_id: string
        monthly_payment: number
        interest_rate: number
        term_months: number
        approved_amount: number
        status: string
        notes: string
        valid_until: string
        created_at: string
        updated_at: string
        }>;
      };
      finance_status_history: {
        Row: {
        id: string
        request_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      insurance_partners: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        description: string
        description_ar: string
        is_active: boolean
        revenue_model: string
        revenue_per_lead: number
        revenue_percentage: number
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        description: string
        description_ar: string
        is_active: boolean
        revenue_model: string
        revenue_per_lead: number
        revenue_percentage: number
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        description: string
        description_ar: string
        is_active: boolean
        revenue_model: string
        revenue_per_lead: number
        revenue_percentage: number
        created_at: string
        updated_at: string
        }>;
      };
      insurance_partner_users: {
        Row: {
        id: string
        partner_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        partner_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        partner_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
      };
      insurance_requests: {
        Row: {
        id: string
        listing_id: string
        customer_id: string
        partner_id: string
        vehicle_price: number
        insurance_type: string
        status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        listing_id: string
        customer_id: string
        partner_id: string
        vehicle_price: number
        insurance_type: string
        status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        listing_id: string
        customer_id: string
        partner_id: string
        vehicle_price: number
        insurance_type: string
        status: string
        created_at: string
        updated_at: string
        }>;
      };
      insurance_offers: {
        Row: {
        id: string
        request_id: string
        partner_id: string
        premium: number
        coverage_details: unknown
        status: string
        valid_until: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        partner_id: string
        premium: number
        coverage_details: unknown
        status: string
        valid_until: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        partner_id: string
        premium: number
        coverage_details: unknown
        status: string
        valid_until: string
        created_at: string
        updated_at: string
        }>;
      };
      advertisers: {
        Row: {
        id: string
        name: string
        slug: string
        logo_url: string
        is_active: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        slug: string
        logo_url: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        slug: string
        logo_url: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
      };
      advertiser_users: {
        Row: {
        id: string
        advertiser_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        advertiser_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        advertiser_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
      };
      ad_campaigns: {
        Row: {
        id: string
        advertiser_id: string
        name: string
        type: string
        placement: string
        budget: number
        spent: number
        start_date: string
        end_date: string
        status: string
        media_url: string
        target_url: string
        impressions_target: number
        clicks_target: number
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        advertiser_id: string
        name: string
        type: string
        placement: string
        budget: number
        spent: number
        start_date: string
        end_date: string
        status: string
        media_url: string
        target_url: string
        impressions_target: number
        clicks_target: number
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        advertiser_id: string
        name: string
        type: string
        placement: string
        budget: number
        spent: number
        start_date: string
        end_date: string
        status: string
        media_url: string
        target_url: string
        impressions_target: number
        clicks_target: number
        created_at: string
        updated_at: string
        }>;
      };
      ad_placements: {
        Row: {
        id: string
        name: string
        slug: string
        description: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        slug: string
        description: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        slug: string
        description: string
        is_active: boolean
        created_at: string
        }>;
      };
      ad_impressions: {
        Row: {
        id: string
        campaign_id: string
        viewed_at: string
        ip_address: string
        user_agent: string
        };
        Insert: Partial<{
        id: string
        campaign_id: string
        viewed_at: string
        ip_address: string
        user_agent: string
        }>;
        Update: Partial<{
        id: string
        campaign_id: string
        viewed_at: string
        ip_address: string
        user_agent: string
        }>;
      };
      ad_clicks: {
        Row: {
        id: string
        campaign_id: string
        clicked_at: string
        ip_address: string
        user_agent: string
        };
        Insert: Partial<{
        id: string
        campaign_id: string
        clicked_at: string
        ip_address: string
        user_agent: string
        }>;
        Update: Partial<{
        id: string
        campaign_id: string
        clicked_at: string
        ip_address: string
        user_agent: string
        }>;
      };
      sponsorship_packages: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        price: number
        duration_days: number
        description: string
        features: unknown
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        price: number
        duration_days: number
        description: string
        features: unknown
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        price: number
        duration_days: number
        description: string
        features: unknown
        is_active: boolean
        created_at: string
        }>;
      };
      part_categories: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        parent_id: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        parent_id: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        parent_id: string
        is_active: boolean
        created_at: string
        }>;
      };
      part_brands: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        is_active: boolean
        created_at: string
        }>;
      };
      spare_parts: {
        Row: {
        id: string
        title: string
        title_ar: string
        slug: string
        category_id: string
        brand_id: string
        part_number: string
        oem_number: string
        description: string
        description_ar: string
        condition: string
        part_type: string
        price: number
        currency: string
        stock_quantity: number
        stock_status: string
        min_order_quantity: number
        warranty_months: number
        return_days: number
        is_active: boolean
        is_approved: boolean
        city_id: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        title: string
        title_ar: string
        slug: string
        category_id: string
        brand_id: string
        part_number: string
        oem_number: string
        description: string
        description_ar: string
        condition: string
        part_type: string
        price: number
        currency: string
        stock_quantity: number
        stock_status: string
        min_order_quantity: number
        warranty_months: number
        return_days: number
        is_active: boolean
        is_approved: boolean
        city_id: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        title: string
        title_ar: string
        slug: string
        category_id: string
        brand_id: string
        part_number: string
        oem_number: string
        description: string
        description_ar: string
        condition: string
        part_type: string
        price: number
        currency: string
        stock_quantity: number
        stock_status: string
        min_order_quantity: number
        warranty_months: number
        return_days: number
        is_active: boolean
        is_approved: boolean
        city_id: string
        created_at: string
        updated_at: string
        }>;
      };
      spare_part_images: {
        Row: {
        id: string
        part_id: string
        url: string
        thumbnail_url: string
        is_primary: boolean
        sort_order: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        part_id: string
        url: string
        thumbnail_url: string
        is_primary: boolean
        sort_order: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        part_id: string
        url: string
        thumbnail_url: string
        is_primary: boolean
        sort_order: number
        created_at: string
        }>;
      };
      spare_part_compatibility: {
        Row: {
        id: string
        part_id: string
        make_id: string
        model_id: string
        year_from: number
        year_to: number
        engine_type: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        part_id: string
        make_id: string
        model_id: string
        year_from: number
        year_to: number
        engine_type: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        part_id: string
        make_id: string
        model_id: string
        year_from: number
        year_to: number
        engine_type: string
        notes: string
        created_at: string
        }>;
      };
      spare_part_inventory: {
        Row: {
        id: string
        part_id: string
        supplier_id: string
        quantity: number
        location: string
        batch_number: string
        expiry_date: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        part_id: string
        supplier_id: string
        quantity: number
        location: string
        batch_number: string
        expiry_date: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        part_id: string
        supplier_id: string
        quantity: number
        location: string
        batch_number: string
        expiry_date: string
        created_at: string
        updated_at: string
        }>;
      };
      spare_part_suppliers: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        phone: string
        email: string
        city_id: string
        is_active: boolean
        is_approved: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        phone: string
        email: string
        city_id: string
        is_active: boolean
        is_approved: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        description_ar: string
        logo_url: string
        phone: string
        email: string
        city_id: string
        is_active: boolean
        is_approved: boolean
        created_at: string
        updated_at: string
        }>;
      };
      spare_part_supplier_users: {
        Row: {
        id: string
        supplier_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        supplier_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        supplier_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
      };
      spare_part_requests: {
        Row: {
        id: string
        customer_id: string
        make: string
        model: string
        year: number
        trim: string
        vin: string
        plate_number: string
        part_name: string
        category_id: string
        part_number: string
        oem_number: string
        description: string
        urgency: string
        city_id: string
        delivery_address_id: string
        budget_min: number
        budget_max: number
        status: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        customer_id: string
        make: string
        model: string
        year: number
        trim: string
        vin: string
        plate_number: string
        part_name: string
        category_id: string
        part_number: string
        oem_number: string
        description: string
        urgency: string
        city_id: string
        delivery_address_id: string
        budget_min: number
        budget_max: number
        status: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        customer_id: string
        make: string
        model: string
        year: number
        trim: string
        vin: string
        plate_number: string
        part_name: string
        category_id: string
        part_number: string
        oem_number: string
        description: string
        urgency: string
        city_id: string
        delivery_address_id: string
        budget_min: number
        budget_max: number
        status: string
        created_at: string
        updated_at: string
        }>;
      };
      spare_part_request_items: {
        Row: {
        id: string
        request_id: string
        part_id: string
        quantity: number
        notes: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        part_id: string
        quantity: number
        notes: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        part_id: string
        quantity: number
        notes: string
        }>;
      };
      spare_part_quotes: {
        Row: {
        id: string
        request_id: string
        supplier_id: string
        dealer_id: string
        quoted_by: string
        price: number
        delivery_fee: number
        total_price: number
        availability: string
        estimated_delivery_days: number
        warranty_months: number
        notes: string
        status: string
        valid_until: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        supplier_id: string
        dealer_id: string
        quoted_by: string
        price: number
        delivery_fee: number
        total_price: number
        availability: string
        estimated_delivery_days: number
        warranty_months: number
        notes: string
        status: string
        valid_until: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        supplier_id: string
        dealer_id: string
        quoted_by: string
        price: number
        delivery_fee: number
        total_price: number
        availability: string
        estimated_delivery_days: number
        warranty_months: number
        notes: string
        status: string
        valid_until: string
        created_at: string
        updated_at: string
        }>;
      };
      spare_part_orders: {
        Row: {
        id: string
        request_id: string
        quote_id: string
        customer_id: string
        supplier_id: string
        total_amount: number
        delivery_fee: number
        vat_amount: number
        grand_total: number
        status: string
        payment_status: string
        notes: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        quote_id: string
        customer_id: string
        supplier_id: string
        total_amount: number
        delivery_fee: number
        vat_amount: number
        grand_total: number
        status: string
        payment_status: string
        notes: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        quote_id: string
        customer_id: string
        supplier_id: string
        total_amount: number
        delivery_fee: number
        vat_amount: number
        grand_total: number
        status: string
        payment_status: string
        notes: string
        created_at: string
        updated_at: string
        }>;
      };
      spare_part_order_items: {
        Row: {
        id: string
        order_id: string
        part_id: string
        description: string
        quantity: number
        unit_price: number
        total_price: number
        };
        Insert: Partial<{
        id: string
        order_id: string
        part_id: string
        description: string
        quantity: number
        unit_price: number
        total_price: number
        }>;
        Update: Partial<{
        id: string
        order_id: string
        part_id: string
        description: string
        quantity: number
        unit_price: number
        total_price: number
        }>;
      };
      spare_part_status_history: {
        Row: {
        id: string
        request_id: string
        order_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        request_id: string
        order_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        request_id: string
        order_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      delivery_providers: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        phone: string
        email: string
        website: string
        is_active: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        phone: string
        email: string
        website: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        logo_url: string
        phone: string
        email: string
        website: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
      };
      delivery_provider_users: {
        Row: {
        id: string
        provider_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        provider_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        provider_id: string
        user_id: string
        role: string
        is_active: boolean
        created_at: string
        }>;
      };
      delivery_zones: {
        Row: {
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        city_id: string
        name: string
        name_ar: string
        is_active: boolean
        created_at: string
        }>;
      };
      delivery_methods: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        estimated_days_min: number
        estimated_days_max: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        estimated_days_min: number
        estimated_days_max: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        description: string
        estimated_days_min: number
        estimated_days_max: number
        is_active: boolean
        created_at: string
        }>;
      };
      delivery_pricing_rules: {
        Row: {
        id: string
        provider_id: string
        zone_id: string
        method_id: string
        base_fee: number
        fee_per_km: number
        free_threshold: number
        weight_fee_per_kg: number
        min_fee: number
        max_fee: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        provider_id: string
        zone_id: string
        method_id: string
        base_fee: number
        fee_per_km: number
        free_threshold: number
        weight_fee_per_kg: number
        min_fee: number
        max_fee: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        provider_id: string
        zone_id: string
        method_id: string
        base_fee: number
        fee_per_km: number
        free_threshold: number
        weight_fee_per_kg: number
        min_fee: number
        max_fee: number
        is_active: boolean
        created_at: string
        }>;
      };
      delivery_addresses: {
        Row: {
        id: string
        user_id: string
        label: string
        city_id: string
        district_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        phone: string
        is_default: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        label: string
        city_id: string
        district_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        phone: string
        is_default: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        label: string
        city_id: string
        district_id: string
        address: string
        address_ar: string
        latitude: number
        longitude: number
        phone: string
        is_default: boolean
        created_at: string
        updated_at: string
        }>;
      };
      delivery_orders: {
        Row: {
        id: string
        order_id: unknown
        order_type: string
        provider_id: string
        method_id: string
        pickup_address_id: string
        delivery_address_id: string
        status: string
        tracking_number: string
        estimated_delivery_date: string
        actual_delivery_date: string
        delivery_fee: number
        notes: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        order_id: unknown
        order_type: string
        provider_id: string
        method_id: string
        pickup_address_id: string
        delivery_address_id: string
        status: string
        tracking_number: string
        estimated_delivery_date: string
        actual_delivery_date: string
        delivery_fee: number
        notes: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        order_id: unknown
        order_type: string
        provider_id: string
        method_id: string
        pickup_address_id: string
        delivery_address_id: string
        status: string
        tracking_number: string
        estimated_delivery_date: string
        actual_delivery_date: string
        delivery_fee: number
        notes: string
        created_at: string
        updated_at: string
        }>;
      };
      delivery_tracking_events: {
        Row: {
        id: string
        delivery_order_id: string
        status: string
        location: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        delivery_order_id: string
        status: string
        location: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        delivery_order_id: string
        status: string
        location: string
        notes: string
        created_at: string
        }>;
      };
      delivery_status_history: {
        Row: {
        id: string
        delivery_order_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        delivery_order_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        delivery_order_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      payment_providers: {
        Row: {
        id: string
        name: string
        slug: string
        is_active: boolean
        is_sandbox: boolean
        config: unknown
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        slug: string
        is_active: boolean
        is_sandbox: boolean
        config: unknown
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        slug: string
        is_active: boolean
        is_sandbox: boolean
        config: unknown
        created_at: string
        updated_at: string
        }>;
      };
      payment_methods: {
        Row: {
        id: string
        name: string
        name_ar: string
        slug: string
        provider_id: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        provider_id: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        name: string
        name_ar: string
        slug: string
        provider_id: string
        is_active: boolean
        created_at: string
        }>;
      };
      payment_transactions: {
        Row: {
        id: string
        user_id: string
        payment_method_id: string
        amount: number
        fee_amount: number
        vat_amount: number
        total_amount: number
        currency: string
        status: string
        reference_id: unknown
        description: string
        entity_type: string
        entity_id: string
        metadata: unknown
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        payment_method_id: string
        amount: number
        fee_amount: number
        vat_amount: number
        total_amount: number
        currency: string
        status: string
        reference_id: unknown
        description: string
        entity_type: string
        entity_id: string
        metadata: unknown
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        payment_method_id: string
        amount: number
        fee_amount: number
        vat_amount: number
        total_amount: number
        currency: string
        status: string
        reference_id: unknown
        description: string
        entity_type: string
        entity_id: string
        metadata: unknown
        created_at: string
        updated_at: string
        }>;
      };
      payment_status_history: {
        Row: {
        id: string
        transaction_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        transaction_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        transaction_id: string
        status: string
        changed_by: string
        notes: string
        created_at: string
        }>;
      };
      wallet_accounts: {
        Row: {
        id: string
        user_id: string
        balance: number
        currency: string
        is_active: boolean
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        balance: number
        currency: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        balance: number
        currency: string
        is_active: boolean
        created_at: string
        updated_at: string
        }>;
      };
      wallet_transactions: {
        Row: {
        id: string
        wallet_id: string
        transaction_type: string
        amount: number
        balance_before: number
        balance_after: number
        reference_type: string
        reference_id: string
        description: string
        metadata: unknown
        created_at: string
        };
        Insert: Partial<{
        id: string
        wallet_id: string
        transaction_type: string
        amount: number
        balance_before: number
        balance_after: number
        reference_type: string
        reference_id: string
        description: string
        metadata: unknown
        created_at: string
        }>;
        Update: Partial<{
        id: string
        wallet_id: string
        transaction_type: string
        amount: number
        balance_before: number
        balance_after: number
        reference_type: string
        reference_id: string
        description: string
        metadata: unknown
        created_at: string
        }>;
      };
      invoices: {
        Row: {
        id: string
        invoice_number: string
        user_id: string
        invoice_type: string
        status: string
        subtotal: number
        discount_amount: number
        vat_percentage: number
        vat_amount: number
        total_amount: number
        currency: string
        notes: string
        due_date: string
        paid_at: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        invoice_number: string
        user_id: string
        invoice_type: string
        status: string
        subtotal: number
        discount_amount: number
        vat_percentage: number
        vat_amount: number
        total_amount: number
        currency: string
        notes: string
        due_date: string
        paid_at: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        invoice_number: string
        user_id: string
        invoice_type: string
        status: string
        subtotal: number
        discount_amount: number
        vat_percentage: number
        vat_amount: number
        total_amount: number
        currency: string
        notes: string
        due_date: string
        paid_at: string
        created_at: string
        updated_at: string
        }>;
      };
      invoice_items: {
        Row: {
        id: string
        invoice_id: string
        description: string
        description_ar: string
        quantity: number
        unit_price: number
        total_price: number
        reference_type: string
        reference_id: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        invoice_id: string
        description: string
        description_ar: string
        quantity: number
        unit_price: number
        total_price: number
        reference_type: string
        reference_id: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        invoice_id: string
        description: string
        description_ar: string
        quantity: number
        unit_price: number
        total_price: number
        reference_type: string
        reference_id: string
        created_at: string
        }>;
      };
      commission_rules: {
        Row: {
        id: string
        rule_type: string
        name: string
        description: string
        percentage: number
        fixed_amount: number
        min_amount: number
        max_amount: number
        applies_to: unknown
        category: string
        is_active: boolean
        priority: number
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        rule_type: string
        name: string
        description: string
        percentage: number
        fixed_amount: number
        min_amount: number
        max_amount: number
        applies_to: unknown
        category: string
        is_active: boolean
        priority: number
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        rule_type: string
        name: string
        description: string
        percentage: number
        fixed_amount: number
        min_amount: number
        max_amount: number
        applies_to: unknown
        category: string
        is_active: boolean
        priority: number
        created_at: string
        updated_at: string
        }>;
      };
      coupons: {
        Row: {
        id: string
        code: string
        description: string
        discount_type: string
        discount_value: number
        min_order_amount: number
        max_uses: number
        used_count: number
        max_uses_per_user: number
        starts_at: string
        expires_at: string
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        code: string
        description: string
        discount_type: string
        discount_value: number
        min_order_amount: number
        max_uses: number
        used_count: number
        max_uses_per_user: number
        starts_at: string
        expires_at: string
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        code: string
        description: string
        discount_type: string
        discount_value: number
        min_order_amount: number
        max_uses: number
        used_count: number
        max_uses_per_user: number
        starts_at: string
        expires_at: string
        is_active: boolean
        created_at: string
        }>;
      };
      coupon_redemptions: {
        Row: {
        id: string
        coupon_id: string
        user_id: string
        transaction_id: string
        discount_amount: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        coupon_id: string
        user_id: string
        transaction_id: string
        discount_amount: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        coupon_id: string
        user_id: string
        transaction_id: string
        discount_amount: number
        created_at: string
        }>;
      };
      crm_customers: {
        Row: {
        id: string
        user_id: string
        assigned_to: string
        tags: unknown
        notes: string
        last_contacted_at: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        assigned_to: string
        tags: unknown
        notes: string
        last_contacted_at: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        assigned_to: string
        tags: unknown
        notes: string
        last_contacted_at: string
        created_at: string
        updated_at: string
        }>;
      };
      customer_notes: {
        Row: {
        id: string
        customer_id: string
        added_by: string
        content: string
        is_private: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        customer_id: string
        added_by: string
        content: string
        is_private: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        customer_id: string
        added_by: string
        content: string
        is_private: boolean
        created_at: string
        }>;
      };
      customer_timeline: {
        Row: {
        id: string
        user_id: string
        event_type: string
        description: string
        metadata: unknown
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        event_type: string
        description: string
        metadata: unknown
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        event_type: string
        description: string
        metadata: unknown
        created_at: string
        }>;
      };
      support_tickets: {
        Row: {
        id: string
        user_id: string
        subject: string
        category: string
        priority: string
        status: string
        assigned_to: string
        reference_type: string
        reference_id: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        subject: string
        category: string
        priority: string
        status: string
        assigned_to: string
        reference_type: string
        reference_id: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        subject: string
        category: string
        priority: string
        status: string
        assigned_to: string
        reference_type: string
        reference_id: string
        created_at: string
        updated_at: string
        }>;
      };
      ticket_messages: {
        Row: {
        id: string
        ticket_id: string
        sender_id: string
        content: string
        is_internal: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        ticket_id: string
        sender_id: string
        content: string
        is_internal: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        ticket_id: string
        sender_id: string
        content: string
        is_internal: boolean
        created_at: string
        }>;
      };
      ticket_attachments: {
        Row: {
        id: string
        ticket_id: string
        message_id: string
        file_url: string
        file_type: string
        file_size: number
        created_at: string
        };
        Insert: Partial<{
        id: string
        ticket_id: string
        message_id: string
        file_url: string
        file_type: string
        file_size: number
        created_at: string
        }>;
        Update: Partial<{
        id: string
        ticket_id: string
        message_id: string
        file_url: string
        file_type: string
        file_size: number
        created_at: string
        }>;
      };
      notification_templates: {
        Row: {
        id: string
        key: string
        title: string
        title_ar: string
        body: string
        body_ar: string
        channels: unknown
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        key: string
        title: string
        title_ar: string
        body: string
        body_ar: string
        channels: unknown
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        key: string
        title: string
        title_ar: string
        body: string
        body_ar: string
        channels: unknown
        created_at: string
        updated_at: string
        }>;
      };
      internal_notifications: {
        Row: {
        id: string
        user_id: string
        title: string
        title_ar: string
        body: string
        body_ar: string
        type: string
        reference_type: string
        reference_id: string
        is_read: boolean
        read_at: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        title: string
        title_ar: string
        body: string
        body_ar: string
        type: string
        reference_type: string
        reference_id: string
        is_read: boolean
        read_at: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        title: string
        title_ar: string
        body: string
        body_ar: string
        type: string
        reference_type: string
        reference_id: string
        is_read: boolean
        read_at: string
        created_at: string
        }>;
      };
      notification_deliveries: {
        Row: {
        id: string
        notification_id: string
        channel: string
        status: string
        sent_at: string
        error: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        notification_id: string
        channel: string
        status: string
        sent_at: string
        error: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        notification_id: string
        channel: string
        status: string
        sent_at: string
        error: string
        created_at: string
        }>;
      };
      employee_targets: {
        Row: {
        id: string
        user_id: string
        target_type: string
        target_value: number
        achieved_value: number
        period_start: string
        period_end: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        target_type: string
        target_value: number
        achieved_value: number
        period_start: string
        period_end: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        target_type: string
        target_value: number
        achieved_value: number
        period_start: string
        period_end: string
        created_at: string
        updated_at: string
        }>;
      };
      employee_commissions: {
        Row: {
        id: string
        user_id: string
        transaction_id: string
        amount: number
        commission_type: string
        status: string
        paid_at: string
        created_at: string
        };
        Insert: Partial<{
        id: string
        user_id: string
        transaction_id: string
        amount: number
        commission_type: string
        status: string
        paid_at: string
        created_at: string
        }>;
        Update: Partial<{
        id: string
        user_id: string
        transaction_id: string
        amount: number
        commission_type: string
        status: string
        paid_at: string
        created_at: string
        }>;
      };
      task_assignments: {
        Row: {
        id: string
        assigned_by: string
        assigned_to: string
        title: string
        description: string
        due_date: string
        priority: string
        status: string
        reference_type: string
        reference_id: string
        completed_at: string
        created_at: string
        updated_at: string
        };
        Insert: Partial<{
        id: string
        assigned_by: string
        assigned_to: string
        title: string
        description: string
        due_date: string
        priority: string
        status: string
        reference_type: string
        reference_id: string
        completed_at: string
        created_at: string
        updated_at: string
        }>;
        Update: Partial<{
        id: string
        assigned_by: string
        assigned_to: string
        title: string
        description: string
        due_date: string
        priority: string
        status: string
        reference_type: string
        reference_id: string
        completed_at: string
        created_at: string
        updated_at: string
        }>;
      };
      report_exports: {
        Row: {
        id: string
        requested_by: string
        report_type: string
        filters: unknown
        format: string
        status: string
        file_url: string
        created_at: string
        completed_at: string
        };
        Insert: Partial<{
        id: string
        requested_by: string
        report_type: string
        filters: unknown
        format: string
        status: string
        file_url: string
        created_at: string
        completed_at: string
        }>;
        Update: Partial<{
        id: string
        requested_by: string
        report_type: string
        filters: unknown
        format: string
        status: string
        file_url: string
        created_at: string
        completed_at: string
        }>;
      };
      spare_part_supplier_parts: {
        Row: {
        id: string
        supplier_id: string
        part_id: string
        price: number
        stock_quantity: number
        is_active: boolean
        created_at: string
        };
        Insert: Partial<{
        id: string
        supplier_id: string
        part_id: string
        price: number
        stock_quantity: number
        is_active: boolean
        created_at: string
        }>;
        Update: Partial<{
        id: string
        supplier_id: string
        part_id: string
        price: number
        stock_quantity: number
        is_active: boolean
        created_at: string
        }>;
      };
      organizations: {
        Row: {
        id: string
        org_type: string
        name: string
        name_ar: string | null
        slug: string
        description: string | null
        description_ar: string | null
        logo_url: string | null
        cover_url: string | null
        phone: string | null
        email: string | null
        website: string | null
        city_id: string | null
        address: string | null
        address_ar: string | null
        latitude: number | null
        longitude: number | null
        registration_number: string | null
        tax_number: string | null
        status: string
        is_active: boolean
        status_notes: string | null
        created_at: string
        updated_at: string
        created_by: string | null
        };
        Insert: Partial<{
        id: string
        org_type: string
        name: string
        name_ar: string | null
        slug: string
        description: string | null
        description_ar: string | null
        logo_url: string | null
        cover_url: string | null
        phone: string | null
        email: string | null
        website: string | null
        city_id: string | null
        address: string | null
        address_ar: string | null
        latitude: number | null
        longitude: number | null
        registration_number: string | null
        tax_number: string | null
        status: string
        is_active: boolean
        status_notes: string | null
        created_at: string
        updated_at: string
        created_by: string | null
        }>;
        Update: Partial<{
        id: string
        org_type: string
        name: string
        name_ar: string | null
        slug: string
        description: string | null
        description_ar: string | null
        logo_url: string | null
        cover_url: string | null
        phone: string | null
        email: string | null
        website: string | null
        city_id: string | null
        address: string | null
        address_ar: string | null
        latitude: number | null
        longitude: number | null
        registration_number: string | null
        tax_number: string | null
        status: string
        is_active: boolean
        status_notes: string | null
        created_at: string
        updated_at: string
        created_by: string | null
        }>;
      };
      organization_members: {
        Row: {
        id: string
        organization_id: string
        user_id: string
        role: string
        status: string
        is_active: boolean
        invited_by: string | null
        invited_at: string | null
        joined_at: string | null
        created_at: string
        updated_at: string
        created_by: string | null
        };
        Insert: Partial<{
        id: string
        organization_id: string
        user_id: string
        role: string
        status: string
        is_active: boolean
        invited_by: string | null
        invited_at: string | null
        joined_at: string | null
        created_at: string
        updated_at: string
        created_by: string | null
        }>;
        Update: Partial<{
        id: string
        organization_id: string
        user_id: string
        role: string
        status: string
        is_active: boolean
        invited_by: string | null
        invited_at: string | null
        joined_at: string | null
        created_at: string
        updated_at: string
        created_by: string | null
        }>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      org_type: 'car_dealer' | 'inspection_center' | 'wholesale_vehicle_trader' | 'spare_parts_supplier' | 'finance_company' | 'insurance_company' | 'advertising_marketing_company' | 'car_rental_company' | 'product_shipping_company' | 'vehicle_transport_company';
      org_status: 'pending_approval' | 'active' | 'suspended' | 'rejected' | 'closed';
      org_member_status: 'active' | 'invited' | 'suspended' | 'left';
    };
  };
}
