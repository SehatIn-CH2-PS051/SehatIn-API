# 📄 SehatIn API Documentation
⚙️ This API is currently under active development.

## 🔗 Base URL
https://sehatin-api-64zqryr67a-et.a.run.app

## 🎯 Endpoints
Send your request body in JSON.

### 1. Register a New User
#### POST /register
- email (String)
- password (String)
- name (String)
- age (Int, required)
- gender (String: 'male', 'female')
- height (Int)
- weight (Int)
- goal (String: 'gain', 'maintain', 'lose')

### 2. Login
#### POST /login
- email (String)
- password (String)
