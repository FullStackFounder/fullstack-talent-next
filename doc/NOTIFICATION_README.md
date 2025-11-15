# Notification System - Fullstack Talent

## 📋 Overview

Sistem notifikasi lengkap dengan 3 channel:
- **In-App Notifications**: Notifikasi real-time di aplikasi
- **Email Notifications**: Notifikasi via email dengan template HTML
- **Push Notifications**: Notifikasi push via Firebase Cloud Messaging (FCM)

## ✨ Features

### In-App Notifications
- ✅ Real-time notifications
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Notification statistics
- ✅ Pagination support

### Email Notifications
- ✅ Beautiful HTML email templates
- ✅ Multiple email types (welcome, enrollment, payment, etc.)
- ✅ SMTP configuration
- ✅ Email logging & tracking
- ✅ Retry mechanism

### Push Notifications
- ✅ Firebase Cloud Messaging integration
- ✅ Device registration
- ✅ Topic subscription
- ✅ Targeted notifications
- ✅ Bulk sending

### Notification Preferences
- ✅ Per-user preferences
- ✅ Channel-specific settings (email, push, in-app)
- ✅ Type-specific settings (course updates, messages, assignments, etc.)
- ✅ Device management

## 🚀 Quick Start

### 1. Installation

```bash
# Run migration
php spark migrate

# Copy environment configuration
cp .env.notification.example .env
```

### 2. Configuration

Edit `.env` file:

```env
# Email Configuration
email.fromEmail = noreply@fullstacktalent.id
email.fromName = "Fullstack Talent"
email.SMTPHost = smtp.gmail.com
email.SMTPUser = your-email@gmail.com
email.SMTPPass = your-app-password
email.SMTPPort = 587
email.SMTPCrypto = tls

# FCM Configuration
FCM_SERVER_KEY = your-fcm-server-key-here
```

### 3. Setup Email (Gmail Example)

1. Enable 2-Factor Authentication di Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → App passwords
   - Generate new app password
3. Use app password di `.env`

### 4. Setup FCM

1. Create Firebase project: https://console.firebase.google.com
2. Enable Cloud Messaging
3. Get Server Key:
   - Project Settings → Cloud Messaging
   - Copy Server Key
4. Add to `.env`

## 📁 Structure

```
app/
├── Config/
│   ├── Email.php                    # Email configuration
│   └── RoutesNotification.php       # Notification routes
├── Controllers/Api/
│   ├── NotificationController.php
│   └── NotificationPreferenceController.php
├── Models/
│   ├── NotificationModel.php
│   ├── NotificationPreferenceModel.php
│   └── EmailLogModel.php
├── Services/
│   ├── NotificationService.php      # Main notification service
│   ├── EmailService.php             # Email handling
│   └── PushNotificationService.php  # FCM handling
└── Views/emails/
    ├── welcome.php
    ├── enrollment_confirmation.php
    ├── payment_confirmation.php
    ├── course_reminder.php
    └── ...
```

## 💻 Usage Examples

### Send Notification (All Channels)

```php
use App\Services\NotificationService;

$notificationService = new NotificationService();

// Send to single user (all enabled channels)
$notificationService->send(
    $userId,
    'enrollment',
    'Course Enrollment Successful',
    'You have successfully enrolled in Web Development Course',
    ['course_id' => 123],
    ['course' => $courseData]
);

// Send to multiple users
$notificationService->sendBulk(
    ['user-id-1', 'user-id-2'],
    'announcement',
    'New Feature Available',
    'Check out our new feature!'
);
```

### Send Email Only

```php
use App\Services\EmailService;

$emailService = new EmailService();

// Send welcome email
$emailService->sendWelcomeEmail(
    'user@example.com',
    'John Doe',
    'https://app.com/verify?token=xyz'
);

// Send payment confirmation
$emailService->sendPaymentConfirmation(
    'user@example.com',
    'John Doe',
    [
        'transaction_id' => 'TRX123',
        'amount' => 500000,
        'payment_method' => 'BCA',
        'paid_at' => date('Y-m-d H:i:s')
    ]
);
```

### Send Push Notification Only

```php
use App\Services\PushNotificationService;

$pushService = new PushNotificationService();

// Send to single user
$pushService->sendToUser(
    $userId,
    'New Assignment',
    'You have a new assignment in Web Development',
    ['assignment_id' => 456]
);

// Send to multiple users
$pushService->sendToUsers(
    ['user-id-1', 'user-id-2'],
    'Course Update',
    'New module has been added'
);

// Send to topic
$pushService->sendToTopic(
    'course_updates',
    'New Course Available',
    'Check out our new AI course!'
);
```

