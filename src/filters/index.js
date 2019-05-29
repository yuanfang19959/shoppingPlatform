export function parseTime(time, cFormat) {


    if (arguments.length === 0) {
        return null;
    }
    if (time === undefined || time === null)
        return '';

    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time == 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;

        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}
export function formatMoney(value) {
    if (value) {
        return (value / 100).toFixed(2);
    } else {
        return '0.00';
    }
}
export function forma(value) {
    if (value) {
        return (value * 100).toFixed(2);
    } else {
        return '0.0';
    }
}
export function forma1(value) {
    // console.log("value==",value);
    if (value) {
        // console.log("1111");
        return value.toFixed(2);
    } else {
        // console.log("2222");
        return '0.00';
    }
}
// 银行卡返回后四位
export function formaBank(value) {
    if (value) {
        return value.substr(-4);
    } 
}
export function formatTime(value, that, params, startName, endName) {
    if (value) {
        let start = value.match(/(\S*)至/)[1];
        let end = value.match(/至(\S*)/)[1];
        if (params) {
            that[params][startName] = start;
            that[params][endName] = end;
        } else {
            that[startName] = start;
            that[endName] = end;
        }
    } else {
        if (params) {
            that[params][startName] = '';
            that[params][endName] = '';
        } else {
            that[startName] = '';
            that[endName] = '';
        }
    }
}
export function formatDate(value){
    if(value){
        return value.split(" ")[0];
    }
}
export function getAge(identityCard) {
    if (identityCard) {
        var len = (identityCard + "").length;
        if (len == 0) {
            return 0;
        } else {
            if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
            {
                return 0;
            }
        }
        var strBirthday = "";
        if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
        {
            strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
        }
        if (len == 15) {
            strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
        }
        //时间字符串里，必须是“/”
        var birthDate = new Date(strBirthday);
        var nowDateTime = new Date();
        var age = nowDateTime.getFullYear() - birthDate.getFullYear();
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    } else {
        return '';
    }

}
export function accoutTypeFilter(type) {
    let typeVal= parseInt(type);
    if(typeVal==0){
        return "普通用户"
    }else if(typeVal==1){
        return "村委"   
    }else if(typeVal==2){
        return "供应商"
    }else if(typeVal==3){
        return "村委,供应商"
    }else if(typeVal==4||typeVal==5||typeVal==6||typeVal==7){
        return "机构中心"
    }else{
        return;
    }
}
//手机号码脱敏显示
export function phoneFilter(val) {
    if (val) {
        let value = val.toString();
        return value.substr(0, 3) + '****' + value.substr(7);

    }
}
//手机号码脱敏显示
export function niceCommentRateFilter(val) {
    if (val) {
        let value = val.toString();
        return value.split('%')[0]/10;

    }
}
//金额方向显示  1资金提现 2资金充值 3季度分润 4退款
export function directionMoneyFilter(val) {
    let value = val.toString();
    if (value==1) {
        return '资金提现';
    }else if(value==2){
        return '资金充值';
    }else if(value==3){
        return '季度分润';
    }else if(value==4){
        return '退款';
    }
}

//截取8位
export function hamp(val){
    if(val){
        let value = val.toString();
        return value.substr(0,9)
    }
}

//截取时间
export function timeFilter(val){
    if(val){
        let value = val.toString();
        return value.substr(0,10) + " "+ value.substr(11,8)
    }
}

// 订单类型
// 订单状态 -1已取消, 0待付款,1待发货,2待收货,4待评价,3已完成、已签收 ,5已评价, 6换货 7 退款
export function orderStatusFilter(val){
    let value = val;
    // let value = val.toString();
    if (value==-1) {
        return '已取消';
    }else if(value==0){
        return '待付款';
    }else if(value==1){
        return '待发货';
    }else if(value==2){
        return '待收货';
    }else if(value==3){
        return '已签收';
    }else if(value==4){
        return '待评价';
    }else if(value==5){
        return '已评价';
    }else if(value==6){
        return '换货';
    }else if(value==7){
        return '退款';
    }
}
// 配送方式 运送方式 1 快递 2ems 3 平邮
export function shipWayFilter(val){
    let value = val.toString();
    if (value==1) {
        return '快递';
    }else if(value==2){
        return 'EMS';
    }else if(value==3){
        return '平邮';
    }
}











