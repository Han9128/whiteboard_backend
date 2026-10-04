
// this must be before importng db otherwiser it is does not provide .env variable to db.js file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoute');
const canvasRouter = require('./routes/canvasRoute');
const connectDb = require('./config/db');
const {setUpSocket} = require('./websocket/socket')

const PORT = process.env.PORT || 5000;



const app = express();

connectDb();

app.use(cors());
app.use(express.json());

app.get('/health', (req,res)=>{
    res.status(200).json({status:"ok"})
})
app.use('/api',authRouter);
app.use('/api/canvas',canvasRouter)

// app.listen internally create and return the http server
const server = app.listen(PORT,()=>{ 
    console.log(`Server is listening on port ${PORT}`);
});

setUpSocket(server);

