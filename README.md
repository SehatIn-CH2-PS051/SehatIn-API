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
The endpoint to register a new user.
```javascript
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
The endpoint to login to an existing account.
```javascript
{
  email: "testuser@fakemail.com",
  password: "Password123",
}
```
---
### 🗝️ Protected Endpoints
Upon a successful registration and login attempt you will be granted an Auth token. Store this token securely as it will allow the API to identify the account associated with your requests.

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
The endpoint to update user's data.

Allowed data to update include:
```javascript
{
  name: string,
  age: number,
  gender: 'male' || 'female',
  height: number,
  weight: number,
  activity_level: 'sedentary' || 'lightly active' || 'moderately active' || 'very active' || 'extra active',
  goal: 'gain' || 'maintain' || 'lose'
}
```

You can update multiple data with a single request. Just specify the data parameter(s) and the new value(s) in your request body. Keep in mind that data validation will still be in place.

**Example 1:**
```javascript
// single update
{
 activity_level: "sedentary"
}
```

**Example 2:**
```javascript
// multiple update
{
 age: 30,
 weight: 78,
 goal: "gain"
}
```
---
#### POST /food
The endpoint to upload your food image and get the detail of it.

Send your request body in *form-data* **type** with the **key** of "file" and the actual food *image* for the **value**:

![example-in-postman](https://storage.googleapis.com/sehatin-users-images/example-in-postman.jpg)