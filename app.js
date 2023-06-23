const express = require('express');
const cors = require('cors');
const NanoTimer = require('nanotimer');

const ffi = require('ffi-napi');
const nodeAddon = require('bindings')('gg')

const app = express();
const PORT = 7999;

app.use(express.json());
app.use(cors());

const soRouter = express.Router();
const nodeRouter = express.Router();
const wasmRouter = express.Router();

// soRouter.use(express.json());

app.use(express.static('./front'));
app.use('/api/so', soRouter)
app.use('/api/node', nodeRouter)
app.use('/api/wasm', wasmRouter)

app.use((req,res,next)=>{
    console.log(`${req.method} request for ${req.url}`);
    next();
});


const soAddon = ffi.Library('./gcc/tt', {
    "enter":["void", ["int"],],
})
soRouter.route('/:size/:repeat')
.get((req,res)=>{
    const size = parseInt(req.params.size);
    const repeat = parseInt(req.params.repeat);
    
    let time = new NanoTimer().time((() => {
        for(let i=0; i<repeat; i++) {
            soAddon.enter(size);
        }
    }),'','u')

    return res.send({"time":usToHMS(time),"format":"(hours:minutes:seconds.milli.micro)"});
});


nodeRouter.route('/:size/:repeat')
.get((req,res)=>{
    const size = parseInt(req.params.size);
    const repeat = parseInt(req.params.repeat);

    let time = new NanoTimer().time((() => {
        for(let i=0; i<repeat; i++) nodeAddon.enter(size);
    }),'','u')
    
    return res.send({"time":usToHMS(time),"format":"(hours:minutes:seconds.milli.micro)"});
});

const t2 = require('./emcc/t2.js');
wasmRouter.route('/:size/:repeat')
.get((req,res)=>{
    const size = (req.params.size);
    const repeat = (req.params.repeat);

    // let time = new NanoTimer().time((() => {
    //     t2(size, repeat)
    // }),'','u')
    console.log( t2(size,repeat))
    let time= 100000
    return res.send({"time":usToHMS(time),"format":"(hours:minutes:seconds.milli.micro)"});
});


function usToHMS( us ) {
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

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});