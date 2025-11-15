# EMAIL TEMPLATES - QUICK REFERENCE GUIDE

## 🚀 Quick Start

### Send Email in 3 Steps:

```php
// 1. Initialize Service
use App\Services\EmailService;
$emailService = new EmailService();

// 2. Choose Template & Send
$emailService->sendWelcomeEmail('user@example.com', 'John Doe');

// 3. Done! ✅
```

---

## 📧 Available Templates

| Template | Method | Variables |
|----------|--------|-----------|
| Welcome | `sendWelcomeEmail()` | email, name, verification_link* |
| Verification | `sendVerificationEmail()` | email, name, verification_link |
| Password Reset | `sendPasswordResetEmail()` | email, name, reset_link |
| Enrollment | `sendEnrollmentConfirmation()` | email, name, course[] |
| Payment | `sendPaymentConfirmation()` | email, name, payment[] |
| Course Reminder | `sendCourseReminder()` | email, name, course[] |
| Assignment | `sendAssignmentNotification()` | email, name, assignment[] |
| Certificate | `sendCertificate()` | email, name, certificate[], path |
| Custom | `send()` | email, subject, template, data[] |

*optional

---

## 💡 Common Use Cases

### 1️⃣ User Registration
```php
// Send welcome + verification
$emailService->sendWelcomeEmail(
    $email, 
    $name, 
    $verificationLink
);
```

### 2️⃣ Forgot Password
```php
$emailService->sendPasswordResetEmail(
    $email,
    $name,
    $resetLink
);
```

### 3️⃣ Course Purchase
```php
// Payment confirmation
$emailService->sendPaymentConfirmation($email, $name, $paymentData);

// Then enrollment
$emailService->sendEnrollmentConfirmation($email, $name, $courseData);
```

### 4️⃣ Class Starting Soon
```php
$emailService->sendCourseReminder(
    $email,
    $name,
    $courseData
);
```

### 5️⃣ New Assignment
```php
$emailService->sendAssignmentNotification(
    $email,
    $name,
    $assignmentData
);
```

### 6️⃣ Course Completed
```php
$emailService->sendCertificate(
    $email,
    $name,
    $certificateData,
    $certificatePdfPath
);
```

---

## 📋 Required Data Structures

### Course Data
```php
$course = [
    'title' => 'Course Name',
    'short_description' => 'Description',
    'tutor_name' => 'Tutor Name',
    'level' => 'beginner|intermediate|advanced',
    'duration_hours' => 40,
    'id' => 'uuid'
];
```

### Payment Data
```php
$payment = [
    'transaction_id' => 'TRX123',
    'paid_at' => '2025-11-02 10:00:00',
    'payment_method' => 'BCA',
    'description' => 'Course Payment',
    'subtotal' => 500000,
    'discount' => 50000,      // optional
    'admin_fee' => 5000,      // optional
    'amount' => 455000,
    'id' => 'uuid'
];
```

### Assignment Data
```php
$assignment = [
    'title' => 'Assignment Title',
    'description' => 'Description',
    'course_title' => 'Course Name',
    'deadline' => '2025-11-10 23:59:59',
    'estimated_time' => '2-3',
    'type' => 'Project',
    'format' => 'Code',
    'requirements' => ['Requirement 1', 'Requirement 2'],
    'id' => 'uuid'
];
```

### Certificate Data
```php
$certificate = [
    'course_title' => 'Course Name',
    'certificate_id' => 'CERT-2025-001',
    'issue_date' => '2025-11-02',
    'download_url' => 'https://...',
    'verify_url' => 'https://...',
    'modules_completed' => 15,
    'hours_spent' => 60,
    'final_score' => 95
];
```

---

## 🎨 Template Colors

```
Welcome:        Purple    (#667eea)
Verification:   Purple    (#667eea)
Password Reset: Orange    (#f59e0b)
Enrollment:     Green     (#10b981)
Payment:        Green     (#10b981)
Reminder:       Indigo    (#6366f1)
Assignment:     Violet    (#8b5cf6)
Certificate:    Gold      (#fbbf24)
Message:        Cyan      (#06b6d4)
Default:        Purple    (#667eea)
```

---

## ⚡ Performance Tips

### 1. Use Queue for Bulk Emails
```php
// Instead of
foreach ($users as $user) {
    $emailService->send(...);
}

// Use (future implementation)
EmailJob::dispatch($users, $template, $data);
```

### 2. Batch Sending
```php
$recipients = ['user1@mail.com', 'user2@mail.com'];
$emailService->sendBulk($recipients, $subject, $template, $data);
```

### 3. Test Before Production
```php
if (ENVIRONMENT === 'development') {
    // Test with your email
    $email = 'your-email@gmail.com';
}
```

---

## 🛠️ Troubleshooting

### Email Not Sending?

**Check 1: SMTP Configuration**
```bash
# .env file
email.SMTPHost = smtp.gmail.com
email.SMTPUser = your-email@gmail.com
email.SMTPPass = your-app-password
```

**Check 2: Email Logs**
```php
use App\Models\EmailLogModel;
$logs = (new EmailLogModel())->orderBy('created_at', 'DESC')->findAll(10);
print_r($logs);
```

**Check 3: Test Connection**
```php
$result = $emailService->testConnection();
print_r($result);
```

### Template Not Found?

**Solution:**
```php
// Check file exists
$templatePath = APPPATH . 'Views/emails/template-name.php';
if (!file_exists($templatePath)) {
    echo "Template not found at: $templatePath";
}
```

### Variables Not Showing?

**Solution:**
```php
// Make sure you pass all required variables
$emailService->send(
    $email,
    $subject,
    'emails/template',
    [
        'name' => $name,     // Required
        'email' => $email,   // Required
        // Add all other required variables
    ]
);
```

---

## 📱 Testing Checklist

- [ ] Test in Gmail
- [ ] Test in Outlook
- [ ] Test in Apple Mail
- [ ] Test on Mobile
- [ ] Test All Variables
- [ ] Test Links Work
- [ ] Check Responsive Layout
- [ ] Verify Colors Display
- [ ] Check Images Load
- [ ] Test Unsubscribe Link

---

## 🔗 Helpful Links

- **SMTP Setup Guide**: [Gmail App Password](https://support.google.com/accounts/answer/185833)
- **Email Testing**: [Mailtrap.io](https://mailtrap.io)
- **HTML Email Guide**: [Campaign Monitor](https://www.campaignmonitor.com/css/)
- **Email Validator**: [mail-tester.com](https://www.mail-tester.com)

---

## 💬 Need Help?

1. Check logs: `app/writable/logs/`
2. Review documentation: `docs/NOTIFICATION_API.md`
3. Email templates summary: `docs/EMAIL_TEMPLATES_SUMMARY.md`
4. Contact: support@fullstacktalent.id

---

## 📝 Quick Notes

```php
// ✅ DO: Always escape output
<?= esc($variable) ?>

// ✅ DO: Use base_url() for links
<?= base_url('path') ?>

// ✅ DO: Handle optional variables
<?php if (isset($optional)): ?>
    // Use $optional
<?php endif; ?>

// ❌ DON'T: Echo raw variables
<?= $variable ?>  // UNSAFE!

// ❌ DON'T: Hard-code URLs
<a href="http://example.com">  // BAD!
```

---

**Last Updated**: November 2, 2025
**Version**: 1.0.0

---

**Quick Access Paths:**
- Templates: `app/Views/emails/`
- Service: `app/Services/EmailService.php`
- Logs: `email_logs` table
- Config: `app/Config/Email.php`