# Notification System API Documentation

## Overview
Notification System menyediakan 3 channel notifikasi:
- **In-App Notifications**: Notifikasi di dalam aplikasi
- **Email Notifications**: Notifikasi via email
- **Push Notifications**: Notifikasi push via Firebase Cloud Messaging (FCM)

---

## Authentication
Semua endpoint memerlukan authentication JWT token.

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

---

## In-App Notifications

### 1. Get All Notifications
Mendapatkan semua notifikasi user

**Endpoint:** `GET /api/notifications`

**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `per_page` (optional): Jumlah per halaman (default: 20)

**Response:**
```json
{
    "status": "success",
    "message": "Notifications retrieved successfully",
    "data": {
        "notifications": [
            {
                "id": "uuid",
                "user_id": "uuid",
                "type": "enrollment",
                "title": "Course Enrollment Successful",
                "message": "You have successfully enrolled in...",
                "data": {...},
                "is_read": false,
                "read_at": null,
                "created_at": "2025-11-02 10:00:00"
            }
        ],
        "pagination": {
            "current_page": 1,
            "per_page": 20,
            "total": 50,
            "total_pages": 3
        },
        "unread_count": 10
    }
}
```

### 2. Get Unread Notifications
Mendapatkan notifikasi yang belum dibaca

**Endpoint:** `GET /api/notifications/unread`

**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `per_page` (optional): Jumlah per halaman (default: 20)

### 3. Get Unread Count
Mendapatkan jumlah notifikasi yang belum dibaca

**Endpoint:** `GET /api/notifications/unread-count`

**Response:**
```json
{
    "status": "success",
    "data": {
        "unread_count": 10
    }
}
```

### 4. Mark as Read
Menandai notifikasi sebagai sudah dibaca

**Endpoint:** `PUT /api/notifications/{id}/read`

**Response:**
```json
{
    "status": "success",
    "message": "Notification marked as read"
}
```

### 5. Mark All as Read
Menandai semua notifikasi sebagai sudah dibaca

**Endpoint:** `PUT /api/notifications/read-all`

**Response:**
```json
{
    "status": "success",
    "message": "All notifications marked as read"
}
```

### 6. Delete Notification
Menghapus notifikasi

**Endpoint:** `DELETE /api/notifications/{id}`

**Response:**
```json
{
    "status": "success",
    "message": "Notification deleted successfully"
}
```

### 7. Delete All Read Notifications
Menghapus semua notifikasi yang sudah dibaca

**Endpoint:** `DELETE /api/notifications/read`

**Response:**
```json
{
    "status": "success",
    "message": "All read notifications deleted successfully"
}
```

### 8. Get Statistics
Mendapatkan statistik notifikasi

**Endpoint:** `GET /api/notifications/statistics`

**Response:**
```json
{
    "status": "success",
    "data": {
        "total": 100,
        "unread": 10,
        "read": 90,
        "types": [
            {
                "type": "enrollment",
                "count": 5
            },
            {
                "type": "payment",
                "count": 3
            }
        ]
    }
}
```

---

## Notification Preferences

### 1. Get Preferences
Mendapatkan preferensi notifikasi user

**Endpoint:** `GET /api/notification-preferences`

**Response:**
```json
{
    "status": "success",
    "message": "Notification preferences retrieved successfully",
    "data": {
        "id": "uuid",
        "user_id": "uuid",
        "email_enabled": true,
        "push_enabled": true,
        "in_app_enabled": true,
        "email_course_updates": true,
        "email_new_messages": true,
        "email_assignments": true,
        "email_payment_confirmations": true,
        "email_promotions": true,
        "email_newsletters": false,
        "push_course_updates": true,
        "push_new_messages": true,
        "push_assignments": true,
        "push_payment_confirmations": true,
        "device_type": "android",
        "created_at": "2025-11-02 10:00:00",
        "updated_at": "2025-11-02 10:00:00"
    }
}
```

### 2. Update Preferences
Update preferensi notifikasi

**Endpoint:** `PUT /api/notification-preferences`

**Request Body:**
```json
{
    "email_enabled": true,
    "push_enabled": true,
    "in_app_enabled": true,
    "email_course_updates": true,
    "email_new_messages": false,
    "push_assignments": true
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Notification preferences updated successfully",
    "data": {
        ...updated preferences...
    }
}
```

### 3. Reset to Default
Reset preferensi ke default

