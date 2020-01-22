const http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");


class StaticServer {
    constructor() {
        this.mimeTypes = {
            "html": "text/html",
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
            "png": "image/png",
            "js": "text/javascript",
            "css": "text/css"
        };

        let directories = new Map();
        directories.set('public', '../public'); // Default
        directories.set('node_modules', '../node_modules');
        this.directories = directories;
    }

    start() {
        http.createServer((request, response) => {

            function fileNotFound() {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
            }

            let directory = this.directories.values().next().value;

            let matches = request.url.match('[^\/]+');
            if (matches) {
                let match = this.directories.get(matches[0]);
                if (match) {
                    directory = '../';
                }
            }

            let uri = url.parse(request.url).pathname;
            let filename = path.join(__dirname, directory, uri);

            if (!fs.existsSync(filename)) {
                fileNotFound();
            }

            if (fs.statSync(filename).isDirectory()) {
                filename += '/index.html';
                if (!fs.existsSync(filename)) {
                    fileNotFound();
                }
            }

            fs.readFile(filename, "binary", (err, file) => {
                if (err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                let mimeType = this.mimeTypes[filename.split('.').pop()];

                if (!mimeType) {
                    mimeType = 'text/plain';
                }

                response.writeHead(200, {"Content-Type": mimeType});
                response.write(file, "binary");
                response.end();
            });
        }).listen(8080);
    }

}

module.exports = StaticServer;