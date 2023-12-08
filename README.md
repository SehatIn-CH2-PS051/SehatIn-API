# 📄 SehatIn API
**This API currently is:**
- ⚙️ Under active development.
- 🪪 Intended for internal use only.

## 🔗 Base URL
https://sehatin-api-64zqryr67a-et.a.run.app

## 🎯 Endpoints
Send your request body in JSON.

---
#### POST /register
```javascript
// register a new account
{
  email: string,
  password: string,
  name: string,
  age: number,
  gender: 'male' || 'female',
  height: number,
  weight: number,
  activity_level: 'sedentary' || 'lightly active' || 'moderately active' || 'very active' || 'extra active',
  goal: 'gain' || 'maintain' || 'lose'
}
```
---
#### POST /login
```javascript
// login to an existing account
{
  email: "testuser@fakemail.com",
  password: "Password123",
}
```
---
### 🗝️ Protected Endpoints
Upon a successful registration and login attempt you will be granted an auth token. Store this token securely as it will allow the API to identify the account associated with your requests.

You should include the auth token in your request header each time you call these protected endpoints.

#### GET /protected
```javascript
// request header
{
  Auth: your-token-here
}
```
---
#### PUT /user/:data-to-modify
Allowed data to modify include:
- name
- age
- height
- weight
- activity_level
- goal

Make sure the last URL segment match your request body.

**example:**
```javascript
// PUT /user/age
{
 age: 25
}
```