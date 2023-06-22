const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 7999;

app.use(express.json());
app.use(cors());

app.use(express.static('./C-module-test/dist'));


// app.use("/api/outline",require('./routes/Outline'));

app.use((req,res,next)=>{
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});