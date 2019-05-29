<template>
  <div class="wrap">
    <!-- 头部导航 -->
    <top :barType="barType" :barText="barText"></top>
    <blank></blank>

    <div class="nav">
      <ul>
        <li v-for="(item, index) in list" @click="selectActive(index, item.status)" :class="[activeIndex === index ? 'default-active' : 'default']"
          :key="index">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div style="height:81px;"></div>
    <!-- 下部内容 -->
    <div ref='wrapper' style="overflow: scroll;-webkit-overflow-scrolling:touch" :style="{height:wrapperHeight+'px'}">
      <mt-loadmore  :bottom-method="loadBottom"   :topMethod="loadtop" :bottom-all-loaded="allLoaded" ref="loadmore"
        @bottom-status-change="handleBottomChange" @top-status-change="handleTopChange" :auto-fill="false">
        <div class="content">
          <!-- 单个商品区域 -->
          <div class="box" v-for="goods in goodsList" @click="
              $router.push({ path: '/orderDetails', query: { id: goods.id } })
            ">
            <!-- 头部区域不包含商品信息 -->
            <div class="top">
              <span class="left">
                <img src="@/assets/imagea/position.png" alt />
                <span>{{goods.villageName }}</span>
              </span>
              <span class="r1">{{ goods.status | orderStatusFilter }}</span>
            </div>

            <!-- 商品详情 -->
            <div class="goods" v-for="item in goods.listDetail" :key="item.name">
              <div class="imgContainer">
                <img :src="item.goodsImage" alt="商品图片" />
              </div>

              <div class="flex1 rightInfo">
                <p>{{ item.goodsName }}</p>
                <span class="kg">{{ item.explains }}</span>
                <span class="kg">净含量 {{ item.weight }}</span>
              </div>

              <div class="right">
                <span class="s3">
                  <span class="t1">¥{{ item.goodsMoney }}</span>
                  <span class="t2">数量 {{ item.goodsNum }}</span>
                </span>
              </div>
            </div>

            <div class="all">
              <span class="jf">爱心积分：{{ goods.integral }}</span>
              <div>
                <span class="cnt">共{{ goods.goodsCount }}件 合计：</span>
                <span class="s4">¥{{ goods.orderMoney |orderTotalNumFilter(goods.shippingFee)}}</span>
              </div>
            </div>

            <div class="bt">
              <ul>
                <!--待收货-->
                <!--订单状态 -1已取消, 0待付款,1待发货,2待收货,4待评价,3已完成、已签收 ,5已评价, 6换货 7 退款-->
                <li v-if='goods.status==2'>
                  <button @click.stop="event(1,goods.id)" class="confirm">确认收货</button>
                </li>
                <li v-if="goods.status == 2">
                  <button @click.stop="event(2, goods.id)" class="extend">
                    延长收货
                  </button>
                </li>
                <li v-if="goods.status == 2">
                  <button @click.stop="event(3, goods.id)" class="view">
                    查看物流
                  </button>
                </li>
                <li v-if="goods.status == 2 || goods.status == 1">
                  <!-- enableReturn为商品是否支持退换货字段 -->
                  <button v-show="goods.enableReturn" @click.stop="event(8, goods.id)" class="buyAgain">
                    申请退款
                  </button>
                </li>
                <!--已完成状态-->
                <li v-if='goods.status==4|| goods.orderReturnPO.exchangeStatus == 3'>
                  <button @click.stop="$router.push({path:'/writeEvaluation',query:{orderId:goods.id}})" class="writeEva">评价</button>
                </li>
                <li v-if="goods.status == -1">
                  <button @click.stop="event(6, goods.id)" class="cancel">
                    删除订单
                  </button>
                </li>
                <li v-if="goods.status == 4">
                  <button @click.stop="event(7, goods.id)" class="cancel">
                    再次购买
                  </button>
                </li>
                <!--待付款状态-->
                <li v-if="goods.status == 0">
                  <button @click.stop="event(4, goods.id)" class="payRightnow">
                    立即付款
                  </button>
                </li>
                <li v-if='goods.status==0'>
                  <button @click.stop="event(5,goods.id)" class="cancel">取消订单</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 底部撑高 -->
        <div class="footpad"></div>
      </mt-loadmore>
    </div>
    <foot></foot>
  </div>
</template>

