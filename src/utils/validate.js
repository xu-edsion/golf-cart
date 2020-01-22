/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validateName(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入球童姓名'))
  } else {
    callback()
  }
}
export function validateNumber(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入球童编号'))
  } else {
    callback()
  }
}
export function validatePhone(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else if (!(/^1[345678]\d{9}$/.test(value))) {
    callback(new Error('手机号码有误，请重输'))
  } else {
    callback()
  }
}
export function validateCarNumber(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入球车设备号'))
  } else {
    callback()
  }
}
export function validateType(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入球车型号'))
  } else {
    callback()
  }
}
export function validateSitMember(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入乘车人数'))
  } else if (!(/^[0-9]*$/.test(value))) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}
