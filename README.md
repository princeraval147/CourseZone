# CourseZone

CourseZone is a full-featured online course platform built with the MERN stack. It allows instructors to create, manage, and sell courses while enabling students to browse, enroll, and learn through interactive content, reviews, and real-time chat. The platform includes payment integration, a dashboard for analytics, and robust user authentication.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Course Management:**  
  Instructors can add, update, and delete courses. Duplicate course titles and negative prices are prevented.
- **Lecture & Review Management:**  
  Instructors can add lectures (with video uploads), update or delete them, and manage student reviews.

- **Student Enrollment & Payment Integration:**  
  Students can enroll in courses after purchasing them. Integrated with Razorpay for secure payments.

- **Real-time Communication:**  
  Features like a chat room and real-time notifications keep students and instructors connected.

- **User Dashboard:**  
  Separate dashboards for students, instructors, and admins, displaying relevant statistics (e.g., enrolled students, earnings, course performance).

- **Profile Management:**  
  Users can update their profiles, upload avatars, and manage account settings.

## Technologies Used

- **Frontend:** React, React Router, Material-UI, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, Razorpay API
- **Other:** JWT for authentication, Multer for file uploads, SweetAlert2 for alerts

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/princeraval147/CourseZone.git
   cd CourseZone
   ```

2. **Backend Setup:**

   ```
   npm install
   ```

   Create a .env file in the backend root and add your environment variables
   or
   You can see .env.example in Project Structure :

```MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
PORT
```

3. **Frontend Setup:**

```
  npm install
```

Create a .env file in the frontend root and add your environment variables:

```
VITE_API_URL
```

## Running the Application

Start the Backend Server:

```
npx nodemon server.js
```

Start the Frontend Server:

```
npm run dev
```

## Project Structure

```
CourseZone/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── .env
└── server.js # Entry point for the backend
├── frontend/
├── src/
│├── components/
│ ├── styles/
│ └── App.jsx
└── .env
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:

```
git commit -m "Add: description of your changes"
```

4. Push to your fork:

```
git push origin feature/your-feature-name
```

Create a Pull Request describing your changes.

## Licence

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact coursezonebusiness@gmail.com.

```
Feel free to adjust any section to better match your project's details. This README provides a strong starting point that covers the project overview, features, technologies, setup, and contribution guidelines.
```
