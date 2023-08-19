const fs = require('fs')
const axios = require('axios')

async function main() {
  try {
    const TODAY_DATE = new Date().toISOString().split('T')[0]
    const PATH = `./output_certsh/${TODAY_DATE}`
    const DOMAIN_ARG = process.argv[2]
    // example: node formats.js zoom
    const certURL = `https://crt.sh/?q=${DOMAIN_ARG}&output=json`
    const responseCert = await axios.get(certURL).then(res => res.data)
    const releaseData = responseCert.map(item => {
      const domain = item.common_name || null
      return { domain }
    })
    // remove duplicate domain
    const unique = [...new Set(releaseData.map(item => item.domain))]
    const releaseDataUnique = unique.map(item => {
      return { domain: item }
    })

    // checking one by one domain status with promise all
    const promisesAll = await Promise.all(
      releaseDataUnique.map(async item => {
        return new Promise(async (resolve, reject) => {
          const domain = item.domain
          console.log(`process domain ${domain} `)
          try {
            const url = `https://${domain}`
            const response = await axios.get(url)
            console.log({ response })
            resolve({
              domain: domain,
              status: response.status,
            })
          } catch (error) {
            resolve({
              domain: domain,
              status: error.response.status,
            })
          }
        })
      }),
    )

    if (!fs.existsSync(PATH)) {
      fs.mkdirSync(PATH)
    }

    fs.writeFileSync(
      `${PATH}/${DOMAIN_ARG}.json`,
      JSON.stringify(promisesAll),
      'utf8',
    )
  } catch (error) {
    console.log(error.message)
  }
}
main()
