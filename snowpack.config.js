
const envMode = process.env.NODE_ENV

if (envMode === 'development') {
  module.exports = {
    mount: {
      src: '/dist',
      example: '/'
    },
    devOptions: {
      open: 'none'
    }
  }
} else if (envMode === 'production') {
  module.exports = {
    mount: {
      src: '/'
    },
    buildOptions: {
      out: 'dist',
      clean: false
    }
  }
}
