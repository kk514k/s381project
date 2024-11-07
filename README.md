# Express Blog Application

## 1. Project Information
- **Project Name**: Express MongoDB Blog
- **Group Info**: 
    - Group2
    - Chui Tsz Nok (s13428724)
	- Yip Tik Yung (s13462601) 
    - Ho Man Ho (s13354233)
    - Lee Kei Fung (s13324591)
	- Wong Jun Yi Joshua (s13341016)


## 2. Project Structure

### Core Files
- `server.js`:
    - Express.js server configuration
    - MongoDB connection setup
    - Middleware configuration (session, passport, flash messages)
    - Route handling for authentication and posts

- `package.json`:
    - Express.js and related middleware
    - MongoDB with Mongoose
    - Authentication (passport, bcryptjs)
    - Template engine (EJS)
    - Development tools (nodemon)

### Views (EJS Templates)
- **Authentication Views**
    - `login.ejs`: User login interface
    - `register.ejs`: New user registration
- **Post Management**
    - `index.ejs`: Dashboard showing all posts
    - `create.ejs`: New post creation form
    - `edit.ejs`: Post editing interface
    - `show.ejs`: Individual post view
- **Shared Components**
    - `layout.ejs`: Main application layout
    - `header.ejs`: Navigation header
    - `footer.ejs`: Page footer
    - `messages.ejs`: Flash message display

### Models
- `User.js`: User schema with authentication methods
    - Username and password management
    - Password hashing with bcrypt
- `Post.js`: Blog post schema
    - Title, content, author references
    - Timestamps for creation and updates

### Routes
- `authRoutes.js`: Authentication endpoints
    - User registration and login
    - Session management
- `postRoutes.js`: Blog post management
    - CRUD operations for posts
    - Authorization checks

## 3. Cloud Server URL
https://s381-group2.onrender.com

## 4. Operation Guide

This project operates on Windows.

### Environment for running the code

#### 1. Install Node.js
If you are running the code but not the URL, please first ensure that you have downloaded Node.js (LTS) for Windows from https://nodejs.org/en.

#### 2. Download and navigate to the Project Folder
Make sure you are in the project folder where your code is located.

#### 3. Run the following two commands on Node.js command prompt
 ```
npm i nodemon
npm run dev
 ```

### Authentication

#### Login
1. Navigate to `/login`
2. Enter credentials:
   ```
   Username: [Create an account via registration]
   Password: [Your chosen password]
   ```
3. Click "Sign in"

#### Registration
1. Navigate to `/register`
2. Create new account with:
    - Username (must be unique)
    - Password
3. Click "Create account"

### Blog Post Management

#### Create Post
1. Log in to your account
2. Click "New Post" button
3. Fill in:
    - Title (5-100 characters)
    - Content (minimum 10 characters)
4. Click "Create"

#### View Posts
- All posts: Navigate to `/posts`
- Single post: Click "View" on any post

#### Edit Post
1. Navigate to post detail page
2. Click "Edit Post"
3. Modify content
4. Click "Update"

#### Delete Post
1. Navigate to post detail page
2. Click "Delete Post"
3. Confirm deletion

### RESTful API Endpoints

#### Authentication
```
POST /register - Create new user
POST /login   - User login
GET  /logout  - User logout
```

#### Posts
```
GET    /posts          - List all posts
POST   /posts          - Create new post
GET    /posts/:id      - View single post
PUT    /posts/:id      - Update post
DELETE /posts/:id      - Delete post
```

### CURL Testing Commands

Since this project operates on Windows, the following curl commands are intended for Windows.

1. Ensure Environment Setup: Make sure you are in the correct environment mentioned, and you have already run npm run dev to start the server at http://localhost:5000.

2. Open a New Command Prompt: Open a new Node.js command prompt while keeping the existing one running for http://localhost:5000.

3. Test the Curl Commands: You can now test the following curl commands in the new command prompt.

Note: Do not close the Node.js command prompt running http://localhost:5000 until you finish testing.

#### Authentication

```bash
# Register new user
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d "{\"username\":\"[username]\",\"password\":\"[password]\"}"

# Login
curl -c cookies.txt -X POST http://localhost:5000/login -H "Content-Type: application/json" -d "{\"username\":\"[username]\",\"password\":\"123\"}"

# Logout
curl -b cookies.txt -X POST http://localhost:5000/logout
```

#### Posts
```bash
# Create post
curl -b cookies.txt -X POST http://localhost:5000/posts -H "Content-Type: application/json" -d "{\"title\":\"Test Post💖\",\"content\":\"This is a test post\"}"

# Get all posts
curl -b cookies.txt -X GET http://localhost:5000/posts

# Get single post
curl -b cookies.txt -X GET http://localhost:5000/posts/[post-id]

# Update post
curl -b cookies.txt -X PUT http://localhost:5000/posts/[post-id] -H "Content-Type: application/json" -d "{\"title\":\"Updated Post💖\",\"content\":\"This is a test updated post\"}"


# Delete post
curl -b cookies.txt -X DELETE http://localhost:5000/posts/[post-id]
```
