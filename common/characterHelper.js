/**
 * 通用字符处理方法
 */

class CharacterHelper {
  /**
   * 十进制转三十二进制
   * @param _hexadecimal 十进制数字
   * 注：
   * ① 26个字母中去除【I、O、S、Z】
   * ② 32进制可作为日期的表示
   */
  static systemDecimalToHex32(_hexadecimal) {
    // 三十二进制表
    const hexTab = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y']
    // 转换结果
    let hex = []
    let quotient = _hexadecimal
    let remainder = -1 // 商、取余
    while (quotient !== 0) {
      remainder = quotient % 32
      quotient = parseInt(quotient / 32)
      // 根据余数生成字符串
      hex.push(hexTab[remainder])
    }
    // 颠倒数组
    hex = hex.reverse()
    // 输出
    return hex.join('')
  }


  /**
   * 随机指定长度字符床
   * @param len 输出随机字符串长度
   * @returns {string} 返回结果
   */
  static randomString(len) {
    len = len || 32
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  /**
   * 随机生成数字字符串
   * @param {Int} len 字符串长度
   */
  static randomNumber(len) {
    len = len || 6
    const $chars = '0123456789';
    const maxPos = $chars.length
    let str = ''
    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str;
  }

  /**
   * 用户客户端识别
   * @param {*} ua 
   */
  static userAgent(ua) {
    // 内核引擎
    var engine = {
      ie: 0,
      gecko: 0,
      webkit: 0,
      khtml: 0,
      opera: 0,
      ver: null
    };
    // 浏览器识别
    var browser = {
      ie: 0,
      firefox: 0,
      safari: 0,
      konq: 0,
      opera: 0,
      chrome: 0,
      ver: null
    };
    // 系统识别
    var system = {
      win: false,
      mac: false,
      xll: false,
      iphone: false,
      ipoad: false,
      ipad: false,
      ios: false,
      android: false,
      nokiaN: false,
      winMobile: false,
      wii: false,
      ps: false
    };


    // 检测浏览器呈现引擎
    if (/Opera\/(\S+)/i.test(ua)) {
      engine.ver = RegExp['$1'];
      engine.opera = parseFloat(browser.ver);
    } else if (/AppleWebkit\/(\S+)/i.test(ua)) {
      engine.ver = RegExp['$1'];
      engine.webkit = parseFloat(engine.ver);

      // 确定是Chrome还是Safari
      if (/Chrome\/(\S+)/i.test(ua)) {
        browser.ver = RegExp['$1'];
        browser.chrome = parseFloat(browser.ver);
      } else if (/Version\/(\S+)/i.test(ua)) {
        browser.ver = RegExp['$1'];
        browser.safari = parseFloat(browser.ver);
      } else {
        // 近似地确定版本号
        var safariVersion = 1;
        if (engine.webkit < 100) {
          safariVersion = 1;
        } else if (engine.webkit < 312) {
          safariVersion = 1.2;
        } else if (engine.webkit < 412) {
          safariVersion = 1.3;
        } else {
          safariVersion = 2;
        }

        browser.safari = browser.safari = safariVersion;
      }
    } else if (/KHTML\/(\S+)/i.test(ua) || /Konqueror\/([^;]+)/i.test(ua)) {
      engine.ver = browser.ver = RegExp['$1'];
      engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/i.test(ua)) {
      engine.ver = RegExp['$1'];
      engine.gecko = parseFloat(engine.ver);

      // 确定是不是Firefox
      if (/Firefox\/(\S+)/i.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.firefox = parseFloat(browser.ver);
      }
    } else if (/MSIE ([^;]+)/i.test(ua)) {
      engine.ver = browser.ver = RegExp['$1'];
      engine.ie = browser.ie = parseFloat(engine.ver);
    }

    // 检测平台
    var p = navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    system.xll = (p.indexOf('Xll') == 0 || p.indexOf('Linux') == 0);

    // 检测Windows操作系统
    if (system.win) {
      if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if (RegExp['$1'] == 'NT') {
          switch (RegExp['$2']) {
            case '5.0': system.win = '2000'; break;
            case '5.1': system.win = 'XP'; break;
            case '6.0': system.win = 'Vista'; break;
            case '6.1': system.win = '7'; break;
            case '6.2': system.win = '8'; break;
            default: system.win = 'NT'; break;
          }
        } else if (RegExp['$1'] == '9x') {
          system.win = 'ME';
        } else {
          system.win = RegExp['$1'];
        }
      }
    }

    // 移动设备
    system.iphone = ua.indexOf('iPhone') > -1;
    system.ipod = ua.indexOf('iPod') > -1;
    system.ipad = ua.indexOf('iPad') > -1;
    system.nokiaN = ua.indexOf('nokiaN') > -1;

    // windows mobile
    if (system.win == 'CE') {
      system.winMobile = system.win;
    } else if (system.win == 'Ph') {
      if (/Windows Phone OS (\d+.\d)/i.test(ua)) {
        system.win = 'Phone';
        system.winMobile = parseFloat(RegExp['$1']);
      }
    }

    // 检测IOS版本
    if (system.mac && ua.indexOf('Mobile') > -1) {
      if (/CPU (?:iPhone )?OS (\d+_\d+)/i.test(ua)) {
        system.ios = parseFloat(RegExp['$1'].replace('_', '.'));
      } else {
        system.ios = 2;        // 不能真正检测出来，所以只能猜测
      }
    }

    // 检测Android版本
    if (/Android (\d+\.\d+)/i.test(ua)) {
      system.android = parseFloat(RegExp['$1']);
    }

    // 游戏系统
    system.wii = ua.indexOf('Wii') > -1;
    system.ps = /PlayStation/i.test(ua);

    return {
      engine: engine,
      browser: browser,
      system: system
    }
  }
}

module.exports = { CharacterHelper }