**Endpoint:** `POST /api/notification-preferences/reset`

**Response:**
```json
{
    "status": "success",
    "message": "Notification preferences reset to default successfully",
    "data": {
        ...default preferences...
    }
}
```

---

## Push Notifications (FCM)

### 1. Register Device
Mendaftarkan device untuk push notifications

**Endpoint:** `POST /api/notification-preferences/register-device`

**Request Body:**
```json
{
    "fcm_token": "your-fcm-token-here",
    "device_type": "android",
    "device_info": {
        "model": "Samsung Galaxy S21",
        "os_version": "Android 12",
        "app_version": "1.0.0"
    }
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Device registered for push notifications successfully"
}
```

### 2. Unregister Device
Menghapus registrasi device

**Endpoint:** `POST /api/notification-preferences/unregister-device`

**Response:**
```json
{
    "status": "success",
    "message": "Device unregistered from push notifications successfully"
}
```

### 3. Subscribe to Topic
Subscribe ke topic notifikasi tertentu

**Endpoint:** `POST /api/notification-preferences/subscribe-topic`

**Request Body:**
```json
{
    "topic": "course_updates"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Successfully subscribed to topic: course_updates"
}
```

**Available Topics:**
- `course_updates`: Update course
- `new_features`: Fitur baru
- `promotions`: Promosi
- `announcements`: Pengumuman

### 4. Unsubscribe from Topic
Unsubscribe dari topic

**Endpoint:** `POST /api/notification-preferences/unsubscribe-topic`

**Request Body:**
```json
{
    "topic": "promotions"
}
```

---

## Development & Testing

### Test In-App Notification
**Endpoint:** `POST /api/notifications/test`

**Request Body:**
```json
{
    "type": "test",
    "title": "Test Notification",
    "message": "This is a test notification"
}
```

**Note:** Hanya tersedia di development mode

### Test Push Notification
**Endpoint:** `POST /api/notification-preferences/test-push`

**Request Body:**
```json
{
    "title": "Test Push",
    "message": "This is a test push notification"
}
```

**Note:** Hanya tersedia di development mode

---

## Notification Types

### Email Notifications
- `welcome`: Email selamat datang
- `verification`: Email verifikasi
- `password_reset`: Email reset password
- `enrollment`: Konfirmasi pendaftaran course
- `payment`: Konfirmasi pembayaran
- `course_reminder`: Reminder course
- `assignment`: Notifikasi assignment baru
- `certificate`: Sertifikat course

### Push Notifications
- `course_update`: Update course
- `new_message`: Pesan baru
- `assignment`: Assignment baru
- `payment_confirmation`: Konfirmasi pembayaran
- `course_reminder`: Reminder course
- `certificate_issued`: Sertifikat diterbitkan

---

## Error Responses

**400 Bad Request:**
```json
{
    "status": "error",
    "message": "Invalid request data"
}
```

**401 Unauthorized:**
```json
{
    "status": "error",
    "message": "Unauthorized"
}
```

**404 Not Found:**
```json
{
    "status": "error",
    "message": "Notification not found"
}
```

**500 Internal Server Error:**
```json
{
    "status": "error",
    "message": "Internal server error"
}
```

---

## Setup & Configuration

### Email Configuration
Edit `.env` file:
```env
email.fromEmail = noreply@fullstacktalent.id
email.fromName = "Fullstack Talent"
email.SMTPHost = smtp.gmail.com
email.SMTPUser = your-email@gmail.com
email.SMTPPass = your-app-password
email.SMTPPort = 587
email.SMTPCrypto = tls
```

### FCM Configuration
1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Enable Cloud Messaging
3. Get Server Key dari Project Settings > Cloud Messaging
4. Add ke `.env`:
```env
FCM_SERVER_KEY = your-fcm-server-key-here
```

---

## Best Practices

1. **Rate Limiting**: Implementasi rate limiting untuk prevent spam
2. **Batch Processing**: Gunakan batch untuk mengirim notifikasi ke banyak user
3. **Queue System**: Gunakan queue untuk email notifications (recommended)
4. **Error Handling**: Handle errors gracefully dan log untuk monitoring
5. **Testing**: Test notifikasi di development mode sebelum production

---

## Support
Untuk bantuan lebih lanjut, hubungi:
- Email: support@fullstacktalent.id
- Documentation: https://docs.fullstacktalent.id