/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://sequelizeui.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  output: 'export',
  exclude: ['/schema'],
}
