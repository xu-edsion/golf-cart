import Mock from 'mockjs'
const Cart = []
const count = 70

for (let i = 0; i < count; i++) {
  Cart.push(Mock.mock({
    id: '@increment',
    type: '@tld',
    number: '@increment',
    sitMember: '@integer(2, 10)',
    remark: '@ctitle(0, 10)',
    hole: '@integer(1, 18)',
    'state|1': ['0', '1'],
    totalTime: '@integer(5, 60)',
    userName: '@cname',
    'userPhone': /1[3578]\d{9}/,
    caddieName: '@cname',
    caddieNumber: '@increment',
    'caddiePhone': /1[3578]\d{9}/,
    timestamp: +Mock.Random.date('T'),
    display_time: '@datetime'
  }))
}

export default {
  Cart
}

