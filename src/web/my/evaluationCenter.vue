<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
    
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>  
    </div>

    <div class="clear"></div>


 <div class="content">
      <!-- 单个商品区域 -->
      <div class="box" v-for='item in orderList'>
        <!-- 头部区域不包含商品信息 -->
        <div class="top">
          <span class="left">
            <img src="@/assets/imagea/position.png" alt />
            <span>{{item.villageName}}</span>
          </span>
        </div>

        <!-- 商品详情 -->
        <div class="goods" v-for='i in item.listDetail'>
          <div class="imgContainer">
            <img :src="i.goodsImage" alt="商品图片" />
            <!--<img :src="@/assets/imagea/meat.png" alt="商品图片" />-->
          </div>

          <div class="rightInfo">
            <p>{{i.goodsName}}</p>
            <span class="kg">净含量{{i.weight}}</span>
            <!--<span class="kg">净含量{{i.weight}}千克</span>-->
          </div>

          <div class="right">
            <span class="s3">
              <span class="t1">¥{{i.goodsMoney}}</span>
              <span class="t2">数量 {{i.goodsNum}}</span>
            </span>
          </div>
        </div>
        <div class="bt">
          <ul>
            <li>
              <button  @click="$router.push({path:'/writeEvaluation',query:{orderId:item.id}})">评价</button>
            </li>
            <li class="last">
              <button @click="$router.push({path:'/orderDetails', query:{id:item.id}})" class="cancel">订单详情</button>
            </li>
          </ul>
        </div>
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
        centerData:{type:0,name:'评价中心'},
        rightData:{type:1,name:''},
      },
      meat: require("@/assets/imagea/meat.png"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      camera: require("@/assets/imagea/camera.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      file: require("@/assets/imagea/file.svg"),
      params:{status:4},
      orderList:[],
    };
  },
  created() {
    this.getCommentData();
  },
  mounted () {
    // let id = this.$route.query.orderId;
    // this.orderId = id?id:'';
    // this.getGoodsCommentData();
  },
  methods: {
    getCommentData() {
      ajax({
        url: 'order-api-impl/order/getOrderinfoByStatus',
        // url: 'order-api-impl/orderComm/list?orderId='+this.orderId,
        optionParams: this.params
      }).post()
        .then(res => {
          if (res.code === 200) {
            this.orderList=res.data?res.data:[];
            // this.userOrderInfo=res.data.userOrderInfo?res.data.userOrderInfo:{};
             
          } else {
            console.log(res)
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
@import "./scss/evaluationCenter.scss";
</style>
