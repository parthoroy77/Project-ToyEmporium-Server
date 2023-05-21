const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
  origin: "",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.SERVER_SECRET_USER}:${process.env.SERVER_SECRET_PASS}@cluster0.h0arnkr.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db("toysDB").collection("toysCollection");

    app.get("/allToys", async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result);
    });

    app.get("/subCategory/:category", async (req, res) => {
      const result = await toysCollection
        .find({ subCategory: req.params.category })
        .toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(filter);
      res.send(result);
    });
    app.get('/myToys', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {sellerEmail: req.query.email}
      }
      const result = await toysCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/addToys', async (req, res) => {
      const addToys = req.body;
      const result = await toysCollection.insertOne(addToys);
      res.send(result)
    })
    app.delete('/deleteToy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(filter);
      res.send(result)
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

app.get("/", (req, res) => {
  res.send("Toy Emporium Server Running");
});

app.listen(port, () => {
  console.log(port);
});
