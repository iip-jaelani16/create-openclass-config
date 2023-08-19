const fs = require('fs')

function main(params) {
  const ilped = JSON.parse(fs.readFileSync('./output/ilped.json', 'utf-8'))
  for (let index = 0; index < ilped.length; index++) {
    const element = ilped[index]
    fs.writeFileSync(`./output/${element}.json`, `["${element}"]`, 'utf-8')
  }
}
main()
