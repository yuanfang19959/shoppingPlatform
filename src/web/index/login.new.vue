<template>
  <div class="mainCon">
    <img :src="bg" alt="" class="logo_img"/>
    <p class="p1">爱心购公益商城</p>
    <p class="p2" v-show="!flag">绑定手机号开始选购</p>
    <div class="btn" v-show="!flag">
      <button>确认授权</button>
      <button @click="show">绑定其他手机号</button>
    </div>

    <div class="bindPhone" v-show="flag">
      <span class="s1 page_top">手机号登录</span>
      <div>
        <input type="tel" v-model='params.phone' placeholder="请输入手机号" maxlength="11" />
      </div>
      <div class="imgCode_box"> 
        <input type="text" v-model='params.imageCode' placeholder="请输入图形验证码" maxlength="4" />
        <img class="imgCode" :src="yzm1" alt="" @click="getcode" />
      </div>
      <div>
        <input type="text" v-model='params.authCode' placeholder="输入短信验证码" maxlength="6" @keyup.enter='loginsubmit' />
      </div>
      <button @click='loginsubmit'>登录</button>
      <span class="s2 msgBtn" v-show="!bol">{{ yzm }}秒</span>
      <span class="s2 msgBtn" @click="getMsgcode" v-show="bol">发送验证码</span>
    </div>
  </div>
</template>
<script>
import { setInterval, clearInterval } from "timers";
import ajax from "@utils/config";
import { validatPhone } from "@/assets/js/validate";
import { Toast } from "mint-ui";
import Cookies from "js-cookie";
export default {
  components: {},
  data() {
    return {
      bg: require("@/assets/imagea/login.svg"),
      yzm1: require("@/assets/imagea/yzm.png"),
      flag: !false,
      yzm: 60,
      bol: true,
      intervalID: null,
      params: {
        // phone:null,
        phone: "",
        imagecCode: "", //图形验证码 imageCode
        authCode: "", //登录验证码
        imageCode: "", //图形验证码
        margCode: "", //获取图形验证码时获取的唯一标示
        imageAuthCode: "", //获取图形验证码时获取的唯一标示
        loginType: 4 //登录端（1，pc、2，微信、3，app、4，h5）
      }
    };
  },
  created() {
    this.getcode();
  },
  methods: {
    show() {
      this.flag = true;
    },
    // 获取验证码
    getcode() {
      ajax({
        url: "member-api-impl/longin/getImagecCode?type=1",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            // this.params.imagecCode=response.data[0];
            this.params.margCode = response.data[0];
            this.yzm1 = "data:image/png;base64," + response.data[1];
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMsgcode() {
      let phone = this.params.phone,
        imageCode = this.params.imageCode,
        margCode = this.params.margCode;
      // console.log("phone==",phone);
      if (!phone) {
        Toast("手机号码不能为空");
        return;
      } else {
        if (!validatPhone(phone)) {
          Toast("手机格式不正确");
          return;
        } else {
          console.log("1111");
        }
      }
      if (!imageCode) {
        Toast("图形验证码不能为空");
        return;
      }

      ajax({
        url:
          "member-api-impl/longin/getcode?codeType=1&phone=" +
          phone +
          "&imageCode=" +
          imageCode +
          "&margCode=" +
          margCode,
        optionParams: this.params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.yzmz();
          } else {
            Toast(response.msg);
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 登录提交

    loginsubmit() {
      let phone = this.params.phone,
        imageCode = this.params.imageCode,
        margCode = this.params.margCode,
        authCode = this.params.authCode;
      // console.log("phone==",phone);
      if (!phone) {
        Toast("手机号码不能为空");
        return;
      } else {
        if (!validatPhone(phone)) {
          Toast("手机格式不正确");
          return;
        } else {
          console.log("1111");
        }
      }
      if (!imageCode) {
        Toast("图形验证码不能为空");
        return;
      }
      if (!authCode) {
        Toast("短信验证码不能为空");
        return;
      }

      this.params.imageAuthCode = this.params.imageCode;
      ajax({
        url: "member-api-impl/longin/phoneLogin",
        optionParams: this.params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.$store.dispatch("SETTOKEN", { token: response.data.token });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("phone", response.data.phone);
            Cookies.set("token", response.data.token);
            Cookies.set("phone", response.data.phone);
            // Toast(response.msg);
            Toast("登录成功");
            this.$router.push("/index");
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    yzmz() {
      // this.getMsgcode();
      this.intervalID = setInterval(() => {
        if (this.yzm <= 60 && this.yzm > 0) {
          this.yzm -= 1;
          this.bol = false;
        } else {
          clearInterval(this.intervalID);
          this.intervalID = null;
          this.yzm = 60;
          this.bol = true;
        }
      }, 1000);
    },
    getpagelist() {
      ajax({
        url: "tAppUser/userInfo",
        optionParams: {}
      })
        .fetch()
        .then(response => {
          if (response.code === 200) {
            this.balance = response.data.balance;
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
@import "./scss/login.scss";
.mainCon {
  width: 100%;
  height: 100%;
}
</style>

