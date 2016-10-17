'use strict';
const url = require('url');
const fs = require('fs');

const polyfills = fs.readFileSync('src/spa/polyfills.6992f2dde5d5688b2b94.js', 'utf8');
const vendor = fs.readFileSync('src/spa/vendor.6992f2dde5d5688b2b94.js', 'utf8');
const app = fs.readFileSync('src/spa/app.6992f2dde5d5688b2b94.js', 'utf8');

module.exports = (fragmentName, fragmentUrl) => (request, response) => {
    const pathname = url.parse(request.url).pathname;
    switch (pathname) {
        case '/fragment.js':
            // serve fragment's JavaScript
            response.writeHead(200, {'Content-Type': 'application/javascript'});
            response.end(`
                define (['word'], function (word) {
                    return function initFragment (element) {
                        ${polyfills}
                        ${vendor}
                        ${app}
                        element.className += ' fragment-${fragmentName}-initialised';
                        element.innerHTML += word;
                    };
                });
            `);
            break;
        case '/fragment.css':
            // serve fragment's CSS
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.end(`
                .fragment-${fragmentName} {
                    padding: 30px;
                    margin: 10px;
                    text-align: center;
                }
                .fragment-${fragmentName}-initialised {
                    background-color: lightgrey;
                }
            `);
            break;
        default:
            // serve fragment's body
            response.writeHead(200, {
                'Link': `<${fragmentUrl}/fragment.css>; rel="stylesheet",` +
                        `<${fragmentUrl}/fragment.js>; rel="fragment-script"`,
                'Content-Type': 'text/html'
            });
            response.end(`
                <toh-app></toh-app>
                <div class="fragment-${fragmentName}">
                    Fragment ${fragmentName}
                </div>
            `);
    }
};
