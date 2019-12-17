import axios from 'axios'

let util = {}
util.title = function (title) {
  title = title || 'cms project'
  window.document.title = title
}

/**
 * 配置ajax基地址
 */
util.ajax = axios.create({
  baseURL: process.env.MODE_URL,
  timeout: 120000
})

util.imgLoad = axios.create({
  timeout: 120000
})

/**
 * 获取 地址栏上的所有参数数据
 * @returns {{}}
 */
util.getLocationBarData = function (urlStr) {
  let url = urlStr || location.search
  let theRequest = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(url.indexOf('?') + 1)
    let strs = str.split('&')
    if (urlStr) theRequest['url'] = url.substr(0, url.indexOf('?'))
    for (let i = 0; i < strs.length; i++) {
      let item = strs[i].split('=')
      theRequest[item[0]] = decodeURIComponent(item[1])
    }
  }
  return theRequest
}

/**
 * 生成随机字符串
 * @param len  几位
 * @returns {string}
 */
util.cookid = function (len) {
  var rdmString = ''
  for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
  return rdmString.substr(0, len)
}

/**
 * 生成随机数
 * @param len  几位
 * @returns {string}
 */
util.random = function (len) {
  var rdmString = ''
  for (; rdmString.length < len; rdmString += Math.random().toString().substr(2));
  return rdmString.substr(0, len)
}

/**
 * 生成随机数(范围内)
 * @param min  最小值
 * @param max  最大值
 * @returns {string}
 */
util.randomRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * data格式化
 * @param date
 * @param fmt
 * @returns {*}
 */
util.dateFormatting = function (date, fmt) {
  if (!fmt) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'W+': weekday[date.getDay()], // 星期
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 时间戳转时间字符串
 * @param date
 * @param fmt
 * @returns {*}
 */
util.getDateStr = function (date, fmt, second) {
  if (!date) {
    return '1970-01-01 00:00:00'
  }
  if (!fmt) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  let newDate = new Date()
  if (!second) {
    newDate.setTime(date * 1000)
  } else {
    newDate.setTime(date)
  }
  return this.dateFormatting(newDate, fmt)
}

/**
 * 秒数 转化为  1天 10时 10分 10秒
 * @param s
 * @returns {string}
 */
util.getTimeMat = function (s) {
  let t = ''
  let hour
  let min
  let sec
  let day
  if (s > -1) {
    hour = Math.floor(s / 3600)
    min = Math.floor(s / 60) % 60
    sec = s % 60
    day = parseInt(hour / 24)
    if (day > 0) {
      hour = hour - 24 * day
      t = day + '天 ' + hour + '时'
    } else if (hour > 0) {
      t = hour + '时'
    }
    if (min > 0) {
      t += min + '分'
    }
    t += parseInt(sec) + '秒'
  }
  return t
}

/**
 * 获取树型列表
 * @param item
 * @param all
 * @param field
 * @returns {*}
 */
util.getTreeData = function (item, all, field = ['globalId', 'parent_id', 'children']) {
  for (let i in all) {
    let value = all[i]
    if (value[field[0]] === item[field[1]]) {
      value[field[2]].push(item)
    } else if (value[field[2]].length) {
      util.getTreeData(item, value[field[2]], field)
    } else {
      continue
    }
  }
  return all
}

/**
 * 删除空的 children 字段
 * @param all
 * @param field
 * @returns {Array}
 */
util.unsetTreeField = function (all = [], field = 'children') {
  for (let i in all) {
    let item = all[i]
    if (!item[field]) {
      continue
    } else if (item[field].length === 0) {
      delete item[field]
    } else {
      util.unsetTreeField(item[field], field)
    }
  }
  return all
}

/**
 * 去除前后空格
 * @param str
 * @returns {*}
 */
util.trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

util.closeGlobalLoading = function () {
  setTimeout(() => {
    window.store.dispatch('showLoading', false)
  }, 0)
}

util.openGlobalLoading = function () {
  setTimeout(() => {
    window.store.dispatch('showLoading', true)
  }, 0)
}

util.isObject = function (type) {
  return Object.prototype.toString.call(type) === '[object Object]'
}

util.getFileUrl = function (src) {
  let { protocol, host } = window.location
  let url = ''
  if (src) {
    // let baseUrl = process.env.NODE_ENV === 'production' ?  host : 'localhost:38080'
    url = protocol + '//' + host + '/h5srv' + src
  }
  return url
}

util.getCmsUrl = function (src) {
  let { protocol, host } = window.location
  // let baseUrl = process.env.NODE_ENV === 'production' ?  host : 'loclahost:81'
  let url = protocol + '//' + host + src
  return url
}

util.getCmsLibrary = function (storedAs) {
  let { protocol, host } = window.location
  let url = protocol + '//' + host + '/h5srv/library/' + storedAs
  return url
}
// 判断图片是否存在
util.checkImgExists = function (imgurl) {
  /* global ActiveXObject XMLHttpRequest */
  /* eslint no-undef: "error" */
  var xmlHttp
  if (window.ActiveXObject) {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
  } else if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest()
  }
  xmlHttp.open('Get', imgurl, false)
  xmlHttp.send()
  if (xmlHttp.status === 404) {
    return false
  } else {
    return true
  }
}

