import * as webLib from './web-lib.mjs';
import * as path from "path";
import * as fs from "fs";

import { fileURLToPath } from 'url';

let config;

const HOST = '127.0.0.1';
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fullPath = path.join(__dirname, '/config.json');

const readConfigFile = (call) => {
    fs.readFile(fullPath, (err, data) => {
        if (err){
            throw err;
        }
        config = JSON.parse(data);
        call();
    });
};

const surfServer = () =>{
    const server = new webLib.HTTPServer(path.join(__dirname, '..', config.root_directory), config.redirect_map);
    server.listen(PORT, HOST);
};

function main(){
    readConfigFile(surfServer);
}

main();