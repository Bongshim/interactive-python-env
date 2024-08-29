# Interactive Python Execution Environment

This project provides a web-based interactive Python execution environment. Users can write Python code in a web
interface, specify additional packages, and execute the code in a sandboxed Docker container on the server.

## Prerequisites

- Docker
- Docker Compose
- Node.js (18 or later)
- npm

## Setup and Installation

### 1. Build the Prebuilt Python Image

Before running the backend, you need to build the prebuilt Python image. This image will be used as a base for creating
Python execution environments.

```bash
cd server
docker-compose build prebuilt-python-image
```

### 2. Use Docker Compose to start the backend services:

```bash
docker-compose up --build
```

Now you can access the backend on - http://localhost:3000.

### 3. Running the frontend

You can run the frontend by opening the html file found in the root director of the project.