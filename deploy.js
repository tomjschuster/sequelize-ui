require('dotenv').config()

const FTPS = require('ftps')
const ftps = new FTPS({
  host: process.env.FTP_HOST,
  username: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  protocol: 'sftp',
  port: 22,
  retries: 2,
  requireSSHKey: true,
  sshKeyPath: process.env.FTP_SSH_KEY_PATH
})

ftps.put('./public/app-prod.js', `./${process.env.FTP_HOST}/app.js`)
ftps.put('./public/index.html', `./${process.env.FTP_HOST}/index.html`)
ftps.put('./public/style.css', `./${process.env.FTP_HOST}/style.css`)

ftps.exec((err, res) => {
  if (err) {
    console.err(err)
  } else {
    console.log('SUCCESS')
    console.log(res)
  }
})
