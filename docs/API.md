# Veritas Academy API Documentation

## Unlocking Your True Potential

![Veritas Academy Logo Placeholder](https://via.placeholder.com/150x50/001F3F/FFD700?text=Veritas+Academy)

This document provides comprehensive API documentation for the Veritas Academy platform, outlining existing and planned endpoints, their functionalities, request/response formats, and authentication requirements. All APIs adhere to RESTful principles and utilize consistent JSON response structures.

## 1. Core API Principles

*   **RESTful Principles**: APIs are designed following RESTful conventions, utilizing standard HTTP methods (GET, POST, PUT, DELETE) for resource manipulation. This approach ensures predictable and stateless interactions.
*   **Next.js Server Actions**: For form submissions and simple data mutations, Next.js Server Actions are preferred. This minimizes boilerplate code and enhances the developer experience by allowing direct server-side data mutations from client components.
*   **Consistent Response Format**: All API responses are standardized to return a consistent JSON structure. This structure includes `success` (a boolean indicating the operation's outcome), `data` (the payload of the response), and `error` (an object containing error details if the operation failed). An example of this structure is:

    ```json
    {
      "success": true,
      "data": { ... },
      "error": null
    }
    ```

*   **Authentication**: All administrative endpoints require JWT-based authentication. A valid `admin_token` cookie must be present in the request.

## 2. Existing API Endpoints

### 2.1. Authentication API

**Endpoint**: `/api/auth`

This API handles administrator authentication.

#### `POST /api/auth`

Authenticates an administrator with a password and sets an `admin_token` cookie upon successful login.

*   **Description**: Authenticates an administrator.
*   **Authentication**: None (password-based authentication).
*   **Request Body**:

    ```json
    {
      "password": "string" // The administrator password
    }
    ```

*   **Response (Success - 200 OK)**:

    ```json
    {
      "success": true
    }
    ```

*   **Response (Error - 401 Unauthorized)**:

    ```json
    {
      "error": "Invalid password"
    }
    ```

### 2.2. Orders API

**Endpoint**: `/api/orders`

This API manages student order submissions and administrative actions related to orders.

#### `GET /api/orders`

Retrieves order information. Can fetch all orders (admin only), a specific order by ID, or orders by student email.

*   **Description**: Fetch orders.
*   **Authentication**: Required for fetching all orders (admin_token). Optional for fetching by email (no token needed).
*   **Query Parameters**:
    *   `id`: (Optional) `string` - The ID of a specific order.
    *   `email`: (Optional) `string` - The email of the student to retrieve orders for.
*   **Response (Admin Success - 200 OK)**:

    ```json
    [
      { /* Order Object */ },
      { /* Order Object */ }
    ]
    ```

*   **Response (Student Success - 200 OK)**:

    ```json
    [
      { /* Order Object */ },
      { /* Order Object */ }
    ]
    ```

*   **Response (Error - 401 Unauthorized)**:

    ```json
    {
      "error": "Unauthorized"
    }
    ```

*   **Response (Error - 404 Not Found)**:

    ```json
    {
      "error": "Not found"
    }
    ```

#### `POST /api/orders`

Creates a new student order.

*   **Description**: Create a new order.
*   **Authentication**: None.
*   **Request Body**:

    ```json
    {
      "studentName": "string",
      "studentEmail": "string",
      "school": "string",
      "courseCode": "string",
      "courseName": "string",
      "examType": "string",
      "examDate": "Date string (ISO 8601)",
      "commitment": "string",
      "topics": "string",
      "notes": "string",
      "files": "array of strings (JSON stringified)"
    }
    ```

*   **Response (Success - 201 Created)**:

    ```json
    { /* New Order Object */ }
    ```

*   **Response (Error - 500 Internal Server Error)**:

    ```json
    {
      "error": "Failed to create order"
    }
    ```

#### `PATCH /api/orders`

Performs administrative actions on an existing order (e.g., quote, set payment link, mark paid, activate, reject).

*   **Description**: Admin actions on an order.
*   **Authentication**: Required (admin_token).
*   **Request Body**:

    ```json
    {
      "id": "string", // Order ID
      "action": "string", // "quote", "setPaymentLink", "markPaid", "activate", "reject"
      "amount": "number", // Required for "quote"
      "modules": "array of strings", // Required for "quote", JSON stringified
      "note": "string", // Optional for "quote"
      "paymentLink": "string" // Required for "quote" and "setPaymentLink"
    }
    ```

*   **Response (Success - 200 OK)**:

    ```json
    { /* Updated Order Object */ }
    ```

*   **Response (Error - 400 Bad Request)**:

    ```json
    {
      "error": "Missing id or action" // or "Unknown action"
    }
    ```

*   **Response (Error - 401 Unauthorized)**:

    ```json
    {
      "error": "Unauthorized"
    }
    ```

*   **Response (Error - 404 Not Found)**:

    ```json
    {
      "error": "Order not found"
    }
    ```

*   **Response (Error - 500 Internal Server Error)**:

    ```json
    {
      "error": "Failed"
    }
    ```

### 2.3. Status API

**Endpoint**: `/api/status`

This API provides the current status of the application's external services.

#### `GET /api/status`

Retrieves the status of the application's external services.

*   **Description**: Get application status.
*   **Authentication**: None.
*   **Response (Success - 200 OK)**:

    ```json
    {
      "emailService": "string", // e.g., "Ethereal SMTP (development/sandbox)" or "Resend SMTP (production)"
      "notificationService": "string" // e.g., "console" or "webhook"
    }
    ```

## 3. Planned API Endpoints (Sprint 1 & Beyond)

Based on the project's expansion plan, the following API endpoints are slated for future implementation:

### 3.1. User Management API

**Endpoint**: `/api/users`

This API will manage student user accounts, including registration, profile management, and roles.

#### `POST /api/users/register`

Registers a new student user.

*   **Description**: Register a new student account.
*   **Authentication**: None.
*   **Request Body**:

    ```json
    {
      "email": "string",
      "password": "string",
      "name": "string"
    }
    ```

*   **Response (Success - 201 Created)**:

    ```json
    {
      "success": true,
      "userId": "string"
    }
    ```

#### `POST /api/users/login`

Authenticates a student user and returns a session token.

*   **Description**: Log in a student user.
*   **Authentication**: None.
*   **Request Body**:

    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

*   **Response (Success - 200 OK)**:

    ```json
    {
      "success": true,
      "token": "string"
    }
    ```

#### `GET /api/users/profile`

Retrieves the profile of the authenticated student user.

*   **Description**: Get authenticated user profile.
*   **Authentication**: Required (user_token).
*   **Response (Success - 200 OK)**:

    ```json
    {
      "id": "string",
      "email": "string",
      "name": "string",
      "courses": [] // Array of enrolled courses
    }
    ```

### 3.2. Course Management API

**Endpoint**: `/api/courses`

This API will manage academic course metadata.

#### `GET /api/courses`

Retrieves a list of available courses.

*   **Description**: Get all available courses.
*   **Authentication**: Optional (can return public courses without auth).
*   **Response (Success - 200 OK)**:

    ```json
    [
      {
        "id": "string",
        "code": "string",
        "name": "string",
        "description": "string"
      }
    ]
    ```

### 3.3. Study Plan API

**Endpoint**: `/api/studyplans`

This API will manage personalized study plans for students.

#### `POST /api/studyplans`

Generates and assigns a new study plan for a student.

*   **Description**: Create a new study plan.
*   **Authentication**: Required (user_token).
*   **Request Body**:

    ```json
    {
      "userId": "string",
      "courseId": "string",
      "examDate": "Date string (ISO 8601)",
      "topics": "array of strings"
    }
    ```

*   **Response (Success - 201 Created)**:

    ```json
    {
      "success": true,
      "studyPlanId": "string"
    }
    ```

#### `GET /api/studyplans/{id}`

Retrieves a specific study plan by ID.

*   **Description**: Get a specific study plan.
*   **Authentication**: Required (user_token).
*   **Path Parameters**:
    *   `id`: `string` - The ID of the study plan.
*   **Response (Success - 200 OK)**:

    ```json
    {
      "id": "string",
      "userId": "string",
      "courseId": "string",
      "startDate": "Date string (ISO 8601)",
      "endDate": "Date string (ISO 8601)",
      "modules": [] // Array of module objects
    }
    ```

## References

[1] Next.js Documentation. (n.d.). *App Router*. Retrieved from https://nextjs.org/docs/app
[2] Prisma Documentation. (n.d.). *Prisma ORM*. Retrieved from https://www.prisma.io/docs
[3] PostgreSQL Documentation. (n.d.). *PostgreSQL: The World's Most Advanced Open Source Relational Database*. Retrieved from https://www.postgresql.org/
[4] Tailwind CSS Documentation. (n.d.). *Rapidly build modern websites without ever leaving your HTML*. Retrieved from https://tailwindcss.com/
[5] JOSE (JSON Object Signing and Encryption) for Javascript. (n.d.). *JOSE*. Retrieved from https://github.com/panva/jose
[6] Nodemailer. (n.d.). *Send e-mails with Node.js*. Retrieved from https://nodemailer.com/
