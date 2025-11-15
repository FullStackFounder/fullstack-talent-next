# Review & Rating System API Documentation

## Overview
Sistem review dan rating untuk platform Fullstack Talent yang mencakup:
- Submit, update, dan delete reviews
- Rating aggregation
- Flag review yang tidak pantas
- Moderasi review oleh admin
- Statistik dan analytics

---

## Authentication
Semua endpoints memerlukan authentication kecuali dinyatakan lain.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## User/Student Endpoints

### 1. Get Reviews

**Endpoint:** `GET /api/reviews/{type}/{id}`

**Description:** Mengambil semua reviews untuk suatu item (course, class, bootcamp, atau tutor)

**Parameters:**
- `type` (path): course | class | bootcamp | tutor
- `id` (path): ID dari item yang direview

**Query Parameters:**
- `rating` (optional): Filter by rating (1-5)
- `has_comment` (optional): Filter reviews dengan comment (true/false)
- `verified_purchase` (optional): Filter verified purchases (true/false)
- `sort_by` (optional): created_at | helpful | rating (default: created_at)
- `sort_order` (optional): ASC | DESC (default: DESC)
- `per_page` (optional): Items per page (default: 10)
- `page` (optional): Page number (default: 1)

**Example Request:**
```http
GET /api/reviews/course/abc-123-def?rating=5&per_page=10&page=1
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": "review-123",
        "student_id": "student-456",
        "student_name": "John Doe",
        "student_avatar": "https://example.com/avatar.jpg",
        "reviewable_type": "course",
        "reviewable_id": "abc-123-def",
        "rating": 5,
        "title": "Great course!",
        "comment": "Learned a lot from this course...",
        "is_verified_purchase": 1,
        "helpful_count": 15,
        "created_at": "2025-10-15T10:30:00Z",
        "updated_at": "2025-10-15T10:30:00Z"
      }
    ],
    "statistics": {
      "total_reviews": 150,
      "average_rating": 4.5,
      "rating_distribution": {
        "5": 80,
        "4": 45,
        "3": 15,
        "2": 7,
        "1": 3
      },
      "rating_percentages": {
        "5": 53.3,
        "4": 30.0,
        "3": 10.0,
        "2": 4.7,
        "1": 2.0
      },
      "with_comment": 120,
      "verified_purchases": 130
    },
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_items": 150,
      "total_pages": 15
    }
  }
}
```

---

### 2. Get Review Statistics

**Endpoint:** `GET /api/reviews/{type}/{id}/statistics`

**Description:** Mengambil statistik review untuk suatu item

**Example Request:**
```http
GET /api/reviews/course/abc-123-def/statistics
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_reviews": 150,
    "average_rating": 4.5,
    "rating_distribution": {
      "5": 80,
      "4": 45,
      "3": 15,
      "2": 7,
      "1": 3
    },
    "rating_percentages": {
      "5": 53.3,
      "4": 30.0,
      "3": 10.0,
      "2": 4.7,
      "1": 2.0
    },
    "with_comment": 120,
    "verified_purchases": 130
  }
}
```

---

### 3. Get My Review

**Endpoint:** `GET /api/reviews/my/{type}/{id}`

**Description:** Mengambil review user sendiri untuk suatu item

**Example Request:**
```http
GET /api/reviews/my/course/abc-123-def
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {
    "id": "review-123",
    "student_id": "student-456",
    "reviewable_type": "course",
    "reviewable_id": "abc-123-def",
    "rating": 5,
    "title": "Great course!",
    "comment": "Learned a lot from this course...",
    "is_verified_purchase": 1,
    "helpful_count": 15,
    "created_at": "2025-10-15T10:30:00Z",
    "updated_at": "2025-10-15T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review tidak ditemukan"
}
```

---

### 4. Submit Review

**Endpoint:** `POST /api/reviews`

**Description:** Mengirimkan review baru

**Request Body:**
```json
{
  "reviewable_type": "course",
  "reviewable_id": "abc-123-def",
  "rating": 5,
  "title": "Great course!",
  "comment": "Learned a lot from this course. The instructor explains everything clearly and the projects are very practical."
}
```

