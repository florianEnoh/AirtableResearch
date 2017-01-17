const https = require('https');
var fs = require('fs');
let currentDumpDir = '';
let options = [];

const tables = ['Epreuves','Tests','Images Propositions','Acquis'];
let dumpFiles = [];
createDailyBackUpRepo();
createFiles();


for (var i = 0; i < tables.length; i++) {
    options.push({
        host: 'api.airtable.com',
        path: '/v0/appHAIFk9u1qqglhX/' + tables[i].replace(' ','%20') + '&maxRecords=',
        method: 'GET',
        headers: {
            Authorization: "Bearer YourKey"
        }
    });
}

    let counter = 0;
    https.get(options[counter], function (res){
        let pieceOfFile = "";
        res.on('data', function (chunk) {
            pieceOfFile += chunk;
        });
        res.on('end',function(){
            writeIntoFile(dumpFiles[counter], pieceOfFile);
            next();
        });
    });


function next(){
    ++counter;
    if (counter>3) return;
    https.get(options[counter], function (res){
        let pieceOfFile = "";
        res.on('data', function (chunk) {
            pieceOfFile += chunk;
        });
        res.on('end',function(){
            writeIntoFile(dumpFiles[counter], pieceOfFile);
            next();
        });
    });
}




function createFiles(){
    tables.forEach(function (item) {
        const currentFile = 'Pix_Production_' + item.replace(' ', '') + '.json';
        dumpFiles.push(currentDumpDir + '/' +currentFile);
        fs.openSync(currentDumpDir + '/' + currentFile, 'w+');
    });
}

function createDailyBackUpRepo() {
    const today = new Date();
    currentDumpDir = today.getFullYear() + '-' + ( today.getMonth() + 1 ) + '-' + today.getDate();
    if (!fs.existsSync(currentDumpDir)){
        fs.mkdirSync(currentDumpDir);
    }
}

function writeIntoFile(fileName, chunk){
    fs.writeFile(fileName,chunk,function(err, data){
        if (err) throw err;
        console.log('It\'s saved!');
    });
}
