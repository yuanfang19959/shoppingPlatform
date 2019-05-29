<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>

    <div class="content" id="top">
      <div class="c1">
        <span>当前手机号</span>
        <span class="s2">{{form.phone|phoneFilter}}</span>
      </div>
    </div>

    <div class="content">
      <div class="c1">
        <span>绑定新手机号</span>
      </div>

      <!-- 输入框 -->
      <div class="inputBox">
        <input type="text" v-model="form.newPhone" placeholder="请输入新手机号"  maxlength="11" />
      </div>

      <div class="inputBox">
        <input type="text" v-model='form.imageCode' placeholder="请输入验证码" maxlength="4" />
        <img :src="yzm" alt="" @click='getImgcode'/>
      </div>

      <div class="inputBox">
        <input type="text" v-model='form.authCode' placeholder="请输入短信验证码" maxlength="6"  />
        <span v-if='isSend' @click='getphonecodeId'>获取验证码</span>
        <span v-else>{{count}}s</span>
      </div>
    </div>
    <div class="bottom1" @click="submitForm">完成更改</div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from '@utils/config';
import { validatPhone } from '@/assets/js/validate';
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components:{
    top,
    blank
  },
  data() {
    return {
      barType:'0',  
      barText:{
        leftData:{type:1,name:require("@/assets/imagea/blackup.svg")},
        centerData:{type:0,name:'更改绑定'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      yzm: require("@/assets/imagea/yzm.png"),
       isSend: true,
       count:"",
       form:{
          phone:'',
          authCode:'',//验证码
          newPhone:'',//新手机号
          imageCode:'',//图形验证码
          margCode:'',//获取图形验证码时获取的唯一标示
       },
    };
  },
  created () {
    this.getImgcode();
  },
  mounted () {
    this.form.phone=this.$route.query.phone?this.$route.query.phone:'';
    
  },
  methods: {
    // 获取图形验证码
      getImgcode() {
        ajax({
          url: 'member-api-impl/longin/getImagecCode?type=2',
          optionParams: {}
        }).post()
          .then(response => {
            if (response.code === 200) {
              this.form.margCode = response.data[0];
              this.yzm = 'data:image/png;base64,' + response.data[1];
            } else {
              console.log(response)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
    toast(val) {
      Toast({
        message: val,
        duration: 1500,
        position: 'bottom'
      });
    },
  
  getphonecodeId() {
        let phone = this.form.newPhone,imageCode=this.form.imageCode;
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
        if(!imageCode){
          Toast("图形验证码不能为空不能为空");
          return;
        }
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.isSend = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.isSend = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
        ajax({
          url: 'member-api-impl/longin/getcode',
          optionParams: {codeType:'2',phone:phone,imageCode:imageCode,margCode:this.form.margCode}
        }).post()
          .then(response => {
            if (response.code === 200) {
            } else {
            }

          })
          .catch(error => {
            console.log(error)
          })

      },
      submitForm(){
        let phone = this.form.newPhone;
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
        ajax({
          url: 'member-api-impl/user/updBindPhone',
          optionParams: this.form,
        }).post()
          .then(response => {
            if (response.code === 200) {
              Toast("更新完成~")
              this.$router.push("/my/account");
            } else {

            }

          })
          .catch(error => {
            console.log(error)
          })
      }
    }
};
</script>

<style lang="scss" scoped>
@import "./scss/modifyPhone.scss";
</style>
