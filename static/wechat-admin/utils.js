// import { getVerifyCodeFunc } from '../../apis/common'
/* eslint-disable */
/**
 * 延迟执行
 * @params time {number} 要延迟的时间
 */
export class DelayExec {
  constructor (time) {
    this.time = time
    this.timer = 0
  }
  exec () {
    return new Promise(resolve => {
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        resolve()
      }, this.time)
    })
  }
}
/**
 * 倒计时
 */
export class CountDown {
  totalTime = 0
  timer = 0
  callback = null
  constructor (time, callback) {
    this.totalTime = time
    this.callback = callback
  }
  start () {
    const task = this.down()
    let result = task.next()
    this.callback(result.value)
    this.timer = setInterval(() => {
      result = task.next()
      if (result.done) return clearInterval(this.timer)
      this.callback(result.value)
    }, 1000)
  }
  stop () {
    clearInterval(this.timer)
    if (this.callback) this.callback(0)
  }
  *down () {
    while (this.totalTime > 0) {
      yield --this.totalTime
    }
  }
}

/* 发送验证码 */
export async function sendCode (smsType, phone, callback) {
//   try {
//     await getVerifyCodeFunc({
//       smsType: smsType,
//       mobile: phone
//     })
//     return new CountDown(60, callback).start()
//   } catch (e) {
//     throw e
//   }
}
/**
 * 复制字段
 * @param template {object} 要复制的所有字段
 * @param target {object} 根据字段模板从target中复制出相关字段
 * @returns {*}
 */
export function copyFields (template, target) {
  if (!target) return template
  if (typeof target !== 'object') return template
  if (Object.keys(target).length === 0) return template
  for (const k of Object.keys(template)) {
    template[k] = target[k]
  }
  return template
}
/**
 * 重置表单
 * @param form {Object} 表单对象
 * @param def {Object} 默认字段的值
 */
export function resetForm (form, def = {}) {
  for (const k of Object.keys(form)) {
    const val = form[k]
    if (typeof val === 'string') {
      form[k] = def[k] || ''
      continue
    }
    if (typeof val === 'number') {
      form[k] = def[k] || 0
      continue
    }
    if (Array.isArray(form[k])) {
      if (def[k]) {
        form[k].splice(0, form[k].length, ...def[k])
      } else {
        form[k].splice(0, form[k].length)
      }
      continue
    }
    if (typeof val === 'object' && val !== null) {
      resetForm(val)
    }
  }
}
// 获去字符串字节数
export function codePointNo (str) {
  let num = 0
  let i = 0
  let codePoint = str.codePointAt(i)
  while (codePoint) {
    if (codePoint > 127) {
      num += 2
    } else {
      num++
    }
    i++
    codePoint = str.codePointAt(i)
  }
  return num
}
/**
 * 节流阀
 * @param fn 需要包装的事件回调
 * @param delay 时间间隔的阈值
 * @returns {Function}
 */
export function throttle (fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0; let timer = null
  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}
/**
 * 生成二维码
 * @param size 二维码大小
 * @param text 二维码内容
 * @param padding 二维码内边距
 * @param image 二维码中心图片
 * @param centerPadding 中心图片的内边距（白边大小）
 * @returns {Promise<*>}
 */
