# Course Management API Documentation

## Base URL
```
Development: http://localhost:8080/api
Production: https://api.fullstacktalent.id/api
```

---

## Course Endpoints

### 1. Get All Courses (with filters and pagination)

Get list of courses with advanced filtering and pagination.

**Endpoint:** `GET /api/courses`

**Authentication:** Not required (public endpoint)

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number | 1 |
| per_page | integer | Items per page (max 100) | 20 |
| search | string | Search in title, description, tags | - |
| category_id | string | Filter by category | - |
| level | string | beginner, intermediate, advanced | - |
| min_price | decimal | Minimum price filter | - |
| max_price | decimal | Maximum price filter | - |
| is_free | boolean | Show only free courses | - |
| is_featured | boolean | Show only featured courses | - |
| sort_by | string | created_at, price, title, average_rating, total_enrolled | created_at |
| sort_order | string | ASC or DESC | DESC |
| my_courses | boolean | Show my courses (requires auth & tutor role) | false |
| status | string | Filter by status (admin only) | - |

**Example Request:**
```bash
GET /api/courses?page=1&per_page=20&level=beginner&search=web&sort_by=price&sort_order=ASC
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Complete Web Development Bootcamp",
      "slug": "complete-web-development-bootcamp",
      "short_description": "Learn web development from zero to hero",
      "description": "Full description...",
      "thumbnail_url": "https://example.com/image.jpg",
      "price": 299000,
      "discount_price": 199000,
      "level": "beginner",
      "language": "Indonesia",
      "duration_hours": 40,
      "total_modules": 10,
      "total_lessons": 50,
      "total_enrolled": 150,
      "average_rating": 4.8,
      "total_reviews": 45,
      "is_featured": true,
      "status": "published",
      "tutor_id": "uuid",
      "tutor_name": "John Doe",
      "tutor_avatar": "https://example.com/avatar.jpg",
      "category_id": "uuid",
      "category_name": "Web Development",
      "requirements": ["Basic computer knowledge"],
      "learning_outcomes": ["Build responsive websites", "Master JavaScript"],
      "tags": ["html", "css", "javascript"],
      "created_at": "2025-11-01 10:00:00",
      "published_at": "2025-11-01 12:00:00"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_more": true
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 2. Get Course Detail

Get detailed information about a specific course including modules and lessons.

**Endpoint:** `GET /api/courses/{id}`

**Authentication:** Not required for published courses

**URL Parameters:**
- `id` (required): Course ID or slug

**Example Request:**
```bash
GET /api/courses/uuid
GET /api/courses/complete-web-development-bootcamp
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Course retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Complete Web Development Bootcamp",
    "slug": "complete-web-development-bootcamp",
    "description": "Full description...",
    "short_description": "Learn web development from zero to hero",
    "thumbnail_url": "https://example.com/image.jpg",
    "preview_video_url": "https://example.com/preview.mp4",
    "price": 299000,
    "discount_price": 199000,
    "level": "beginner",
    "language": "Indonesia",
    "duration_hours": 40,
    "total_modules": 10,
    "total_lessons": 50,
    "total_enrolled": 150,
    "average_rating": 4.8,
    "total_reviews": 45,
    "is_featured": true,
    "status": "published",
    "tutor_id": "uuid",
    "tutor_name": "John Doe",
    "tutor_email": "john@example.com",
    "tutor_avatar": "https://example.com/avatar.jpg",
    "tutor_bio": "Experienced developer...",
    "category_id": "uuid",
    "category_name": "Web Development",
    "category_slug": "web-development",
    "requirements": ["Basic computer knowledge", "Internet connection"],
    "learning_outcomes": ["Build responsive websites", "Master JavaScript"],
    "tags": ["html", "css", "javascript", "react"],
    "modules": [
      {
        "id": "uuid",
        "title": "Introduction to HTML",
        "description": "Learn HTML basics",
        "order_index": 1,
        "is_preview": true,
        "total_lessons": 5,
        "total_duration": 90,
        "lessons": [
          {
            "id": "uuid",
            "title": "What is HTML?",
            "description": "Introduction to HTML",
            "type": "video",
            "content_url": "https://example.com/lesson1.mp4",
            "duration_minutes": 15,
            "order_index": 1,
            "is_preview": true
          }
        ]
      }
    ],
    "created_at": "2025-11-01 10:00:00",
    "published_at": "2025-11-01 12:00:00"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `404`: Course not found
- `403`: Course not published and user doesn't have access

---

### 3. Create Course

Create a new course (Tutor only).

**Endpoint:** `POST /api/courses`

