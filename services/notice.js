/**
 * 通知服务
 */
const { sms_requester } = require('../common/sms_sdk');
const { email_requester } = require('../common/email_sdk');


class Notice {

    /**
     * 
     * @param {*} args 手机号码
     * {
     *    "phones":"18971115676",  
     *    "content":"您好，您的手机验证码为：108108。" 
     * }
     * @param {*} headers 请求头，可为空
     */
    static sendSms(args, headers) {
        //
        console.log('sms come', paras, headers)
        return sms_requester.send(paras, headers);
    }


    /**
     * 发送邮件
     * @param paras
     * {
     *   to: 'recipient@domain.com',        // 收件人，多人用分号“;”隔开
     *   subject: '邮件标题',                // 邮件主题
     *   text: '邮件正文内容!!',   // 邮件内容
     *   html: '<a href="http://www.baidu.com">链接示例</a><div>dddwewerwe</div>',   //带有html格式的内容，如果使用 html 参数，则text参数是无效的
     *   attachments: [   // 附件
     *       {
     *           filename: 'text.txt',    //附件的名称
     *           content: 'hello world!'   //附件的文本内容
     *       },
     *       {
     *           filename: 'text.xlsx',          //附件名称
     *           path: 'D:/text.xlsx'            //附件的路径
     *       }
     *   ]
     * }
     * @returns {Promise.<*>}
     */
    static sendEmail(paras, headers) {
        // 发送邮件
        console.log('send email', paras, headers);
        return email_requester.send_mail(paras);
    }

}


module.exports = { Notice }
