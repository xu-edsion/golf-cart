import Mock from 'mockjs'
import List from './table'
import Cart from './cart'
Mock.mock(/\/table\/list/, 'get', List)
Mock.mock(/cart/, 'get', Cart)

export default Mock
