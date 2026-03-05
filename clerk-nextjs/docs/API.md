// =================================
// API DOCUMENTATION
// =================================

# BioPara E-commerce API Documentation

## Overview

This is the comprehensive REST API for the BioPara e-commerce platform. The API provides endpoints for managing products, orders, payments, reviews, shipping, and more.

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

All API endpoints (except public ones) require authentication using Clerk. Include the user's session token in the Authorization header:

```
Authorization: Bearer <clerk_session_token>
```

## Rate Limiting

- **100 requests per 15 minutes** per IP address
- Rate limit headers are included in all responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit window resets
  - `Retry-After`: Seconds until retry is allowed

## Response Format

All responses follow this format:

```json
{
  "success": true|false,
  "data": {}, // Present on success
  "error": "Error message", // Present on failure
  "message": "Success message", // Present on success
  "pagination": { // Present on paginated responses
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 100,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Endpoints

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category_id` (optional): Filter by category
- `search` (optional): Search query
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `sort_by` (optional): Sort field (name, price, created_at)
- `sort_order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Product Name",
        "slug": "product-slug",
        "description": "Product description",
        "price": 29.99,
        "original_price": 39.99,
        "image_url": "https://example.com/image.jpg",
        "category_id": "uuid",
        "stock_quantity": 100,
        "is_featured": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "categories": [...]
  },
  "pagination": {...}
}
```

#### Get Product by ID
```http
GET /api/products/[id]
```

#### Create Product (Admin)
```http
POST /api/admin/products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Product description",
  "price": 29.99,
  "category_id": "uuid",
  "stock_quantity": 100,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Product image",
      "order": 1
    }
  ],
  "status": "active"
}
```

### Orders

#### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 29.99,
      "total_price": 59.98
    }
  ],
  "shipping_address_id": "uuid",
  "billing_address_id": "uuid",
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "ORD-123456",
      "status": "pending",
      "total_amount": 69.97
    },
    "payment_intent": {
      "client_secret": "pi_123456_secret",
      "amount": 69.97
    }
  }
}
```

#### Get User Orders
```http
GET /api/orders
```

#### Update Order Status (Admin)
```http
PUT /api/admin/orders
```

**Request Body:**
```json
{
  "order_id": "uuid",
  "action": "update_status",
  "status": "shipped",
  "tracking_number": "1Z9999W99999999999",
  "tracking_url": "https://www.fedex.com/tracking/1Z9999W99999999999"
}
```

### Payments

#### Create Payment Intent
```http
POST /api/payments
```

**Request Body:**
```json
{
  "action": "create_payment_intent",
  "amount": 69.97,
  "currency": "USD",
  "metadata": {
    "order_id": "uuid"
  }
}
```

#### Confirm Payment
```http
POST /api/payments
```

**Request Body:**
```json
{
  "action": "confirm_payment",
  "payment_intent_id": "pi_123456",
  "payment_method_id": "pm_123456"
}
```

#### Process Refund
```http
POST /api/payments
```

**Request Body:**
```json
{
  "action": "refund",
  "payment_intent_id": "pi_123456",
  "amount": 34.99,
  "reason": "customer_request"
}
```

### Reviews

#### Create Review
```http
POST /api/reviews
```

**Request Body:**
```json
{
  "product_id": "uuid",
  "rating": 5,
  "title": "Great Product!",
  "content": "This is an amazing product!",
  "images": ["https://example.com/review1.jpg"]
}
```

#### Get Product Reviews
```http
GET /api/reviews?product_id=uuid
```

**Query Parameters:**
- `product_id`: Product UUID (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `rating`: Filter by rating (1-5)
- `sort_by`: Sort field (created_at, rating)
- `sort_order`: Sort order (asc, desc)

### Shipping

#### Get Shipping Rates
```http
POST /api/shipping
```

**Request Body:**
```json
{
  "action": "get_rates",
  "from_address": {
    "name": "Sender Name",
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  },
  "to_address": {
    "name": "Recipient Name",
    "street1": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90001",
    "country": "US"
  },
  "parcels": [
    {
      "length": 10,
      "width": 8,
      "height": 5,
      "weight": 2,
      "distance_unit": "in",
      "mass_unit": "lb"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rates": [
      {
        "carrier": "Standard Shipping",
        "service": "Ground",
        "rate": 12.99,
        "estimated_days": "5-7 business days",
        "tracking_available": true
      },
      {
        "carrier": "Express Shipping",
        "service": "Express",
        "rate": 24.99,
        "estimated_days": "2-3 business days",
        "tracking_available": true
      }
    ]
  }
}
```

#### Track Shipment
```http
POST /api/shipping
```

**Request Body:**
```json
{
  "action": "track_shipment",
  "tracking_number": "1Z9999W99999999999",
  "carrier": "FedEx"
}
```

### Email

#### Send Order Confirmation
```http
POST /api/email
```

**Request Body:**
```json
{
  "type": "order_confirmation",
  "orderId": "uuid"
}
```

#### Send Password Reset
```http
POST /api/email
```

**Request Body:**
```json
{
  "type": "password_reset",
  "email": "user@example.com",
  "resetToken": "reset_token_123",
  "customerName": "John Doe"
}
```

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Webhooks

### Stripe Webhook
```http
POST /api/payments/webhook
```

**Events Handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `charge.dispute.created`

## SDK Examples

### JavaScript/TypeScript

```typescript
// Create order
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [{
      product_id: 'uuid',
      quantity: 2,
      unit_price: 29.99,
      total_price: 59.98
    }],
    shipping_address_id: 'uuid'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Order created:', result.data.order);
}
```

### cURL

```bash
# Get products
curl -X GET "http://localhost:3000/api/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create order
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{
      "product_id": "uuid",
      "quantity": 1,
      "unit_price": 29.99,
      "total_price": 29.99
    }],
    "shipping_address_id": "uuid"
  }'
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Support

For API support and documentation updates, contact:
- Email: api-support@biopara.com
- Documentation: https://docs.biopara.com/api
- Status Page: https://status.biopara.com
