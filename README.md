# CS510 Project : Interwise


**Group 30:** Xinyao Qiu, Richard Yang, Fangyang Xu, Hongbin Yang

## Introduction

Interwise is a web application designed to streamline and enhance preparation for technical interviews. Preparing for these interviews is often inefficient due to scattered resources and a lack of personalized, interactive tools. Interwise aims to solve this by providing a centralized platform with AI-powered assistance.

## Core Features

* **Searchable Question Bank:** Access a database of interview questions, including real experiences shared by users.
* **Upload & Solve:** Users can upload their own questions and work on solutions within the app.
* **LLM Integration:** Leverage Large Language Models (LLMs) for:
    * Understanding interview questions.
    * Generating potential answers.
    * Getting instant explanations of concepts.
    * Comparing different solution approaches.
* **Answer Management:** Easily move and manage answers generated or refined using the LLM assistant.
* **Personalized Recommendations:** Receive suggestions for questions or resources based on your activity and performance.
* **Text Retrieval:** Efficiently search and find relevant information within the application.
* **User Management:** Secure authentication and user profile handling.
* **File Uploads:** Support for uploading relevant files (e.g., question descriptions, diagrams).

## Project Structure

### Backend

The backend provides the core API and data management for Interwise.

* **Key Components**
    * `server.js`: Entry point for the Express application.
    * `routes/`: Defines API endpoints grouped by feature (e.g., auth, users, questions, answers).
    * `controllers/`: Contains the business logic for API routes.
    * `models/`: Defines Mongoose schemas for User, Question, and Answer data structures.
    * `middleware/`: Handles authentication, input validation, error handling, and file uploads.
    * `errors/`: Custom error classes for handling specific error types.
    * `utils/`: Utility functions and mock data (if applicable).
* **Core API Functionality** 
    * **Authentication:** `/api/v1/[login/register]`
    * **Users:** `/api/v1/users`
    * **Questions:** `/api/v1/questions`
    * **Answers:** `/api/v1/answers`
    * **Comments:** `/api/v1/comments`
    * **Likes:**: `api/v1/likes`
    * **Dislikes** `/api/v1/dislikes`

### Frontend



## Getting Started

PLEASE CHANGE FILE `env` TO `.env` AND MODIFY VALUES

Example commands:

```bash
# Clone the repository
git clone [repo-url]
cd cs510-project

# Install backend dependencies
npm install

# Configure backend environment variables (e.g., .env file)
#DATABASE_URL=your_mongodb_connection_string
#JWT_SECRET=your_jwt_secret

# Run the backend server
npm run server

# Install frontend dependencies
# cd frontend
# npm install

# Run the frontend development server
# npm run dev