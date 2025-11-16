# Enrollment System API Documentation

## Base URL
```
Development: http://localhost:8080/api
Production: https://api.fullstacktalent.id/api
```

---

## Enrollment Endpoints

### 1. Enroll to Course

Enroll a student to a course.

**Endpoint:** `POST /api/enrollments`

**Authentication:** Required (JWT Token - Student role)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "course_id": "uuid-of-course",
  "payment_id": "uuid-of-payment" // optional, if payment already completed
}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Enrollment berhasil",
  "data": {
    "id": "enrollment-uuid",
    "student_id": "student-uuid",
    "enrollable_type": "course",
    "enrollable_id": "course-uuid",
    "payment_id": "payment-uuid",
    "status": "active",
    "progress_percentage": 0.00,
    "started_at": "2025-11-01 14:00:00",
    "course_title": "Complete Web Development",
    "course_slug": "complete-web-development",
    "thumbnail_url": "https://example.com/image.jpg",
    "level": "beginner",
    "duration_hours": 40,
    "total_modules": 10,
    "total_lessons": 50,
    "tutor_name": "John Doe",
    "tutor_avatar": "https://example.com/avatar.jpg",
    "created_at": "2025-11-01 14:00:00"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: Already enrolled, course not available, or validation error
- `401`: Unauthorized
- `404`: Course not found

---

### 2. Get My Courses

Get all courses the student is enrolled in.

**Endpoint:** `GET /api/enrollments/my-courses`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): active|completed|pending|cancelled|expired

