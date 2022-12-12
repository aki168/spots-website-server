const { MongoClient, ServerApiVersion } = require('mongodb');
export const uri = "mongodb+srv://root:19921217@node-class.z1egu8r.mongodb.net/?retryWrites=true&w=majority";
export const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
export const connectDB = () => {
    client.connect(async (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('db is OK')

        // const collection = client.db("website").collection("members");
        // client.close();
    })
}

