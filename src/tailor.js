'use strict';
const http = require('http');
const path = require('path');
const Tailor = require('node-tailor');
const fragmentServer = require('./../lib/fragment-server');
const fetchTemplateFs = require('../lib/fetch-template');

const baseTemplateFn = () => 'base-template';

const tailorInstance = new Tailor({
    fetchTemplate: fetchTemplateFs(path.join(__dirname, 'templates'), baseTemplateFn)
});

const server = http.createServer(tailorInstance.requestHandler);
server.listen(8080);

console.log('Tailor started at port 8080');
tailorInstance.on('error', (request, err) => console.error(err));

const footerFragment = http.createServer(
    fragmentServer('footer', 'http://localhost:8081')
);
footerFragment.listen(8081);
console.log('footerFragment started at port 8081');
