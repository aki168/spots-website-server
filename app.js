require('dotenv').config()

const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const uri = `mongodb+srv://root:${process.env.DB_KEY}@node-class.z1egu8r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('db is OK')
  // client.close();
})



const express = require('express')
const app = express()
const cors = require("cors");
const bp = require('body-parser')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const { promisify } = require("util");

app.set('view engine', 'ejs')
app.set('view options', './views')
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

app.get('/', (req, res)=>{
  res.render('index.ejs')
})

app.get('/users', async (req, res) => {
  let collection = client.db("website").collection("users")
  collection.find().toArray().then(result => {
    const userList = result.map(user => {
      let { password, ...userData } = user
      return userData
    })
    res.json(userList)
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
    const token = jwt.sign({ tId: result._id }, "jwtSecret", {
      expiresIn: "1d"
    })

    let userData = {
      id: result.id,
      tId: result._id.toString(),
      name: result.name,
      mail: result.mail,
      role: result.role,
      spotList: result.spotList,
      token
    }
    res.end(JSON.stringify({ msg: "登入成功", info: userData }))
  } else {
    res.end(JSON.stringify({ msg: "您的帳號或密碼錯誤" }))
  }
})

app.patch('/users', async (req, res) => {
  let tId = ''
  const { token, spotList } = req.body
  if (!token) {
    res.send({ meg: "token is empty" })
  } else {
    jwt.verify(token, "jwtSecret", async (err, decoded) => {
      if (err) {
        res.send({ auth: false, msg: "auth do not pass" })
      } else {
        tId = decoded.tId
        let collection = client.db("website").collection("users")
        const result = await collection.updateOne({ "_id": ObjectId(tId) }, {
          $set: { spotList }
        })
        if (result.modifiedCount >= 1) {
          res.end(JSON.stringify({ msg: "修改成功" }))
        } else {
          res.end(JSON.stringify({ msg: "setting error" }))
        }
      }
    })
  }

})

app.post('/register', async (req, res) => {
  const { mail, password, name, role } = req.body

  let collection = client.db("website").collection("users")
  const isExist = await collection.findOne({ mail })
  if (isExist) {
    res.send({ msg: "您已經註冊過囉" })
    res.end()
  }
  if (isExist === null) {
    const result = await collection.insertOne({ name, mail, password, role, spotList: [] })
    if (result) {
      res.send({ msg: "註冊成功" })
      res.end()
    }
  }
})

app.post('/auth', async (req, res) => {
  let tId = ''
  const { token } = req.body
  if (!token) {
    res.send({ meg: "token is empty" })
  } else {
    jwt.verify(token, "jwtSecret", async (err, decoded) => {
      if (err) {
        res.send({ auth: false, msg: "auth do not pass" })
      } else {
        tId = decoded.tId
        let collection = client.db("website").collection("users")
        const result = await collection.findOne({ "_id": ObjectId(tId) })
        if (result) {
          let userData = {
            id: result.id,
            tId: result._id.toString(),
            name: result.name,
            mail: result.mail,
            role: result.role,
            spotList: result.spotList,
          }
          res.end(JSON.stringify({ auth: true, msg: "驗證成功", info: userData }))
        }
      }
    })
  }
})

app.get('/spots', async (req, res) => {
  let collection = client.db("website").collection("spots")
  collection.find().toArray().then(result => {
    res.json(result)
  }).catch(err => {
    console.log(err)
  })  
})  

app.post('/spots', async (req, res) => {
  const { name, description, pictureUrl } = req.body
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

  let collection = client.db("website").collection("spots")
  const result = await collection.deleteOne({ "_id": ObjectId(objectId) })
  console.log(result)
  if (result.deletedCount >= 1) {
    res.send({ msg: "刪除成功" })
    res.end()
  }  
})  

app.patch('/spots', async (req, res) => {
  const { objectId, name, description } = req.body

  let collection = client.db("website").collection("spots")
  const result = await collection.updateOne({ "_id": ObjectId(objectId) }, {
    $set: { name, description }
  })  
  if (result.modifiedCount >= 1) {
    res.end(JSON.stringify({ msg: "修改成功" }))
  } else {
    res.end(JSON.stringify({ msg: "setting error" }))
  }  
})  


app.listen(process.env.PORT || 8888, (err) => {
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", process.env.PORT || 8888);
})