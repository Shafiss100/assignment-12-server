const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");

// newAutoEvolution;
// WtnlSx7y1IgzSMUZ;

// // token ------------
// app.post("/token", async (req, res) => {
//   const user = req.body;
//   const email = user.user;
//   const token = jwt.sign({ email }, process.env.ACCESS_TOKEN);
//   res.send({ message: token });
// });
const verifytoken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.send({ message: "authorization not found" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.send({ message: "forbidden access" });
    }
    res.decoded = decoded;
    next();
  });
};

const uri =
  "mongodb+srv://newAutoEvolution:WtnlSx7y1IgzSMUZ@cluster0.cqgvt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("datacollection").collection("users");
    app.post("/user", async (req, res) => {
      const user = req.body;
      const email = user.email;
      const filter = await userCollection.findOne({ email });
      if (filter === null) {
        const result = await userCollection.insertOne(user);
        res.send({ message: "success" });
      } else {
        res.send({ message: "error" });
      }
    });
    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const filter = await userCollection.find({ email: email }).toArray();
      res.send(filter);
    });
    // update profile
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          edu: user.edu,
          linked: user.linked,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is on(new server)");
});

app.listen(port, () => {
  console.log(` listening port ${port}`);
});
