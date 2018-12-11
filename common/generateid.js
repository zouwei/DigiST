/**
 * Created by timer on 2015/4/8.
 */

// var random=require("random-key");
// var printf=require("printf");
var idConfig = {};
/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


var loadconfig = function () {
    try {
        var fs = require('fs');
        idConfig = JSON.parse(fs.readFileSync('./generateid.json'));

    } catch (ex) {

    }


}

var saveconfig = function () {
    var fs = require('fs');
    fs.writeFileSync('./generateid.json', JSON.stringify(idConfig));

}

loadconfig();

var generator = function () {

}


var record = {};
generator.getID = function (name) {
    //console.log(name);
    var buf = new Buffer(12);
    var host = 1;//process.env.RISKEYS_HOST;
    var pid = process.pid;
    var time = Math.round((new Date).getTime() / 1000);

    if (record[name] == null) record[name] = { time: 0, seq: 0 };
    //console.log(record[name].time,time);
    if (record[name].time != time) {
        record[name].time = time;
        record[name].seq = 0;
    } else {
        record[name].seq++;
    }
    var seq = record[name].seq;
    var pname = name + "\0";
    buf.write(pname, 0, 2);
    // buf.writeUInt8(name.charCodeAt(0));
    //buf.writeUInt8(name.charCodeAt(1),1);
    buf.writeUInt16LE(host, 2);
    buf.writeUInt16LE(pid & 0xffff, 4);
    buf.writeUInt32LE(time, 6);
    buf.writeUInt16LE(seq, 10);
    var id = buf.toString("hex").toUpperCase();
    return id;
};

generator.getID_old = function (name, tp, cb) {
    //console.log(name);
    var buf = new Buffer(12);
    var host = 1;//process.env.RISKEYS_HOST;
    var pid = process.pid;
    var time = Math.round((new Date).getTime() / 1000);

    if (record[name] == null) record[name] = { time: 0, seq: 0 };
    //console.log(record[name].time,time);
    if (record[name].time != time) {
        record[name].time = time;
        record[name].seq = 0;
    } else {
        record[name].seq++;
    }
    var seq = record[name].seq;
    var pname = name + "\0";
    buf.write(pname, 0, 2);
    // buf.writeUInt8(name.charCodeAt(0));
    //buf.writeUInt8(name.charCodeAt(1),1);
    buf.writeUInt16LE(host, 2);
    buf.writeUInt16LE(pid & 0xffff, 4);
    buf.writeUInt32LE(time, 6);
    buf.writeUInt16LE(seq, 10);
    var id = buf.toString("hex").toUpperCase();

    if (cb) cb(id);
    else return id;

};

module.exports = generator;