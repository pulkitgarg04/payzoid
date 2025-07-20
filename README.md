# PayZoid
<p align="center">
  <img src="https://socialify.git.ci/pulkitgarg04/payzoid/image?font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Floating%20Cogs&pulls=1&stargazers=1&theme=Dark" alt="payzoid" />
</p>
<p align="center">
  <a href="https://hits.sh/github.com/pulkitgarg04/payzoid/">
    <img src="https://hits.sh/github.com/pulkitgarg04/payzoid.svg?style=plastic&color=0077bf" alt="Hits"/>
  </a>
</p>

### Introduction
**Payzoid** is a financial application designed to simplify peer-to-peer (p2p) transactions, manage user accounts, and provide an intuitive wallet management system.

The app allows users to securely send, receive, and track their transactions, along with features like profile management, authentication, and email verification. Payzoid is built with a MERN stack and follows best practices for scalability and security.

### Setup and Installation
#### Pre-Requisities
- Node.js (v14 or above)
- MongoDB (local or cloud-based, like MongoDB Atlas)
- npm or yarn for package management

#### Installation
1. Clone the repository:
```bash
git clone https://github.com/pulkitgarg04/payzoid.git
cd payzoid
```

2. Install dependencies for both the client and server:

```bash
# Navigate to server and install
cd server
npm install

# Navigate to client and install
cd ../client
npm install
```

3. Set up Environment Variables: See [Environment Variables](#environment-variables) for required variables and setup.

4. Run the application:
```bash
# In the server folder
node index.js

# In the client folder
npm run dev
```

### Environment Variables
The project relies on several environment variables. Create a .env file in both the server and client directories with the following variables:

#### For Server:
```
PORT=8080
FRONTEND_URL="http://localhost:5173"
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL=your_email_service
EMAIL_PASSWORD=your_email_service_password
```

#### For Client:
```
VITE_BACKEND_URL = "http://localhost:8080"
```

### Tech Stack
#### Frontend
- **React**: For building a responsive and dynamic user interface.
- **React Router**: For handling routing in the single-page application.
- **Zustand**: Lightweight state management to handle user and session data.
- **Tailwind CSS**: For styling the application with a focus on customization and a responsive layout.
- **React Hot Toast**: For displaying user-friendly notifications.

#### Backend
- **Node.js**: JavaScript runtime used to build the server-side of the application.
- **Express.js**: Web framework for building RESTful APIs and handling middleware.
- **MongoDB**: NoSQL database for storing user and transaction data.
- **Mongoose**: ODM for MongoDB, providing schema and data validation.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Nodemailer**: For sending email notifications and handling email verification.
- **Axios**: For handling HTTP requests in API calls.

#### Security and Authorization
- **bcrypt**: For hashing user passwords to enhance security.
- **JWT Authentication**: For secure, token-based user authentication.
- **Environment Variables**: Sensitive information is stored in environment variables using .env files for security.

### Authentication and Authorization
- **Signup & Login**: Users must sign up and log in to access most features.
- **JWT**: JSON Web Token (JWT) is used for user sessions.
- **Protected Routes**: API endpoints require a valid token in the Authorization header.
- **Email Verification**: After signup, users must verify their email before accessing their dashboard.

### Frontend Architecture
The frontend of Payzoid is built with React and React Router for navigation. Key components include:

- **State Management**: Using `Zustand` for managing authentication and user state.
- **Page Components**: Organized under `src/pages/` for each route.
- **ProtectedRoute & RedirectAuthenticatedUser**: Custom wrappers to secure specific routes.
- **Toasts**: Notifications for actions using `react-hot-toast`.

### Changelog
Refer to [CHANGELOG](CHANGELOG.md) for version history and updates.

### Contributing
We appreciate your interest in contributing to PayZoid! Your contributions help us improve and grow. Please feel free to submit pull requests, report issues, or suggest new features. Your feedback and participation are highly valued as we continue to develop and enhance the platform.

For detailed guidelines on how to contribute, please see our [CONTRIBUTING](CONTRIBUTING.md) file.

### License
PayZoid is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.