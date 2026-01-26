# Packovery Frontend

> A comprehensive Angular application for efficient order tracking, signal monitoring, and alert configuration.

![Angular Version](https://img.shields.io/badge/Angular-20.3.0-dd0031.svg?style=flat&logo=angular)

## Overview

**Packovery Frontend** is a modern web application designed to streamline logistics and monitoring operations. It provides a robust interface for searching orders, viewing detailed shipment information, monitoring active signals via REST APIs, and managing a flexible alert system.

Built with performance and usability in mind, the application features a secure authentication flow, interactive maps for tracking, and infinite scrolling data lists.

## Tech Stack

This project is built using the latest web technologies:

*   **Framework**: [Angular 20](https://angular.io/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Reactive Programming**: [RxJS](https://rxjs.dev/)
*   **Maps & Geolocation**: [Leaflet](https://leafletjs.com/)
*   **UI/UX**: SCSS, [Ngx-Infinite-Scroll](https://www.npmjs.com/package/ngx-infinite-scroll)

## Key Features

*   **Secure Authentication**: Complete flow including Login, Forgot Password, Confirmation Code verification, and Password Reset.
*   **Order Management**:
    *   **Order Search**: Quickly find orders with advanced filtering.
    *   **Order Details**: Detailed view of specific orders, likely including tracking status and history.
*   **Signal Monitoring**:
    *   **Active Signals**: REST API for monitoring active signals/trackers.
*   **Alert System**:
    *   **Alert Configurator**: Manage and configure system-wide alerts.
    *   **Create & Modify Alerts**: Custom interfaces for defining specific alert conditions.
*   **Route Protection**: Implements `AuthGuard`, `NoAuthGuard`, and `ResetPasswordGuard` to ensure secure access control.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: `v18.13.0` or higher (recommended)
*   **npm**: `v8.x` or higher

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/JFranciosi/packovery-frontend.git
    cd packovery-frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Usage

### Development Server

Run `{`ng serve`}` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

```bash
npm start
# OR
ng serve
```

### Build

Run `{`ng build`}` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
```

## Project Structure

A simplified view of the project's architecture:

```text
src/
└── app/
    ├── component/          # Reusable UI components (e.g., Alert Creation/Modification)
    ├── guards/             # Route guards (Auth, NoAuth, ResetPassword)
    ├── interceptors/       # HTTP interceptors for request handling
    ├── model/              # TypeScript interfaces and class models
    ├── pages/              # Main application pages (Login, OrderSearch, etc.)
    ├── services/           # Business logic and API communication services
    ├── app.config.ts       # Application configuration
    └── app.routes.ts       # Main routing definitions
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.