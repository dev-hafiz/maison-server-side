const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();

//MiddleWare & Body Parser
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

     try{

          await client.connect();
          console.log('Database Connect succesfully')

          const database = client.db("Maison_commercial");
          const productsCollection = database.collection("products");
          const ordersCollection = database.collection("orders");

          //GET API ALL PRODUCTS
          app.get('/products', async(req, res)=>{
               const cursor = productsCollection.find({});
               const results = await cursor.toArray()
               res.send(results);
          });

          //GET APPI DATA WITH ID
          app.get('/products/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)}
               const result = await productsCollection.findOne(query)
               res.json(result)
          })

          //POST ORDER ON ORDER COLLECTION
          app.post('/addOrders', async(req, res)=>{
               const addOrder = req.body;
               const result = await ordersCollection.insertOne(addOrder)
               res.json(result)
          })

           //GET DATA WITH EMAIL
           app.get('/addOrders', async(req, res)=>{
               const email = req.query.email;
               const query = {email: email};
               const cursor = ordersCollection.find(query)
               const result = await cursor.toArray()
               res.json(result)
          })


          //DELETE API
          app.delete('/addOrders/:id', async(req, res)=>{
               const id = req.params.id;
               const query = { _id: ObjectId(id)};
               const result = await ordersCollection.deleteOne(query)
               res.json(result)
          })
          

     }
     finally{
          //  await client.close();
     }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
     res.send('Running On The Maison commercial Server')
});

app.listen(port, ()=>{
     console.log('Listening  the server port', port)
})