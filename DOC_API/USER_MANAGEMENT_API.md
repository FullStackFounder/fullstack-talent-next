# User Management API Documentation

## Overview
Complete API documentation for User Management features including Profile Management, Avatar Upload, Bank Accounts, Social Media Links, and Wishlist functionality.

**Base URL:** `https://api.fullstacktalent.id`  
**Authentication:** Bearer Token (JWT)

---

## 1. Profile Management

### Get My Profile
```http
GET /api/profile
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "phone": "08123456789",
      "role": "siswa",
      "avatar_url": "https://domain.com/avatars/user.jpg",
      "bio": "Learning enthusiast",
      "is_verified": true,
      "status": "active",
      "created_at": "2025-01-01 10:00:00",
      "updated_at": "2025-01-15 14:30:00"
    },
    "profile": {
      "id": "uuid",
      "user_id": "uuid",
      "date_of_birth": "1995-01-15",
      "gender": "male",
      "address": "Jl. Sudirman No. 123",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "postal_code": "12190",
      "country": "Indonesia",
      "education_level": "Bachelor",
      "institution": "University of Indonesia",
      "major": "Computer Science",
      "graduation_year": 2018,
      "current_job_title": "Software Developer",
      "current_company": "Tech Company",
      "interests": ["Web Development", "AI", "Mobile Apps"],
      "learning_goals": "Become a fullstack developer",
      "timezone": "Asia/Jakarta",
      "language_preference": "id"
    },
    "social_links": [
      {
        "id": "uuid",
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/johndoe",
        "display_order": 1,
        "is_public": true
      }
    ],
    "settings": {
      "notifications_enabled": true,
      "email_digest": "weekly",
      "theme": "light"
    },
    "statistics": {
      "total_courses": 5,
      "completed_courses": 2,
      "certificates": 2,
      "total_learning_hours": 40
    }
  }
}
```

### Update Profile
```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "08198765432",
  "bio": "Aspiring fullstack developer",
  
  // Student profile fields
  "date_of_birth": "1995-01-15",
  "gender": "male",
  "address": "New Address",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postal_code": "12190",
  "education_level": "Master",
  "institution": "MIT",
  "major": "Computer Science",
  "graduation_year": 2020,
  "current_job_title": "Senior Developer",
  "current_company": "Big Tech",
  "interests": ["React", "Node.js", "PostgreSQL"],
  "learning_goals": "Master fullstack development",
  "timezone": "Asia/Jakarta",
  "language_preference": "id",
  
  // Tutor profile fields (if role is tutor)
  "expertise": ["React", "Node.js", "MongoDB"],
  "years_experience": 5,
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "portfolio_url": "https://johndoe.com"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": { ... },
    "profile": { ... }
  }
}
```

### Get Public Profile
```http
GET /api/users/{userId}/profile
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "John Doe",
      "role": "tutor",
      "avatar_url": "...",
      "bio": "Experienced developer"
    },
    "profile": {
      "expertise": ["React", "Node.js"],
      "years_experience": 5
    },
    "social_links": [
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/johndoe"
      }
    ],
    "statistics": {
      "total_courses": 10,
      "total_students": 250,
      "average_rating": 4.8
    }
  }
}
```

---

## 2. Avatar Management

### Upload Avatar
```http
POST /api/profile/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:**
- `avatar`: Image file (JPG, PNG, WEBP)
- Max size: 2MB
- Recommended: 400x400px

**Response 200:**
```json
{
  "status": "success",
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "https://domain.com/uploads/avatars/user_1234567890.jpg"
  }
}
```

**Error 400:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "avatar": "The avatar file exceeds the maximum size of 2048 KB."
  }
}
```

### Delete Avatar
```http
DELETE /api/profile/avatar
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Avatar deleted successfully"
}
```

---

## 3. Bank Account Management (Tutor Only)

### Get Bank Account
```http
GET /api/profile/bank-account
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "bank_name": "Bank BCA",
    "bank_account_number": "1234567890",
    "bank_account_name": "John Doe",
    "is_verified": true
  }
}
```

**Error 403 (Not a tutor):**
```json
{
  "status": "error",
  "message": "Only tutors can manage bank accounts"
}
```

### Update Bank Account
```http
PUT /api/profile/bank-account
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "bank_name": "Bank BCA",
  "bank_account_number": "1234567890",
  "bank_account_name": "John Doe"
}
```

**Supported Banks:**
- Bank BCA
- Bank Mandiri
- Bank BNI
- Bank BRI
- Bank Permata
- Bank CIMB Niaga
- Bank Danamon
- Other banks

**Response 200:**
```json
{
  "status": "success",
  "message": "Bank account updated successfully",
  "data": {
    "bank_name": "Bank BCA",
    "bank_account_number": "1234567890",
    "bank_account_name": "John Doe"
  }
}
```

### Delete Bank Account
```http
DELETE /api/profile/bank-account
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Bank account deleted successfully"
}
```

### Verify Bank Account (Admin Only)
```http
POST /api/admin/tutors/{tutorId}/verify-bank
Authorization: Bearer {admin-token}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Bank account verified successfully"
}
```

---

## 4. Social Media Links

### Get Social Media Links
```http
GET /api/profile/social-media
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/johndoe",
      "display_order": 1,
      "is_public": true,
      "created_at": "2025-01-01 10:00:00"
    },
    {
      "id": "uuid",
      "platform": "GitHub",
      "url": "https://github.com/johndoe",
      "display_order": 2,
      "is_public": true,
      "created_at": "2025-01-01 10:05:00"
    }
  ]
}
```

