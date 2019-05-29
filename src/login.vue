<template>
    <div class="loginCon">
        11111111
    </div>
</template>
<script>
import ajax from '@utils/config';
import Swiper from 'swiper';
export default {
    components: {
    },
    data() {
        return {
            img:require("@/assets/images/loginBanner.gif"),
            bgUrl: {
                backgroundImage: "url(" + require("@/assets/images/loginBanner.gif") + ")",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
            },
            account: true,
            pwd: false,
            tabItem1:{
                backgroundImage: "url(" + require("@/assets/images/phone.gif") + ")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0px center"
            },
            tabItem2:{
                backgroundImage: "url(" + require("@/assets/images/password.gif") + ")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0px center"
            }
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
    },
    filters: {

    }
}
</script>
<style lang='scss' scoped>
    .loginCon{
        width: 100%;
        height: 100%;
        .top{
            height: 681px;
            width: 100%;
            position: relative;
            .logo{
                position: absolute;
                top: 284px;
                left: 236px;
                width: 279px;
                height: 75px;
                background-color: #fff;
                font-size: 20px;
            }
        }
        .content{
            height: 587px;
            width: 100%;
            background:rgba(255,255,255,1);
            padding-top: 65px;
            .conTab{
                line-height: 39px;
                height: 39px;
                width: 523px;
                margin-left: 114px;
                .account{
                    font-size: 31px;
                    padding-left: 5px;
                    float: left;
                }
                .pwd{
                    float: right;
                    font-size: 31px;
                    padding-right: 5px;
                }
                .blod1{
                    font-size: 39px;
                }
                .blod{
                    font-size: 39px;
                }
            }
            .tabItem{
                width: 523px;
                margin-left: 114px;
                margin-top: 35px;
                position: relative;
                .input_text{
                    outline: none;
                    width: 523px;
                    height: 72px;
                    line-height: 72px;
                    text-indent: 60px;
                    font-size: 22px;
                    border-color: rgba(86,132,252,1);
                    border-style: solid;
                    border-top-width: 0px;
                    border-right-width: 0px;
                    border-bottom-width: 1px;
                    border-left-width: 0px;
                    display: block;
                    margin: 0 auto;
                }
                .sendMsg{
                    position: absolute;
                    right: 10px;
                    top: 90px;
                    font-size: 26px;
                    width:55px;
                    font-family:PingFang-SC-Regular;
                    font-weight:400;
                    color:rgba(86,132,252,1);
                }
            }
            .login{
                width: 523px;
                margin-left: 114px;
                margin-top: 80px;
                height: 79px;
                line-height: 79px;
                text-align: center;
                background:rgba(86,132,252,1);
                border-radius:8px;
                font-size:30px;
                font-family:PingFang-SC-Regular;
                font-weight:400;
                color:rgba(255,255,255,1);
            }
            .last{
                width: 523px;
                margin-left: 114px;
                margin-top: 20px;
                font-size:28px;
                .forgetPwd{
                    float: left;
                    height:28px;
                    font-size:28px;
                    font-family:PingFang-SC-Regular;
                    font-weight:400;
                    color:rgba(153,153,153,1);
                    line-height:28px;
                }
                .register{
                    float: right;
                    height:28px;
                    font-size:28px;
                    font-family:PingFang-SC-Regular;
                    font-weight:400;
                    color:rgba(0,0,0,1);
                    line-height:28px;
                }
            }
        }
    }
</style>