**Example Request:**
```bash
GET /api/enrollments/my-courses?status=active
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Enrollments retrieved successfully",
  "data": [
    {
      "id": "enrollment-uuid",
      "student_id": "student-uuid",
      "enrollable_type": "course",
      "enrollable_id": "course-uuid",
      "status": "active",
      "progress_percentage": 45.50,
      "started_at": "2025-10-15 10:00:00",
      "completed_at": null,
      "course_title": "Complete Web Development",
      "course_slug": "complete-web-development",
      "thumbnail_url": "https://example.com/image.jpg",
      "level": "beginner",
      "duration_hours": 40,
      "total_modules": 10,
      "total_lessons": 50,
      "average_rating": 4.8,
      "tutor_name": "John Doe",
      "tutor_avatar": "https://example.com/avatar.jpg",
      "progress_stats": {
        "total_lessons": 50,
        "completed_lessons": 23,
        "in_progress_lessons": 1,
        "remaining_lessons": 27,
        "progress_percentage": 45.50,
        "time_spent_minutes": 690,
        "time_spent_hours": 11.5,
        "days_since_enrollment": 17,
        "status": "active",
        "is_completed": false,
        "certificate_issued": false
      },
      "next_lesson": {
        "id": "lesson-uuid",
        "title": "Understanding JavaScript Objects",
        "type": "video",
        "duration_minutes": 25,
        "module_title": "JavaScript Fundamentals"
      },
      "created_at": "2025-10-15 10:00:00"
    }
  ],
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 3. Get Enrollment Progress Detail

Get detailed progress information for a specific enrollment.

**Endpoint:** `GET /api/enrollments/{id}/progress`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Enrollment ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Progress retrieved successfully",
  "data": {
    "enrollment": {
      "id": "enrollment-uuid",
      "student_id": "student-uuid",
      "status": "active",
      "progress_percentage": 45.50,
      "started_at": "2025-10-15 10:00:00",
      "course_title": "Complete Web Development",
      "course_slug": "complete-web-development",
      "description": "Full course description...",
      "thumbnail_url": "https://example.com/image.jpg",
      "level": "beginner",
      "duration_hours": 40,
      "total_modules": 10,
      "total_lessons": 50,
      "tutor_name": "John Doe",
      "tutor_email": "john@example.com",
      "category_name": "Web Development"
    },
    "statistics": {
      "total_lessons": 50,
      "completed_lessons": 23,
      "in_progress_lessons": 1,
      "remaining_lessons": 27,
      "progress_percentage": 45.50,
      "time_spent_minutes": 690,
      "time_spent_hours": 11.5,
      "days_since_enrollment": 17,
      "status": "active",
      "started_at": "2025-10-15 10:00:00",
      "completed_at": null,
      "is_completed": false,
      "certificate_issued": false
    },
    "module_progress": [
      {
        "module_id": "module-uuid-1",
        "module_title": "Introduction to HTML",
        "total_lessons": 5,
        "completed_lessons": 5,
        "progress_percentage": 100.00,
        "lessons": [
          {
            "lesson_id": "lesson-uuid-1",
            "lesson_title": "What is HTML?",
            "type": "video",
            "duration_minutes": 15,
            "status": "completed",
            "progress_percentage": 100.00,
            "completed_at": "2025-10-15 11:00:00"
          }
        ]
      },
      {
        "module_id": "module-uuid-2",
        "module_title": "CSS Fundamentals",
        "total_lessons": 8,
        "completed_lessons": 6,
        "progress_percentage": 75.00,
        "lessons": [
          {
            "lesson_id": "lesson-uuid-8",
            "lesson_title": "CSS Flexbox",
            "type": "video",
            "duration_minutes": 30,
            "status": "in_progress",
            "progress_percentage": 65.00,
            "completed_at": null
          }
        ]
      }
    ],
    "next_lesson": {
      "id": "lesson-uuid",
      "title": "Understanding JavaScript Objects",
      "type": "video",
      "duration_minutes": 25,
      "content_url": "https://example.com/lesson.mp4",
      "module_title": "JavaScript Fundamentals"
    },
    "last_accessed_lesson": {
      "lesson_id": "lesson-uuid-8",
      "lesson_title": "CSS Flexbox",
      "module_title": "CSS Fundamentals",
      "status": "in_progress",
      "updated_at": "2025-11-01 13:30:00"
    }
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `403`: Not authorized to access this enrollment
- `404`: Enrollment not found

---

### 4. Get Student Dashboard

Get dashboard overview with learning statistics.

**Endpoint:** `GET /api/enrollments/dashboard`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "active_courses": 3,
    "completed_courses": 5,
    "total_time_spent_hours": 87.5,
    "current_streak_days": 7,
    "recent_enrollments": [
      {
        "id": "enrollment-uuid",
        "course_title": "Complete Web Development",
        "thumbnail_url": "https://example.com/image.jpg",
        "progress_percentage": 45.50,
        "status": "active"
      }
    ],
    "learning_activity_7days": [
      {
        "date": "2025-11-01",
        "lessons_completed": 3,
        "minutes_spent": 90
      },
      {
        "date": "2025-10-31",
        "lessons_completed": 2,
        "minutes_spent": 60
      }
    ]
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 5. Continue Learning

Get the most recent course and lesson to resume learning.

**Endpoint:** `GET /api/enrollments/continue-learning`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Continue learning data retrieved",
  "data": {
    "id": "enrollment-uuid",
    "course_title": "Complete Web Development",
    "course_slug": "complete-web-development",
    "thumbnail_url": "https://example.com/image.jpg",
    "progress_percentage": 45.50,
    "lesson_id": "lesson-uuid",
    "last_position": 145
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 6. Start Lesson

Mark a lesson as started and begin tracking progress.

**Endpoint:** `POST /api/enrollments/{id}/lessons/{lesson_id}/start`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Enrollment ID
- `lesson_id` (required): Lesson ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Lesson started successfully",
  "data": {
    "id": "progress-uuid",
    "enrollment_id": "enrollment-uuid",
    "lesson_id": "lesson-uuid",
    "lesson_title": "Understanding JavaScript Objects",
    "lesson_description": "Learn about objects in JavaScript",
    "type": "video",
    "content_url": "https://example.com/lesson.mp4",
    "duration_minutes": 25,
    "status": "in_progress",
    "progress_percentage": 0.00,
    "module_title": "JavaScript Fundamentals",
    "created_at": "2025-11-01 14:00:00"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 7. Update Lesson Progress

Update progress percentage for a lesson (e.g., video watch progress).

**Endpoint:** `PUT /api/enrollments/{id}/lessons/{lesson_id}/progress`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): Enrollment ID
- `lesson_id` (required): Lesson ID

**Request Body:**
```json
{
  "progress_percentage": 75.50,
  "last_position": 450
}
```

**Field Validations:**
- `progress_percentage` (required): 0-100
- `last_position` (optional): Last video position in seconds

**Success Response (200):**
```json
{
  "status": true,
  "message": "Progress updated successfully",
  "data": {
    "lesson_progress": {
      "id": "progress-uuid",
      "lesson_id": "lesson-uuid",
      "lesson_title": "Understanding JavaScript Objects",
      "status": "in_progress",
      "progress_percentage": 75.50,
      "last_position": 450
    },
    "enrollment_stats": {
      "total_lessons": 50,
      "completed_lessons": 23,
      "progress_percentage": 46.00
    }
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 8. Complete Lesson

Mark a lesson as completed.

**Endpoint:** `POST /api/enrollments/{id}/lessons/{lesson_id}/complete`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Enrollment ID
- `lesson_id` (required): Lesson ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Lesson completed successfully",
  "data": {
    "enrollment_stats": {
      "total_lessons": 50,
      "completed_lessons": 24,
      "progress_percentage": 48.00,
      "time_spent_hours": 12.0
    },
    "next_lesson": {
      "id": "next-lesson-uuid",
      "title": "JavaScript Arrays and Methods",
      "type": "video",
      "duration_minutes": 30,
      "module_title": "JavaScript Fundamentals"
    }
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

---

### 9. Get Certificate

Get certificate for completed course.

**Endpoint:** `GET /api/enrollments/{id}/certificate`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (required): Enrollment ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Certificate berhasil diterbitkan",
  "data": {
    "certificate_url": "https://api.fullstacktalent.id/certificates/enrollment-uuid.pdf"
  },
  "timestamp": "2025-11-01 14:00:00"
}
```

**Error Responses:**
- `400`: Course not completed yet
- `403`: Not authorized

---

### 10. Get Recommended Courses

Get personalized course recommendations based on learning history.

**Endpoint:** `GET /api/enrollments/recommendations`

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional): Number of recommendations (default: 5, max: 20)

**Success Response (200):**
```json
{
  "status": true,
  "message": "Recommended courses retrieved successfully",
  "data": [
    {
      "id": "course-uuid",
      "title": "Advanced JavaScript Patterns",
      "slug": "advanced-javascript-patterns",
      "thumbnail_url": "https://example.com/image.jpg",
      "price": 299000,
      "level": "advanced",
      "average_rating": 4.9,
      "total_enrolled": 250,
      "tutor_name": "Jane Smith",
      "category_name": "Web Development"
    }
  ],
  "timestamp": "2025-11-01 14:00:00"
}
```

---

## Testing Examples

### Using cURL

#### 1. Enroll to Course
```bash
curl -X POST http://localhost:8080/api/enrollments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "course-uuid"
  }'
```

#### 2. Get My Courses
```bash
curl -X GET http://localhost:8080/api/enrollments/my-courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 3. Get Progress Detail
```bash
curl -X GET http://localhost:8080/api/enrollments/enrollment-uuid/progress \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Start Lesson
```bash
curl -X POST http://localhost:8080/api/enrollments/enrollment-uuid/lessons/lesson-uuid/start \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Update Progress
```bash
curl -X PUT http://localhost:8080/api/enrollments/enrollment-uuid/lessons/lesson-uuid/progress \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "progress_percentage": 75.5,
    "last_position": 450
  }'
```

#### 6. Complete Lesson
```bash
curl -X POST http://localhost:8080/api/enrollments/enrollment-uuid/lessons/lesson-uuid/complete \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Enrollment Status Values

| Status | Description |
|--------|-------------|
| pending | Waiting for payment confirmation |
| active | Currently learning |
| completed | Course finished |
| cancelled | Enrollment cancelled |
| expired | Enrollment period expired |

---

## Progress Tracking Flow

```
1. Student enrolls → POST /api/enrollments
2. Get course list → GET /api/enrollments/my-courses
3. View progress → GET /api/enrollments/{id}/progress
4. Start lesson → POST /api/enrollments/{id}/lessons/{lesson_id}/start
5. Update progress → PUT /api/enrollments/{id}/lessons/{lesson_id}/progress
6. Complete lesson → POST /api/enrollments/{id}/lessons/{lesson_id}/complete
7. Complete course → GET /api/enrollments/{id}/certificate
```

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025