### Add Social Media Link
```http
POST /api/profile/social-media
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "platform": "LinkedIn",
  "url": "https://linkedin.com/in/johndoe",
  "is_public": true,
  "display_order": 1
}
```

**Supported Platforms:**
- LinkedIn
- GitHub
- Twitter/X
- Instagram
- Facebook
- YouTube
- TikTok
- Medium
- Dev.to
- Website
- Portfolio
- Other

**Response 201:**
```json
{
  "status": "success",
  "message": "Social media link added successfully",
  "data": {
    "id": "uuid",
    "platform": "LinkedIn",
    "url": "https://linkedin.com/in/johndoe",
    "display_order": 1,
    "is_public": true
  }
}
```

### Update Social Media Link
```http
PUT /api/profile/social-media/{linkId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "platform": "LinkedIn",
  "url": "https://linkedin.com/in/johndoe-updated",
  "is_public": false,
  "display_order": 2
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Social media link updated successfully",
  "data": { ... }
}
```

### Delete Social Media Link
```http
DELETE /api/profile/social-media/{linkId}
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Social media link deleted successfully"
}
```

### Reorder Social Media Links
```http
POST /api/profile/social-media/reorder
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "links": [
    {"id": "uuid1", "display_order": 1},
    {"id": "uuid2", "display_order": 2},
    {"id": "uuid3", "display_order": 3}
  ]
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Social media links reordered successfully"
}
```

---

## 5. Wishlist Management

### Get Wishlist
```http
GET /api/wishlist
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "wishlist-uuid",
      "user_id": "user-uuid",
      "item_type": "course",
      "item_id": "course-uuid",
      "created_at": "2025-01-01 10:00:00",
      
      // Course details
      "title": "Fullstack Web Development",
      "slug": "fullstack-web-development",
      "thumbnail_url": "https://domain.com/courses/thumb.jpg",
      "price": 500000,
      "discount_price": 350000,
      "average_rating": 4.8,
      "total_enrolled": 1250,
      "tutor_name": "Jane Doe"
    }
  ]
}
```

### Add to Wishlist
```http
POST /api/wishlist
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "item_type": "course",
  "item_id": "course-uuid"
}
```

**Item Types:**
- `course` - Regular course
- `class` - Live class
- `bootcamp` - Bootcamp program

**Response 201:**
```json
{
  "status": "success",
  "message": "Added to wishlist successfully",
  "data": {
    "id": "wishlist-uuid",
    "user_id": "user-uuid",
    "item_type": "course",
    "item_id": "course-uuid",
    "created_at": "2025-01-01 10:00:00"
  }
}
```

**Error 400 (Already in wishlist):**
```json
{
  "status": "error",
  "message": "Item already in wishlist"
}
```

### Remove from Wishlist
```http
DELETE /api/wishlist/{wishlistId}
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Removed from wishlist successfully"
}
```

### Check if Item in Wishlist
```http
GET /api/wishlist/check/{itemType}/{itemId}
Authorization: Bearer {token}
```

**Example:**
```http
GET /api/wishlist/check/course/abc-123-def
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "in_wishlist": true,
    "wishlist_id": "wishlist-uuid"
  }
}
```

### Get Wishlist Count
```http
GET /api/wishlist/count
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "count": 5
  }
}
```

### Clear Wishlist
```http
DELETE /api/wishlist/clear
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Wishlist cleared successfully"
}
```

---

## Error Responses

All endpoints return consistent error format:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "field_name": "Error message"
  }
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Unauthorized. Please login first."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "An error occurred. Please try again later."
}
```

---

## Rate Limiting

- **Default:** 60 requests per minute per user
- **File uploads:** 10 requests per minute
- **Wishlist operations:** 30 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
```

---

## Best Practices

### Profile Management
1. Update profile incrementally (don't send all fields every time)
2. Cache profile data on client side
3. Refresh profile after avatar upload
4. Show loading states during updates

### Avatar Upload
1. Compress images before upload
2. Show preview before uploading
3. Implement crop functionality
4. Use progressive image loading

### Bank Account
1. Mask account numbers in display
2. Require re-authentication for sensitive operations
3. Show verification status clearly
4. Log all bank account changes

### Social Media
1. Validate URLs before submission
2. Show platform icons for better UX
3. Implement drag-and-drop reordering
4. Cache public links

### Wishlist
1. Show visual feedback when adding/removing
2. Sync wishlist count in real-time
3. Implement optimistic UI updates
4. Show wishlist status on course cards

---

## Webhooks

### Profile Updated
```json
{
  "event": "profile.updated",
  "data": {
    "user_id": "uuid",
    "updated_fields": ["full_name", "bio"],
    "timestamp": "2025-01-01T10:00:00Z"
  }
}
```

### Avatar Uploaded
```json
{
  "event": "avatar.uploaded",
  "data": {
    "user_id": "uuid",
    "avatar_url": "https://domain.com/avatars/user.jpg",
    "timestamp": "2025-01-01T10:00:00Z"
  }
}
```

### Bank Account Updated
```json
{
  "event": "bank_account.updated",
  "data": {
    "user_id": "uuid",
    "bank_name": "Bank BCA",
    "timestamp": "2025-01-01T10:00:00Z"
  }
}
```

---

## Support

For API support:
- Email: api-support@fullstacktalent.id
- Documentation: https://docs.fullstacktalent.id
- Status: https://status.fullstacktalent.id