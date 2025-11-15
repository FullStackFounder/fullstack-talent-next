# Payment Integration API Documentation

## Base URL
```
Development: http://localhost:8080/api
Production: https://api.fullstacktalent.id/api
```

---

## Payment Provider

This API integrates with **Xendit** payment gateway, supporting multiple payment methods:
- Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)
- E-Wallet (OVO, DANA, LinkAja, ShopeePay)
- Credit Card
- Retail Outlet (Alfamart, Indomaret)
- QRIS

---

## Payment Endpoints

### 1. Create Payment

Create a new payment for course enrollment or other items.

**Endpoint:** `POST /api/payments/create`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "item_type": "course",
  "item_id": "course-uuid",
  "item_name": "Complete Web Development Bootcamp",
  "amount": 299000,
  "payment_method": "bank_transfer",
  "payment_channel": "BCA",
  "description": "Payment for Complete Web Development Bootcamp"
}
```

**Field Validations:**
- `item_type` (required): course|class|bootcamp|mentorship
- `item_id` (required): UUID of the item
- `item_name` (optional): Name of the item for display
- `amount` (required): Payment amount (minimum: 10000, maximum: 50000000)
- `payment_method` (required): bank_transfer|e_wallet|credit_card|retail_outlet|qris
- `payment_channel` (optional): Specific bank/e-wallet (BCA, OVO, etc.)
- `description` (optional): Custom payment description

**Success Response (201):**
```json
{
  "status": true,
  "message": "Payment berhasil dibuat",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "user_id": "user-uuid",
      "order_id": "ORDER-20251101140000-ABC123",
      "external_id": "xendit-invoice-id",
      "payment_method": "bank_transfer",
      "payment_channel": "BCA",
      "amount": 299000,
      "admin_fee": 4000,
      "total_amount": 303000,
      "currency": "IDR",
      "status": "pending",
      "payment_url": "https://checkout.xendit.co/web/xxx",
      "description": "Payment for Complete Web Development Bootcamp",
      "expired_at": "2025-11-02 14:00:00",
      "metadata": {
        "item_type": "course",
        "item_id": "course-uuid",
        "item_name": "Complete Web Development Bootcamp",
        "user_email": "user@example.com",
        "user_name": "John Doe"
      },
      "user_name": "John Doe",
      "user_email": "user@example.com",
      "created_at": "2025-11-01 14:00:00"
    },
    "payment_url": "https://checkout.xendit.co/web/xxx",
    "expires_at": "2025-11-02 14:00:00"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: Already has pending payment, invalid amount, or validation error
- `401`: Unauthorized
- `422`: Validation errors
- `500`: Server error or Xendit API error

**Payment Flow:**
1. User creates payment → Receives payment URL
2. User opens payment URL → Completes payment on Xendit
3. Xendit sends webhook → Payment status updated
4. Enrollment activated automatically

---

### 2. Get Payment Status

Check current payment status.

**Endpoint:** `GET /api/payments/{id}/status`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Payment ID or Order ID

**Example Request:**
```bash
GET /api/payments/payment-uuid/status
GET /api/payments/ORDER-20251101140000-ABC123/status
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Payment status retrieved successfully",
  "data": {
    "id": "payment-uuid",
    "user_id": "user-uuid",
    "order_id": "ORDER-20251101140000-ABC123",
    "external_id": "xendit-invoice-id",
    "payment_method": "bank_transfer",
    "payment_channel": "BCA",
    "amount": 299000,
    "admin_fee": 4000,
    "total_amount": 303000,
    "currency": "IDR",
    "status": "paid",
    "payment_url": "https://checkout.xendit.co/web/xxx",
    "paid_at": "2025-11-01 15:30:00",
    "expired_at": "2025-11-02 14:00:00",
    "metadata": {
      "item_type": "course",
      "item_id": "course-uuid",
      "item_name": "Complete Web Development Bootcamp"
    },
    "user_name": "John Doe",
    "user_email": "user@example.com",
    "created_at": "2025-11-01 14:00:00"
  },
  "timestamp": "2025-11-01 16:00:00"
}
```

**Payment Status Values:**

