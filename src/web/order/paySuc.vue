<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <!--<img
        class="blackup"
        :src="blackup"
        alt=""
        @click="$router.push('/my/index')"
      />
      <span class="center_1">付款成功</span>
      <span class="leftS" @click="alr">提交</span>-->
      <top :barType='barType' :barText='barText' @subSave='alr'></top>
      <blank></blank>
    </div>

    <div class="clear"></div>

    <!-- 提交成功显示的内容 -->
    <div class="successContent">
      <img :src="file" alt="" />
      <div class="suc">订单已提交</div>

      <div class="btn">
        <button @click="$router.push('/order')">查看订单</button>
        <button @click="$router.push('/index')">返回首页</button>
      </div>
    </div>

  </div>
</template>

<script>
import { Toast, Popup } from "mint-ui";
import ajax from "@utils/config";
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
        centerData:{type:0,name:'付款成功'},
        rightData:{type:0,name:'提交'},
      },
      meat: require("@/assets/imagea/meat.png"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      camera: require("@/assets/imagea/camera.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      file: require("@/assets/imagea/file.svg"),
      popupVisible: false,
      flag: false,
      showTrue: false,
      reason: null,
      index: null,
      checkReason: [
        {
          id: 1,
          name: "少件、漏发",
          iflag: false
        },
        {
          id: 2,
          name: "包装/商品破损",
          iflag: false
        },
        {
          id: 3,
          name: "与描述不符",
          iflag: false
        }
      ]
    };
  },
  created() {
    // this.getaddressList();
  },
  methods: {
    alr() {
      if (this.reason) {
        this.showTrue = true;
        Toast("提交成功");
      } else {
        Toast("请选择原因退款！");
      }
    },
    popUP() {
      this.popupVisible = true;
    },
    popClose() {
      this.popupVisible = false;
      this.reason = this.checkReason[this.index].name;
    },
    popCancel() {
      this.popupVisible = false;
      this.reason = null;
    },
    change(index) {
      //单选
      this.checkReason.forEach(item => {
        item.iflag = false;
      });
      this.checkReason[index].iflag = !this.checkReason[index].iflag;
      this.index = index;
    },
    getaddressList() {
      ajax({
        url: 'tAppUser/userInfo',
        optionParams: {}
      }).post()
        .then(response => {
          if (response.code === 200) {
            // this.balance = response.data.balance;
          } else {
            console.log(response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/applyRefund.scss";
</style>
