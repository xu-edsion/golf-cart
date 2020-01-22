'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://47.106.80.254:8282"'
  // BASE_API: '"http://192.168.100.8:8282"'
})
