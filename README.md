# Full-Stack Blog Application

A modern full-stack blog application with CRUD operations and authentication. Built with React, Express, Node.js, and Supabase PostgreSQL.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Create Posts**: Authenticated users can create blog posts with title, content, and optional images
- **Read Posts**: Browse all posts with pagination and search functionality
- **Update Posts**: Users can edit their own posts
- **Delete Posts**: Users can delete their own posts with confirmation
- **User Posts**: View all posts created by a specific user
- **Responsive Design**: Clean, modern UI that works on all devices
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

### Backend
- **Node.js** with Express
- **Supabase** for PostgreSQL database and authentication
- **JWT** for token-based authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 19** with Hooks
- **React Router** for navigation
- **Vite** for fast development and building
- **Context API** for state management
- **CSS-in-JS** for styling

## Project Structure

```
.
├── server/               # Backend API
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth & validation middleware
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── .env.example     # Example environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Express server entry point
│
├── client/              # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context for auth
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # React entry point
│   ├── .env             # Frontend environment variables
│   ├── .env.example     # Example environment variables
│   └── package.json     # Frontend dependencies
│
└── README.md            # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Supabase account** (database is already configured)

## Setup Instructions

### 1. Clone and Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables

The environment variables are already configured in both `.env` files. No changes needed!

**Server** (`server/.env`):
- `PORT=5000`
- `JWT_SECRET` - Secret key for JWT tokens
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Client** (`client/.env`):
- `VITE_API_URL=http://localhost:5000/api`

### 3. Database Setup

The database schema is already created in Supabase with:
- `profiles` table for user information
- `posts` table for blog posts
- Row Level Security (RLS) policies for data protection
- Indexes for performance

## Running the Application

You need to run both the backend and frontend servers:

### Start Backend Server

```bash
cd server
npm start
```

Server will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173` (or the next available port)

### Development Mode

For backend with auto-reload:

```bash
cd server
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Posts Endpoints

#### Get All Posts (with pagination & search)
```http
GET /api/posts?search=react&page=1&limit=10

Response: 200 OK
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Single Post
```http
GET /api/posts/:id

Response: 200 OK
{
  "id": "uuid",
  "title": "Post Title",
  "content": "Post content...",
  "image_url": "https://example.com/image.jpg",
  "username": "johndoe",
  "user_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Create Post (Auth Required)
```http
POST /api/posts
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first blog post. It must be at least 50 characters long.",
  "image_url": "https://example.com/image.jpg"
}

Response: 201 Created
{
  "message": "Post created successfully",
  "post": {...}
}
```

#### Update Post (Auth Required, Owner Only)
```http
PUT /api/posts/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content that is at least 50 characters long.",
  "image_url": "https://example.com/new-image.jpg"
}

Response: 200 OK
{
  "message": "Post updated successfully",
  "post": {...}
}
```

#### Delete Post (Auth Required, Owner Only)
```http
DELETE /api/posts/:id
Authorization: Bearer jwt_token_here

Response: 200 OK
{
  "message": "Post deleted successfully"
}
```

#### Get User's Posts
```http
GET /api/posts/user/:userId?page=1&limit=10

Response: 200 OK
{
  "posts": [...],
  "pagination": {...}
}
```

## Data Validation

### Post Validation
- **Title**: Required, 5-120 characters
- **Content**: Required, minimum 50 characters
- **Image URL**: Optional, must be a valid URL if provided

### User Validation
- **Username**: Required, 3-30 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters

## Security Features

- Passwords hashed with bcrypt
- JWT tokens for authentication (7-day expiration)
- Row Level Security (RLS) in database
- CORS configured for cross-origin requests
- Authorization checks for update/delete operations
- Input validation on both client and server
- SQL injection protection via Supabase client

## Testing the Application

### Manual Testing

1. **Register a new account**
   - Go to Register page
   - Fill in username, email, and password
   - Submit form

2. **Login**
   - Go to Login page
   - Enter credentials
   - Submit form

3. **Create a post**
   - Click "Create Post" in navbar
   - Fill in title (5-120 chars) and content (min 50 chars)
   - Optionally add image URL
   - Submit form

4. **View posts**
   - Browse posts on home page
   - Use search to find posts by title or author
   - Click on a post to view full details

5. **Edit/Delete posts**
   - Go to "My Posts"
   - Click "Edit" to modify your post
   - Click "Delete" to remove your post (with confirmation)

## Error Handling

The application handles various error scenarios:

- Invalid credentials
- Validation errors (inline display)
- Network errors
- Unauthorized access attempts
- Database errors
- Missing resources (404)

All errors return consistent JSON format:
```json
{
  "message": "Error description",
  "details": "Specific error details or object"
}
```

## Production Build

### Build Frontend
```bash
cd client
npm run build
```

The optimized files will be in `client/dist/`

### Environment Variables for Production

Update the environment variables for production:

**Server**:
- Change `JWT_SECRET` to a strong random string
- Ensure Supabase credentials are correct

**Client**:
- Update `VITE_API_URL` to your production API URL

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change `PORT` in `server/.env`
- Vite will automatically use the next available port

### Database Connection Issues
- Verify Supabase credentials in `server/.env`
- Check if Supabase project is active

### CORS Errors
- Ensure backend server is running
- Check CORS configuration in `server/server.js`

## Future Enhancements

- Comments on posts
- Like/favorite posts
- User profiles with avatars
- Post categories/tags
- Rich text editor
- Image upload functionality
- Password reset
- Social media sharing
- Email notifications
- Post drafts

## License

MIT License - feel free to use this project for learning or as a base for your own applications.

## Author

Built as a full-stack blog application assignment demonstrating CRUD operations, authentication, and modern web development practices.
