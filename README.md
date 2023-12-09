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
#### PUT /user
Allowed data to update include:
- name
- gender
- age
- height
- weight
- activity_level
- goal

You can update all data together or just one at a time. Just specify the data and the new value in your request body.

**example:**
```javascript
// update the currently logged in user's:
// age to 30 and height to 190
{
 age: 30,
 height: 190
}
```