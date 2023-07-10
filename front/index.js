//add click listener to button for .so
document.getElementById('gcc-search').addEventListener('click', async()=>{await checkInput('gcc')});
//add click listener to button for node-gyp
document.getElementById('node-search').addEventListener('click', async()=>{await checkInput('node')});
//add click listener to button for emscripten
document.getElementById('wasm-search').addEventListener('click', async()=>{await checkInput('wasm')});

 async function checkInput(type){//check input fields are correct
    const size = document.getElementById('size').value;
    const repeat = document.getElementById('repeat').value;

    if(size ==='')
        return alert('Please Make Sure To Enter In A Number In The Size Field');    
        
    if(repeat ==='')
        return alert('Please Make Sure To Enter In A Number In The Repeat Field');

    if(parseInt(size) <= 0||parseInt(repeat) <= 0)
        return alert('Please Make Sure To Enter In A Positive Number');
    
    // console.log(type)
    // console.log(size)
    // console.log(repeat)

    await Promise.all([//call the back-end in an async environment
        (async () => makeCall(type, size, repeat))(),
    ]);
}

async function getProcessedData(url) {//call the back-end url
    let v;
    try {
      v = await fetch(url);
    } catch (ignore) {}
    return await getProcessedJSON(v);
}

async function getProcessedJSON(res) {//parse the response JSON
    let v;
    try {
      v = await res.json();
    } catch (ignore) {}
    return await processDataInWorker(v);
}

async function processDataInWorker(data) {//exctract the data field directly
    // console.log(`${data.time}  ${data.format}`)
    return await data;
}
  

async function makeCall(type, size, repeat){//create the appropriate url, call it, then display the result in a list
    const resultDisplay = document.getElementById('results')
    const newResult = document.createElement('li')//the result tag
    resultDisplay.appendChild(newResult)//where the result will be added to the dom

    let data = {}
    newResult.innerText = `Getting Time For ${type} of ${size}x${size} for ${repeat}, Please Wait`//text to show you order is being processed
    await Promise.all([//get data in async environment
        (async () => data = await getProcessedData(`/api/${type}/${size}/${repeat}`))(),
    ]);

    newResult.innerText = `${type} of ${size}x${size} for ${repeat} returned in ${data.time}  ${data.format}`//write response to result tag
    console.log(`${type} of ${size}x${size} for ${repeat} returned in ${data.time}  ${data.format}`)//print result in console
}


