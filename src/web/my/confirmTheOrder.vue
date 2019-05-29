<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <headerTop :barType="barType" :barText="barText"></headerTop>
      <blank></blank>
    </div>

    <!-- 默认地址 -->
    <div class="content" @click="$router.push({path:'/my/address',query:{pageType:1}})">
      <div class="c1">
        <img :src="dw" alt="" class="dw" />
        <div class="left">
          <div class="top">
            <span class="s1">{{ defData.name }}</span>
            <span class="phone">{{ defData.phone }}</span>
          </div>
          <div class="addressTest">
            {{ defData.addressDetail }}
          </div>
        </div>
        <div class="right">
          <img :src="leftarrow" alt="" />
        </div>
      </div>
    </div>

    <div class="block">
      <!-- 单个商品区域 -->

      <div class="box" v-for="item in goodList.supplierList" :key="item.spid">
        <!-- 头部区域不包含商品信息 -->
        <div class="top">
          <span class="left">
            <img src="@/assets/imagea/position.png" alt />
            <span class="supplierName">{{ item.supplierName }}</span>
          </span>
        </div>
        <div v-for="i in item.shipWayList">
          <!-- 商品详情 -->
          <div class="goods" v-for="ii in i.goodsList">
            <div class="imgContainer">
              <img class="goodImg" :src="ii.imageAddress" alt="商品图片" />
            </div>

            <div class="padd0_10 rightInfo flex1">
              <p>{{ ii.name }}</p>
              <span class="kg">净含量{{ ii.weight }}</span>
            </div>

            <div class="right">
              <span class="s3">
                <span class="t1">¥{{ ii.price }}</span>
                <span class="t2">数量 {{ ii.num }}</span>
              </span>
            </div>
          </div>

          <!-- 配送及备注信息 -->
          <div class="song">
            <div class="song_top">
              <div class="top_left">
                <span class="p1">配送方式</span>
                <span class="p2">普通配送</span>
              </div>

              <div class="top_right">
                <span class="p1">{{ i.shipWay | shipWayFilter }}</span>
                <span class="p1">{{ i.fee }}</span>
                <div class="lwf">
                  <img :src="leftarrow" alt="" />
                </div>
              </div>
            </div>

            <div class="song_bottom">
              <span class="p1">订单备注</span>
              <input v-model="params.remark" ref="remark" type="text" placeholder="请先与乡村负责人或供应商家沟通" />
            </div>
          </div>
        </div>

        <div class="all">
          <div>
            <span class="cnt">共{{ item.total }}件 合计：</span>
            <span class="s4">¥{{ item.totalMoney }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠卷不要删除 -->
    <!-- 使用优惠券 -->
    <!-- 有优惠 -->
    <!-- <div class="content" v-show="!haveYHQ">
      <div class="yhq">
        <div class="left">
          <img :src="yhq" alt="" class="yhqImg" />
          <span class="s1">可使用优惠券</span>
        </div>

        <div class="right">
          <span>满500-100</span>
          <img
            :src="unselect"
            alt=""
            class="img1"
            v-show="!flag"
            @click="useCard"
          />
          <img
            :src="selected"
            alt=""
            class="img1"
            v-show="flag"
            @click="useCard"
          />
          <img :src="leftarrow" alt="" class="img2" />
        </div>
      </div>
    </div> -->

    <!-- 没有优惠 -->
    <!-- <div class="content" v-show="haveYHQ">
      <div class="yhq">
        <div class="left">
          <img :src="yhq" alt="" class="yhqImg" />
          <span class="s1">无使用优惠券</span>
        </div>

        <div class="right">
          <img :src="leftarrow" alt="" class="img2" />
        </div>
      </div>
    </div> -->

    <!-- 选择帮扶村 -->
    <div class="selecun" @click="$router.push('/my/selectVillage')">
      <div class="seleLeft">
        <span>
          <img :src="dw" alt="" />
        </span>
        <span v-show="!searchRes.address">请选择帮扶村</span>
        <span v-show="searchRes.address">{{ searchRes.address }}</span>
      </div>
      <div class="seleRight">
        <img :src="leftarrow" alt="" />
      </div>
    </div>
    <div style="height: 100px;"></div>
    <!-- 底部功能 -->
    <div class="bottom_pay">
      <div class="total_num">
        <span class="count">共{{ goodList.total }}件</span>
        <span class="">总计</span>
        <span class="total_num_price">￥{{ goodList.totalMoney }}</span>
      </div>
      <div class="sub_btn" @click="submitData">
        提交订单
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from "@utils/config";
import headerTop from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    headerTop,
    blank
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: {
          type: 2,
          name: require("@/assets/imagea/blackup.svg"),
          path: "/my/cart"
        },
        centerData: { type: 0, name: "确认订单" },
        rightData: { type: 0, name: "" }
      },
      allPrice: 0, //总额
      allCount: 0, //总件数
      haveYHQ: false, //有无优惠卷的boolean
      flag: false, // 选中状态的boolean
      dw: require("@/assets/imagea/dw.svg"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      unselect: require("@/assets/imagea/c2.png"),
      selected: require("@/assets/imagea/c1.png"),
      yhq: require("@/assets/imagea/yhq.svg"),
      goodList: [],
      list: [1],
      params: {
        addressId: null,
        listGoodsOrders: [],
        villageId: null,
        map: [],
        mapGoodsMoney: []
      },
      listData: [],
      defData: {}, //默认地址数据
      defId: null,
      searchRes: {} //帮扶村回传地址
    };
  },
  created() {
    let addressId = this.$route.query.addressId;
    this.addressId = addressId ? addressId : "";
  },
  mounted() {
    this.getAllprice();
    this.getaddressList();
    let goodArr = JSON.parse(localStorage.getItem("goodArr"));
    let goodArr2 = JSON.parse(localStorage.getItem("goodArr2"));
    goodArr = goodArr ? goodArr : [];
    goodArr2 = goodArr2 ? goodArr2 : [];
    console.log("goodArr==", goodArr2);
    this.params.list = goodArr;
    goodArr.map(item => {
      this.list.push(item.goodsId);
    });
    this.goodList = goodArr2;
    // 获取回传的帮扶村信息
    console.log("searchRes===", this.$route.query.searchRes);
    if (this.$route.query.searchRes) {
      let searchRes = JSON.parse(this.$route.query.searchRes);
      this.searchRes = searchRes ? searchRes : {};
    }
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
    getGoodsMes() {
      let temp = JSON.parse(localStorage.getItem("list"));
      this.params.list = temp;
      ajax({
        url: "product-api-impl/app/confirmGoodsList",
        optionParams: this.params
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.goodList = res.data ? res.data : [];
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 提交订单
    submitData() {
      this.params.listGoodsOrders = this.params.list;
      this.params.deliveryAddressId = this.params.addressId;
      this.params.villageId = this.searchRes.addressId; //帮扶村 地址回传赋值
      let maps = {},
        mapGoodsMoney = {},
        listGoodsOrders = [];
      this.goodList.supplierList.map(item => {
        let itemData = item.shipWayList;
        itemData.map(ii => {
          listGoodsOrders.push({
            carriageTemplateMoney: String(ii.fee),
            modeOfDistribution: String(ii.shipWay),
            supplierId: item.supplierId,
            remark: ""
          });
          let goodData = ii.goodsList;
          goodData.map(iii => {
            let id = String(iii.id),
              obj1 = {},
              obj2 = {};
            maps[id] = String(iii.num);
            mapGoodsMoney[id] = String(iii.price);
          });
        });
      });

      this.params.map = maps;
      this.params.mapGoodsMoney = mapGoodsMoney;
      this.params.listGoodsOrders = listGoodsOrders;
      ajax({
        url: "order-api-impl/order/addOrderinfo",
        optionParams: this.params
      })
        .post()
        .then(res => {
          console.log("res===", res);
          if (res.code === 200) {
            console.log(res);
            Toast("订单提交成功~");
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取地址列表
    getaddressList() {
      ajax({
        url: "member-api-impl/user/deliveryAddressList",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            let tmp = response.data ? response.data : [],
              isback = 0;
            tmp.map(item => {
              if (this.addressId && item.id == this.addressId) {
                this.defData = item;
                isback = 1;
              } else if (isback == 0) {
                if (item.isDefault == 1) {
                  this.defData = item;
                } else {
                  this.defData = tmp[0];
                }
              }
            });

            this.params.addressId = this.defData.id;
            this.getGoodsMes();
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
    totalPrice(price, num) {
      return (price * num * 1).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/confirmTheOrder.scss";
</style>
