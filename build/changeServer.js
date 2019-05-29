var fs = require('fs');
var path = require('path');
var argument = process.argv.splice(2);

if (argument[0] === 'devServer') {
    base('http://192.168.0.13:8055/zrf_admin/'); //开发启动
} else if (argument[0] === 'testServer') {
    base('http://192.168.0.15:8024/debt/'); //开发测试打包
} else if (argument[0] === 'chengmei') {
    base('http://192.168.1.82:8055/') //成美打包
} else if (argument[0] === 'production') {
    base('http://119.29.150.98/phoenix/mobile/api/'); //生产打包
} else if (argument[0] === 'agency') {
    base('/kxd-admin/'); //代理
}

function base(ip) {
    var data = getData(ip);
    var p = path.resolve(__dirname, '../src/assets/js/ajax/baseURL.js');
    fs.writeFile(p, data, function(err) {
        if (err) {
            throw err;
        }
        console.log('change server is successful: ' + ip);
    })

    function getData(ip) {
        return `
            export default function baseURL () {
                return ` + '"' + ip + '"' + `
            }
        `
    }
}