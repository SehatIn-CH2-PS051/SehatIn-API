# 📄 SehatIn API
⚙️ This API is currently under active development.

## 🔗 Base URL
https://sehatin-api-64zqryr67a-et.a.run.app

## 🎯 Endpoints
Send your request body in JSON.

### 1. Register a New User
#### POST /register
```
{
  email: string,
  password: string,
  name: string,
  age: number,
  gender: 'male' || 'female',
  height: number,
  weight: number,
  activityLevel: 'sedentary' || 'lightly active' || 'moderately active' || 'very active' || 'extra active',
  goal: 'gain' || 'maintain' || 'lose'
}
```

### 2. Login
#### POST /login
```
{
  email: string,
  password: string,
}
```
