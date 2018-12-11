/**
 * 邮件发送
 */
const nodemailer = require('nodemailer')
const config = require('config')
const emailConfig = config.get('global.email')
const spaceConfig = config.get('global.space')

const { BaseRequester } = require('./requester')

class EmailGatewayRequester extends BaseRequester {
  /**
   * 发送邮件
   * @param param
   * {
   *   to: 'qi.wang@anyi-tech.com',  // 收件人，多人用分号“;”隔开
   *   subject: 'anyi',     //邮件主题
   *   text: 'haohao!!',   //邮件内容
   *   html: '<a href="http://www.baidu.com">nihao1</a><div>dddwewerwe</div>',   //带有html格式的内容，如果使用 html 参数，则text参数是无效的
   *   attachments: [   //附件
   *       {
   *           filename: 'text0.txt',   //附件的名称
   *           content: 'hello world!'   //附件的文本内容
   *       },
   *       {
   *           filename: 'text1.xlsx',    //附件名称
   *           path: 'D:/123.xlsx'          //附件的路径
   *       }
   *   ]
   * }
   * @returns {Promise.<*>}
   */
  send_mail(param) {
    if (!param) {
      return Promise.reject(new Error('需要传入发送邮件的参数'))
    }
    if (!param.to && !param.subject) {
      return Promise.reject(new Error('参数不完整'))
    }
    const reg = new RegExp('[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$')
    if (!reg.test(param.to)) {
      return Promise.reject(new Error('收件人地址格式不对'))
    }
    if (!param.text && !param.html) {
      return Promise.reject(new Error('邮件正文不能为空'))
    }
    if (param.attachments) {
      if (!(param.attachments instanceof Array)) {
        return Promise.reject(new Error('附件列表必须为数组'))
      }
      for (const n in param.attachments) {
        if (!param.attachments[n].filename) {
          return Promise.reject(new Error('附件文件名不能为空'))
        }
        if (!param.attachments[n].content && !param.attachments[n].path) {
          return Promise.reject(new Error('附件文件内容或者地址错误'))
        }
      }
    }

    const mailOptions = {
      from: (param.title || spaceConfig.systemName) + '<' + emailConfig.user + '> '
    }

    mailOptions.to = param.to
    if (param.cc) {
      mailOptions.cc = param.cc
    }
    mailOptions.subject = param.subject
    if (param.text) {
      mailOptions.text = param.text
    }
    if (param.html) {
      mailOptions.html = param.html
    }
    if (param.attachments) {
      mailOptions.attachments = param.attachments
    }

    // 发送邮件配置
    const transporter = nodemailer.createTransport({
      secureConnection: emailConfig.secureConnection, // 使用 SSL
      port: emailConfig.port,
      host: emailConfig.host, // 主机
      auth: {
        user: emailConfig.user, // service@anyi-tech.com
        pass: emailConfig.password // FengXianGuanJia123
      }
    });

    // 发送邮件
    return transporter.sendMail(mailOptions).then(info => {
      return Promise.resolve(info.response)
    }).catch(ex => {
      return Promise.reject(ex)
    });
  }
}

const email_requester = new EmailGatewayRequester('emailgateway',
  emailConfig.host
)

module.exports = { EmailGatewayRequester, email_requester }
