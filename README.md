# Sweety – Blood Glucose Tracker

A full-stack web application that allows patients to record, manage, and monitor their daily blood glucose readings. Users can securely register, log in, manage readings, and view daily and monthly reports.

## Features

### 1. Authentication
- User registration with name, email, and password.
- Secure login using JWT authentication.
- Password hashing using bcrypt.
- Users can access only their own glucose readings.

### 2. Glucose Reading Management
- Add, view, edit, and delete glucose readings.
- Four reading slots:
  - Morning fasting
  - After breakfast
  - After lunch
  - After dinner
- Validate glucose values between 40 and 600 mg/dL.
- Accept whole-number glucose values only.
- Prevent duplicate readings for the same slot and date.
- Prevent future dates.
- Maximum of four readings per day.

### 3. Glucose Reports
- Daily report.
- Month-to-date report.
- Previous month report.
- Highest, lowest, and average glucose values.
- Average rounded to one decimal place.
- Total number of readings.
- Individual reading details and friendly empty states.
- Date selection using year, month, and date dropdowns.

## Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML
- CSS
- Vite

**Backend**
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcrypt

**Database**
- PostgreSQL
- pg (node-postgres)

**Testing**
- Node.js built-in test runner
- Supertest

## Project Structure

```text
sweety-blood-glucose-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── readingService.js
│   │   │   └── reportService.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── seed/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── schema.sql
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Yaminikrishna5999/sweety-blood-glucose-tracker.git
cd sweety-blood-glucose-tracker
```

### 2. Database Setup

1. Start PostgreSQL.
2. Create a database named `sweety_db`.
3. Open the `server/src/config/schema.sql` file.
4. Execute the SQL commands in your PostgreSQL database using pgAdmin or psql.

This creates the required users and glucose readings tables.

### 3. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file by copying `.env.example`:

```bash
copy .env.example .env
```

Update the `.env` file with your local PostgreSQL credentials and a secure JWT secret.

Required environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweety_db
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
JWT_SECRET=your_long_random_secret
```

Start the backend:

```bash
npm run dev
```

Backend API runs at:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
npm install
npm run dev
```

Open the Vite development URL:

`http://localhost:5173`

## Demo Account

The seed script creates a demo user with sample glucose readings.

Run the following command from the server directory:

```bash
npm run seed
```

Demo credentials:

- Email: `demo@sweety.com`
- Password: `Demo@12345`

## Running Tests

Navigate to the server directory:

```bash
cd server
npm test
```

The backend tests cover:

- Invalid email validation.
- Password length validation.
- Authentication token validation.
- Glucose value validation.
- Reading slot validation.
- Future date validation.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in a user |

### Glucose Readings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/readings` | Get user readings |
| POST | `/api/readings` | Add a reading |
| PUT | `/api/readings/:id` | Update a reading |
| DELETE | `/api/readings/:id` | Delete a reading |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily report |
| GET | `/api/reports/month-to-date?date=YYYY-MM-DD` | Month-to-date report |
| GET | `/api/reports/previous-month?date=YYYY-MM-DD` | Previous month report |

All reading and report endpoints require JWT authentication.

## Notes and Assumptions

- Each user can manage only their own glucose readings.
- Each of the four daily slots can contain only one reading.
- Glucose readings must be whole numbers between 40 and 600 mg/dL.
- Future reading dates are not permitted.
- Reports are generated based on the date selected by the user.
- The previous month report displays readings for the entire calendar month preceding the selected date.
- The application uses local development URLs for frontend and backend communication.

## Future Improvements

- Add graphical glucose trends and charts.
- Add pagination for reading history.
- Improve frontend automated test coverage.
- Add deployment configuration for production hosting.

## Author

**Kalava Yamini Krishna**

Junior Full Stack Developer Assessment Project – Kenpath

GitHub Repository:  
https://github.com/Yaminikrishna5999/sweety-blood-glucose-tracker
