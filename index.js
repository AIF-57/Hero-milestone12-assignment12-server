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
        const testimonialCollection = client.db("testimonial_collection").collection("testimonials");
        const faqCollection = client.db("faq_collection").collection("faqs");

        // get all products data
        app.get('/products',async(req,res)=>{
            const query = {};
            const cursor = collection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });


        // get product categories
        app.get('/product/categories', async(req,res)=>{
            const query = {};
            const cursor = collection.find(query).project({Category: 1});
            const productCategories = await cursor.toArray();
            res.send(productCategories);
        })


        // get single product data
        app.get('/product/:id',async(req,res)=>{
            const id =  req.params.id;

            const options = {};
            const query = {MODEL_ID: id};
            const product = await collection.findOne(query,options);
            res.send(product);
        });
        // updating remaining quantity after order placed
        app.put('/product/:id',async(req,res)=>{
            const id =  req.params.id;
            console.log(id);
            const quantity = req.body;
            const remainingQuantity = quantity.remainingQuantity;
            console.log(remainingQuantity);


            const filter = {MODEL_ID: id};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    AVAILABILITY : remainingQuantity
                }
            };
            const result = await collection.updateOne(filter,updateDoc,options);
            res.send(result);

        })




        // post order
        app.post('/order/:id',async(req,res)=>{
            const id = req.params.id;
            const order = req.body;

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

        // edit cart item quantity
        app.put('/cart_item/:id', async(req,res)=>{
            const productId = req.params.id;

            const filter = {_id: new ObjectId(productId)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    "orderDetails.paymentStatus" : 'paid'
                }
            };
            const result = await orderCollection.updateOne(filter,updateDoc,options);
            res.send(result);

        })



        // add new product
        app.post('/new_product', async(req,res)=>{
            const newProduct = req.body;
            const result = await collection.insertOne(newProduct);
            res.send( result)
        });

        // get single product details for edit product
        app.get('/product/edit-product/:id',async(req,res)=>{
            const id =  req.params.id;

            const options = {};
            const query = {MODEL_ID: id};
            const product = await collection.findOne(query,options);
            res.send(product);
        });
        // edit product
        app.put('/product/edit-product/:product_Id',async(req,res)=>{
            const productId = req.params.product_Id;
            const updatedProductDetails = req.body;
            const filter = {_id: new ObjectId(productId)};
            const options = {upsert: true};
            const updateDoc = {
                $set: updatedProductDetails
            };
            const result = await collection.updateOne(filter,updateDoc,options);
            res.send(result);
        })

        // delete product from admin dashBoard
        app.delete('/product/:id',async(req,res)=>{
            const productId = req.params.id;
            const query = {_id: new ObjectId(productId)};
            const result = await collection.deleteOne(query);
            res.send(result);
        });




        // get testimonials
        app.get('/testimonials', async(req,res)=>{
            const query = {};
            const cursor = testimonialCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });




        // get faqs
        app.get('/faqs',async(req,res)=>{
            const query = {};
            const cursor = faqCollection.find(query);
            const faqs = await cursor.toArray();
            res.send(faqs);
        });
    }finally{
        // client.close();
    }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`Listening to the port: ${port}`)
})