const axios = require('axios')
const fs = require('fs')
// get from flag
const domains_initial = process.argv[2]
// example command
// node index.js google.com
const options = {
  method: 'GET',
  url: `https://www.virustotal.com/api/v3/domains/${domains_initial}/subdomains`,
  params: { limit: '100' },
  headers: {
    accept: 'application/json',
    'x-apikey':
      '31595486209f67d642f1ab01bd07a854d626c725865f9ac8e9db27cab4e36c26',
  },
}

function main(domains) {
  axios
    .request(options)
    .then(function (response) {
      const {
        data,
        links: { next },
      } = response.data
      let oldData = '[]'
      let oldDataDns = '[]'
      try {
        oldData = fs.readFileSync(`./output/${domains}/${domains}.json`, 'utf8')
      } catch (error) {
        console.debug('not found')
      }

      try {
        oldDataDns = fs.readFileSync(
          `./output/${domains}/${domains}_last_dns.json`,
          'utf8',
        )
      } catch (error) {
        console.debug('dns not found')
      }

      // old domains
      const oldDataArr = JSON.parse(oldData)
      const oldDataArrDns = JSON.parse(oldData)
      // current domains
      const releaseData = [...(data || [])].map(e => e?.id || 'NULL')
      const lastDnsRecord = [...(data || [])].map(
        e => e?.attributes?.last_dns_records || [],
      )

      const mergeData = [...oldDataArr, ...releaseData]
      const mergeDataDns = [...oldDataArrDns, ...lastDnsRecord]
      // create dir if not exist
      if (!fs.existsSync(`./output/${domains}`)) {
        fs.mkdirSync(`./output/${domains}`)
      }
      fs.writeFileSync(
        `./output/${domains}/${domains}.json`,
        JSON.stringify(mergeData),
      )

      fs.writeFileSync(
        `./output/${domains}/${domains}_last_dns.json`,
        JSON.stringify(mergeDataDns),
      )

      if (next) {
        options.url = next
        main(domains)
      }
    })
    .catch(function (error) {
      console.error(error)
    })
}

main(domains_initial)
