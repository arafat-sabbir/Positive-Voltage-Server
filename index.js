const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const PORT = process.env.PORT || 5000;
// Rest Object
app.use(express.json());
app.use(cors());

const uri = process.env.CONNECTION_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const UserCollection = client.db("PositiveVoltage").collection("Users");

    // Store The Newly Registered Users On Server
    app.post("/api/users", async (req, res) => {
      const userData = req.body;
      console.log(userData);
      console.log(userData);
      const userEmail = userData?.userEmail;
      const query = { userEmail: userEmail };
      const isExist = await UserCollection.findOne(query);
      if (isExist) {
        return res.send("User Already Exist");
      }
      const result = await UserCollection.insertOne(userData);
      res.send(result);
    });

    // Get The Current Logged In User Data From Database
    app.get('/api/user', async (req, res) => {
      const userEmail = req.query.email;
      console.log(userEmail);
      const query = { userEmail: userEmail };
      const result = await UserCollection.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Rest Api

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Ecommerce App</h1>");
});
// Port
// Lister To Server
app.listen(PORT, () => {
  console.log(`Ecommerce is Running In Port ${PORT}`);
});
