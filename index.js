var https = require('https')
var pem = require('pem')
var request = require('request')
var minimist = require('minimist')

var CERT_OPTIONS = { days: 7, selfSigned: true }
var args = minimist(process.argv.slice(2))
if (args.h || args['?'] || args.help || args._.length !== 1) {
  console.error('Usage: dev-https [-p <port>] <url>')
  process.exit(1)
}

var baseUrl = args._[0]
var port = args.p || 4430

function createCert (callback) {
  pem.createCertificate(CERT_OPTIONS, created)

  function created (err, keys) {
    if (err) {
      return callback(err)
    }

    return callback(null, {
      key: keys.serviceKey,
      cert: keys.certificate
    })
  }
}

function setupServer (opts, callback) {
  var server = https.createServer(opts, handler)
  server.listen(opts.port, callback)
}

function handler (req, res) {
  var requestHeaders = {}
  Object.keys(req.headers).forEach(function (key) {
    if (key.toLowerCase !== 'host') {
      requestHeaders[key] = req.headers[key]
    }
  })

  var requestOpts = {
    url: baseUrl + req.url,
    method: req.method,
    headers: requestHeaders
  }

  var proxyReq = request(requestOpts)
  req.pipe(proxyReq).pipe(res)
}

createCert(created)

function created (err, cert) {
  if (err) {
    throw err
  }

  var opts = {
    key: cert.key,
    cert: cert.cert,
    port: port
  }

  setupServer(opts, finishedSetup)
}

function finishedSetup (err) {
  if (err) {
    throw err
  }

  console.log('Listening on https://localhost:' + port)
  console.log('Proxying requests to ' + baseUrl)
}
