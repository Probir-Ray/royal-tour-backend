const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrfjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://royalDbUser:jRXRUhwswlWBLSjH@cluster0.xrfjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('royalTour');
        const planCollection = database.collection('plan');

        // GET API
        app.get('/', async(req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        })

        // POST API
        app.post('/plans', async (req, res) => {
            const newPlan = req.body;
            const result = await planCollection.insertOne(newPlan);
            res.json(result);
        });

        // Filter data
        app.get('/place-order/:planId', async (req, res) => {
            const id = req.params.planId;
            const query = { _id: ObjectId(id) };
            const plan = await planCollection.findOne(query);
            console.log('load id', id);
            res.send(plan);
        })

    }
    finally {
        
    }
}

run().catch(console.dir);


// app.get('/', (req, res) => {
//     res.send('Send data');
// });


app.listen(port, () => {
    console.log("Server running at port", port);
})