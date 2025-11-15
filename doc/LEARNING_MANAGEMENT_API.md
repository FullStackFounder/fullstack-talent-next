# Learning Management API Documentation

## Overview
Complete API documentation for Learning Management System features including Course Modules, Lessons, Progress Tracking, Video Streaming, Quizzes, and Certificates.

---

## 1. Course Modules API

### Get Course Modules
```
GET /api/courses/{courseId}/modules
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "title": "Introduction to React",
      "description": "Learn React basics",
      "order_index": 1,
      "is_preview": 0,
      "lesson_count": 5,
      "created_at": "2025-01-01 10:00:00",
      "updated_at": "2025-01-01 10:00:00"
    }
  ]
}
```

### Create Module
```
POST /api/courses/{courseId}/modules
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Advanced React Patterns",
  "description": "Learn advanced concepts",
  "order_index": 2,
  "is_preview": 0
}
```

### Update Module
```
PUT /api/modules/{moduleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Module Title",
  "description": "Updated description"
}
```

### Delete Module
```
DELETE /api/modules/{moduleId}
Authorization: Bearer {token}
```

### Reorder Modules
```
POST /api/courses/{courseId}/modules/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "modules": [
    {"id": "uuid1", "order_index": 1},
    {"id": "uuid2", "order_index": 2}
  ]
}
```

---

## 2. Course Lessons API

### Get Module Lessons
```
GET /api/modules/{moduleId}/lessons
Authorization: Bearer {token}
```

### Create Lesson
```
POST /api/modules/{moduleId}/lessons
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Introduction to Hooks",
  "description": "Learn about React Hooks",
  "type": "video",
  "content_url": "video_id_from_streaming_service",
  "duration_minutes": 25,
  "order_index": 1,
  "is_preview": 0
}
```

**Lesson Types:**
- `video` - Video content
- `text` - Text/Article content
- `quiz` - Quiz/Assessment
- `assignment` - Assignment/Project

### Update Lesson
```
PUT /api/lessons/{lessonId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Lesson Title",
  "duration_minutes": 30
}
```

### Delete Lesson
```
DELETE /api/lessons/{lessonId}
Authorization: Bearer {token}
```

---

## 3. Progress Tracking API

### Get Course Progress
```
GET /api/enrollments/{enrollmentId}/progress
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "enrollment_id": "uuid",
    "overall_progress": 65.5,
    "total_lessons": 20,
    "completed_lessons": 13,
    "in_progress_lessons": 2,
    "module_progress": [
      {
        "module_id": "uuid",
        "module_title": "React Basics",
        "lessons": [
          {
            "id": "uuid",
            "lesson_id": "uuid",
            "lesson_title": "useState Hook",
            "status": "completed",
            "progress_percentage": 100,
            "completed_at": "2025-01-15 14:30:00"
          }
        ]
      }
    ]
  }
}
```

### Get Lesson Progress
```
GET /api/enrollments/{enrollmentId}/lessons/{lessonId}/progress
Authorization: Bearer {token}
```

### Update Lesson Progress
```
POST /api/enrollments/{enrollmentId}/lessons/{lessonId}/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "progress_percentage": 75,
  "last_position": 450,
  "status": "in_progress"
}
```

### Complete Lesson
```
POST /api/enrollments/{enrollmentId}/lessons/{lessonId}/complete
Authorization: Bearer {token}
```

### Get Next Lesson
```
GET /api/enrollments/{enrollmentId}/next-lesson
Authorization: Bearer {token}
```

---

## 4. Video Streaming API

### Get Video Stream URL
```
GET /api/videos/{videoId}/stream?lesson_id={lessonId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "type": "hls",
    "url": "https://stream.cloudflare.com/video.m3u8?token=xxx",
    "thumbnail": "https://stream.cloudflare.com/thumbnail.jpg",
    "expires_at": "2025-01-01 12:00:00"
  }
}
```

### Upload Video (Tutor Only)
```
POST /api/videos/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

video: [file]
title: "Introduction Video"
description: "Course intro"
```

### Track Watch Time
```
POST /api/videos/{videoId}/track
Authorization: Bearer {token}
Content-Type: application/json

{
  "lesson_id": "uuid",
  "watch_time": 300,
  "position": 450
}
```

---

## 5. Quiz Management API

### Get Quiz Details
```
GET /api/quizzes/{quizId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "lesson_id": "uuid",
    "title": "React Hooks Quiz",
    "description": "Test your knowledge",
    "duration_minutes": 30,
    "passing_score": 70,
    "max_attempts": 3,
    "questions": [
      {
        "id": "uuid",
        "question_text": "What is useState?",
        "question_type": "multiple_choice",
        "points": 5,
        "options": [
          {
            "id": "uuid",
            "option_text": "A React Hook",
            "order_index": 0
          }
        ]
      }
    ],
    "statistics": {
      "total_attempts": 150,
      "average_score": 78.5,
      "pass_rate": 85.5
    }
  }
}
```

### Create Quiz
```
POST /api/lessons/{lessonId}/quizzes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Final Assessment",
  "description": "Final test for the course",
  "duration_minutes": 45,
  "passing_score": 80,
  "max_attempts": 2,
  "shuffle_questions": 1,
  "show_correct_answers": 1
}
```