<script>
import foot from "@/components/footer.vue";
import { MessageBox, Toast, Loadmore } from "mint-ui";
import ajax from "@utils/config";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    foot,
    top,
    blank
  },

  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 0, name: "" },
        centerData: { type: 0, name: "我的订单" },
        rightData: { type: 1, name: "" }
      },
      activeIndex: 0,
      list: [
        {
          id: 1001,
          name: "全部",
          status: ""
        },
        {
          id: 1002,
          name: "待付款",
          status: 0
        },
        {
          id: 1003,
          name: "待发货",
          status: 1
        },
        {
          id: 1004,
          name: "待收货",
          status: 2
        },
        {
          id: 1005,
          name: "待评价",
          status: 4
        }
      ],
      goods: [],
      params: {
        status: "",
        pageIndex: 1,
        pageSize: 5
      },
      goodsList: [], //订单数据
      goodsAllCount: 0,
      goodsAllPrice: 0,
      allLoaded: false,
      wrapperHeight: null,
      pages: null,
      total: 0 //返回总订单数
    };
  },
  created() {
    this.params.status = this.$route.query.type
      ? this.$route.query.type - 1
      : ""; //入口 我的订单直接进 赋值“”  个人中心进 取type-1
    this.getCountAndPrice();
    this.getList();
  },
  mounted() {
    if (this.$route.query.type != undefined) {
      let type = this.$route.query.type;
      this.activeIndex = this.$route.query.iindex;
      this.selectActive(this.activeIndex, type);
    }
    this.wrapperHeight =
      document.documentElement.clientHeight -
      this.$refs.wrapper.getBoundingClientRect().top -
      100;
  },
  methods: {
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    // 下拉操作加载
    loadtop() {
      setTimeout(() => {
        if (this.params.pageSize > 5) {
          this.params.pageSize = 5;
          this.allLoaded = false; //初始化全部加载，否在在此上滑无法更新；
        }
        this.getList();
        this.$refs.loadmore.onTopLoaded();
      }, 1000);
    },
    //上滑加载
    loadBottom() {
      setTimeout(() => {
        if (this.params.pageSize >= this.total) {
          this.allLoaded = true;
          Toast("已加载全部！");
        } else {
          this.params.pageSize += 5;
          this.getList();
        }
        this.$refs.loadmore.onBottomLoaded();
      }, 1000);
    },
    selectActive(index, type) {
      this.activeIndex = index;
      this.params.status = type;
      this.allLoaded = false;
      this.getList();
    },
    getCountAndPrice() {
      var tempAllCount = 0,
        tempAllPrice = 0;
      this.goods.forEach(item => {
        tempAllCount += item.count;
        tempAllPrice += item.count * item.price * 1;
      });
      this.goodsAllPrice = tempAllPrice;
      this.goodsAllCount = tempAllCount;
    },
    event(type, id, data) {
      let popText1,
        popText2,
        msgText,
        iconfont = "";
      if (type == 1) {
        popText1 = "确认后货款将转入卖家账户";
        popText2 = "您是否已签收商品？";
        msgText = "确认成功";
      } else if (type == 2) {
        popText1 = "每笔订单只能延长一次哦";
        popText2 = "确认延长收货时间？";
        msgText = "已延长！";
        iconfont = "iconClass";
      } else if (type == 3) {
        this.$router.push("/logStatus");
        return;
      } else if (type == 4) {
        this.$router.push("/pay");
        return;
      } else if (type == 5) {
        popText1 = "确认取消订单?";
        popText2 = "woo";
        msgText = "操作成功";
      } else if (type == 6) {
        popText1 = "订单删除后将无法恢复";
        popText2 = "您确认删除该订单？";
        msgText = "操作成功";
      } else if (type == 7) {
        popText1 = "商品是否加入购物车";
        popText2 = "您确认该商品加入购物车？";
        msgText = "操作成功";
      } else if (type == 8) {
        popText1 = "申请退款";
        popText2 = "是否申请退款";
        msgText = "操作成功";
      }

      MessageBox.confirm("", {
        title: popText1,
        message: popText2,
        showCancelButton: true
      })
        .then(res => {
          if (res === "confirm") {
            this.$nextTick(() => {
              if (type == 1) {
                this.operat(0, id);
              } else if (type == 2) {
                this.operat(3, id); //延长收货
              } else if (type == 5) {
                // 5取消订单
                this.operat(1, id);
              } else if (type == 6) {
                // 6 删除订单
                this.operat(2, id);
              } else if (type == 7) {
                //7 再次购买
                this.operat(4, id);
              } else if (type == 8) {
                //申请退款
                this.operat(5, id);
              }
            });
          }
        })
        .catch(() => {
          console.log("catch");
        });
    },
    // 获取我的订单数据
    getList() {
      ajax({
        url: "order-api-impl/order/getOrderinfoPageByStatus",
        optionParams: this.params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.goodsList = response.data.records ? response.data.records : [];
            this.total = response.data.total || 0;
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 判断下一页是否有数据
    more() {
      ajax({
        url: "order-api-impl/order/getOrderinfoPageByStatus",
        optionParams: this.params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.goodsList = response.data.records ? response.data.records : [];
            this.pages = response.data.pages;
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 确认订单 0 /order/addOrderinfo  ，取消订单 1 /order/cancelOrderinfo ，删除订单 2  /order/deleteOrderinfo
    // 延长收货 updOrderinfoProlongDate
    operat(type, data) {
      console.log("operat==type=", type);
      let url = "",
        params = {};
      if (type == 0) {
        url = "order-api-impl/order/updateOrderinfoStatus";
        params = { orderId: data, status: 4 }; //确认收货传参 stutas：4
        console.log("operat==222=");
      } else if (type == 1) {
        url = "order-api-impl/order/cancelOrderinfo?id=" + data; //取消订单
        params = { id: data };
      } else if (type == 2) {
        url = "order-api-impl/order/deleteOrderinfo"; //删除订单
        params = { id: data };
      } else if (type == 3) {
        url = "order-api-impl/order/updOrderinfoProlongDate"; //延长收货
        params = { id: data };
      } else if (type == 4) {
        url = "product-api-impl/shopcar/addAndUpdateShopCarRepurchase"; // 再次购买  加入购物车
        params = { orderId: data };
      } else if (type == 5) {
        //申请退款
        this.$router.push({ path: "/applyRefund", query: { id: data } });
      }
      ajax({
        url: url,
        optionParams: params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            if (type == 0) {
              this.$router.push("/confirmGoods");
            } else if (type == 1) {
            } else if (type == 2) {
            } else if (type == 4) {
              Toast("操作成功！");
            }
            this.getList();
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  filters: {
    // 订单总价
    orderTotalNumFilter(goodnum, fee) {
      let Tgoodnum = parseFloat(goodnum),
        Tfee = fee;
      return Tgoodnum * 1 + Tfee;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/myOrder.scss";
.default {
  color: black;
}
.default-active {
  color: #e1212d;
  border-bottom: 1px solid #e1212d;
}
</style>