**Validation Rules:**
- `reviewable_type`: required, in_list[course,class,bootcamp,tutor]
- `reviewable_id`: required, max 36 characters
- `rating`: required, integer, 1-5
- `title`: optional, max 255 characters
- `comment`: optional, max 5000 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review berhasil disimpan",
  "data": {
    "review_id": "review-123",
    "review": {
      "id": "review-123",
      "student_id": "student-456",
      "reviewable_type": "course",
      "reviewable_id": "abc-123-def",
      "rating": 5,
      "title": "Great course!",
      "comment": "Learned a lot from this course...",
      "is_verified_purchase": 1,
      "helpful_count": 0,
      "created_at": "2025-10-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
```json
// Already reviewed
{
  "success": false,
  "message": "Anda sudah memberikan review untuk item ini"
}

// Validation error
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "rating": "Rating harus diisi"
  }
}
```

---

### 5. Update Review

**Endpoint:** `PUT /api/reviews/{id}`

**Description:** Mengupdate review yang sudah ada

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review berhasil diubah",
  "data": {
    "review": {
      "id": "review-123",
      "rating": 4,
      "title": "Updated title",
      "comment": "Updated comment...",
      "updated_at": "2025-10-15T11:00:00Z"
    }
  }
}
```

---

### 6. Delete Review

**Endpoint:** `DELETE /api/reviews/{id}`

**Description:** Menghapus review

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review berhasil dihapus"
}
```

---

### 7. Flag Review

**Endpoint:** `POST /api/reviews/{id}/flag`

**Description:** Melaporkan review yang tidak pantas

**Request Body:**
```json
{
  "reason": "spam",
  "severity": "high",
  "details": "This review contains spam links",
  "category": "content",
  "evidence": ["screenshot1.jpg", "screenshot2.jpg"]
}
```

**Validation Rules:**
- `reason`: required, in_list[spam,inappropriate,fake,offensive,copyright,misleading,harassment,other]
- `severity`: optional, in_list[low,medium,high,critical]
- `details`: optional, max 1000 characters
- `category`: optional, in_list[content,behavior,legal,quality,other]
- `evidence`: optional, array

**Success Response (201):**
```json
{
  "success": true,
  "message": "Laporan berhasil dikirim. Tim kami akan meninjau segera.",
  "data": {
    "flag_id": "flag-123",
    "flag_count": 3,
    "auto_hidden": false
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Anda sudah melaporkan review ini"
}
```

---

### 8. Mark Review as Helpful

**Endpoint:** `POST /api/reviews/{id}/helpful`

**Description:** Menandai review sebagai helpful

**Success Response (200):**
```json
{
  "success": true,
  "message": "Terima kasih atas feedback Anda",
  "data": {
    "helpful_count": 16
  }
}
```

---

## Admin Moderation Endpoints

### 9. Get All Reviews (Admin)

**Endpoint:** `GET /api/admin/reviews`

**Description:** Mengambil semua reviews (admin dashboard)

**Query Parameters:**
- `per_page`: Items per page (default: 20)
- `page`: Page number (default: 1)
- `search`: Search in title, comment, or user name
- `type`: Filter by reviewable_type
- `rating`: Filter by rating

**Example Request:**
```http
GET /api/admin/reviews?search=spam&rating=1&page=1
Authorization: Bearer admin_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": "review-123",
        "student_id": "student-456",
        "student_name": "John Doe",
        "student_email": "john@example.com",
        "reviewable_type": "course",
        "reviewable_id": "abc-123",
        "rating": 1,
        "title": "Bad course",
        "comment": "...",
        "created_at": "2025-10-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 150,
      "total_pages": 8
    }
  }
}
```

---

### 10. Get Flagged Reviews

**Endpoint:** `GET /api/admin/reviews/flagged`

**Description:** Mengambil semua review yang di-flag

**Query Parameters:**
- `severity`: Filter by severity (low, medium, high, critical)
- `reason`: Filter by reason
- `category`: Filter by category
- `is_urgent`: Filter urgent flags (true/false)
- `sort_by`: created_at | flag_count (default: created_at)
- `sort_order`: ASC | DESC (default: DESC)
- `per_page`: Items per page (default: 20)
- `page`: Page number

**Success Response (200):**
```json
{
  "success": true,
  "message": "Flagged reviews retrieved successfully",
  "data": {
    "flags": [
      {
        "id": "flag-123",
        "review_id": "review-456",
        "flagged_by": "user-789",
        "flagged_by_name": "Jane Doe",
        "reason": "spam",
        "severity": "high",
        "details": "Contains spam links",
        "status": "active",
        "is_urgent": 1,
        "total_flags": 3,
        "rating": 1,
        "comment": "Check out this link...",
        "created_at": "2025-10-15T10:30:00Z"
      }
    ],
    "statistics": {
      "by_status": {
        "active": 45,
        "resolved": 120,
        "dismissed": 30
      },
      "by_severity": {
        "critical": 5,
        "high": 15,
        "medium": 20,
        "low": 5
      },
      "by_reason": {
        "spam": 20,
        "inappropriate": 15,
        "fake": 10
      },
      "urgent_count": 8
    },
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 45,
      "total_pages": 3
    }
  }
}
```

---

### 11. Get Priority Reviews

**Endpoint:** `GET /api/admin/reviews/priority`

**Description:** Mengambil reviews dengan multiple flags (prioritas tinggi)

**Query Parameters:**
- `min_flags`: Minimum number of flags (default: 3)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Priority reviews retrieved successfully",
  "data": [
    {
      "review_id": "review-123",
      "flag_count": 5,
      "max_severity": "critical",
      "reasons": "spam,inappropriate,offensive",
      "rating": 1,
      "comment": "...",
      "reviewable_type": "course",
      "reviewable_id": "abc-123",
      "student_name": "John Doe"
    }
  ]
}
```

---

### 12. Resolve Flag

**Endpoint:** `POST /api/admin/reviews/flags/{id}/resolve`

**Description:** Menyelesaikan flag tanpa action pada review (dismiss)

**Request Body:**
```json
{
  "resolution": "Reviewed and found no violation. Flag dismissed."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Flag berhasil diselesaikan"
}
```

---

### 13. Delete Review (Admin)

**Endpoint:** `DELETE /api/admin/reviews/{id}`

**Description:** Menghapus review (moderator action)

**Request Body:**
```json
{
  "reason": "Contains spam content and violates community guidelines"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review berhasil dihapus"
}
```

---

### 14. Edit Review (Admin)

**Endpoint:** `PUT /api/admin/reviews/{id}`

**Description:** Mengedit konten review yang tidak pantas

**Request Body:**
```json
{
  "title": "Edited title (inappropriate content removed)",
  "comment": "Edited comment...",
  "edit_reason": "Removed inappropriate language and spam links"
}
```

**Validation Rules:**
- `edit_reason`: required, max 1000 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review berhasil diubah",
  "data": {
    "review": {
      "id": "review-123",
      "title": "Edited title",
      "comment": "Edited comment...",
      "updated_at": "2025-10-15T11:00:00Z"
    }
  }
}
```

