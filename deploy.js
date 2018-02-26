require('dotenv').config()

require('scp2').scp(
  'dist/',
  {
    host: process.env.REMOTE_HOST,
    username: process.env.REMOTE_USERNAME,
    password: process.env.REMOTE_PASSWORD,
    path: process.env.REMOTE_PATH
  },
  err => (err ? console.error(err) : console.log('Success'))
)
