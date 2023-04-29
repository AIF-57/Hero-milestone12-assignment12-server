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
        const orderCollection = client.db("order_collection").collection("orders");

        // get all products data
        app.get('/products',async(req,res)=>{
            const query = {};
            const cursor = collection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // get single product data
        app.get('/product/:id',async(req,res)=>{
            const id =  req.params.id;

            const options = {};
            const query = {MODEL_ID: id};
            const product = await collection.findOne(query,options);
            res.send(product);
        });


        // post order
        app.post('/order',async(req,res)=>{
            const order = req.body;
            // console.log(order)
            // const query = {item:order.item};
            // const exist = await orderCollection.findOne(query);
            // console.log(exist)
            // // if(exist){
            // //     return res.send({success: false});
            // // };
            const result = await orderCollection.insertOne(order);
            return res.send({success: true, result})
        });

        // get user order
        app.get('/user-orders',async(req,res)=>{
            const query = {};
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        });

        // delete cart item
        app.delete('/user-order/:id',async(req,res)=>{
            const itemId = req.params.id;
            const query = {_id: new ObjectId(itemId)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })


        // delete product from admin dashBoard
        app.delete('/product/:id',async(req,res)=>{
            const productId = req.params.id;
            const query = {_id: new ObjectId(productId)};
            const result = await collection.deleteOne(query);
            res.send(result);
        })
    }finally{
        // client.close();
    }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`Listening to the port: ${port}`)
})