# Hostel Complaint Management System 🏨

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

### 🌐 Live Demos
- **Frontend Web App:** [Live on Netlify](https://hostel-complaint-system.netlify.app/) 
- **Backend API Docs:** [Live on Render](https://hostel-backend-ksuw.onrender.com/docs)

A full-stack, secure web application engineered to streamline the process of submitting, tracking, and resolving student complaints within university hostels. 

Built with a focus on **security**, **scalability**, and **clean architecture**, this application demonstrates a strong command of modern backend development principles, RESTful API design, and role-based access control (RBAC).

---

## 🚀 Key Features

* **JWT-Based Authentication:** Secure, stateless user sessions utilizing JSON Web Tokens and bcrypt password hashing.
* **Role-Based Access Control (RBAC):** Distinct privileges for `Admin` and `Student` users. Students can submit complaints securely, while only authenticated administrators can mutate complaint statuses to "Resolved".
* **RESTful API Architecture:** Clean, modular, and clearly separated API routes tailored with FastAPI's dependency injection system.
* **Relational Database Management:** Structured querying and object-relational mapping (ORM) handled via SQLAlchemy and SQLite.
* **Dynamic Frontend Integration:** A seamless, single-page application (SPA) feel achieved through Vanilla JavaScript and dynamic DOM manipulation.

---

## 🛠️ Technical Stack

* **Backend:** Python, FastAPI, SQLAlchemy
* **Database:** SQLite
* **Security:** JWT (JSON Web Tokens), `passlib` & `bcrypt`
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)

> **A Note on Development Methodology:** 
> *The core system architecture, backend REST API, database schemas, security dependencies, and overall application logic were meticulously structured and hand-coded by me. To accelerate the styling footprint and visual aesthetics of the frontend interface, I effectively leveraged AI tooling. This approach demonstrates my ability as a modern developer to harness AI for rapid UI prototyping while maintaining absolute, hands-on control over the underlying engineering, logic, and system architecture.*

---

## ⚙️ Running Locally

### 1. Start the Backend Server

Ensure you have Python installed. Navigate to the project directory and install the necessary dependencies:

```bash
# Optional: Create a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install Python requirements
pip install -r requirements.txt

# Start the FastAPI Server using Uvicorn
python main.py
```
> The API will be available at `http://127.0.0.1:8080`.

### 2. Access the Frontend App
Simply open `frontend/index.html` in your web browser, or serve it using any local development server (like VS Code's Live Server extension). No heavy Node.js or React build times required!

---

## 📖 API Documentation

Because this system is built on **FastAPI**, fully interactive API documentation is automatically generated. When the backend is running, navigate to:
* **Swagger UI:** `http://127.0.0.1:8080/docs`
* **ReDoc:** `http://127.0.0.1:8080/redoc`
