<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <!--<img class="blackup" :src="blackup" alt="" @click='$router.push("/my/index")'>
            <span>我的积分</span>-->
      <top :barType="barType" :barText="barText"></top>
      <blank></blank>
    </div>
    <div class="top">
      <div class="centerBox">
        <span class="s1">{{ integral.integral }}</span>
        <div class="gy">
          <span class="line1"></span>
          <span class="s2">{{ integral.gradeName }}</span>
          <span class="line"></span>
        </div>
        <div class="pic">
          <span v-for="i in starList" :key="i.id">
            <img src="@/assets/imagea/diamondB.svg" alt="" v-show="!i.starFlag"/>
            <img src="@/assets/imagea/diamond.svg" alt="" v-show="i.starFlag"/>
          </span>
        </div>
      </div>
    </div>

    <div class="middle">
      <!-- 进度条 -->
      <div class="progress">
        <span class="next">下一等级</span>
        <div class="vermiddle">
          <div class="left">
            <progress :value="integral.integral" max="20"></progress>
            <div class="l1">
              <span>{{gradeRangeArr[0]}}</span>
              <span>{{gradeRangeArr[1]}}</span>
            </div>
          </div>
          <div class="right">
            {{ integral.nextGradeName }}
          </div>
        </div>
      </div>

      <!-- 积分详情 -->
      <div class="jf">
        <span class="s3">积分详情</span>
        <div class="content" v-for="i in listIntegral" :key="i.id">
          <div class="left">
            <p>{{i.goodsName}}商品名称</p>
            <span class="date">{{i.finishTime}}</span>
          </div>
          <span class="multi">+{{i.integral}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ajax from "@utils/config";
import { Toast, DatetimePicker } from "mint-ui";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import { setTimeout } from 'timers';
export default {
  components: {
    top,
    blank
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "我的积分" },
        rightData: { type: 1, name: "" }
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      integral: {},
      starList:[
          {
              id:1,
              starFlag:false,
          },
          {
              id:2,
              starFlag:false,
          },
          {
              id:3,
              starFlag:false,
          },
          {
              id:4,
              starFlag:false,
          },
          {
              id:5,
              starFlag:false,
          }
      ],
      gradeRangeArr:[],
      listIntegral:[]
    };
  },
  created() {
    this.getaccountGrade();
    
    setTimeout(()=>{
        this.starOn()
    },200)
    
  },
  mounted() {
     this.starOn();
  },
  methods: {
    getaccountGrade() {
      ajax({
        url: "member-api-impl/user/accountGrade",
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.integral = res.data ? res.data : {};
            this.gradeRangeArr=this.integral.gradeRange.split(',');
            this.listIntegral = this.integral.listIntegral;
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    starOn(){
        // 点亮心心
         if(this.integral){
            let star = this.integral.gradeStar
          for(var i = 0;i <star; i++){
              this.starList[i].starFlag = true
          }
      }
    }
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
@import "./scss/integral.scss";
</style>
