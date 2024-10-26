# API Documentation

## Overview

This application allows users to create organizations, manage members, and assign roles within those organizations. It includes authentication and authorization features to ensure that only authorized users can perform specific actions.

### Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Redis
- JWT for authentication
- Joi for validation

## Environment Setup

Ensure you have the following tools installed:

- Node.js v-20
- MongoDB
- Redis

Clone the repository and install dependencies:

```bash
git clone https://github.com/AbdelRahmanH1/ideanest.git
```

install dependencies

```bash
npm install
```

## Running Application

Run the project (development mode)

```bash
npm run dev
```

Build The project

```bash
npm run build
```

Run the Project (Production Mode)

```bash
npm start
```

## Authentication

### Login

- **Endpoint:** `POST /signin`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
  **Respone result:**
  ```json
  {
    "token": "string",
    "refresh_token": "string"
  }
  ```

### Signup

- **Endpoint:** `POST /signup`
- **Request Body:**

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

  **Respone result:**

  ```json
  {
    "message": "string",
    "token": "string",
    "refresh_token": "string"
  }
  ```

### refresh-token

- **Endpoint:** `POST /refresh-token`
- **Request Body:**
  ```json
  {
    "refresh_token": "string"
  }
  ```
  **Respone result:**
  ```json
  {
    "message": "string",
    "token": "string",
    "refresh_token": "string"
  }
  ```

### revoke-refresh-token

- **Endpoint:** `POST /revoke-refresh-token`
- **Request Body:**
  ```json
  {
    "refresh_token": "string"
  }
  ```
  **Respone result:**
  ```json
  {
    "message": "string"
  }
  ```

## Organization Management

### Create Organization

- **Endpoint:** `POST /organization`
- **Authorization:** `Bearer [token]`
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
  **Respone Schema:**
  ```json
  {
    "organization_id": "string"
  }
  ```

### Get Organization by ID

- **Endpoint:** `GET /organization/{organization_id}`
- **Authorization:** `Bearer [token]`
- **Request Body:**

  ```json
  {}
  ```

  **Respone Schema:**

  ```json
  {
    "organization_id": "string",
    "name": "string",
    "description": "string",
    "organization_members": [
      {
        "name": "string",
        "email": "string",
        "access_level": "string"
      }
    ]
  }
  ```

  ### Get All Organizations

- **Endpoint:** `GET /organization`
- **Authorization:** `Bearer [token]`
- **Request Body:**
  ```json
  {}
  ```
  **Respone Schema:**
  ```json
  [
    {
      "organization_id": "string",
      "name": "string",
      "description": "string",
      "organization_members": [
        {
          "name": "string",
          "email": "string",
          "access_level": "string"
        }
      ]
    }
  ]
  ```

### Update Organization

- **Endpoint:** `PUT /organization/{organization_id`
- **Authorization:** `Bearer [token]`
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
  **Respone Schema:**
  ```json
  [
    {
      "organization_id": "string",
      "name": "string",
      "description": "string",
      "organization_members": [
        {
          "name": "string",
          "email": "string",
          "access_level": "string"
        }
      ]
    }
  ]
  ```

### Delete Organization

- **Endpoint:** `DELETE /organization/{organization_id}`
- **Authorization:** `Bearer [token]`
- **Request Body:**
  ```json
  {}
  ```
  **Respone Schema:**
  ```json
  {
    "message": "string"
  }
  ```

### Invite User to Organization

- **Endpoint:** `POST /organization/{organization_id}/invite`
- **Authorization:** `Bearer [token]`
- **Request Body:**
  ```json
  {
    "user_email": "string"
  }
  ```
  **Respone Schema:**
  ```json
  {
    "message": "string"
  }
  ```

### Revoke Refresh Token Route

- **Endpoint:** `POST /revoke-refresh-token/`
- **Authorization:** `Bearer [token]`
- **Request Body:**
  ```json
  {
    "refresh_token": "string"
  }
  ```
  **Respone Schema:**
  ```json
  {
    "message": "string"
  }
  ```

# Models

## User Model

### User Schema

- **name**:String (required, min: 3, max: 10)
- **email**:String (required, unique, email format)
- **password**:String (required, min: 6, max: 20)
- **organization**:Array of ObjectId (references Organization)

## Organization Model

### Organization Schema

- **name**:String (required, unique)
- **description**:String (required)
- **createdBy**:ObjectId (references User, required)
- **members**:Array of Objects containing
  - **user**:ObjectId (references User)
  - **accessLevel**: Enum (admin, member, read-only)

## Middleware

### Authentication Middleware

- Validates the token and retrieves user data.

### Error Handling

- Custom error responses are returned with appropriate HTTP status codes.
