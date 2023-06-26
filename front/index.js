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

    await makeCall(type, size, repeat);
}

async function makeCall(type, size, repeat){
    const resultDisplay = document.getElementById('results')
    resultDisplay.innerText = 'Getting Time, Please Wait'
    switch(type){
        case 'gcc':
            fetch(`/api/so/${size}/${repeat}`).then(res=>res.json().then(data=>{
                console.log(`${data.time}  ${data.format}`)
                resultDisplay = document.getElementById('results').innerText = `${data.time}  ${data.format}`
            }));
            break;
        case 'node':
            fetch(`/api/node/${size}/${repeat}`).then(res=>res.json().then(data=>{
                console.log(`${data.time}  ${data.format}`)
                resultDisplay = document.getElementById('results').innerText = `${data.time}  ${data.format}`
            }));
            break;
        case 'wasm':
            fetch(`/api/wasm/${size}/${repeat}`).then(res=>res.json().then(data=>{
                console.log(`${data.time}  ${data.format}`)
                resultDisplay = document.getElementById('results').innerText = `${data.time}  ${data.format}`
            }));
            break;    
    }
}


