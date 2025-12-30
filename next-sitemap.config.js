/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'http://localhost:3000', // أو رابط موقعك الفعلي
  generateRobotsTxt: true,
  // خيارات إضافية:
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
};
