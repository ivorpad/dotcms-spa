require('dotenv').config();

const express = require('express');
const next = require('next');
const querystring = require('query-string');
const bodyParser = require('body-parser');
const { getCookie, LANG_COOKIE_NAME } = require('./utils/dotcms/utilities');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { isNextInternalFile, loggerLog } = require('./utils');
const dotcms = require('./utils/dotcms');

const formUrlEncodedParser = bodyParser.raw({
    type: 'application/x-www-form-urlencoded',
    limit: '10mb',
    extended: true
});

function getCurrentLanguage(cookie) {
    return getCookie(cookie, LANG_COOKIE_NAME) || '1';
}

function dotCMSRequestHandler(req, res) {
    const url = req.path;
    if (dotcms.isPage(url)) {
        return dotcms.getPage(url, getCurrentLanguage(req.headers.cookie));
    } else {
        return dotcms.proxyToStaticFile(req, res);
    }
}

function isStaticPage(path) {
    return path.startsWith('/blog/post') || path.startsWith('/store');
}

app.prepare()
    .then(() => {
        const server = express();

        server.get('*', async (req, res) => {
            req.locals = {};
            req.locals.context = {};

            if (isNextInternalFile(req.path)) {
                return handle(req, res);
            }

            /*
                Trying to render the requested page from DotCMS, if the page exist and have a
                layout:
                
                1. We use NextJS to server side render the page
                2. We use the NextJS page component in /pages/dotcms.js
                3. We pass the page object to that component
            */
            try {
                const pageRender = await dotCMSRequestHandler(req, res);
                if (pageRender && !isStaticPage(req.path)) {
                    app.render(req, res, '/dotcms', { pageRender });
                } else if (pageRender && isStaticPage(req.path)) {
                    return handle(req, res);
                }
            } catch (error) {
                /* 
                    If the request to DotCMS fail we have a fallback chain in place.
                */
                switch (error.statusCode) {
                    /*
                        If the page doesn't have a layout we render the error using next right away.
                    */
                    case dotcms.errors.DOTCMS_NO_LAYOUT:
                        res.statusCode = 406; // Not Acceptable
                        error.statusCode = res.statusCode;
                        error.traceError = error.stack;

                        app.renderError(null, req, res, req.path, {
                            error
                        });
                        break;

                    case dotcms.errors.DOTCMS_CUSTOM_ERROR:
                        res.statusCode = 406; // Not Acceptable
                        error.statusCode = 'Error: 500';
                        error.traceError = error.stack;

                        app.renderError(null, req, res, req.path, {
                            error
                        });
                        break;
                    /*
                        But if the request to DotCMS fail because the instance is down or auth 
                        wasn't sucessufl, we try to render the page using next static page feature.

                        If the page exist in next all good but if not next will render a 404.

                        Also we are setting in dev mode a dotcmsStatus message that we will render
                        in all the pages just in edit mode to tell developers that something is up
                        with the DotCMS instance they are trying to reach. 
                    */
                    case dotcms.errors.DOTCMS_DOWN:
                    case dotcms.errors.DOTCMS_NO_AUTH:
                        let dotcmsStatus;

                        if (dev) {
                            dotcmsStatus = error.message;
                        }

                        app.render(req, res, req.path, { dotcmsStatus });
                        break;
                    default:
                        app.render(req, res, req.path);
                }
            }
        });

        /*
            We can assume (at least for now) that all requests to /api/* are meant
            to DotCMS instance, so we just proxy them.
        */
        server.post('/api/*', async (req, res) => dotcms.proxyToStaticFile(req, res));
        server.put('/api/*', async (req, res) => dotcms.proxyToStaticFile(req, res));

        /*
            DotCMS Edit Mode Anywhere Plugin works by sending a POST request to the configured
            server with the page object in the body, so:

            1. We parse the body
            2. Set absolute url to the assets for correct rendering inside DotCMS
            3. Render the page using nextjs api
        */
        server.post('*', formUrlEncodedParser, async (req, res) => {
            loggerLog('DOTCMS EDIT MODE');
            const page = JSON.parse(querystring.parse(req.body.toString()).dotPageData).entity;
            const pageRender = await dotcms.transformPage(page);
            app.setAssetPrefix(process.env.PUBLIC_URL);
            app.render(req, res, '/dotcms', { pageRender, isBeingEditFromDotCMS: true });
        });

        server.listen(3000, (err) => {
            if (err) throw err;
            console.log(`> Ready on ${process.env.PUBLIC_URL}`);
        });
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1);
    });