---

### 15. Bulk Resolve Flags

**Endpoint:** `POST /api/admin/reviews/flags/bulk-resolve`

**Description:** Menyelesaikan multiple flags sekaligus

**Request Body:**
```json
{
  "flag_ids": ["flag-123", "flag-456", "flag-789"],
  "resolution": "Reviewed all flags. No violations found."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Berhasil menyelesaikan 3 flag",
  "data": {
    "resolved": 3,
    "failed": 0,
    "total": 3
  }
}
```

---

### 16. Get Moderation Statistics

**Endpoint:** `GET /api/admin/reviews/statistics`

**Description:** Mengambil statistik moderasi

**Query Parameters:**
- `start_date`: Filter start date (YYYY-MM-DD)
- `end_date`: Filter end date (YYYY-MM-DD)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "moderation_actions": {
      "by_action": {
        "delete_review": 25,
        "edit_review": 15,
        "resolve_flag": 80,
        "bulk_resolve_flag": 30
      },
      "total_actions": 150,
      "unique_moderators": 5,
      "unique_reviews": 120
    },
    "flag_statistics": {
      "by_status": {
        "active": 45,
        "resolved": 120,
        "dismissed": 30
      },
      "by_severity": {
        "critical": 5,
        "high": 15,
        "medium": 20,
        "low": 5
      },
      "urgent_count": 8
    },
    "moderator_performance": [
      {
        "performed_by": "admin-123",
        "moderator_name": "Admin User",
        "total_actions": 50,
        "deletions": 10,
        "approvals": 5,
        "edits": 8,
        "flag_resolutions": 27
      }
    ]
  }
}
```

---

### 17. Get Moderation History

**Endpoint:** `GET /api/admin/reviews/{id}/history`

**Description:** Mengambil riwayat moderasi untuk suatu review

**Success Response (200):**
```json
{
  "success": true,
  "message": "Moderation history retrieved successfully",
  "data": {
    "moderation_logs": [
      {
        "id": "log-123",
        "review_id": "review-456",
        "action": "edit_review",
        "performed_by": "admin-789",
        "performed_by_name": "Admin User",
        "description": "Review content edited by moderator",
        "old_value": "{...}",
        "new_value": "{...}",
        "created_at": "2025-10-15T11:00:00Z"
      }
    ],
    "flags": [
      {
        "id": "flag-123",
        "flagged_by": "user-456",
        "flagged_by_name": "Jane Doe",
        "reason": "spam",
        "severity": "high",
        "status": "resolved",
        "created_at": "2025-10-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 18. Mark Flag as Urgent

**Endpoint:** `POST /api/admin/reviews/flags/{id}/urgent`

**Description:** Menandai flag sebagai urgent

**Success Response (200):**
```json
{
  "success": true,
  "message": "Flag berhasil ditandai sebagai urgent"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Review tidak ditemukan"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "rating": "Rating harus diisi",
    "reviewable_type": "Tipe review tidak valid"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan sistem"
}
```

---

## Best Practices

1. **Rate Limiting**: Implementasikan rate limiting untuk prevent spam reviews
2. **Caching**: Cache review statistics untuk performance
3. **Validation**: Selalu validate input di frontend dan backend
4. **Moderation**: Review dengan multiple flags harus diprioritaskan
5. **Notifications**: Kirim notifikasi ke user ketika review mereka di-moderate
6. **Analytics**: Track review metrics untuk insights

---

## Database Indexes

Pastikan indexes berikut ada untuk performance optimal:

```sql
-- Reviews table
CREATE INDEX idx_reviewable ON reviews(reviewable_type, reviewable_id);
CREATE INDEX idx_student ON reviews(student_id);
CREATE INDEX idx_rating ON reviews(rating);
CREATE INDEX idx_helpful ON reviews(helpful_count);

-- Review flags table
CREATE INDEX idx_review_flag ON review_flags(review_id, status);
CREATE INDEX idx_severity ON review_flags(severity);
CREATE INDEX idx_urgent ON review_flags(is_urgent);

-- Review moderation logs
CREATE INDEX idx_review_log ON review_moderation_logs(review_id);
CREATE INDEX idx_moderator ON review_moderation_logs(performed_by);
```

---

## Testing Checklist

- [ ] User dapat submit review setelah enrollment completed
- [ ] User tidak bisa submit duplicate review
- [ ] Rating aggregation berjalan dengan benar
- [ ] Flag system berfungsi untuk semua jenis pelanggaran
- [ ] Admin dapat moderate reviews (edit, delete, resolve flags)
- [ ] Bulk operations berfungsi dengan baik
- [ ] Statistics calculation akurat
- [ ] Pagination berfungsi di semua endpoints
- [ ] Error handling comprehensive
- [ ] Notifications terkirim dengan benar

---

## Support

Untuk pertanyaan atau masalah, hubungi:
- Email: tech@fullstacktalent.id
- Documentation: https://docs.fullstacktalent.id
