require('dotenv').config()

const options = {
  host: process.env.REMOTE_HOST,
  username: process.env.REMOTE_USERNAME,
  path: process.env.REMOTE_PATH
}

if (process.env.PRIVATE_KEY) {
  options.privateKey = require('fs').readFileSync(process.env.PRIVATE_KEY)
} else {
  options.password = process.env.REMOTE_PASSWORD
}

require('scp2').scp(
  'dist/',
  options,
  err => (err ? console.error(err) : console.log('Success'))
)
