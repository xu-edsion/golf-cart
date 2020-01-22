export function fiterCart(cartList, from, to) {
  const dueInCarts = []
  const dueOutCarts = []
  const allData = []
  const chooseData = []
  const currData1 = []
  const currData2 = []
  const currData3 = []
  const currData4 = []
  const currData5 = []
  const currData6 = []
  cartList.forEach(function(value, index) {
    if (value.state === '1') {
      dueInCarts.push(value)
    } else if (value.state === '0') {
      dueOutCarts.push(value)
    }
    if (value.hole / 3 <= 1) {
      currData1.push(value)
    } else if (value.hole / 3 <= 2) {
      currData2.push(value)
    } else if (value.hole / 3 <= 3) {
      currData3.push(value)
    } else if (value.hole / 3 <= 4) {
      currData4.push(value)
    } else if (value.hole / 3 <= 5) {
      currData5.push(value)
    } else if (value.hole / 3 <= 6) {
      currData6.push(value)
    }
    if (from && to) {
      if (value.hole >= from && value.hole <= to) {
        chooseData.push(value)
      }
    }
  })
  allData.push(currData1, currData2, currData3, currData4, currData5, currData6)
  return { dueInCarts, dueOutCarts, allData, chooseData }
}

export function compare(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}
