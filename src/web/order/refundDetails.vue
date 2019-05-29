<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <headTop :barType="barType" :barText="barText"></headTop>
      <!--<blank></blank>-->
      <div class="receive">

        <!-- 退货退款换态 1待退款 2已同意,退货中 3已退款 , -->
        <span v-if="orderReturnPO.backStatus == 1">待退款 </span>
        <span v-if="orderReturnPO.backStatus == 2">已同意,退货中 </span>
        <span v-if="orderReturnPO.backStatus == 3">已退款</span>

        <!-- 换货状态 1待换货 2已同意,换货中 3已换货  -->
        <span v-if="orderReturnPO.exchangeStatus == 1">待换货 </span>
        <span v-if="orderReturnPO.exchangeStatus == 2">已同意,换货中 </span>
        <span v-if="orderReturnPO.exchangeStatus == 3">已换货</span>
        <span>{{ goodsList.updateTime }}</span>
      </div>
    </div>

    <!-- 物流部分 -->
    <div class="wl">
      <div class="wl_left">
        <span>{{ status }}总金额</span>
      </div>
      <div class="wl_right">
        <span>¥{{ goodsList.actualPayment }}</span>
      </div>
    </div>

    <div class="block">
      <!-- 单个商品区域 -->

      <div class="box">
        <!-- 头部区域不包含商品信息 -->
        <div class="top">
          <span class="left">
            <span>{{ status }}信息</span>
          </span>
        </div>

        <!-- 商品详情 -->
        <div class="goods" v-for="items in detail" :key="items.id">
          <div class="imgContainer">
            <img :src="items.goodsImage" alt="商品图片" />
          </div>

          <div class="rightInfo">
            <p>{{ items.goodsName }}</p>
            <span class="kg">净含量{{ items.weight }}</span>
          </div>

          <div class="right">
            <span class="s3">
              <span class="t1">¥{{ items.goodsMoney }}</span>
              <span class="t2">数量 {{ items.goodsNum }}</span>
            </span>
          </div>
        </div>

        <div class="refundtime">
          <span>{{ status }}原因：{{ orderReturnPO.reasonText }}</span>
          <span>{{ status }}金额：￥{{ goodsList.actualPayment }}</span>
          <span>申请时间：{{ orderReturnPO.applyTime | timeFilter }}</span>
        </div>
      </div>
    </div>

    <!-- 客服 -->
    <div class="wl" @click="showWaring">
      <div class="wl_center">
        <span>联系客服</span>
      </div>
      <div class="wl_right">
        <img :src="leftarrow" alt="" />
      </div>
    </div>
  </div>
</template> 

<script>
import ajax from "@utils/config";
import { Toast, DatetimePicker } from "mint-ui";
import headTop from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    headTop,
    blank
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "退款详情" },
        rightData: { type: 0, name: "" }
      },
      flag: false, // 选中状态的boolean
      car: require("@/assets/imagea/car.png"),
      dw: require("@/assets/imagea/dw.svg"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      unselect: require("@/assets/imagea/c2.png"),
      selected: require("@/assets/imagea/c1.png"),
      yhq: require("@/assets/imagea/yhq.svg"),
      detail: [],
      goodsList: [],
      orderReturnPO: [],
      status: ""
    };
  },
  methods: {
    getOrderinfoView() {
      ajax({
        url: "order-api-impl/order/getOrderinfoView?id=" + this.$route.query.id,
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.goodsList = response.data ? response.data : {};
            this.detail = this.goodsList.listDetail;
            this.orderReturnPO = this.goodsList.orderReturnPO;
            //改变文字
            if (this.orderReturnPO.backStatus === 1) {
              this.status = "退款";
            } else {
              this.status = "换货";
              this.barText.centerData.name = "换货详情";
            }
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showWaring() {
      Toast("程序猿开发中~");
    }
  },
  mounted() {
    this.getOrderinfoView();
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/refundDetails.scss";
</style>
