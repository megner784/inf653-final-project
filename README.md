
# 🌎 US States CRUD API

## 📖 Overview
The **US States CRUD API** provides detailed information about states in the United States, 
including **fun facts, capitals, nicknames, populations, and admission dates**. Users can also 
add, update, and delete **fun facts** for each state.

# 🛠️ Developer 
**Michael Egner**

## 🚀 Getting Started
### **Prerequisites**
- [NPM](https://www.npmjs.com/) Node Package Manager
- [Node.js](https://nodejs.org/en) (Recommended: latest version)
- [Express.js](https://expressjs.com/) (Recommended: latest version)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (for storing fun facts)
- [Postman](https://www.postman.com/) or any API testing tool (optional)

### **Installation**
Clone the repository:
```sh
git clone https://github.com/megner784/inf653-final-project
```
#### Install dependences:
npm install

####  Setup Environment Variables

Create a .env file and add:

**DATABASE_URI** = mongodb+srv://user:password@cluster.mongodb.net/FunFactsDB?appName=Cluster0

This connects your app to MongoDB Atlas.
**Start Server**
npm start

Your API will run on https://inf653-final-project-crud-api.glitch.me/.

📌 API Reference
Base URL
https://inf653-final-project-crud-api.glitch.me/

**Endpoints and Methods**

**1️) Get All Stat**
GET /states
Returns data for all US states.

**Query Params:**
contig=true → Only contiguous states (i.e., lower 48)
contig=false → Only non-contiguous states

**2️) Get a Single State**
GET /states/{stateCode}

Example:
GET /states/KS
Response:
{
    "state": "Kansas",
    "nickname": "Sunflower State",
    "capital_city": "Topeka",
    "population": 2893957,
    "funfacts": ["Kansas has more shoreline than Florida!"]
}

**3️) Fun Facts Management**
GET /states/{stateCode}/funfact → Returns a random fun fact.
POST /states/{stateCode}/funfact → Adds new fun facts.
PATCH /states/{stateCode}/funfact → Updates an existing fun fact.
DELETE /states/{stateCode}/funfact → Removes a fun fact.

🔧 Error Handling
Responses are structured as:

{ "error": "State code 'ZZ' is invalid." }

📝 License
None.

🤝 Contributing
If you’d like to contribute, submit a pull request or open an issue.


