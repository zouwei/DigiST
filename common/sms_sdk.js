// const crypto = require('crypto');
// const moment = require('moment');
// const fs = require('fs');
//
// const generateid = require('../common/generateid');

const md5 = require('MD5')
const config = require('config')
const smsConfig = config.get('global.sms')

const { BaseRequester } = require('./requester')

/**
 * 错误码转换
 */
const errmsg = {
  0: '提交成功',
  1: '账号无效',
  2: '密码错误',
  3: 'msgid太长，不得超过32位',
  6: '短信内容超过最大限制',
  7: '扩展子号码无效',
  8: '定时时间格式错误',
  14: '手机号码为空',
  19: '用户被禁发或禁用',
  20: 'ip鉴权失败',
  21: '短信内容为空',
  22: '数据包大小不匹配',
  98: '系统正忙',
  99: '消息格式错误'
}

/**
 * 记录列表
 */
const record = {}

class SmsGatewayRequester extends BaseRequester {
  constructor(name, host, defaultHeaders) {
    super(name, host, defaultHeaders)
    this.send_sms_api = 'json/sms/Submit'
  }

  /**
     * 发送短信
     * @param params
     * {
     *      "phones":"",            // 短信内容
     *      "content":"短信内容",   // 短信内容
     * },
     * @param headers
     * {
     *       "appKey":"anyi"          // 【可选参数】
     * }
     * @returns {Promise.<TResult>|*}
     */
  send(params, headers) {
    // 随机生成时间戳
    const time = Math.round((new Date()).getTime() / 86400000)

    if (record[headers.appKey] == null) { record[headers.appKey] = { time: 0, seq: 0 } }

    if (record[headers.appKey].time !== time) {
      record[headers.appKey].time = time
      record[headers.appKey].seq = 0
    } else {
      // 判断
      if (record[headers.appKey].seq > 100000) {
        return Promise.reject(new Error('当日限制超过发送限制'))
      }
      // 累加
      record[headers.appKey].seq++
    }
    console.log('record>', record)

    // 参数
    const data = {
      'account': smsConfig.user,              // "dh64291"
      'password': md5(smsConfig.password),
      'msgid': '',
      'phones': params.phones,
      'content': params.content,
      'sign': '【DigiST】'
      // "subcode": "8528",
      // "sendtime": (new Date()).format("yyyyMMddHHmmss")           //"201705161826"
    }
    // 指定签名
    const sign = {
      'DigiST': '【DigiST】',
    }
    if (sign[headers.appKey]) {
      data.sign = sign[headers.appKey]
    }
    // api地址
    const url = this.host + this.send_sms_api
    // 发起请求
    return super.request('post', url, {
      json: data
    }).then(result => {
      try {
        console.log('返回内容', result)

        if (result.result === '0') {
          console.log('短信发送成功')
          return Promise.resolve('短信发送成功')
        } else {
          console.log('出现异常>>', errmsg[result.result])
          Promise.reject(new Error(errmsg[result.result] || '未知错误'))
        }
      } catch (ex) {
        console.log('异常', ex)
        return Promise.reject(ex)
      }
    });
  }
}

const sms_requester = new SmsGatewayRequester('smsgateway',
  smsConfig.host
)

module.exports = { SmsGatewayRequester, sms_requester }