**Authentication:** Required (JWT Token - Tutor role)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete Web Development Bootcamp",
  "description": "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners who want to become full-stack developers.",
  "short_description": "Learn web development from zero to hero in 12 weeks",
  "price": 299000,
  "discount_price": 199000,
  "level": "beginner",
  "language": "Indonesia",
  "category_id": "uuid",
  "thumbnail_url": "https://example.com/image.jpg",
  "preview_video_url": "https://example.com/preview.mp4",
  "requirements": [
    "Basic computer knowledge",
    "Internet connection",
    "Passion to learn"
  ],
  "learning_outcomes": [
    "Build responsive websites with HTML & CSS",
    "Master JavaScript fundamentals",
    "Create interactive web apps with React",
    "Build REST APIs with Node.js"
  ],
  "tags": ["html", "css", "javascript", "react", "nodejs"]
}
```

**Field Validations:**
- `title` (required): 10-255 characters
- `description` (required): Minimum 50 characters
- `short_description` (optional): Maximum 500 characters
- `price` (required): Decimal, >= 0
- `discount_price` (optional): Decimal, >= 0
- `level` (required): beginner|intermediate|advanced
- `language` (optional): Default "Indonesia"
- `category_id` (optional): Valid category UUID
- `requirements` (optional): Array of strings
- `learning_outcomes` (optional): Array of strings
- `tags` (optional): Array of strings

**Success Response (201):**
```json
{
  "status": true,
  "message": "Course berhasil dibuat",
  "data": {
    "id": "uuid",
    "title": "Complete Web Development Bootcamp",
    "slug": "complete-web-development-bootcamp",
    "status": "draft",
    "tutor_id": "uuid",
    // ... full course data
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `403`: Only tutors can create courses
- `422`: Validation errors
- `500`: Server error

---

### 4. Update Course

Update existing course (Tutor only - own courses).

**Endpoint:** `PUT /api/courses/{id}`

**Authentication:** Required (JWT Token - Tutor role)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): Course ID

**Request Body (all fields optional):**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description with more details about the course content",
  "short_description": "Updated short description",
  "price": 349000,
  "discount_price": 249000,
  "level": "intermediate",
  "category_id": "new-category-uuid",
  "thumbnail_url": "https://example.com/new-image.jpg",
  "requirements": [
    "HTML basics",
    "CSS fundamentals"
  ],
  "learning_outcomes": [
    "Build advanced web applications",
    "Master modern JavaScript"
  ],
  "tags": ["javascript", "react", "advanced"]
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Course berhasil diupdate",
  "data": {
    // Updated course data
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: No data to update or invalid course ID
- `403`: Not authorized to update this course
- `404`: Course not found
- `422`: Validation errors

---

### 5. Delete Course

Delete a course (Tutor only - own courses).

**Endpoint:** `DELETE /api/courses/{id}`

**Authentication:** Required (JWT Token - Tutor role)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Course ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Course berhasil dihapus",
  "data": {
    "deleted_at": "2025-11-01 14:00:00"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: Course has enrollments and cannot be deleted
- `403`: Not authorized to delete this course
- `404`: Course not found

---

### 6. Get Featured Courses

Get list of featured courses.

**Endpoint:** `GET /api/courses/featured`

**Authentication:** Not required

**Query Parameters:**
- `limit` (optional): Number of courses (default: 6, max: 20)

**Example Request:**
```bash
GET /api/courses/featured?limit=10
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Featured courses retrieved successfully",
  "data": [
    // Array of featured courses
  ],
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 7. Search Courses

Search courses by keyword.

**Endpoint:** `GET /api/courses/search`

**Authentication:** Not required

**Query Parameters:**
- `q` (required): Search keyword (minimum 3 characters)
- `limit` (optional): Number of results (default: 20, max: 50)

**Example Request:**
```bash
GET /api/courses/search?q=javascript&limit=10
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Search results",
  "data": [
    // Array of matching courses
  ],
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: Keyword too short (< 3 characters)

---

### 8. Publish Course

Publish a draft course (Tutor only - own courses).

**Endpoint:** `POST /api/courses/{id}/publish`

**Authentication:** Required (JWT Token - Tutor role)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Course ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Course berhasil dipublikasi",
  "data": {
    "published_at": "2025-11-01 14:00:00"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: Course must have at least 1 module and 1 lesson
- `403`: Not authorized to publish this course
- `404`: Course not found

---

## Testing Examples

### Using cURL

#### 1. Get All Courses
```bash
curl -X GET "http://localhost:8080/api/courses?page=1&per_page=10&level=beginner"
```

#### 2. Get Course Detail
```bash
curl -X GET "http://localhost:8080/api/courses/uuid-or-slug"
```

#### 3. Create Course
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development Fundamentals",
    "description": "Learn the basics of web development including HTML, CSS, and JavaScript. This course is designed for complete beginners.",
    "price": 199000,
    "level": "beginner"
  }'
```

#### 4. Update Course
```bash
curl -X PUT http://localhost:8080/api/courses/uuid \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Course Title",
    "price": 249000
  }'
```

#### 5. Delete Course
```bash
curl -X DELETE http://localhost:8080/api/courses/uuid \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 6. Publish Course
```bash
curl -X POST http://localhost:8080/api/courses/uuid/publish \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Common Use Cases

### Use Case 1: Browse Courses as Student
```
1. GET /api/courses (list all published courses)
2. GET /api/courses?level=beginner&is_free=true (filter free beginner courses)
3. GET /api/courses/{id} (view course details)
```

### Use Case 2: Create Course as Tutor
```
1. POST /api/auth/login (get access token)
2. POST /api/courses (create draft course)
3. POST /api/courses/{id}/modules (add modules - coming soon)
4. POST /api/courses/{id}/modules/{module_id}/lessons (add lessons - coming soon)
5. POST /api/courses/{id}/publish (publish course)
```

### Use Case 3: Manage My Courses as Tutor
```
1. GET /api/courses?my_courses=true (get my courses)
2. PUT /api/courses/{id} (update course)
3. DELETE /api/courses/{id} (delete course if needed)
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 422  | Validation Error |
| 500  | Internal Server Error |

---

## Course Status Values

| Status | Description |
|--------|-------------|
| draft | Course is being created |
| pending_review | Submitted for review |
| approved | Approved by admin |
| rejected | Rejected by admin |
| published | Live and available to students |
| archived | No longer available |

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025