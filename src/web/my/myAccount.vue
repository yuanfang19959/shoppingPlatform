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
      <span>我的账户</span>-->
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>
    

     <div class="content">
      <div class="c1" >
        <span >账户余额</span>
        <div @click="$router.push('/my/accountBalance')">
            <span class="s2" >{{infoData.balanceMoney|forma1}}</span>
          <img :src="leftarrow" alt="" />
        </div>
          
      </div>
      <div class="c1" @click="$router.push('/balanceDetails')">
        <span>余额明细</span>
        <div>
           
        <img :src="leftarrow" alt="" /> 
        </div>
      </div>
      <div class="c1">
        <span>账户类型</span>
        <span class="s2"> {{infoData.types|accoutTypeFilter}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import ajax from '@utils/config';
import { Toast } from "mint-ui";
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
        centerData:{type:0,name:'我的账户'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      infoData:{},
    };
  },
  created () {
    this.getInfoData();
  },
  methods: {
      getInfoData() {
        ajax({
          url: 'member-api-impl/user/myBalance',
          optionParams: {}
        }).post()
          .then(res => {
            if (res.code === 200) {
              this.infoData = res.data?res.data:{};;
            } else {
              console.log(res)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
     
    },
};
</script>

<style lang="scss" scoped>
@import "./scss/myAccount.scss";
</style>
