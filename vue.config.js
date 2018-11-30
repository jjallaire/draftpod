
module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
    },
  },

  chainWebpack: config => {
    config
      .plugin('copy')
      .tap(args => {
        args[0][0].ignore.push('images/cards/*');
        return args;
      })
  }
  
}