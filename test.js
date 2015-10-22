var test = require('tap').test
var http = require('http')
var spawn = require('child_process').spawn
var request = require('request')

test('start and serve requests', function (t) {
  var proc
  var server = http.createServer(handler)
  server.listen(8000, listening)

  function listening (err) {
    t.error(err)
    proc = spawn(process.execPath, ['index.js', '-p', '8001', 'http://localhost:8000'])

    // wait for process to start up
    setTimeout(started, 5000)
  }

  function started () {
    var opts = { url: 'https://localhost:8001', rejectUnauthorized: false }
    request(opts, requested)
  }

  function requested (err, req, body) {
    t.error(err)
    t.equal(body, 'Test body')
    proc.kill()
    server.close()
    t.end()
  }

  function handler (req, res) {
    res.end('Test body')
  }
})
