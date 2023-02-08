const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q89u4if.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('db connected')
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
  client.close();
});
app.get('/',(req,res)=>{
    res.send('Hello World !');
});






app.listen(port,()=>{
    console.log(`Listening to the port: ${port}`)
})