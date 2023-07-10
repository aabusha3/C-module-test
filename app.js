//needed general modules
const express = require('express');
const cors = require('cors');
const NanoTimer = require('nanotimer');

const PORT = 7999;//the port
const app = express();
app.use(express.json());
app.use(cors());

//create routers
const soRouter = express.Router();  //router for .so button
const nodeRouter = express.Router();//router for node-gyp button
const wasmRouter = express.Router();//router for emscriten button

app.use(express.static('./front'));//the front-end

//define api url for routers
app.use('/api/gcc', soRouter)
app.use('/api/node', nodeRouter)
app.use('/api/wasm', wasmRouter)

//debugging purposes
app.use((req,res,next)=>{
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//ffi call
const ffi = require('ffi-napi');//needed ffi module
const soAddon = ffi.Library('./gcc/tt', {//define the interface
    "enter":["void", ["int"],],
})
soRouter.route('/:size/:repeat')
.get((req,res)=>{//define get method for /api/gcc/:size/:repeat
    //must be number
    const size = parseInt(req.params.size);
    const repeat = parseInt(req.params.repeat);
    
    let time = new NanoTimer().time((() => {
        for(let i=0; i<repeat; i++) soAddon.enter(size);//call .so resource
    }),'','u')//time the duration taken by the call in micro-seconds (us)

    //return 200 success with the time taken and format
    return res.status(200).send({"time":usToHMS(time),"format":"(hours:minutes:seconds.milli.micro)"});
});

//node-gyp call
const nodeAddon = require('bindings')('gg')//nicety bindings module
nodeRouter.route('/:size/:repeat')
.get((req,res)=>{//define get method for /api/node/:size/:repeat
    //must be number
    const size = parseInt(req.params.size);
    const repeat = parseInt(req.params.repeat);

    let time = new NanoTimer().time((() => {
        for(let i=0; i<repeat; i++) nodeAddon.enter(size);//call .node resource
    }),'','u')//time the duration taken by the call in micro-seconds (us)
    
    //return 200 success with the time taken and format
    return res.send({"time":usToHMS(time),"format":"(hours:minutes:seconds.milli.micro)"});
});

//emscripten call
const emccAddon = require('./emcc/t2.js');//call the auto-generated js file
wasmRouter.route('/:size/:repeat')
.get((req,res)=>{//define get method for /api/wasm/:size/:repeat
    //must be string
    const size = (req.params.size);
    const repeat = (req.params.repeat);

    //timing happens in ./emcc/t2.js file

    //return 200 success with the time taken and format
    return res.send({"time":usToHMS(emccAddon(size,repeat)),"format":"(hours:minutes:seconds.milli.micro)"});
});


function usToHMS( us ) {//convert micro-seconds (us) to hours:minutes:seconds.milli.micro format
    var ms = us /1000
    var seconds = ms / 1000;
    ms = ms % 1000
    
    var hours = parseInt( Math.trunc(seconds / 3600) );
    seconds = seconds % 3600;
    
    var minutes = parseInt( Math.trunc  (seconds / 60) ); 
    seconds = seconds % 60;
    
    us = us % 1000
    return ( hours+":"+minutes+":"+Math.trunc(seconds)+"."+Math.trunc(ms)+"."+Math.trunc(us));
}

app.listen(PORT, ()=>{//start listening on specified port
    console.log(`Listening on http://localhost:${PORT}`);
});