export async function generateQrcode (size, text, padding = 0, image = '', centerPadding = 0) {
  try {
    let imageSize = 60 // 中心图片的宽高
    let img = null // 中心图片
    if (image) {
      img = await loadImage(image)
    }
    let canvas = new window.Qrcode({
      render: 'canvas',
      correctLevel: 3, // 纠错级别
      text, // 内容
      size, // 大小
      background: '#ffffff',
      foreground: '#000000',
      pdground: '#000000'
      // image: '', 不起作用，注释掉
      // imageSize: 30
    })
    // 生成中心图片内边距
    if (centerPadding > 0 && img) {
      let centerCanvas = cutImageCenter(img)
      let realPadding = centerPadding * (centerCanvas.width / imageSize)
      let tempCanvas = document.createElement('canvas')
      tempCanvas.width = centerCanvas.width + realPadding * 2
      tempCanvas.height = centerCanvas.height + realPadding * 2
      let tempCtx = tempCanvas.getContext('2d')
      tempCtx.fillStyle = '#ffffff'
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempCtx.drawImage(centerCanvas, realPadding, realPadding, centerCanvas.width, centerCanvas.height)
      centerCanvas = tempCanvas
      let imgSize = img.width
      let scale = imageSize / imgSize
      let smallWidth = imgSize * scale
      let smallHeight = imgSize * scale
      let ctx = canvas.getContext('2d')
      ctx.drawImage(centerCanvas, size / 2 - smallWidth / 2, size / 2 - smallHeight / 2, smallWidth, smallHeight)
    }
    // 绘制二维码内边距
    if (padding > 0) {
      let tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width + padding * 2
      tempCanvas.height = canvas.height + padding * 2
      let tempCtx = tempCanvas.getContext('2d')
      tempCtx.fillStyle = '#ffffff'
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempCtx.drawImage(canvas, padding, padding, canvas.width, canvas.height)
      canvas = tempCanvas
    }
    return canvas.toDataURL()
  } catch (e) {
    throw e
  }
}
/**
 * 截取图片中间部分
 * @param img {HTMLElement} 要截取的图片
 * @param ratio {Number} 裁剪图片的长宽比 默认是1:1
 * @returns {HTMLElement} 返回canvas对象
 */
export function cutImageCenter (img, ratio = 1) {
  const canvas = document.createElement('canvas')
  let w = img.naturalWidth
  let h = img.naturalHeight
  // 说明图片高度有可能不够
  if (w / h >= ratio) {
    canvas.width = h * ratio
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img,
      (w - canvas.width) / 2,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height)
  } else {
    canvas.width = w
    canvas.height = w / ratio
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img,
      0,
      (h - canvas.height) / 2,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height)
  }
  return canvas
}

/**
 * 加载跨域图片
 * @param src {string}
 * @return {Promise<any>}
 */
export function loadImage (src) {
  let img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = src + '?' + Date.now()
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (e) => {
      reject(new Error('图片加载错误'))
    }
  })
}

/**
 * 获取视频第一帧并返会图片
 * @param video {HTMLVideoElement}
 * @returns {WindowBase64}
 */
export function getVideoFirstKeyframe (video) {
  video.onloadeddata = function () {
    let canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL()
  }
}

/**
 * 大小数字
 * @param n {number} 要转换的数字
 * @returns {string}
 */
export function SectionToChinese (section) {
  let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let chnUnitChar = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '万亿']
  let strIns = ''; let chnStr = ''
  let unitPos = 0
  let zero = true
  while (section > 0) {
    let v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  return chnStr
}
/**
 * 大写钱数
 * @param n {number} 要转换的数字
 * @returns {string}
 */
export function DX (n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
    return '数据非法'
  }
  let unit = '亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分'
  let str = ''
  n += '00'
  let p = n.indexOf('.')
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2)
  }
  unit = unit.substr(unit.length - n.length)
  for (let i = 0; i < n.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
  }
  return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(兆|万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
}

/**
 * 作用营销中心，保存时间重叠的提示以及跳转
 * 第一个参数是后台返回
 * @param warnMessage {string} 提醒消息
 * @param routerName {string} 跳转路由
 */
export async function goPage (vm, { flag, list }, warnMessage, routerName) {
  if (flag) {
    await vm.$success(warnMessage)
    vm.$router.push({ name: routerName })
  } else {
    let htmlStr = '<p>商品在该活动时间内，已参与了其他活动，请勿重复设置<p/><p>商品已参与活动时间如下：</p>'
    for (let { activityType, activityStartTime, activityEndTime } of list) {
      htmlStr += `<p><span>${activityType}：</span> <span>${activityStartTime} 至 ${activityEndTime}</span></p>`
    }
    vm.$alert({
      title: '提示',
      message: htmlStr,
      dangerouslyUseHTMLString: true
    })
  }
}

export const promise = {
  timeout (ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }
}
