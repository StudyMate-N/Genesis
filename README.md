# Veritas Academy

## Unlocking Your True Potential

![Veritas Academy Logo Placeholder](https://via.placeholder.com/150x50/001F3F/FFD700?text=Veritas+Academy)

## Project Description

Veritas Academy, formerly known as CertiPrep Academic, is a personalized exam preparation platform designed to empower students by providing custom study plans tailored to their individual syllabi. The platform transforms raw student data, such as course codes, exam dates, and specific topics, into structured learning modules. These modules encompass a variety of educational tools, including study guides, flashcards, and mock examinations, all aimed at enhancing student learning outcomes and providing a comprehensive, adaptive study experience.

## Features

*   **Personalized Study Plans**: Tailored study plans based on individual student syllabi, course codes, exam dates, and topics.
*   **Comprehensive Learning Modules**: Includes study guides, flashcards, and mock examinations.
*   **Admin Panel**: For managing orders, quotes, payments, and activations.
*   **Secure Authentication**: JWT-based authentication for admin users.
*   **Unified API Service Layer**: Centralized integration for external services like email and notifications.

## Tech Stack

The Veritas Academy project leverages a modern and robust technology stack to ensure scalability, performance, and maintainability. The key technologies employed are:

| Layer           | Technology                  | Description                                                                                                                                     |
| :-------------- | :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**   | Next.js 14+ (App Router)    | A React framework for building full-stack web applications, utilizing the App Router for enhanced routing and data fetching capabilities.       |
| **Language**    | JavaScript (with TypeScript recommendation) | The primary programming language, with a strong recommendation to transition towards TypeScript for improved type safety and developer experience. |
| **Database**    | PostgreSQL                  | A powerful, open-source relational database system known for its reliability, feature robustness, and performance.                              |
| **ORM**         | Prisma                      | A next-generation ORM that simplifies database access and management, providing type-safe database queries.                                     |
| **Authentication** | JWT (via `jose`)            | JSON Web Tokens are used for secure session management, with tokens stored in HTTP-only cookies to enhance security.                            |
| **Styling**     | Tailwind CSS                | A utility-first CSS framework that enables rapid UI development and consistent styling across the application.                                  |
| **Email**       | Nodemailer                  | A module for Node.js applications to send emails, used for notifications and administrative communications.                                     |

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   PostgreSQL database

### Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/StudyMate-N/Genesis.git
    cd Genesis
    ```
2.  Install NPM packages:
    ```bash
    npm install
    # or yarn install
    ```
3.  Set up environment variables (see `Environment Variables` section).
4.  Push Prisma schema to your database:
    ```bash
    npx prisma db push
    ```
5.  Start the development server:
    ```bash
    npm run dev
    # or yarn dev
    ```

## Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

*   `DATABASE_URL`: Connection string for your PostgreSQL database. Example: `postgresql://user:password@host:port/database`
*   `JWT_SECRET`: A secret key for signing and verifying JSON Web Tokens. **MUST be a strong, random string in production.**
*   `ADMIN_PASSWORD`: Password for accessing the administrative panel. **Change from default in production.**
*   `EMAIL_FROM`: The sender email address for system communications. Example: `Veritas Academy <noreply@veritas.academy>`
*   `RESEND_API_KEY`: (Optional, for production email) API key for Resend email service. If not set, Nodemailer with Ethereal (dev) or console logging (prod) will be used.
*   `NOTIFICATION_WEBHOOK_URL`: (Optional, for production notifications) Webhook URL for sending notifications (e.g., Slack, Discord).

## Folder Structure

The application's file and folder structure is organized to promote modularity and clarity:

```
. 
├── app/                  # Next.js App Router: route definitions and server components
│   ├── admin/            # Admin dashboard routes
│   │   └── emails/       # Admin email management
│   ├── api/              # Backend API endpoints
│   │   ├── auth/         # Authentication API
│   │   ├── orders/       # Order management API
│   │   └── status/       # System status API
│   ├── dashboard/        # Student-facing personalized dashboard
│   │   └── [orderId]/    # Dynamic routes for specific orders
│   │       └── exam/     # Exam-related pages
│   ├── order/            # Student intake form
│   ├── pay/              # Payment related pages
│   │   └── [orderId]/    # Dynamic routes for specific payments
│   ├── layout.js         # Root layout for the application
│   └── page.js           # Root page for the application
├── components/           # Reusable React UI components
│   ├── AdminPanel.jsx
│   ├── EmailTemplates.jsx
│   ├── ExamSimulation.jsx
│   ├── IntakeForm.jsx
│   ├── LandingPage.jsx
│   └── PrepDashboard.jsx
├── lib/                  # Shared utility functions, DB client, authentication logic
│   ├── api.js            # Unified API service layer
│   ├── auth.js           # Authentication utilities
│   └── db.js             # Database client setup
├── prisma/               # Prisma schema definition and migration scripts
│   └── schema.prisma
├── public/               # Static assets
├── .env.local.example    # Example environment variables file
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── jsconfig.json         # JavaScript configuration
```

## Contributing

We welcome contributions to the Veritas Academy project! Please see the `CONTRIBUTING.md` file for guidelines on how to contribute.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/StudyMate-N/Genesis](https://github.com/StudyMate-N/Genesis)

## Acknowledgements

*   [Next.js](https://nextjs.org/)
*   [Prisma](https://www.prisma.io/)
*   [PostgreSQL](https://www.postgresql.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [JOSE](https://github.com/panva/jose)
*   [Nodemailer](https://nodemailer.com/)
