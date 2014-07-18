
var test    = require('tap').test
  , msgpack = require('../')

test('encode/decode 2^8 <-> (2^16-1) bytes strings', function(t) {

  var encoder = msgpack()
    , all     = []
    , str

  str = new Buffer(Math.pow(2, 8))
  str.fill('a')
  all.push(str.toString())

  str = new Buffer(Math.pow(2, 8) + 1)
  str.fill('a')
  all.push(str.toString())

  str = new Buffer(Math.pow(2, 14))
  str.fill('a')
  all.push(str.toString())

  str = new Buffer(Math.pow(2, 16) - 1)
  str.fill('a')
  all.push(str.toString())

  all.forEach(function(str) {
    t.test('encoding a string of length ' + str.length, function(t) {
      var buf = encoder.encode(str)
      t.equal(buf.length, 3 + Buffer.byteLength(str), 'must be the proper length')
      t.equal(buf[0], 0xda, 'must have the proper header');
      t.equal(buf.readUInt16BE(1), Buffer.byteLength(str), 'must include the str length');
      t.equal(buf.toString('utf8', 3, Buffer.byteLength(str) + 3), str, 'must decode correctly');
      t.end()
    })

    t.test('decoding a string of length ' + str.length, function(t) {
      var buf = new Buffer(3 + Buffer.byteLength(str))
      buf[0] = 0xda
      buf.writeUInt16BE(Buffer.byteLength(str), 1)
      buf.write(str, 3)
      t.equal(encoder.decode(buf), str, 'must decode correctly');
      t.end()
    })

    t.test('mirror test a string of length ' + str.length, function(t) {
      t.equal(encoder.decode(encoder.encode(str)), str, 'must stay the same');
      t.end()
    })
  })

  t.end()
})
