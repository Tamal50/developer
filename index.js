const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId


const dotenv = require('dotenv').config()


const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000

app.get('/', (req, res) => {
    res.send("Database Working")
  })


const uri = "mongodb+srv://Tamal:Tamal@cluster0.ox36p.mongodb.net/NewsProtal?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
    const bugs = client.db("NewsProtal").collection("News");
    const admin = client.db("NewsProtal").collection("admin");
    const comments = client.db("NewsProtal").collection("comment");



    app.post('/addbug', (req, res) => {
      // const file = req.files.file;
      const title = req.body.bug.title;
      const vote = req.body.bug.vote;
      const date = req.body.bug.date;
      const Email = req.body.Email;
      const status = req.body.status;
      const description = req.body.bug.description;
      const voter = req.body.voter;
      // const newImg = file.data;
      // const encImg = newImg.toString("base64");
      // var image = {
      //   contentType: file.mimetype,
      //   size: file.size,
      //   img: Buffer.from(encImg, "base64"),
      // };
      const image = req.body.image

      bugs.insertOne({
        title,
        description,
        image,
        date,
        vote,
        Email,
        status,
        voter
      })
      .then(result =>{
        console.log(result.acknowledged)
          res.json(result.acknowledged)
      })
    })

    app.get('/bugs', (req, res) => {
        bugs.find({})
        .toArray((err, documents) => {
          res.send(documents)
        })
      })
    
    app.get('/bug/:id', (req, res) => {
      bugs.find({_id:ObjectId.createFromHexString(req.params.id)})
      .toArray((err, documents)=>{
        res.send(documents[0])
      })
    })


    // Comment

    app.post('/addcomment', (req, res) => {
      // const file = req.files.file;
      const bugtitle = req.body.bug.title;
      const bugvote = req.body.bug.vote;
      const bugid = req.body.bug._id;
      const bugerEmail = req.body.bug.Email;
      const bugdate = req.body.bug.date;
      const bugimg = req.body.bug.image;
      const bugstatus = req.body.bug.status;
      const bugdescription = req.body.bug.description;
      const CommeterEmail = req.body.Email;
      const Comment = req.body.comment.comment;
      const commentimage = req.body.image

      comments.insertOne({
        bugtitle,
        bugvote,
        bugstatus,
        bugimg,
        bugdate,
        bugerEmail,
        bugid,
        bugdescription,
        CommeterEmail,
        Comment,
        commentimage,
      })
      .then(result =>{
        console.log(result.acknowledged)
          res.json(result.acknowledged)
      })
    })

    app.get('/comments', (req, res) => {
      comments.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
    
    app.get('/admin', (req, res) => {
      admin.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    }) 
    
    app.get('/bugs/status/:data', (req, res) => {
      var query = { status: req.params.data };
      bugs.find(query)
      .toArray((err, documents)=>{
        res.send(documents)
      })
    })

    app.post('/isAdmin', (req, res) => {
      const email = req.body.email;
      admin.find({ email: email })
          .toArray((err, documents) => {
              res.send(documents.length > 0);
          })
    })

    app.patch('/update/:id', (req, res) => {
      bugs.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {status: req.body.status}
      })
      .then (result => {
        res.send(result.modifiedCount > 0)
      })
    })

      
    console.log("Database")

});



app.listen(process.env.PORT || port, () => { })