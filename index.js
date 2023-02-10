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


app.get('/',(req,res)=>{
    res.send('Hello World')
})

async function run (){
    try{
        await client.connect();
        const collection = client.db("product_collection").collection("products");
        app.get('/products',async(req,res)=>{
            const query = {};
            const cursor = collection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    }finally{
        // client.close();
    }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`Listening to the port: ${port}`)
})