### Add Question to Quiz
```
POST /api/quizzes/{quizId}/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "question_text": "What is the purpose of useEffect?",
  "question_type": "multiple_choice",
  "points": 10,
  "explanation": "useEffect handles side effects",
  "options": [
    {
      "text": "Handle side effects",
      "is_correct": 1
    },
    {
      "text": "Render components",
      "is_correct": 0
    }
  ]
}
```

**Question Types:**
- `multiple_choice` - Multiple choice with one correct answer
- `true_false` - True or False question
- `short_answer` - Short text answer (needs manual grading)
- `essay` - Long essay answer (needs manual grading)

---

## 6. Quiz Attempts API

### Start Quiz Attempt
```
POST /api/quizzes/{quizId}/attempts/start
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Quiz attempt started",
  "data": {
    "attempt": {
      "id": "uuid",
      "quiz_id": "uuid",
      "attempt_number": 1,
      "status": "in_progress",
      "started_at": "2025-01-01 10:00:00",
      "questions": [...]
    },
    "quiz": {
      "title": "React Quiz",
      "duration_minutes": 30,
      "total_questions": 10
    }
  }
}
```

### Submit Answer
```
POST /api/attempts/{attemptId}/answers
Authorization: Bearer {token}
Content-Type: application/json

{
  "question_id": "uuid",
  "selected_option_id": "uuid"
}
```

For essay/short answer:
```json
{
  "question_id": "uuid",
  "answer_text": "My answer here..."
}
```

### Submit Quiz
```
POST /api/attempts/{attemptId}/submit
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Quiz submitted successfully",
  "data": {
    "attempt": {...},
    "score": 85.5,
    "passed": true,
    "total_points": 100,
    "earned_points": 85,
    "passing_score": 70,
    "time_spent_seconds": 1450,
    "answers": [
      {
        "question_id": "uuid",
        "question_text": "What is useState?",
        "selected_option": {...},
        "correct_option": {...},
        "is_correct": true,
        "points_earned": 10,
        "explanation": "..."
      }
    ]
  }
}
```

### Get Quiz Results
```
GET /api/attempts/{attemptId}/results
Authorization: Bearer {token}
```

### Get My Quiz Attempts
```
GET /api/quizzes/{quizId}/my-attempts
Authorization: Bearer {token}
```

### Abandon Attempt
```
POST /api/attempts/{attemptId}/abandon
Authorization: Bearer {token}
```

---

## 7. Certificates API

### Generate Certificate
```
POST /api/enrollments/{enrollmentId}/generate-certificate
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Certificate generated successfully",
  "data": {
    "id": "uuid",
    "certificate_number": "CERT-FST-202501-ABC12345",
    "verification_code": "A1B2C3D4E5F6",
    "student_name": "John Doe",
    "course_title": "Fullstack Web Development",
    "issue_date": "2025-01-15",
    "completion_date": "2025-01-15",
    "final_score": 88.5,
    "grade": "A",
    "certificate_url": "https://domain.com/uploads/certificates/cert.pdf"
  }
}
```

### Get My Certificates
```
GET /api/certificates/my-certificates
Authorization: Bearer {token}
```

### Get Certificate Details
```
GET /api/certificates/{certificateId}
Authorization: Bearer {token}
```

### Download Certificate
```
GET /api/certificates/{certificateId}/download
Authorization: Bearer {token}
```

Returns PDF file for download.

### Verify Certificate (Public)
```
GET /api/certificates/verify/{verificationCode}
```

**No authentication required** - Public endpoint for employers to verify certificates.

**Response:**
```json
{
  "status": "success",
  "message": "Certificate verified successfully",
  "data": {
    "is_valid": true,
    "certificate_number": "CERT-FST-202501-ABC12345",
    "student_name": "John Doe",
    "course_title": "Fullstack Web Development",
    "issue_date": "2025-01-15",
    "completion_date": "2025-01-15",
    "duration_hours": 40,
    "final_score": 88.5,
    "grade": "A"
  }
}
```

### Regenerate Certificate (Admin Only)
```
POST /api/certificates/{certificateId}/regenerate
Authorization: Bearer {token}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": {
    "field_name": "Validation error message"
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

All endpoints (except certificate verification) require Bearer token authentication:

```
Authorization: Bearer {your_jwt_token}
```

---

## Rate Limiting

- **Standard endpoints:** 60 requests per minute
- **Video streaming:** 120 requests per minute
- **Quiz attempts:** 30 requests per minute

---

## Webhooks

### Certificate Generated
```json
{
  "event": "certificate.generated",
  "data": {
    "certificate_id": "uuid",
    "student_id": "uuid",
    "course_id": "uuid"
  },
  "timestamp": "2025-01-01T10:00:00Z"
}
```

### Quiz Completed
```json
{
  "event": "quiz.completed",
  "data": {
    "attempt_id": "uuid",
    "student_id": "uuid",
    "quiz_id": "uuid",
    "score": 85.5,
    "passed": true
  },
  "timestamp": "2025-01-01T10:00:00Z"
}
```

---

## Best Practices

1. **Progress Tracking:** Update progress every 30 seconds during video playback
2. **Quiz Attempts:** Implement client-side timer for quiz duration
3. **Certificate Generation:** Only trigger after enrollment is completed
4. **Video Streaming:** Use signed URLs and refresh before expiration
5. **Error Handling:** Implement retry logic for failed requests

---

## Support

For API support, contact: api-support@fullstacktalent.id