util.getThumbnailUrl = function (src, screenMode) {
  if (src) {
    return util.getFileUrl(src)
  } else {
    // 1: 横屏、2: 竖屏
    return util.getStaticUrl('static/img/' + screenMode + '_thumbnail.png')
  }
}

/**
 * 创建script
 * @param url
 * @returns {Promise}
 */
util.createScript = function (url, hasCallback) {
  let scriptElement = document.createElement('script')
  document.body.appendChild(scriptElement)
  let promise = new Promise((resolve, reject) => {
    scriptElement.addEventListener('load', e => {
      util.removeScript(scriptElement)
      if (!hasCallback) {
        resolve(e)
      }
    }, false)

    scriptElement.addEventListener('error', e => {
      util.removeScript(scriptElement)
      reject(e)
    }, false)

    if (hasCallback) {
      window.____callback____ = function () {
        resolve()
        window.____callback____ = null
      }
    }
  })

  if (hasCallback) {
    url += '&callback=____callback____'
  }

  scriptElement.src = url

  return promise
}

/**
 * 移除script标签
 * @param scriptElement script dom
 */
util.removeScript = function (scriptElement) {
  document.body.removeChild(scriptElement)
}

/**
 * 秒数转时分秒格式  如 10  ==> 00:00:10
 * @param s
 */
util.formatSecond = function (value) {
  let secondTime = parseInt(value) // 秒
  let minuteTime = 0 // 分
  let hourTime = 0 // 小时
  if (secondTime >= 60) {
    minuteTime = parseInt(secondTime / 60)
    secondTime = parseInt(secondTime % 60)
    if (minuteTime >= 60) {
      hourTime = parseInt(minuteTime / 60)
      minuteTime = parseInt(minuteTime % 60)
    }
  }
  if (secondTime < 10) {
    secondTime = '0' + secondTime
  }
  if (hourTime < 10) {
    hourTime = '0' + hourTime
  }
  if (minuteTime < 10) {
    minuteTime = '0' + minuteTime
  }
  return hourTime + ':' + minuteTime + ':' + secondTime
}

util.getCharacterLength = function (str) {
  let realLength = 0
  if (str) {
    let charCode = -1
    for (var i = 0; i < str.length; i++) {
      charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) {
        realLength += 1
      } else {
        realLength += 3
      }
    }
  }
  return realLength
}

// 扁平数据转成树形数据
util.arr2treeData = function (source, id, parentId, children) {
  let cloneData = JSON.parse(JSON.stringify(source))
  return cloneData.filter(father => {
    let branchArr = cloneData.filter(child => father[id] === child[parentId])
    if (branchArr.length > 0) {
      father[children] = branchArr
    }
    return (father[parentId] === 0 || father[parentId] === null)
  })
}

util.checkFileExt = function (fileName, filterArr) {
  let flag = false
  let index = fileName.lastIndexOf('.')
  let ext = fileName.substr(index + 1)
  for (var i = 0; i < filterArr.length; i++) {
    if (ext === filterArr[i]) {
      flag = true // 一旦找到合适的，立即退出循环
      break
    }
  }
  return flag
}

// 计算base64字节大小
util.getBase64Size = function (base64Src) {
  let i = base64Src.lastIndexOf(';base64,')
  let imgSrc = base64Src.substr(i + 8)
  let fileSize = imgSrc.length - (imgSrc.length / 8) * 2
  let fileSizeStr = ''
  fileSize = Math.round(fileSize * 100) / 100
  fileSizeStr = fileSize + 'B'
  if (fileSize > 1024) {
    fileSize = fileSize / 1024
    fileSize = Math.round(fileSize * 100) / 100
    fileSizeStr = fileSize + 'KB'
    if (fileSize > 1024) {
      fileSize = fileSize / 1024
      fileSize = Math.round(fileSize * 100) / 100
      fileSizeStr = fileSize + 'MB'
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSize = Math.round(fileSize * 100) / 100
        fileSizeStr = fileSize + 'G'
      }
    }
  }
  return fileSizeStr
}

