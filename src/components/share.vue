<template>
  <div class="shareBox" v-if="params.isShow">
    <div class="share_content">
        <h4><span @click="params.isShow=false">×</span>分享</h4>
        <p>分享出去，让更多的人看到，会增加债转成功率哦！</p>
        <ul>
            <li @click="wxFriend(1)">
                <img src="~@/assets/images/wx.png" alt="微信好友">
                <p>微信好友</p>
            </li>
            <li @click="wxFriend(2)">
                <img src="~@/assets/images/pyq.png" alt="微信朋友圈">
                <p>微信朋友圈</p>
            </li>
            <li @click="wxFriend(3)">
                <img src="~@/assets/images/qqhy.png" alt="QQ">
                <p>QQ</p>
            </li>
            <li @click="wxFriend(4)">
                <img src="~@/assets/images/qqkj.png" alt="QQ空间">
                <p>QQ空间</p>
            </li>         
        </ul>
    </div>
  </div>
</template>
<script type="text/babel">
import ajax from '@utils/config';
import { Toast } from 'mint-ui';
export default {
  props: {
    // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
    // shareBox: {
    //   type: Object,
    //   default: function() {
    //     return {}
    //   }
    // },
    //弹框标题
    params: {
      type: Object,//Boolean Array Object
      default: function() {
        return {}
      }
    },
  },
  data() {
    return {
        data:{
            title: this.params.title, // 分享标题
            link: this.params.url, // 分享链接
            desc: this.params.desc, // 分享描述
            imgUrl: this.params.img, // 分享图标
        },
        shorturl:''
    };
  },
  created() {
        this.geturl();
        this.getWXSign();
  },
  methods: {
        geturl(){
            if(this.params.url.indexOf("#") != -1){
                this.shorturl = location.href.split('#')[0].toString();
                // this.shorturl = this.params.url.split("#")[0];
                // this.shorturl = this.params.url.split("#")[0]+'#'+this.params.url.split("#")[1];
                // this.shorturl = 'https://www.bsnzz.com/h5/page/#/buy/details?id=90';
                console.log(this.shorturl);
            }
        },
		//微信获取签名
		getWXSign() {
			ajax({
                url: "wx_app_support/get_ticket?url="+this.shorturl,
				optionParams: {
				}
			}).fetch()
				.then(res => {
					if (res.code === 200) {
						wx.config({
                            //debug:  false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: 'wx16a52d931f9cb9e7', // 必填，公众号的唯一标识
                            timestamp:  res.data.timestamp, // 必填，生成签名的时间戳
                            nonceStr:  res.data.nonceStr, // 必填，生成签名的随机串
                            signature:  res.data.signature,// 必填，签名，见附录1
                            jsApiList:  ['checkJsApi',  'onMenuShareTimeline',  'onMenuShareAppMessage',  'onMenuShareQQ',  'onMenuShareWeibo',  'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			            });
			            //通过ready接口处理成功验证
			            wx.ready(function ()  {
                            //判断当前客户端版本是否支持指定JS接口
                            //wx.checkJsApi({
                            //    jsApiList: ['onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            //    success: function (res) {
                            //        // 以键值对的形式返回，可用的api值true，不可用为false
                            //        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                            //        if (res) {
                            //            alert(JSON.stringify(res));
                            //        }
                            //    }
                            //});
				//             var  data  =  {
                //                 title: this.params.title, // 分享标题
                //                 link: this.params.url, // 分享链接
                //                 desc: this.params.desc, // 分享描述
                //                 imgUrl: this.params.img, // 分享图标
                //             };
                
				                //分享到朋友圈
				//                 wx.onMenuShareTimeline(data);
				//                 //分享给朋友
				//                 wx.onMenuShareAppMessage(data);
				//                 //分享到QQ
				//                 wx.onMenuShareQQ(data);
				//                 //分享到腾讯微博
				//                 wx.onMenuShareWeibo(data);
				//                 //分享到QQ空间
				//                 wx.onMenuShareQZone(data);
			            });
						// console.log(wx);
			            //通过error接口处理失败验证
			            wx.error(function (res)  {
                                console.log(JSON.stringify(res));
				//                 alert(JSON.stringify(res));
			            });
			            function  shareSuccess(res)  {
				                alert("分享成功："  +  JSON.stringify(res));
			            }
			            function  shareFail(res)  {
				                alert("分享失败："  +  JSON.stringify(res));
			            }
					} else {
					}
				})
				.catch(error => {
					console.log(error)
				})
        },
        wxFriend(val) {
            if(val==1){
                wx.onMenuShareAppMessage(this.data);
                // if(window.location.href.indexOf("approuter") != -1){
                //     window.location.href = 'https://www.jd.com?onMenuShareAppMessage&id='+this.params.id;
                // } else {
                //     wx.onMenuShareAppMessage(this.data);
                //     // console.log(this.data);
                //     // console.log(JSON.stringify(this.data));
                // }
            }
            if(val==2){
                wx.onMenuShareTimeline(this.data);
                // if(window.location.href.indexOf("approuter") != -1){
                //     window.location.href = 'https://www.jd.com?onMenuShareTimeline&id='+this.params.id;
                // } else {
                //     wx.onMenuShareTimeline(this.data);
                // }
            }
            if(val==3){
                wx.onMenuShareQQ(this.data);
                // if(window.location.href.indexOf("approuter") != -1){
                //     window.location.href = 'https://www.jd.com?onMenuShareTimeline&id='+this.params.id;
                // } else {
                //     wx.onMenuShareQQ(this.data);
                // }
            }
            if(val==4){
                wx.onMenuShareQZone(this.data);
                // if(window.location.href.indexOf("approuter") != -1){
                //     window.location.href = 'https://www.jd.com?onMenuShareQZone&id='+this.params.id;
                // } else {
                //     wx.onMenuShareQZone(this.data);
                // }
                
            }
        }
  },
};
</script>
<style lang='scss' scoped>
.shareBox{
    width:749px;
    height:100%;
    background:rgba(0,0,0,0.3);
    position: absolute;
    top: 0px;
    z-index: 999999;
}
.share_content{
    // position: absolute;
    margin-top:450px;
    margin-left: 40px;
    width:670px;
    height:440px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    h4{
        height:34px;
        font-size:36px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:34px;
        text-align: center;
        position: relative;
        padding-top: 30px;
        span{
            color: #999999;
            position: absolute;
            left: 44px;
            top: 20px;
        }
    }
    p{
        height:24px;
        font-size:24px;
        font-family:PingFang-SC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:24px;
        margin:55px 0 73px;
        text-align: center; 
    }
    ul{
        width: 630px;
        height: 130px;
        margin:0 auto;
        display: flex;
        justify-content: space-around;
        li{
            text-align: center;
            img{
                width: 80px;
                height: 80px;
            }
            p{
                color:rgba(51,51,51,1);
                margin:20px 0 0;
            }
        }
    }
}
</style>