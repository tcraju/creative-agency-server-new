const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fileUpload = require('express-fileupload')
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(bodyParser.json());
app.use(fileUpload())
app.use(cors());
const port = 5000

// const uri = 'mongodb+srv://creative-agency-new-admin:FGebJY3bDujYiVw@cluster0.d1uxx.mongodb.net/creative-agency-new-db?retryWrites=true&w=majority';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d1uxx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const feedbackDb = client.db("creative-agency-new-db").collection("feedback");
  const serviceDb = client.db("creative-agency-new-db").collection("services");
  const worksDb = client.db("creative-agency-new-db").collection("works");
  const ordersDb = client.db("creative-agency-new-db").collection("orders");
  console.log('database connected');



  app.get('/feedback', (req, res) => {
    feedbackDb.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.get('/services', (req, res) => {
    serviceDb.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/works', (req, res) => {
    worksDb.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/orders', (req, res) => {
    ordersDb.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


//   app.post('/addOrder', (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;
//     const heading = req.body.heading;
//     const details = req.body.details;
//     const price = req.body.price;
//     const newImg = file.data;
//     const encImg = newImg.toString('base64');

//     var image = {
//         contentType: file.mimetype,
//         size: file.size,
//         img: Buffer.from(encImg, 'base64')
//     };

//     ordersDb.insertOne({ name, email, heading, details, price, image })
//         .then(result => {
//             res.send(result.insertedCount > 0);
//         })
// })
app.post('/addOrder', (req, res) => {
  const file = req.files.file
  const encImg = file.data.toString('base64')
  const image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  }
  const { name, details, email, heading, price } = req.body
  ordersDb.insertOne({ name, details, email, heading, price, image })
      .then(result => {
          return res.send(result.insertedCount > 0)
      })
})







});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)



// app.post('/addOrder', (req, res) => {
//   const file = req.files.file
//   const encImg = file.data.toString('base64')
//   const image = {
//       contentType: file.mimetype,
//       size: file.size,
//       img: Buffer.from(encImg, 'base64')
//   }
//   const { name, detail, email, work, price, status } = req.body
//   orderCollection.insertOne({ name, detail, email, status, work, price, image })
//       .then(result => {
//           return res.send(result.insertedCount > 0)
//       })
// })