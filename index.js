require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

//const uri = "mongodb://localhost:27017"
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyhqa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri)

const run = async () => {
    try {
        await client.connect()

        const database = client.db("moon-tech")
        const productCollection = database.collection("products")

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();

            res.send({ status: true, data: product });
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params
            const result = await productCollection.findOne({ _id: ObjectId(id) })
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const doc = req.body
            const result = await productCollection.insertOne(doc)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const pdInfo = req.body
            const updateDoc = {
                $set: {
                    model: pdInfo.model,
                    image: pdInfo.image,
                    price: pdInfo.price,
                    brand: pdInfo.brand,
                    status: pdInfo.status
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc)

            res.send(result)
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const result = await productCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Hello Moon")
})

app.listen(port, () => {
    console.log(`Moon tech app listing on port ${port}`)
})