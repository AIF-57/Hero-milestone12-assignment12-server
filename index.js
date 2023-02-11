const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Hello World')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q89u4if.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


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

        // TODO: get single data
        app.get('/product/:id',async(req,res)=>{
            const id =  req.params.id;
            console.log(req.params.id);

            const options = {};
            const query = {MODEL_ID: id};
            const product = await collection.findOne(query,options);
            res.send(product);
        });
    }finally{
        // client.close();
    }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`Listening to the port: ${port}`)
})