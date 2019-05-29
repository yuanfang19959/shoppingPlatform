<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText'></top>
      <div class="receive">
        <span>{{goodsData.status|orderStatusFilter}}</span>
        <span class="s2" v-if="goodsData.status==0">剩余6个小时自动取消</span>
        <span class="s2" v-else v-show="goodsData.remainderDays">剩余{{ goodsData.remainderDays}}天自动确认</span>
      </div>
    </div>

    <div class="clear"></div>
    <!-- 物流部分 -->
    <div class="wl">
      <div class="wl_left" @click="$router.push('/logStatus')">
        <img :src="car" alt="" />
        <span>物流状态物流状态物流状态</span>
      </div>
      <div class="wl_right">
        <img :src="leftarrow" alt="" />
      </div>
    </div>

    <!-- 默认地址 -->
    <div class="content" @click='editAddr'>
      <div class="c1">
        <img :src="dw" alt="" class="dw" />
        <div class="left">
          <div class="top">
            <span class="s1">{{goodsData.consigneeName }}</span>
            <span class="phone">{{goodsData.consigneePhone }}</span>
          </div>
          <div class="addressTest">
            {{goodsData.receiveAddress}}
          </div>
        </div>
        <div class="right">
          <img :src="leftarrow" alt="" />
        </div>
      </div>
    </div>

    <div class="block">
      <!-- 单个商品区域 -->

      <div class="box" v-for="item in goodsData.listDetail" :key="item.spid">
        <!-- 头部区域不包含商品信息 -->
        <div class="top">
          <span class="left">
            <img src="@/assets/imagea/position.png" alt />
            <span>{{ goodsData.sellName }}</span>
          </span>
        </div>

        <!-- 商品详情 -->
        <div class="goods">
          <div class="imgContainer goodsimg">
            <img :src="item.goodsImage" alt="商品图片" />
          </div>

          <div class="rightInfo">
            <p>{{ item.goodsName }}</p>
            <span class="kg" v-if="item.weight">净含量{{item.weight }}</span>
          </div>

          <div class="right">
            <span class="s3">
              <span class="t1">¥{{ item.goodsMoney}}</span>
              <span class="t2">数量 {{ item.goodsNum }}</span>
            </span>
          </div>
        </div>

        <!-- 配送及备注信息 -->
        <div class="song">
          <div class="song_top">
            <span class="p1">商品总价</span>
            <span class="p2">¥{{item.goodsMoney|goodsTotalMoneyFilter(item.goodsNum)}}</span>
          </div>

          <div class="song_top">
            <span class="p1">运费</span>
            <span class="p2">¥{{goodsData.shippingFee }}</span>
          </div>
          <div class="song_middle">
            <span class="">订单总价</span>
            <span class="">¥{{item.goodsMoney|orderTotalNumFilter(item.goodsNum,goodsData.shippingFee)}}</span>
          </div>
          <div class="song_bottom">
            <span class="p1">实付款</span>
            <span class="p2" v-if="goodsData.actualPayment">¥{{goodsData.actualPayment }}</span>
            <span class="p2" v-else>未支付</span>
          </div>
        </div>

      </div>
    </div>

    <!-- //包括订单时间 -->
    <div class="orderDetails">
      <span class="title">
        订单信息
      </span>
      <div class="time">
        <span>公益积分：</span>
        <span>{{goodsData.integral}}</span>
      </div>

      <div class="time">
        <span>订单编号：</span>
        <span>{{goodsData.orderNumber}}</span>
        <span class="copy">复制</span>
      </div>

      <div class="time">
        <span>创建时间：</span>
        <span>{{goodsData.createTime}}</span>
      </div>

      <div class="time">
        <span>付款时间：</span>
        <span>{{goodsData.paymentTime}}</span>
      </div>

      <div class="time">
        <span>发货时间：</span>
        <span>{{goodsData.shipmentsTime }}</span>
      </div>
    </div>

    <!-- 客服 -->
    <div class="wl" v-show='false'>
      <div class="wl_center">
        <span>联系客服</span>
      </div>
      <div class="wl_right">
        <img :src="leftarrow" alt="" />
      </div>
    </div>

    <div class="blankspace"></div>
    <!-- 底部区域 -->
    <div class="bottom">
      <ul class="bottomList">
        <!--订单状态 -1已取消, 0待付款,1待发货,2待收货,4待评价,3已完成、已签收 ,5已评价, 6换货 7 退款-->

        <li @click='extendOrder(-1)' v-if='goodsData.status==-1'>删除订单</li>
        <!---1 删除订单 0 修改地址 1 取消订单 2 付款 3 待发货  5 确认收货 6 延长收货  7 换货中 8 退货中 -->
        <li @click='extendOrder(0)' v-if='goodsData.status==0'>修改地址</li>
        <li @click='extendOrder(1)' v-if='goodsData.status==0'>取消订单</li>
        <li @click='extendOrder(2)' v-if='goodsData.status==0'>付款</li>

        <li @click='extendOrder(3)' v-if='goodsData.status==1'>待发货</li>
        <!--<li @click='extendOrder(4)' >申请退款</li>-->

        <li @click='confirmOrder(5)' v-if='goodsData.status==2'>确认收货</li>
        <li @click='extendOrder(6)' v-if='goodsData.status==2'>延长收货</li>

        <li @click='extendOrder(7)' v-if='goodsData.status==6'>换货中</li>

        <li @click='extendOrder(8)' v-if='goodsData.status==7'>退货中</li>
        <li @click="$router.push({path:'/logStatus', query: { orderId: goodsData.id}})" v-if='goodsData.status==4||goodsData.status==5||goodsData.status==2'>查看物流</li>
        <li @click='isShow=!isShow' class="moreItem" v-show="goodsData.status==1||goodsData.status==2||goodsData.status==3">
          <span>更多</span>
          <!--更多弹框-->
          <div class="morePopup" v-show='isShow'>
            <ul class="morePopupList">
              <li v-if='goodsData.status==3' @click="$router.push({ path: '/my/invoice', query: { id: goodsData.id,orderData:JSON.stringify(goodsData)}})">申请开票</li>
              <li v-if="goodsData.status ==1 || goodsData.status ==2 || goodsData.status ==3   " @click='exChange(1)'>申请退款</li>
              <li v-if="goodsData.status ==1 || goodsData.status ==2 || goodsData.status ==3  " @click='exChange(2)'>申请换货</li>
            </ul>
            <div class="morePopup_bottom" v-if='goodsData.status==3||this.isExchange'>
              <div class="triangle_topright"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { Toast, Popup } from "mint-ui";
