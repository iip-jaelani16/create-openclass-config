const fs = require('fs')

function main() {
  let results = ''
  const payload = fs.readFileSync('./payload.txt', 'utf-8')
  results += 'GET / HTTP/1.1[crlf]'
  results += 'Host: [host][crlf]'
  results += payload.replace(/(\n)/g, '[crlf]')
  results += '[crlf][crlf]'

  fs.writeFileSync('./payload/payload-result.txt', results)
}

main()
