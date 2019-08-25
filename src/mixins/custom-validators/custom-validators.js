export function mobileNumberCheck (value) {
  const validation = /^1[3578]\d{9}$/
  return validation.test(value)
}

export function bankNumberCheck (bankno) {
  if (!bankno) {
    return true
  }
  const lastNum = bankno.substr(bankno.length - 1, 1) // 取出最后一位（与luhm进行比较）
  const first15Num = bankno.substr(0, bankno.length - 1) // 前15或18位
  let newArr = []
  for (let i = first15Num.length - 1; i > -1; i--) {    // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }
  let arrJiShu = []  // 奇数位*2的积 <9
  let arrJiShu2 = [] // 奇数位*2的积 >9
  let arrOuShu = []  // 偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 === 1) {
      // 奇数位
      if (parseInt(newArr[j]) * 2 < 9) {
        arrJiShu.push(parseInt(newArr[j]) * 2)
      } else {
        arrJiShu2.push(parseInt(newArr[j]) * 2)
      }
    } else {
      // 偶数位
      arrOuShu.push(newArr[j])
    }
  }
  const jishuChild1 = [] // 奇数位*2 >9 的分割之后的数组个位数
  const jishuChild2 = [] // 奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    jishuChild1.push(parseInt(arrJiShu2[h]) % 10)
    jishuChild2.push(parseInt(arrJiShu2[h]) / 10)
  }
  let sumJiShu = 0 // 奇数位*2 < 9 的数组之和
  let sumOuShu = 0 // 偶数位数组之和
  let sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal = 0
  for (let m = 0; m < arrJiShu.length; m++) {
    sumJiShu += parseInt(arrJiShu[m])
  }
  for (let n = 0; n < arrOuShu.length; n++) {
    sumOuShu += parseInt(arrOuShu[n])
  }
  for (let p = 0; p < jishuChild1.length; p++) {
    sumJiShuChild1 += parseInt(jishuChild1[p])
    sumJiShuChild2 += parseInt(jishuChild2[p])
  }
  // 计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)

  // 计算Luhm值
  let k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
  let luhm = 10 - k
  if (parseInt(lastNum) === luhm) {
    return true
  } else {
    return false
  }
}

// 价格正则 保留小数点后面 2 位
export function priceFormat (price) {
  if (!price) {
    return true
  }
  // return /^(0?|[1-9]\d*)(.[0-9]{1,2})?$/.test(price)
  return /^(0|[1-9]\d*)(\.[0-9]{1,2})?$/.test(price)
}

// 整数价格正则 保留小数点后面 2 位
export function integerPriceFormat (price) {
  if (!price) {
    return true
  }
  // return /^(0?|[1-9]\d*)(.[0-9]{1,2})?$/.test(price)
  return /^(0|[1-9]\d*)(\.[0]{1,2})?$/.test(price)
}

// 正整数
export function quantityFormat (val) {
  if (!val) {
    return true
  }
  return /^[1-9]\d*$/.test(val)
}

// 折扣 , 1-100的整数
export function discountFormat (val) {
  // if (!val) {
  //   return true
  // }
  // return /^(0|[1-9]\d*)(\.[0-9]{1,2})?$/.test(val)
  return /^(100|[1-9]\d|[1-9])$/.test(String(val))
}

// 字符数量
export function wordLength (val) {
  return val && parseInt(val.replace(/[\u4E00-\u9FA5]/g, '**').length / 2) || 0
}
