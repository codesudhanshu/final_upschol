const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const adminsection = require('./admin section/router/index')
const candidatesection = require('./candidatesection/router')
const mongoose = require('mongoose')
dotenv.config()
const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URI

const app  = express()
app.use(express.json())
app.use(cors())


// app.use("*", cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "30mb" }));
// app.use(express.urlencoded({ limit: '5mb', extended: true }));
// app.use(express.json({ limit: '5mb' }));
// app.use(fileUpload());
// app.use(compression());

adminsection(app);
candidatesection(app)

mongoose.connect(MONGODB_URL)
.then(()=>console.log("MongoDB Has Been Connected"))
.catch(()=>console.log("MongoDB has Been Not Connected"))

app.listen(PORT,()=>{
    console.log(`Server listen on port ${PORT}`)
})