| Status | Description |
|--------|-------------|
| pending | Waiting for payment |
| paid | Payment successful |
| settled | Payment settled (final) |
| expired | Payment expired (not paid within time limit) |
| cancelled | Payment cancelled by user |
| failed | Payment failed |

---

### 3. Payment Webhook (Xendit Callback)

Webhook endpoint for receiving payment notifications from Xendit.

**Endpoint:** `POST /api/payments/webhook`

**Authentication:** Webhook Token Verification

**Headers:**
```
x-callback-token: <xendit_webhook_token>
Content-Type: application/json
```

**Webhook Payload (from Xendit):**
```json
{
  "id": "xendit-invoice-id",
  "external_id": "ORDER-20251101140000-ABC123",
  "user_id": "user-uuid",
  "status": "PAID",
  "amount": 303000,
  "paid_amount": 303000,
  "bank_code": "BCA",
  "paid_at": "2025-11-01T15:30:00.000Z",
  "payment_channel": "BCA",
  "payment_method": "BANK_TRANSFER",
  "description": "Payment for Complete Web Development Bootcamp"
}
```

**Response (200):**
```json
{
  "success": true
}
```

**What Happens in Webhook:**
1. Verify webhook token
2. Find payment by external_id
3. Update payment status
4. Create/activate enrollment (if course payment)
5. Log transaction
6. Send notification to user

**Webhook Security:**
- Token verification required
- IP whitelist (optional)
- Request signature validation

---

### 4. Get My Payments

Get all payments for the authenticated user.

**Endpoint:** `GET /api/payments/my-payments`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending|paid|expired|cancelled|failed)

**Example Request:**
```bash
GET /api/payments/my-payments?status=paid
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Payments retrieved successfully",
  "data": [
    {
      "id": "payment-uuid",
      "order_id": "ORDER-20251101140000-ABC123",
      "payment_method": "bank_transfer",
      "payment_channel": "BCA",
      "amount": 299000,
      "admin_fee": 4000,
      "total_amount": 303000,
      "status": "paid",
      "paid_at": "2025-11-01 15:30:00",
      "metadata": {
        "item_type": "course",
        "item_name": "Complete Web Development Bootcamp"
      },
      "created_at": "2025-11-01 14:00:00"
    }
  ],
  "timestamp": "2025-11-01 16:00:00"
}
```

---

### 5. Cancel Payment

Cancel a pending payment.

**Endpoint:** `POST /api/payments/{id}/cancel`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Payment ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Payment berhasil dibatalkan",
  "data": {
    "cancelled_at": "2025-11-01 16:00:00"
  },
  "timestamp": "2025-11-01 16:00:00"
}
```

**Error Responses:**
- `400`: Payment cannot be cancelled (not pending)
- `403`: Not authorized
- `404`: Payment not found

---

### 6. Get Available Payment Methods

Get list of available payment methods and channels.

**Endpoint:** `GET /api/payments/methods`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "status": true,
  "message": "Payment methods retrieved successfully",
  "data": {
    "bank_transfer": [
      "BCA",
      "BNI",
      "BRI",
      "MANDIRI",
      "PERMATA"
    ],
    "e_wallet": [
      "OVO",
      "DANA",
      "LINKAJA",
      "SHOPEEPAY"
    ],
    "retail_outlet": [
      "ALFAMART",
      "INDOMARET"
    ],
    "credit_card": true,
    "qris": true
  },
  "timestamp": "2025-11-01 16:00:00"
}
```

---

## Testing Examples

### Using cURL

#### 1. Create Payment
```bash
curl -X POST http://localhost:8080/api/payments/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_type": "course",
    "item_id": "course-uuid",
    "item_name": "Complete Web Development",
    "amount": 299000,
    "payment_method": "bank_transfer",
    "payment_channel": "BCA"
  }'
```

#### 2. Check Payment Status
```bash
curl -X GET http://localhost:8080/api/payments/payment-uuid/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 3. Get My Payments
```bash
curl -X GET http://localhost:8080/api/payments/my-payments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Cancel Payment
```bash
curl -X POST http://localhost:8080/api/payments/payment-uuid/cancel \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Get Payment Methods
```bash
curl -X GET http://localhost:8080/api/payments/methods
```

---

## Complete Payment Flow

### Flow 1: Enroll to Course with Payment

```
1. Student browses course
   GET /api/courses/course-uuid

