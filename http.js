const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path')


const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const jsonData = JSON.parse(json)

const server = http.createServer((req, res) => {


    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

   //Overview html route 
    if(pathName === '/' ||  pathName === '/product'){
        res.writeHead(200, { "content-type": "text/html" });

        fs.readFile(`${__dirname}/template/toverview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/template/cards.html`, 'utf-8', (err, data) => {
                const cardOutput = jsonData.map(el => replaceTemplate(data, el)).join('')
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardOutput)

            res.end(overviewOutput)
            })
        })
        //template html  Route
    } else if( pathName === '/laptop' &&  id < jsonData.length) {
        res.writeHead(200, { "content-type": "text/html" });
        
        fs.readFile(`${__dirname}/template/template.html`, 'utf-8', (err, data) => {
            const laptop = jsonData[id];
            let output = replaceTemplate(data, laptop)
            res.end(output)
        })
     }
    //css route
    else if(url === '/', '/product', '/laptop' && id < jsonData.length){
        res.writeHead(200, {'content-type':'text/css'});
        fs.readFile(`${__dirname}/template/style.css`, 'utf-8', (err, data) => {
           if(err){
              console.log(Error)
           }
           data = style.css;
          res.write(data);
          res.end()
        })

    }
    //Route to access image files 
    else if((/\.(jpeg|jpg|png|gif|pdf)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/template/img/${pathName}`, (err, data) => {
            res.writeHead(200, { "Content-type": "img/jpg" })
            res.end(data)
        })
    }
   
    else {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end('Page not found')
    }
})

server.listen(3500, () => {
    console.log(`Server Listening at port: 3500`)
})

function replaceTemplate(original, laptop){
    let output = original.replace(/{%PRODUCTNAME%}/g, laptop.productName)
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%SCREEN%}/g, laptop.screen)
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id)

    return output;
}