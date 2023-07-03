document.getElementById('gcc-search').addEventListener('click', async()=>{await checkInput('gcc')});
document.getElementById('node-search').addEventListener('click', async()=>{await checkInput('node')});
document.getElementById('wasm-search').addEventListener('click', async()=>{await checkInput('wasm')});

 async function checkInput(type){
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

    makeCall(type, size, repeat);
}

async function getProcessedData(url) {
    let v;
    try {
      v = await fetch(url);
    } catch (ignore) {}
    return await getProcessedJSON(v);
}

async function getProcessedJSON(res) {
    let v;
    try {
      v = await res.json();
    } catch (ignore) {}
    return await processDataInWorker(v);
}

async function processDataInWorker(data) {
    console.log(`${data.time}  ${data.format}`)
    return await data;
}
  

async function makeCall(type, size, repeat){
    const resultDisplay = document.getElementById('results')
    const newResult = document.createElement('li')
    resultDisplay.appendChild(newResult)

    let data = {}
    newResult.innerText = `Getting Time For ${type} of ${size}x${size} for ${repeat}, Please Wait`
    await Promise.all([
        (async () => data = await getProcessedData(`/api/${type}/${size}/${repeat}`))(),
    ]);

    newResult.innerText = `${type} of ${size}x${size} for ${repeat} returned in ${data.time}  ${data.format}`
}


