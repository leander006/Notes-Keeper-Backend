
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/note')
const mongoose = require('mongoose')
const {protect} = require('./middleware/fetchuser')
const express = require('express')
const app = express()
const cors = require('cors')

dotenv.config();
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URL
  ).then(console.log("connected to mongodb")
).catch((err)=> console.log(err));




//Available Routes

app.use('/api/auth',authRoute )
app.use('/api/note',protect,notesRoute)

app.get("/",(req,res) =>{
  res.send("Welcome to server of Note-keeper App")
})

app.listen(process.env.PORT || 4000, () => {
  console.log("INoteBook app listening")
})

