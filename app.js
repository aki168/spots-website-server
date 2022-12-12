const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const uri = "mongodb+srv://root:19921217@node-class.z1egu8r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('db is OK')

  // const collection = client.db("website").collection("members");
  // client.close();
})



const express = require('express')
const app = express()
const cors = require("cors");
const bp = require('body-parser')
const session = require('express-session')
let PORT = 8888

app.set('view engine', 'ejs')
app.set('view', './views')
// const corsOptions = {
//     origin: [
//         'http://localhost:5173',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
app.use(cors());
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }))
app.use(bp.json())
app.use(session({
  secret: 'any key',
  resave: false,
  saveUninitialized: true
}))

app.get('/spots', async (req, res) => {
  let collection = client.db("website").collection("spots")
  // let data = []
  collection.find().toArray().then(result => {
    res.json(result)
  }).catch(err => {
    console.log(err)
  })
})

app.post('/spots', async(req, res)=> {
  const {name, description, pictureUrl } = req.body
  console.log(req.body)
  
  let collection = client.db("website").collection("spots")
  const result = await collection.insertOne({ name, description, pictureUrl })
  if (result) {
    res.send({ msg: "新增成功" })
    res.end()
  }
})

app.delete('/spots', async (req, res) => {
  const { objectId } = req.body
  console.log('body', req.body)
  
  let collection = client.db("website").collection("spots")
  const result = await collection.deleteOne({"_id": ObjectId(objectId)})
  console.log(result)
  if (result.deletedCount >= 1) {
    res.send({ msg: "刪除成功" })
    res.end()
  }
})


app.get('/users', async (req, res) => {
  let collection = client.db("website").collection("users")
  // let data = []
  collection.find().toArray().then(result => {
    res.json(result)
  }).catch(err => {
    console.log(err)
  })
})

app.post('/users', async (req, res) => {
  const { mail, password } = req.body
  console.log(req.body)

  let collection = client.db("website").collection("users")
  const result = await collection.findOne({
    $and: [{ mail }, { password }]
  })

  if (result != null) {
    // req.session.isLogin = true
    // req.session.userData = {
    //   id: result._id.toString(),
    //   name: result.name,
    //   mail: result.mail,
    //   role: result.role
    // }
    let userData = {
      id: result.id,
      tId: result._id.toString(),
      name: result.name,
      mail: result.mail,
      role: result.role
    }
    res.send({ msg: "登入成功", info: userData })
    res.end()
  } else {
    res.send({ msg: "您的帳號或密碼錯誤" })
    res.end()
  }
})

app.post('/register', async (req, res) => {
  const { mail, password, name, role } = req.body
  console.log(req.body)

  let collection = client.db("website").collection("users")
  const isExist = await collection.findOne({ mail })
  if (isExist) {
    res.send({ msg: "您已經註冊過囉" })
    res.end()
  }
  if (isExist === null) {
    const result = await collection.insertOne({ name, mail, password, role, spotList:[] })
    if (result) {
      res.send({ msg: "註冊成功" })
      res.end()
    }
  }
})


app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})