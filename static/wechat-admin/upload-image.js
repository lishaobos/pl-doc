import Compressor from 'compressorjs'
import axios from 'axios'
/* eslint-disable */
// 获取TST数据
const getSTS = () => axios.get('/apis/v1/oss/upload/sts')
const OSS = require('ali-oss')
const REGION = 'oss-cn-hangzhou'
const BUCKET = 'penglai-weimall'
const STSLIFETIME = 600000 // STS有效时间，10分钟
Compressor.setDefaults({
  checkOrientation: true, // 检查方向
  // 表示压缩后的图像尺寸大于原始图像尺寸时，是否输出原始图像而不是压缩后的图像，但以下情况除外:
  // 设置了mimeType选项，其值与图像的mime类型不同。
  // 设置了width选项，其值大于图像的自然宽度。
  // 设置了height选项，其值大于图像的自然高度。
  // 设置了minWidth选项，其值大于图像的自然宽度。
  // 设置了minHeight选项，其值大于图像的自然高度。
  strict: true,
  // minWidth 输出图像的最小宽度。该值应该大于0，并且不应该大于maxWidth。
  maxWidth: 1920, // 输出图像的最大宽度。这个值应该大于0。
  // width: 1920,
  // minHeight 输出图像的最小高度。该值应该大于0，并且不应该大于maxHeight
  // maxHeight 输出图像的最大高度。这个值应该大于0
  // height 输出图像的高度。如果没有指定，则使用原始图像的自然高度，或者如果设置了宽度选项，则使用自然长宽比自动计算高度。
  quality: 0.75,
  mimeType: 'image/jpeg',
  convertSize: 5000000 // 超过此值的PNG文件将转换为jpeg。要禁用此功能，只需将值设置为无穷大
  // beforeDraw(context, canvas)
  // drew(context, canvas)
})
/**
 * 压缩图片
 * @param file { Blob | HTMLImageElement } 要压缩的图片，可以是blob，也可以是图片URL
 * @param fileType { String } 返回值类型，blob | base64, 不传则返回blob
 * @param maxWidth { Number } 规定压缩的最大宽度
 * @returns {Promise<any>}
 */
export async function compress(file, fileType = 'blob', maxWidth = 1920) {
  if (file.toLocaleString().indexOf('HTMLImageElement') > -1) {
    file = await imgToBlob(file)
  }
  return new Promise(async(resolve, reject) => {
    try {
      file = await compressImage(file, maxWidth)
      if (fileType === 'base64') {
        const base64 = await blobToBase64(file)
        resolve(base64)
      } else {
        resolve(file)
      }
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 上传媒体接口
 * @param file {Blob} 媒体
 * @returns {Promise<void>}
 */
export async function upload(file) {
  try {
    let ext = /jpg|png|gif|jpeg|bmp|mp4/i.exec(file.type)
    if (ext) {
      ext = ext[0]
    } else {
      throw new Error('不允许的媒体格式')
    }
    const client = await getClient()
    const key = `img/${randomString()}.${ext}`
    const res = await client.put(key, file)
    res.url = 'https://mallcdn.youpenglai.com/' + res.name
    return res
  } catch (e) {
    throw e
  }
}
/**
 * 断点上传接口（用于上传较大文件，可回传进度条）
 * @param file {Blob} 媒体
 * @param progress {Function} 进度回调
 * @returns {Promise<void>}
 */
export async function breakpointUpload(file, progress) {
  try {
    const ext = /mp4|ogg|webm/i.exec(file.type)[0]
    const client = await getClient()
    const key = `video/${randomString()}.${ext}`
    return await client.multipartUpload(key, file, {
      progress: function(p, checkpoint) {
        progress(p, checkpoint)
      },
      mime: `video/${ext}`
    })
  } catch (e) {
    throw e
  }
}
/**
 * 删除媒体接口
 * @param key 媒体名称 {Array}
 * @returns {Promise<void>}
 */
export async function deleteImage(key) {
  const client = await getClient()
  // 单独删除咱不可用，所以需传入key的数组
  // if (typeof key === 'string') {
  //   try {
  //     await client.delete(key)
  //   } catch (e) {
  //     throw e
  //   }
  // }
  // 批量删除
  if (Array.isArray(key)) {
    try {
      await client.deleteMulti(key)
      console.warn(`image is deleted !`)
    } catch (e) {
      throw e
    }
  } else {
    throw new Error('key 必须是数组！')
  }
}
async function getClient() {
  const sts = JSON.parse(localStorage.getItem('sts')) || {}
  let credentials = null

  if (!sts.time || STSLIFETIME < Date.now() - sts.time) {
    // sts过期
    const { data } = await getSTS()
    credentials = data.result.credentials
    data.result.time = Date.now()
    localStorage.setItem('sts', JSON.stringify(data.result))
  } else {
    credentials = sts.credentials
  }
  const { securityToken, accessKeySecret, accessKeyId } = credentials
  return new OSS({
    region: REGION,
    accessKeyId,
    accessKeySecret,
    stsToken: securityToken,
    bucket: BUCKET
  })
}

function compressImage(file, maxWidth = 1920) {
  /* eslint-disable */
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth, // 输出图像的最大宽度。这个值应该大于0。
      success (result) {
        resolve(result)
      },
      error (error) {
        reject(error)
      }
    })
  })
}
export function blobToBase64 (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      resolve(reader.result.split(',')[1])
    }
    reader.readAsDataURL(blob)
  })
}
// 生成随机字符串
function randomString () {
  // 随机串的长度为 10 ~ 50 的随机数
  const len = Number.parseInt(Math.random() * 51 + 10)
  // const date = new Date()
  // 48~57 数字， 65~90 大写，  97~122 小写
  const LIB = 'qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM1234567890'
  const parseInt = Number.parseInt
  const random = Math.random
  const randomStr = []
  for (let i = 0; i < len; i++) {
    const index = parseInt(random() * 62)
    randomStr.push(LIB[index])
    if (i !== 0 && i % 8 === 0) {
      randomStr.push('-')
    }
  }
  // let dateString = `
  //   ${date.getFullYear()}
  //   ${String(date.getMonth() + 1).padStart(2, '0')}
  //   ${String(date.getDate()).padStart(2, '0')}
  //   ${String(date.getHours()).padStart(2, '0')}
  //   ${String(date.getMinutes()).padStart(2, '0')}
  //   ${String(date.getSeconds()).padStart(2, '0')}
  // `
  // dateString = dateString.replace(/\s/g, '')
  return randomStr.join('') + '-' + Date.now()
}

export function createObjectUrl (blob) {
  let url
  if (window.createObjectURL) { // basic
    url = window.createObjectURL(blob)
  } else if (window.URL) { // mozilla(firefox)
    url = window.URL.createObjectURL(blob)
  } else if (window.webkitURL) { // webkit or chrome
    url = window.webkitURL.createObjectURL(blob)
  }
  return url
}

export function revokeObjectURL (URL) {
  window.URL.revokeObjectURL(URL)
}

/**
 * 图片URL转blob
 * @param url {HTMLImageElement}
 */
function imgToBlob (img) {
  let canvas = document.createElement('canvas')
  let ctx = null
  img.crossOrigin = ''
  return new Promise((resolve) => {
    if (img.complete) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        resolve(blob)
      }, 'image/jpeg', 0.9)
    } else {
      img.onload = () => {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(blob => {
          resolve(blob)
        }, 'image/jpeg', 0.9)
      }
    }
  })
}
function isVideo (file) {
  return file.type.indexOf('video') > -1
}
