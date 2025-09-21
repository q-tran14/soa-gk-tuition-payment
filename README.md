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
- **Endpoint:** `http://localhost:8000/api/send-otp`

- **Description:** Generate a 6-digit OTP code and send it to the user's email. The OTP expires after 5 minutes.

- **Request Body (JSON):**
```json
  {
    "email": "student@example.com"
  }
```
### Respone 200 OK
```json
    {
        "message": "OTP code sent to your email. Please check your email."
    }
```
### Respone 500 ERROR
```json
    {
        "message": "Failed to send OTP code to your email."
    }
```