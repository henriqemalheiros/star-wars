export default {
  buildModules: [
    '@nuxtjs/tailwindcss',
    '~/modules/scraper.js',
  ],
  head: {
    title: 'Star Wars explorer',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
  },
};
