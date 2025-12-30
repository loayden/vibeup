/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://vibeup.vercel.app', // غيّر بالرابط النهائي من Vercel/Netlify
  generateRobotsTxt: true, // يولّد robots.txt تلقائياً
  sitemapSize: 7000,       // عدد URLs في كل Sitemap
};