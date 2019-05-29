<template>
  <div class="mainCon">
    <img :src="bg" alt="" />
    <p class="p1">爱心购公益商城</p>
    <p class="p2" v-show="!flag">绑定手机号开始选购</p>
    <div class="btn" v-show="!flag">
      <button>确认授权</button>
      <button @click="show">绑定其他手机号</button>
    </div>

    <div class="bindPhone" v-show="flag">
      <span class="s1">绑定手机号</span>
      <input type="tel" placeholder="请输入手机号" />
      <input type="text" placeholder="请输入验证码" maxlength="4" />
      <img :src="yzm" alt="" />
      <input type="text" placeholder="输入短信验证码" maxlength="6" />
      <button>完成绑定</button>
      <span class="s2" v-show="!bol">{{ yzm }}秒</span>
      <span class="s2" @click="yzmz" v-show="bol">发送验证码</span>
    </div>
  </div>
</template>
<script>
import { setInterval, clearInterval } from "timers";
import ajax from "@utils/config";
export default {
  components: {},
  data() {
    return {
      bg: require("@/assets/imagea/login.svg"),
      yzm: require("@/assets/imagea/yzm.png"),
      flag: false,
      yzm: 60,
      bol: true,
      intervalID:null
    };
  },
  created() {},
  methods: {
    show() {
      this.flag = true;
    },
    yzmz(){
      this.intervalID = setInterval(() => {
        if (this.yzm <=60 && this.yzm >0) {
          this.yzm -=1;
           this.bol = false;
        }else{
            clearInterval(this.intervalID);
            this.intervalID = null;
            this.yzm = 60;
            this.bol = true;
        }
      }, 1000);
    },
     getpagelist() {
        ajax({
          url: 'tAppUser/userInfo',
          optionParams: {}
        }).post()
          .then(response => {
            if (response.code === 200) {
              this.balance = response.data.balance;
            } else {
              console.log(response)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
  },
  watch: {
   
  }
};
</script>
<style lang='scss' scoped>
@import "./scss/login.scss";
.mainCon {
  width: 100%;
  height: 100%;
}
</style>

