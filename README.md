# dev-https

Dead simple HTTPS reverse proxy for use when developing

[![NPM][npm-badge]][npm]
[![Build Status][travis-badge]][travis]

This utility automatically creates a self-signed certificate, sets up an HTTPS
server, and proxies all requests to the server you specify. Use it for quickly
testing a site over https when developing.

## Usage

```sh
dev-https [-p <port>] <url>
```

First, you need to install it:

```sh
npm install -g dev-https
```

Then, run it:

```sh
dev-https http://localhost:8000
```

By default it runs on port 4430 (https://localhost:4430), but you can specify
the port:

```sh
dev-https -p 443 http://localhost:8000
```

That's it!

## Notes

You **will** get SSL certificate errors with this. That is to be expected when
generating self-signed SSL certs on the fly like this does. This is **not** to
be used in production at all, only when developing.

[npm]: https://www.npmjs.com/package/dev-https
[npm-badge]: https://img.shields.io/npm/v/dev-https.svg
[travis]: https://travis-ci.org/conradz/dev-https
[travis-badge]: https://img.shields.io/travis/conradz/dev-https.svg
