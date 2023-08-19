const fs = require('fs')
const base64 = require('base-64')
var emoji = require('node-emoji')
const lodash = require('lodash')
function main() {
  const filename = process.argv[2]
  // template dns yaml from ./template/dns.yaml
  const accounts = fs.readFileSync('./account.txt', 'utf8')
  const groupsTemplate = fs.readFileSync(
    './template/group_template.yaml',
    'utf8',
  )
  const providersTemplate = fs.readFileSync(
    './template/providers_template.yaml',
    'utf8',
  )
  const dnsTemplate = fs.readFileSync('./template/dns.yaml', 'utf8')
  const trojanTemplate = fs.readFileSync(
    './template/trojan_template.yaml',
    'utf8',
  )
  const vmessTemplate = fs.readFileSync(
    './template/vmess_template.yaml',
    'utf8',
  )
  const vlessTemplate = fs.readFileSync(
    './template/vless_template.yaml',
    'utf8',
  )
  // list pathname in output folder
  const pathnames = fs.readdirSync('./output')

  const accountList = accounts.split('\n')

  // data
  let groups = `proxy-groups:\n`
  let providers = `proxy-providers:\n`

  for (let index = 0; index < pathnames.length; index++) {
    const bugName = pathnames[index]
    // bugs list
    const bugsList = fs.readFileSync(`./output/${bugName}`, 'utf8')
    let bugs = bugsList.split('\n')
    // remove duplicate adn empty
    bugs = bugs.filter((item, index) => bugs.indexOf(item) === index)
    bugs = bugs.filter(item => item !== '')
    const chunkBugs = lodash.chunk(bugs, 150)
    const emoticon = emoji.random()
    let groups__create = groupsTemplate.replace(
      /({group_name})/g,
      `${bugName.replace(/\./g, '_').toUpperCase()} ${emoticon.emoji}`,
    )
    let providers_fr_group = `\n`

    for (
      let index_chunks = 0;
      index_chunks < chunkBugs.length;
      index_chunks++
    ) {
      const chunkBugs_data = chunkBugs[index_chunks]
      const replaceBugName = `${bugName.replace(/\./g, '_').toUpperCase()}_${
        index_chunks + 1
      }`

      providers += providersTemplate
        .replace(/(provider_name)/g, replaceBugName)
        .replace(/({filename})/g, replaceBugName.toLowerCase())

      providers_fr_group += `   - ${replaceBugName}\n`
      let proxies = `proxies:\n`
      for (
        let index_bugs = 0;
        index_bugs < chunkBugs_data.length;
        index_bugs++
      ) {
        const bug = chunkBugs_data[index_bugs]
        console.log(`----------${bug}------------`)
        for (let index = 0; index < accountList.length; index++) {
          const account = accountList[index]
          if (account !== '') {
            const [type, data] = account.split('://')
            if (type === 'vmess') {
              const {
                v, //: '2',
                ps, //: 'sshocean-dasdasd',
                add, //: 'cdnodeb.visionplus.id',
                port, //: '80',
                id, //: '4e920450-ea9f-411d-88aa-0510641b1dd4',
                aid, //: '0',
                scy, //: 'auto',
                net, //: 'ws',
                type, //: 'none',
                host, //: 'sgovh1.v2rayserv.com',
                path, //: '/vmess',
                tls, //: 'none',
                sni, //: 'sgovh1.v2rayserv.com',
                alpn, //: '',
                ...rest
              } = JSON.parse(base64.decode(data))
              console.log({
                v, //: '2',
                ps, //: 'sshocean-dasdasd',
                add, //: 'cdnodeb.visionplus.id',
                port, //: '80',
                id, //: '4e920450-ea9f-411d-88aa-0510641b1dd4',
                aid, //: '0',
                scy, //: 'auto',
                net, //: 'ws',
                type, //: 'none',
                host, //: 'sgovh1.v2rayserv.com',
                path, //: '/vmess',
                tls, //: 'none',
                sni, //: 'sgovh1.v2rayserv.com',
                alpn, //: ''
                rest,
              })
              proxies += `${vmessTemplate
                .replace(
                  /({name})/g,
                  `${ps}-${bug}-${port === '443' ? 'ws' : 'non-ws'}-${index}`,
                )
                .replace(/('{bug}')/g, bug)
                .replace(/('{port}')/g, port)
                .replace(/('{uuid}')/g, id)
                .replace(/('{aid}')/g, aid)
                .replace(/('{tls}')/g, port === '443' ? true : false)
                .replace(/('{path}')/g, path)
                .replace(/('{server}')/g, add)
                .replace(/('{udp}')/g, true)}\n`
            } else if (type === 'vless') {
              const [d, nameData] = data.split('#')
              const [uuid, rest] = d.split('@')
              const [server, rest1] = rest.split(':')
              const [port, rest2] = rest1.split('?')
              const [path, security, encryption, host, sni] = rest2.split('&')
              const path_data = decodeURIComponent(path.split('=')[1])
              const sni_data = sni.split('=')[1]
              const host_data = host.split('=')[1]
              const encryption_data = encryption.split('=')[1]
              const security_data = security.split('=')[1]

              proxies += `${vlessTemplate
                .replace(
                  /({name})/g,
                  `${nameData}-${bug}-${
                    port === '443' ? 'ws' : 'non-ws'
                  }-${index}`,
                )
                .replace(/('{bug}')/g, bug)
                .replace(/('{port}')/g, port)
                .replace(/('{uuid}')/g, uuid)
                .replace(/('{aid}')/g, 0)
                .replace(/('{tls}')/g, port === '443' ? true : false)
                .replace(/('{path}')/g, path)
                .replace(/('{server}')/g, server)
                .replace(/('{udp}')/g, true)}\n`
            } else {
              const [trojanData, name] = data.split('#')
              const [uuid, dataHost] = trojanData.split('@')
              const [host, credentialPort] = dataHost.split(':')
              const [port, query] = credentialPort.split('?')
              const [server, path, sni, type] = query.split('&')
              const server_data = server.split('=')[1]
              const path_data = path.split('=')[1]
              const sni_data = sni.split('=')[1]
              const type_data = type.split('=')[1]
              console.log({ path_data, path })
              const results = {
                name,
                uuid,
                host,
                port,
                server_data,
                path_data: decodeURIComponent(path_data),
                sni_data,
                type_data,
              }
              proxies += `${trojanTemplate
                .replace(/({name})/g, `${results.host}-${bug}-${index}`)
                .replace(/('{bug}')/g, bug)
                .replace(/('{port}')/g, results.port)
                .replace(/('{password}')/g, results.uuid)
                .replace(/('{path}')/g, results.path_data || '/')
                .replace(/('{server}')/g, results.host)
                .replace(/('{udp}')/g, true)}\n`
            }
          }
        }
        fs.writeFileSync(
          `./proxies/${replaceBugName.toLowerCase()}.yaml`,
          proxies,
          'utf8',
        )
      }
    }
    groups += groups__create.replace(/('{provider_use}')/g, providers_fr_group)
  }
  const config = `${dnsTemplate}\n${groups}\n${providers}`
  fs.writeFileSync(`./config/${filename}.yaml`, config, 'utf8')
}

main()