util.GetLength = function (str) {
  var realLength = 0
  var len = str.length
  var charCode = -1
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode > 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 2
    }
  }
  return realLength
}

util.cutString = function (str, len) {
  if (str.length * 2 <= len) {
    return str
  }
  var strlen = 0
  var s = ''
  for (var i = 0; i < str.length; i++) {
    s = s + str.charAt(i)
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2
      if (strlen >= len) {
        return s.substring(0, s.length - 1) + '...'
      }
    } else {
      strlen = strlen + 1
      if (strlen >= len) {
        return s.substring(0, s.length - 2) + '...'
      }
    }
  }
  return s
}

util.time2sec = function (time) {
  var s = 0
  var timeArr = time.split(':')
  if (timeArr.length === 3) {
    var hour = timeArr[0]
    var min = timeArr[1]
    var sec = timeArr[2]
    s = Number(hour * 3600) + Number(min * 60) + Number(sec)
  }
  return s
}

util.deepCompare = function (x, y) {
  var i, l, leftChain, rightChain
  function compare2Objects (x, y) {
    var p
    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true
    }
    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString()
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false
    }

    if (x.constructor !== y.constructor) {
      return false
    }

    if (x.prototype !== y.prototype) {
      return false
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false
      } else if (typeof y[p] !== typeof x[p]) {
        return false
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false
      } else if (typeof y[p] !== typeof x[p]) {
        return false
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':
          leftChain.push(x)
          rightChain.push(y)
          if (!compare2Objects(x[p], y[p])) {
            return false
          }
          leftChain.pop()
          rightChain.pop()
          break
        default:
          if (x[p] !== y[p]) {
            return false
          }
          break
      }
    }
    return true
  }

  if (arguments.length < 1) {
    return true // Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = [] // Todo: this can be cached
    rightChain = []

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false
    }
  }
  return true
}

// 判断参数是否是其中之一
util.oneOf = function (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

util.getAlignLeft = function (rotate, w, h) {
  var left = 0
  var r = 0
  if (rotate <= 90) {
    r = rotate * Math.PI / 180
    left = Math.sin(r) * h
  } else if (rotate > 90 && rotate <= 180) {
    r = (rotate - 90) * Math.PI / 180
    left = Math.sin(r) * w + Math.cos(r) * h
  } else if (rotate > 180 && rotate <= 270) {
    r = (rotate - 180) * Math.PI / 180
    left = Math.cos(r) * w
  } else {
    r = (rotate - 270) * Math.PI / 180
    left = 0
  }

  left = Math.round(left * 100) / 100
  return { left: left }
}

util.getAlignCenter = function (rotate, w, h, width, rc) {
  var oCoords = util.getAlignLeft(rotate, w, h)
  var _w = Math.round(rc.width * 100) / 100
  var left = Math.round((width - _w) / 2 * 100) / 100 + oCoords.left
  left = Math.round(left * 100) / 100
  return left
}

util.getAlignRight = function (rotate, w, h, width, rc) {
  var oCoords = util.getAlignLeft(rotate, w, h)
  var _w = Math.round(rc.width * 100) / 100
  var left = Math.round((width - _w) * 100) / 100 + oCoords.left
  left = Math.round(left * 100) / 100
  return left
}

util.getAlignTop = function (rotate, w, h) {
  var top = 0
  var r = 0
  if (rotate <= 90) {
    top = 0
  } else if (rotate > 90 && rotate <= 180) {
    r = (rotate - 90) * Math.PI / 180
    top = Math.sin(r) * h
  } else if (rotate > 180 && rotate <= 270) {
    r = (rotate - 180) * Math.PI / 180
    top = Math.cos(r) * h + Math.sin(r) * w
  } else {
    r = (rotate - 270) * Math.PI / 180
    top = Math.cos(r) * w
  }

  top = Math.round(top * 100) / 100
  return { top: top }
}

util.getAlignMiddle = function (rotate, w, h, height, rc) {
  var oCoords = util.getAlignTop(rotate, w, h)
  var _h = Math.round(rc.height * 100) / 100
  var top = Math.round((height - _h) / 2 * 100) / 100 + oCoords.top
  top = Math.round(top * 100) / 100
  return top
}

util.getAlignBottom = function (rotate, w, h, height, rc) {
  var oCoords = util.getAlignTop(rotate, w, h)
  var _h = Math.round(rc.height * 100) / 100
  var top = Math.round((height - _h) * 100) / 100 + oCoords.top
  top = Math.round(top * 100) / 100
  return top
}

export default util