import ajax from "@utils/config";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    top,
    blank
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: {
          type: 2,
          name: require("@/assets/imagea/blackup.svg"),
          path: "/order"
        },
        centerData: { type: 0, name: "订单详情" },
        rightData: { type: 1, name: "" }
      },
      status: "",
      allPrice: 0, //总额
      allCount: 0, //总件数
      haveYHQ: false, //有无优惠卷的boolean
      flag: false, // 选中状态的boolean
      car: require("@/assets/imagea/car.png"),
      dw: require("@/assets/imagea/dw.svg"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      unselect: require("@/assets/imagea/c2.png"),
      selected: require("@/assets/imagea/c1.png"),
      yhq: require("@/assets/imagea/yhq.svg"),
      isShow: false,
      goodList: [],
      goodsData: {}, //
      isExchange: true
    };
  },
  created() {
    let id = this.$route.query.id;
    this.getpagelist(id);
  },
  mounted() {
    this.getAllprice();
  },
  methods: {
    getAllprice() {
      //计算总额
      var temp_sum = 0,
        temp_count = 0;
      this.goodList.forEach(item => {
        temp_sum += item.count * item.price;
        temp_count += item.count;
      });
      this.allPrice = temp_sum;
      this.allCount = temp_count;
    },
    useCard() {
      // 使用优惠券的时候
      // 这边后面需要根据优惠券的使用条件来使用优惠
      if (!this.flag) {
        this.allPrice = this.allPrice - 100;
      } else {
        this.allPrice = this.allPrice + 100;
      }
      this.flag = !this.flag;
    },
    getpagelist(id) {
      ajax({
        url: "order-api-impl/order/getOrderinfoView?id=" + id,
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.goodsData = response.data ? response.data : {};

            if (this.$route.query.OrderAddrData) {
              let addrData = this.$route.query.OrderAddrData;
              addrData = JSON.parse(this.$route.query.OrderAddrData);
              addrData = addrData ? addrData : {};
              this.goodsData.consigneeName = addrData.name;
              this.goodsData.consigneePhone = addrData.phone;
              this.goodsData.receiveAddress = addrData.addressDetail;
            }
            this.goodsData.listDetail.map(item => {
              //订单多商品情况，如果有一件商品不能退。则整个订单不能退款退货
              if (!item.isExchange) {
                return (this.isExchange = false);
              }
            });
            console.log("11111");
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 确认订单
    confirmOrder() {
      ajax({
        url: "order-api-impl/order/addOrderinfo",
        optionParams: {}
      })
        .post()
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
    },
    // 延长收货
    extendOrder(type) {
      // -1 删除订单 0 修改地址 1 取消订单 2 付款 3 待发货  5 确认收货 6 延长收货  7 换货中 8 退货中
      let url,
        data,
        orderId = parseInt(this.goodsData.id);
      if (type == -1) {
        url = "order/deleteOrderinfo";
        data = { id: orderId };
      } else if (type == 0) {
        this.$router.push({
          path: "/my/address",
          query: { pageType: 2, orderId: orderId }
        });
        // return;
      } else if (type == 1) {
        url = "order/cancelOrderinfo?id=" + orderId;
        data = {};
      } else if (type == 2) {
        this.$router.push({ path: "/pay", query: { goodsData: orderId } });
        return;
      } else if (type == 3) {
      } else if (type == 4) {
      } else if (type == 5) {
        url = "order/updateOrderinfoStatus";
        data = {
          orderId: orderId,
          status: 4
        };
      } else if (type == 6) {
        url = "order/updOrderinfoProlongDate?id=" + orderId;
        data = {};
      } else if (type == 7) {
      } else if (type == 8) {
      }
      // 判断是否需要请求数据
      if (type != 0) {
        ajax({
          url: "order-api-impl/" + url,
          optionParams: data
        })
          .post()
          .then(response => {
            if (response.code === 200) {
              let msgText = "操作成功";
              Toast(response.msg);
              if (type == -1) {
                msgText = "删除成功";
                this.$router.push("/order");
              } else {
                this.getpagelist();
              }
              Toast(msgText);
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //检测是否支持退换货
    exChange(type) {
      //   type 1退款 2换货
      console.log(this.isExchange);
      if (this.isExchange) {
        console.log(this.isExchange);
        if (type == 1) {
          this.$router.push({
            path: "/applyRefund",
            query: { id: this.$route.query.id }
          });
        } else {
          this.$router.push({
            path: "/exchangeGoods",
            query: { id: this.$route.query.id }
          });
        }
      } else {
        Toast("此商品不支持退换货！");
      }
    },
    // 修改收货地址
    editAddr() {}
  },
  filters: {
    // 订单总价
    orderTotalNumFilter(goodnum, num, fee) {
      let Tgoodnum = parseFloat(goodnum),
        Tnum = parseFloat(num),
        Tfee = fee;
      return Tgoodnum * Tnum + Tfee;
    },
    // 商品总价
    goodsTotalMoneyFilter(goodnum, num) {
      console.log("goodnum==", goodnum, num);
      let Tgoodnum = parseFloat(goodnum),
        Tnum = parseFloat(num);
      return Tgoodnum * Tnum;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/orderDetails.scss";
</style>
