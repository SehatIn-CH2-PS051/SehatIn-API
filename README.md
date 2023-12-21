# 📄 SehatIn API
**This API currently is:**
- ⚙️ Under active development.
- 🪪 Intended for internal use only.

## 🔗 Base URL
https://sehatin-api-64zqryr67a-et.a.run.app

## 🎯 Endpoints
Send your request body in JSON.

---
### 📝 POST /register
The endpoint to register a new user.
```javascript
// request body
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
### 🔐 POST /login
The endpoint to login to an existing account.
```javascript
// request body
{
  email: "testuser@fakemail.com",
  password: "Password123",
}
```
---
### 🗝️ Protected Endpoints
Upon a successful registration and login attempt you will be granted an Auth token. Store this token securely as it will allow the API to identify the account associated with your requests.

You should include the auth token in your request header each time you call these protected endpoints.

### GET /protected
```javascript
// request header
{
  Auth: your-token-here
}
```
---
### 🚹 GET /user

The endpoint to retrieve the user's data.

```javascript
// response body
{
  code: 200,
  status: "OK",
  user: {
    name: "Default User",
    age: 25,
    gender: "male",
    height: 185,
    weight: 78,
    bmi: 22.8,
    bmr: 1816.25,
    classification: "normal",
    activity_level: "sedentary",
    goal: "gain"
  },
  calorie_intake: 2179.5
}
```
---
### ✏️ PUT /user
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

**Example 👇**
```javascript
// single update
{
 activity_level: "sedentary"
}
```
```javascript
// multiple update
{
 age: 30,
 weight: 78,
 goal: "gain"
}
```
---
### 🍕 POST /food
The endpoint to get the detail of your food.

Send your request body in *form-data* **type** with the **key** of "file" and the actual food *image* for the **value**:

![example-in-postman](https://storage.googleapis.com/sehatin-users-images/example-in-postman.jpg)
---
### 🥪 POST /eat-log
The endpoint to post your eating logs.

After a successful **POST** request to **/food** you will get a response containing multiple info of the food you just ate. These food's info is vary based on its portion. The idea is to **POST** request to the /**eat-log** endpoint with one (based on your portion) of the food's info as the request body.

**Example 👇**

**POST /food**'s response:
```javascript
{
  code: 200,
  status: "OK",
  nama: "Tempe",
  image_url: "https://storage.googleapis.com/sehatin-users-images/tempe.jpg",
  data: [
    {
      detail: {
        Karbohidrat: "9,39g",
        Lemak: "10,8g",
        Protein: "18,54g"
      },
      kalori: "55 kkal",
      porsi: "1 ons"
    },
    {
      detail: {
        Karbohidrat: "9,39g",
        Lemak: "10,8g",
        Protein: "18,54g"
      },
      kalori: "193 kkal",
      porsi: "100 gram (g)"
    },
    {
      detail: {
        Karbohidrat: "9,39g",
        Lemak: "10,8g",
        Protein: "18,54g"
      },
      kalori: "320 kkal",
      porsi: "1 mangkok"
    }
  ]
}
```

Notice that there are multiple object (food's info) in the **data** property. As mentioned before, each of them is vary based on its portion.

The next step is to make a **POST** request to the **/eat-log** endpoint with the food's name, image URL and one of the food's info as the request body:

```javascript
// request body
{
  nama: "Tempe",
  image_url: "https://storage.googleapis.com/sehatin-users-images/tempe.jpg",
  detail: {
    Karbohidrat: "9,39g",
    Lemak: "10,8g",
    Protein: "18,54g"
  },
  kalori: "320 kkal",
  porsi: "1 mangkok"
}
```
---
### 📃 GET /eat-log
The endpoint to get the user's eating logs.

```javascript
// response body
{
  code: 200,
  status: "OK",
  data: [
    {
      id: "b0218f50d96a",
      food: "Tempe",
      portion: "1 ons",
      calories: 55,
      carbs: 9.39,
      prots: 18.54,
      fats: 10.8,
      message: null,
      date: "2023-12-14T17:00:00.000Z",
      time: "17:26:56",
      image_url: "https://storage.googleapis.com/sehatin-users-images/tempe.jpg"
    }
  ]
}
```
---
### 📃 GET /lstm

The endpoint to retrieve the user eating pattern charts.

```javascript
// response body
{
  code: 200,
  status: "OK",
  data: {
    calories_consumption_plot_url: "https://storage.googleapis.com/sehatin-users-images/ed32b89372f8_calories_consumption_plot.png",
    macronutrient_proportion_plot_url: "https://storage.googleapis.com/sehatin-users-images/ed32b89372f8_macronutrient_proportion_plot.png",
    message: "Warning: The proportion of protein is out of the acceptable range (10–35%). ",
    predicted_values_plot_url: "https://storage.googleapis.com/sehatin-users-images/ed32b89372f8_predicted.png"
  }
}
```