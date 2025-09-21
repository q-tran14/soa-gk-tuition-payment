# soa-gk-tuition-payment
Repo for SOA Midterm Project - Tuition Payment

# How to start the service?
## Services written by Javascript
> `cd into service-js`

> `npm install`

> `npm run start`

## Service written by Python

## Service written by Java

## Service written by C#

# Services Endpoint and parameters
## OTP Service:
### Send OTP
- **Endpoint:** `http://localhost:8000/api/send-otp`
- **Method:** `POST`
- **Description:** Generate a 6-digit OTP code and send it to the user's email. The OTP expires after 5 minutes.
- **Request Body (JSON):**
```json
  {
    "email": "student@example.com"
  }
```
- **Respone 200 OK**
```json
    {
        "message": "OTP code sent to your email. Please check your email."
    }
```
- **Respone 500 ERROR**
```json
    {
        "message": "Failed to send OTP code to your email."
    }
```

### Verify OTP
- **Endpoint:** `http://localhost:8000/api/verify-otp`
- **Method:** `POST`
- **Description:** Verify OTP code
- **Request Body (JSON):**
```json
    {
        "email": "student@example.com",
        "code": "123456"
    }
```
- **Respone 200 OK**
```json
    {
        "success": true,
        "message": "OTP verified"
    }
```
- **Respone 400 Bad Request**
```json
    {
        "success": false,
        "error": {
            "code": "MISSING_FIELDS",
            "message": "Email and recovery code are required."
        }
    }
```
- **Respone 404 Not Found**
```json
    {
        "success": false,
        "error": {
            "code": "OTP_NOT_FOUND",
            "message": "No OTP found for this email."
        }
    }
```
- **Respone 410 Gone**
```json
    {
        "success": false,
        "error": {
            "code": "OTP_EXPIRED",
            "message": "OTP has expired."
        }
    }
```
- **Respone 401 Unauthorized**
```json
    {
        "success": false,
        "error": {
            "code": "INVALID_OTP",
            "message": "Invalid OTP."
        }
    }
```
- **Respone 500 Internal Server Error**
```json
    {
        "success": false,
        "error": {
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred while verifying OTP."
        }
    }
```
## Notification Service:
### Send Email
- **Endpoint:** `http://localhost:8000/api/send-email`
- **Method:** `POST`
- **Description:** Send an email to the specified recipient.
- **Request Body (JSON):**
```json
    {
        "to": "student@example.com",
        "subject": "Your OTP Code",
        "text": "Your OTP code is 123456. It will expire in 5 minutes.",
        "html": "<h2>Your OTP Code is</h2><p>123456</p>"
    }
```
- **Respone 200 OK**
```json
    {
        "message": "Notification sent to your email. Please check your email."
    }
```
- **Respone 500 ERROR**
```json
    {
        "message": "Failed to send notification to your email."
    }
```