### Update User Preferences

```php
use App\Models\NotificationPreferenceModel;

$preferenceModel = new NotificationPreferenceModel();

// Get preferences
$preferences = $preferenceModel->getOrCreate($userId);

// Update preferences
$preferenceModel->update($preferences['id'], [
    'email_promotions' => false,
    'push_new_messages' => true
]);

// Register FCM token
$preferenceModel->updateFcmToken(
    $userId,
    'fcm-token-here',
    'android',
    ['model' => 'Samsung S21']
);
```

## 🎯 Notification Shortcuts

```php
$notificationService = new NotificationService();

// Enrollment notification
$notificationService->notifyEnrollment($userId, $courseData);

// Payment confirmation
$notificationService->notifyPaymentConfirmation($userId, $paymentData);

// Course reminder
$notificationService->notifyCourseReminder($userId, $courseData);

// Assignment notification
$notificationService->notifyAssignment($userId, $assignmentData);

// Certificate issued
$notificationService->notifyCertificateIssued($userId, $certificateData);

// New message
$notificationService->notifyNewMessage($userId, $messageData);
```

## 🧪 Testing

### Test In-App Notification

```bash
curl -X POST http://localhost:8080/api/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "title": "Test Notification",
    "message": "This is a test"
  }'
```

### Test Push Notification

```bash
curl -X POST http://localhost:8080/api/notification-preferences/test-push \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Push",
    "message": "This is a test push"
  }'
```

### Test Email

```php
use App\Services\EmailService;

$emailService = new EmailService();

// Test connection
$result = $emailService->testConnection();
print_r($result);

// Send test email
$emailService->send(
    'test@example.com',
    'Test Email',
    'emails/welcome',
    ['name' => 'Test User']
);
```

## 📊 Monitoring

### Email Logs

```php
use App\Models\EmailLogModel;

$emailLogModel = new EmailLogModel();

// Get email statistics
$stats = $emailLogModel->getStatistics();

// Get user email logs
$logs = $emailLogModel->getByUser($userId, 50);
```

### Notification Statistics

```php
use App\Services\NotificationService;

$notificationService = new NotificationService();

$stats = $notificationService->getStatistics($userId);
// Returns: total, unread, read, types breakdown
```

## 🎨 Email Templates

Lokasi: `app/Views/emails/`

Available templates:
- `welcome.php` - Welcome email
- `verification.php` - Email verification
- `password_reset.php` - Password reset
- `enrollment_confirmation.php` - Course enrollment
- `payment_confirmation.php` - Payment confirmation
- `course_reminder.php` - Course reminder
- `assignment_notification.php` - New assignment
- `certificate.php` - Certificate issued
- `new_message.php` - New message

### Create Custom Template

```php
// app/Views/emails/custom_template.php
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?= esc($title) ?></title>
</head>
<body>
    <h1><?= esc($title) ?></h1>
    <p><?= esc($message) ?></p>
    <!-- Your custom content -->
</body>
</html>
```

## 🔒 Security

1. **Email Security**:
   - Use app passwords, not real passwords
   - Enable 2FA on email account
   - Use TLS/SSL encryption

2. **FCM Security**:
   - Keep server key secret
   - Don't commit to version control
   - Rotate keys regularly

3. **User Privacy**:
   - Respect user preferences
   - Implement unsubscribe mechanism
   - Log all notification activities

## 🐛 Troubleshooting

### Email Not Sending

1. Check SMTP credentials
2. Verify firewall/port access
3. Check email logs: `email_logs` table
4. Enable debug mode:
   ```php
   $email->setNewline("\r\n");
   $email->SMTP['debug'] = 2;
   ```

### Push Notifications Not Working

1. Verify FCM server key
2. Check device token validity
3. Ensure Firebase project is active
4. Check network connectivity

### Template Not Found

1. Verify template path: `app/Views/emails/`
2. Check file permissions
3. Use correct template name in code

## 📚 API Documentation

Full API documentation: [NOTIFICATION_API.md](../docs/NOTIFICATION_API.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create Pull Request

## 📝 License

Copyright © 2025 Fullstack Talent. All rights reserved.

## 📞 Support

- Email: support@fullstacktalent.id
- Documentation: https://docs.fullstacktalent.id
- GitHub Issues: https://github.com/fullstacktalent/backend/issues