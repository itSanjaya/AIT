import * as path from "path";
import * as net from "net";
import * as fs from "fs";
import MarkdownIt from "markdown-it";

const MIME_TYPES = {
    "jpg" : "image/jpg",
    "jpeg" : "image/jpeg",
    "png" : "image/png",
    "html" : "text/html",
    "css" : "text/css",
    "txt" : "text/plain"
};

/**
 * returns the extension of a file name (for example, foo.md returns md)
 * @param fileName (String)
 * @return extension (String)
 */
function getExtension(fileName) {
    const formatPath = path.extname(fileName).toLowerCase();
    if (formatPath.startsWith(".")) {
        return formatPath.substring(1);
    }
    return formatPath;
}

/**
 * determines the type of file from a file's extension (for example,
 * foo.html returns text/html
 * @param: fileName (String)
 * @return: MIME type (String), undefined for unkwown MIME types
 */
function getMIMEType(fileName) {
    const ext = path.extname(fileName);
    return ext.length > 0 ? MIME_TYPES[ext.substring(1)] : null;
}

class Request {
    constructor(reqStr) {
        const [method, path] = reqStr.split(" ");
        this.method = method;
        this.path = path;
    }
}

class Response {

    static STATUS_CODES = {
        200 : "OK",
        308 : "Permanent Redirect",
        404 : "Page Not Found",
        500 : "Internal Server Error"
    };

    constructor(socket, statusCode = 200, version = "HTTP/1.1") {
        this.sock = socket;
        this.statusCode = statusCode;
        this.version = version;
        this.headers = {};
        this.body = null;
    }

    setHeader(name, value) {
        this.headers[name] = value;
    }

    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    send(body) {
        this.body = body ?? "";
      
        if (!Object.hasOwn(this.headers, "Content-Type")) {
            this.headers["Content-Type"] = "text/html";
        }

        const statusCodeDesc = Response.STATUS_CODES[this.statusCode];

        const headersString = Object.entries(this.headers).reduce((s, [name, value]) => {
            return s + `${name}: ${value} \r\n`;
        }, "");

        this.sock.write(`${this.version} ${this.statusCode} ${statusCodeDesc}\r\n`);
        this.sock.write(`${headersString}\r\n`);
        this.sock.write(this.body);

        this.sock.end();
    }
}

class HTTPServer {
    constructor(rootDirFull, redirectMap) {
        this.rootDirFull = rootDirFull;
        this.redirectMap = redirectMap;
        this.server = net.createServer(this.handleConnection.bind(this));
    }

    listen(port, host) {
        this.server.listen(port, host);
    }

    handleConnection(sock) {
        sock.on("data", data => this.handleRequest(sock, data));
    }

    handleRequest(sock, binaryData) {
        const req = new Request(binaryData.toString());
        const res = new Response(sock);
        const reqPathFull = path.join(this.rootDirFull, req.path);
        let another;
        let level = false;

        // TODO: (see homework specification for details)
        // 0. implementation can start here, but other classes / methods can be modified or added
        // 1. handle redirects first
        // 2. if not a redirect and file/dir does not exist send back not found
        // 3. if file, serve file
        // 4. if dir, generate page that lists files and dirs contained in dir
        // 5. if markdown, compile and send back html

        if (this.redirectMap[req.path] !== undefined){
            another = path.join(this.rootDirFull, this.redirectMap[req.path]);
            level = true;
        }

        fs.access(level? another: reqPathFull, fs.constants.F_OK, (err) =>{
            if (err){
                res.status(404);
                res.setHeader('Content-Type', MIME_TYPES['txt']);
                res.send();
            }
            else{
                const variab = level? another: reqPathFull;

                if (level){
                    res.status(308);
                }
                else{
                    res.status(200);
                }
                
                const frdr = fs.statSync(variab);
                if (frdr.isFile()){
                    const get = getExtension(variab);

                    res.setHeader('Content-Type', getMIMEType(variab));
                    fs.readFile(variab, (err, data) => {
                        if (err){
                            res.status(500);
                            res.send();
                            throw err;
                        }

                        else{
                            let extd;
                            
                            if (get === 'md'){
                                res.setHeader('Content-Type', MIME_TYPES['html']);
                                const mrkdn = MarkdownIt({html:true});
                                extd = mrkdn.render(data.toString());
                            }
                            res.send(get === 'md'? extd: data);
                        }
                    });
                }

                else if(frdr.isDirectory()){
                    let one = " ";

                    fs.readdir(variab, {withFileTypes: true}, (err, files) => {
                        if (err){
                            res.status(500);
                            res.setHeader('Content-Type', MIME_TYPES['html']);
                            res.send();
                        }
                        else{
                            for (let i=0; i < files.length; i++) {
                                one = one + `<a href = ${req.path + files[i].name + '/'} > ${files[i].name} </a> <br>`;
                            }
                            res.send(one);
                        }
                    });
                }
            }
        });
    }
}


export {
    Request,
    Response,
    HTTPServer
};