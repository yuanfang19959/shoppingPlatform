<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <img
        class="blackup"
        :src="blackup"
        alt=""
        @click="$router.push('/my/index')"
      />
      <span>评价成功</span>
    </div>
    <div class="top">
      <div class="centerBox">
        <div class="gy">
          <span class="s2">你的评价将会为他人提供宝贵的参考</span>
        </div>
        <div class="gy_bottom">
          <span @click="$router.push('/index')">返回首页</span>
          <span @click="$router.push('/writeEvaluation')">查看评价</span>
        </div>
      </div>
    </div>

    <div class="middle">
      <hr />
      <span>继续评价</span>
    </div>

    <!-- 底部评价 -->
    <div class="content">
      <div class="mini" v-show="ordersList.length>0" v-for="i in ordersList">
        <div v-for="item in i.listDetail" style="width: 100%" class="flexbox goodsList">
          <img :src="item.goodsImage" alt="" />
          <p class="flex1">{{ item.goodsName }}</p>
          <button @click="$router.push({path:'/writeEvaluation',query:{orderId:i.id}})">去评价</button>
        </div>
      </div>
      <div v-show="ordersList.length==0" class="textC">暂无未评价订单</div>
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
        centerData:{type:0,name:'订单详情'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      ordersList: [],
      params: { 
        status: "4" ,
        pageIndex:1,
        pageSize:20,
      }
    };
  },
  mounted () {},
  created () {
    this.getList();
  },
  methods: {
     getList() {
        ajax({
        url: "order-api-impl/order/getOrderinfoPageByStatus",
        optionParams: this.params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.ordersList = response.data.records ? response.data.records : [];
            // this.pages = response.data.pages;
            
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
      },
  },

};
</script>

<style lang="scss" scoped>
@import "./scss/evaluationSuc.scss";
</style>
