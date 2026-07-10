import { NextResponse } from 'next/server'
import { corsHeaders } from '@/lib/api-helpers'

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'BD API v1',
    description: 'RESTful API for BD automotive marketplace. Used by the mobile app and third-party integrations.',
    version: '1.0.0',
    contact: { email: 'api@bd.evico.sa' },
  },
  servers: [{ url: '/api/v1', description: 'Production' }],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'sb-access-token' },
      apiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
    },
    schemas: {
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          perPage: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 150 },
          totalPages: { type: 'integer', example: 8 },
        },
      },
      Listing: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          slug: { type: 'string' },
          title: { type: 'string' },
          price: { type: 'number' },
          status: { type: 'string', enum: ['active', 'pending', 'sold', 'rejected'] },
          year: { type: 'integer' },
          mileage: { type: 'integer' },
          is_featured: { type: 'boolean' },
          featured_until: { type: 'string', format: 'date-time', nullable: true },
          views_count: { type: 'integer' },
          vehicle: { $ref: '#/components/schemas/Vehicle' },
          city: { $ref: '#/components/schemas/City' },
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          make: { $ref: '#/components/schemas/Make' },
          model: { $ref: '#/components/schemas/Model' },
          year: { type: 'integer' },
          mileage: { type: 'integer' },
          images: { type: 'array', items: { $ref: '#/components/schemas/Image' } },
        },
      },
      Make: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, name_ar: { type: 'string' } } },
      Model: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, name_ar: { type: 'string' } } },
      City: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, name_ar: { type: 'string' } } },
      Image: { type: 'object', properties: { id: { type: 'string' }, url: { type: 'string' }, is_primary: { type: 'boolean' } } },
      Auction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string', enum: ['active', 'ended', 'cancelled'] },
          start_price: { type: 'number' },
          reserve_price: { type: 'number', nullable: true },
          start_time: { type: 'string', format: 'date-time' },
          end_time: { type: 'string', format: 'date-time' },
          seller: { $ref: '#/components/schemas/Profile' },
          bid_count: { type: 'integer' },
          watcher_count: { type: 'integer' },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          full_name: { type: 'string' },
          avatar_url: { type: 'string', nullable: true },
          phone: { type: 'string' },
        },
      },
      SparePart: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          title_ar: { type: 'string' },
          price: { type: 'number' },
          condition: { type: 'string' },
          part_number: { type: 'string' },
          category: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, slug: { type: 'string' } } },
          brand: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, slug: { type: 'string' } } },
          images: { type: 'array', items: { $ref: '#/components/schemas/Image' } },
        },
      },
      SupportTicket: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          subject: { type: 'string' },
          category: { type: 'string' },
          status: { type: 'string', enum: ['open', 'closed', 'waiting'] },
          priority: { type: 'string', enum: ['low', 'normal', 'high'] },
          created_at: { type: 'string', format: 'date-time' },
          message_count: { type: 'integer' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Not found' },
        },
      },
    },
  },
  paths: {
    '/listings': {
      get: {
        tags: ['Listings'],
        summary: 'List active vehicle listings',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by title or description' },
          { name: 'make_id', in: 'query', schema: { type: 'string' } },
          { name: 'model_id', in: 'query', schema: { type: 'string' } },
          { name: 'min_price', in: 'query', schema: { type: 'number' } },
          { name: 'max_price', in: 'query', schema: { type: 'number' } },
          { name: 'min_year', in: 'query', schema: { type: 'integer' } },
          { name: 'max_year', in: 'query', schema: { type: 'integer' } },
          { name: 'body_type_id', in: 'query', schema: { type: 'string' } },
          { name: 'fuel_type_id', in: 'query', schema: { type: 'string' } },
          { name: 'transmission_id', in: 'query', schema: { type: 'string' } },
          { name: 'condition_id', in: 'query', schema: { type: 'string' } },
          { name: 'city_id', in: 'query', schema: { type: 'string' } },
          { name: 'dealer_id', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', default: 'active' } },
          { name: 'featured', in: 'query', schema: { type: 'string', enum: ['true'] } },
          { name: 'fields', in: 'query', schema: { type: 'string', enum: ['full'] }, description: 'Use "full" for complete vehicle details' },
          { name: 'sort_by', in: 'query', schema: { type: 'string', default: 'created_at_desc', enum: ['created_at_desc', 'created_at_asc', 'price_asc', 'price_desc'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': { description: 'Paginated listings', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { listings: { type: 'array', items: { $ref: '#/components/schemas/Listing' } }, pagination: { $ref: '#/components/schemas/Pagination' } } } } } } } },
        },
      },
    },
    '/listings/{slug}': {
      get: {
        tags: ['Listings'],
        summary: 'Get listing detail',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'fields', in: 'query', schema: { type: 'string', enum: ['compact'] }, description: 'Use "compact" for minimal response' },
        ],
        responses: { '200': { description: 'Listing detail' }, '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } },
      },
    },
    '/auctions': {
      get: {
        tags: ['Auctions'],
        summary: 'List auctions',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', default: 'active', enum: ['active', 'ended', 'all'] } },
          { name: 'dealer_id', in: 'query', schema: { type: 'string' } },
          { name: 'sort_by', in: 'query', schema: { type: 'string', default: 'end_time_asc', enum: ['end_time_asc', 'end_time_desc', 'price_asc', 'price_desc'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Paginated auctions' } },
      },
    },
    '/auctions/{slug}': {
      get: {
        tags: ['Auctions'],
        summary: 'Get auction detail',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'fields', in: 'query', schema: { type: 'string', enum: ['compact'] } },
        ],
        responses: { '200': { description: 'Auction detail' }, '404': { description: 'Not found' } },
      },
    },
    '/parts': {
      get: {
        tags: ['Parts'],
        summary: 'List spare parts',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'brand', in: 'query', schema: { type: 'string' } },
          { name: 'condition', in: 'query', schema: { type: 'string' } },
          { name: 'part_type', in: 'query', schema: { type: 'string' } },
          { name: 'sort_by', in: 'query', schema: { type: 'string', default: 'created_at_desc' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Paginated parts' } },
      },
    },
    '/parts/{slug}': {
      get: {
        tags: ['Parts'],
        summary: 'Get spare part detail',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Part detail' }, '404': { description: 'Not found' } },
      },
    },
    '/makes': {
      get: {
        tags: ['Lookups'],
        summary: 'List car makes',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 50 } },
        ],
        responses: { '200': { description: 'Paginated makes with model counts' } },
      },
    },
    '/makes/{makeId}/models': {
      get: {
        tags: ['Lookups'],
        summary: 'List models for a make',
        parameters: [
          { name: 'makeId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 50 } },
        ],
        responses: { '200': { description: 'Paginated models' } },
      },
    },
    '/lookups': {
      get: {
        tags: ['Lookups'],
        summary: 'Get all lookup tables (body types, fuel types, etc.)',
        responses: { '200': { description: 'All lookups' } },
      },
    },
    '/dashboard': {
      get: {
        tags: ['User'],
        summary: 'Get user dashboard data',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [
          { name: 'section', in: 'query', schema: { type: 'string', default: 'summary', enum: ['summary', 'listings', 'favorites', 'requests', 'all'] } },
        ],
        responses: { '200': { description: 'Dashboard data' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/finance': {
      get: {
        tags: ['Finance'],
        summary: 'List finance partners',
        responses: { '200': { description: 'Finance partners' } },
      },
    },
    '/finance/requests': {
      get: {
        tags: ['Finance'],
        summary: 'Get my finance requests',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string' } }],
        responses: { '200': { description: 'Finance requests' }, '401': { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Finance'],
        summary: 'Submit a finance request',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { listing_id: { type: 'string' }, partner_id: { type: 'string' }, vehicle_price: { type: 'number' }, down_payment: { type: 'number' } }, required: ['listing_id', 'partner_id'] } } } },
        responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/insurance': {
      get: {
        tags: ['Insurance'],
        summary: 'List insurance partners',
        responses: { '200': { description: 'Insurance partners' } },
      },
    },
    '/insurance/requests': {
      get: {
        tags: ['Insurance'],
        summary: 'Get my insurance requests',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string' } }],
        responses: { '200': { description: 'Insurance requests' }, '401': { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Insurance'],
        summary: 'Submit an insurance request',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { listing_id: { type: 'string' }, partner_id: { type: 'string' }, vehicle_price: { type: 'number' }, insurance_type: { type: 'string', enum: ['comprehensive', 'third_party'] } }, required: ['listing_id', 'partner_id'] } } } },
        responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/delivery': {
      get: {
        tags: ['Delivery'],
        summary: 'Get delivery orders or addresses',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [
          { name: 'section', in: 'query', schema: { type: 'string', default: 'orders', enum: ['orders', 'addresses'] } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Delivery data' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/delivery/addresses': {
      post: {
        tags: ['Delivery'],
        summary: 'Create a delivery address',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { label: { type: 'string' }, city_id: { type: 'string' }, address: { type: 'string' }, address_ar: { type: 'string' }, phone: { type: 'string' }, is_default: { type: 'boolean' } }, required: ['city_id', 'address'] } } } },
        responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/support/tickets': {
      get: {
        tags: ['Support'],
        summary: 'List my support tickets',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['open', 'closed', 'waiting'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Paginated tickets' }, '401': { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Support'],
        summary: 'Create a support ticket',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { subject: { type: 'string' }, category: { type: 'string' }, message: { type: 'string' } }, required: ['subject', 'message'] } } } },
        responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/support/tickets/{id}': {
      get: {
        tags: ['Support'],
        summary: 'Get ticket detail with messages',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Ticket with messages' }, '401': { description: 'Unauthorized' }, '404': { description: 'Not found' } },
      },
    },
    '/support/tickets/{id}/messages': {
      post: {
        tags: ['Support'],
        summary: 'Add a message to a ticket',
        security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { content: { type: 'string' } }, required: ['content'] } } } },
        responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(spec, {
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
  })
}