2. Student enrolls to course (creates payment)
   POST /api/payments/create
   {
     "item_type": "course",
     "item_id": "course-uuid",
     "amount": 299000,
     "payment_method": "bank_transfer",
     "payment_channel": "BCA"
   }

3. System returns payment URL
   Response: { payment_url: "https://checkout.xendit.co/..." }

4. Student opens payment URL and completes payment

5. Xendit sends webhook notification
   POST /api/payments/webhook
   { status: "PAID", ... }

6. System processes webhook:
   - Updates payment status to "paid"
   - Creates enrollment with status "active"
   - Sends confirmation email

7. Student can start learning
   GET /api/enrollments/my-courses
```

### Flow 2: Check Payment Before Accessing Course

```
1. Student checks payment status
   GET /api/payments/order-id/status

2. If status = "paid", student can access course
   GET /api/enrollments/enrollment-uuid/progress

3. If status = "pending", show payment URL again

4. If status = "expired", offer to create new payment
```

---

## Admin Fee Structure

| Payment Method | Fee |
|----------------|-----|
| Bank Transfer | Rp 4,000 (flat) |
| E-Wallet | 2.0% of amount |
| Credit Card | 2.9% of amount |
| Retail Outlet | Rp 5,000 (flat) |
| QRIS | 0.7% of amount |

*Note: Actual fees may vary based on Xendit pricing*

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## Webhook Testing

### Using Xendit Dashboard
1. Go to Xendit Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Set verification token in `.env`
4. Test webhook using "Send Test Event"

### Using Postman
```bash
POST http://localhost:8080/api/payments/webhook
Headers:
  x-callback-token: your_webhook_token
  Content-Type: application/json

Body:
{
  "id": "test-invoice-id",
  "external_id": "ORDER-20251101140000-ABC123",
  "status": "PAID",
  "amount": 303000,
  "paid_amount": 303000,
  "paid_at": "2025-11-01T15:30:00.000Z"
}
```

---

## Security Best Practices

1. **Always verify webhook token**
2. **Use HTTPS in production**
3. **Store Xendit keys securely** in environment variables
4. **Implement rate limiting** on payment creation
5. **Log all payment transactions** for audit trail
6. **Validate payment amounts** before processing
7. **Check duplicate payments** before creating new one
8. **Set appropriate expiry times** for payments
9. **Handle webhook idempotency** (same webhook sent multiple times)
10. **Monitor failed payments** and notify users

---

## Configuration (.env)

```env
# Xendit Configuration
payment.xenditSecretKey = xnd_development_your_secret_key
payment.xenditPublicKey = xnd_public_development_your_public_key
payment.xenditWebhookToken = your_webhook_verification_token
payment.xenditIsProduction = false

# Payment Settings
payment.paymentExpiryHours = 24
payment.minimumAmount = 10000
payment.maximumAmount = 50000000
payment.platformFeePercentage = 25.0

# URLs
payment.successUrl = http://localhost:3000/payment/success
payment.failureUrl = http://localhost:3000/payment/failed
payment.callbackUrl = http://localhost:8080/api/payments/callback
```

---

## Common Issues & Solutions

### Issue 1: Webhook not received
**Solution:**
- Check webhook URL is accessible from internet
- Verify webhook token is correct
- Check Xendit dashboard for webhook logs
- Use ngrok for local testing

### Issue 2: Payment status not updating
**Solution:**
- Check webhook handler logs
- Verify external_id matches between payment and Xendit
- Manually check payment status using Xendit API

### Issue 3: Duplicate payments created
**Solution:**
- Implement `hasPendingPayment` check before creating
- Add unique constraint on order_id

### Issue 4: Invalid amount error
**Solution:**
- Ensure amount is within min/max limits
- For IDR, amount must be integer (no decimals)
- Admin fee calculated correctly

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025  
**Payment Gateway**: Xendit