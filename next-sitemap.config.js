/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://vibeup.com', // غيرها لدومينك
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/email'], // لو مش عايز صفحة الإيميل في السايت ماب
};