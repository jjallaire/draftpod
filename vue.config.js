

const config = require('./src/config');

module.exports = {

  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // variables
      var_title: config.title,
      var_url: config.url

    },
  },


  chainWebpack: config => {
    config
      .module.rule('md')
        .test(/\.md/)
        .use('vue-loader')
        .loader('vue-loader')
        .end()
        .use('vue-markdown-loader')
        .loader('vue-markdown-loader/lib/markdown-compiler')
        .options({
          raw: true,
          preprocess: function(markdownIt, source) {
            return source;
          },
        });

    config    
      .plugin('copy')
        .tap(args => {
          args[0][0].ignore.push('images/cards/*');
          return args;
        });
  }
  
}