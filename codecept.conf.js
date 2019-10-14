exports.config = {
  tests: './js/tests/*_test.js',
  output: './js/tests/output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost',
      show: false
    }
  },
  include: {
    I: './js/tests/config/steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'Jarvikartta'
}