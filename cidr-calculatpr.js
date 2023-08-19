function u(n) {
  return n >>> 0
} // we need to treat the numbers as unsigned
function ip(n) {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    (n >>> 0) & 0xff,
  ].join('.')
}

var addr = '198.162.1.1/24',
  m = addr.match(/\d+/g), // [ '198', '162', '1', '1', '24' ]
  addr32 = m.slice(0, 4).reduce(function (a, o) {
    return u(+a << 8) + +o
  }), // 0xc6a20101
  mask = u(~0 << (32 - +m[4])) // 0xffffff00
var start = ip(u(addr32 & mask)), // 198.162.1.0
  end = ip(u(addr32 | ~mask)) // 198.162.1.255

console.log({ start, end })
