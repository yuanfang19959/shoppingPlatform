<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType="barType" :barText="barText"></top>
      <blank></blank>
    </div>

    <div class="content">
      <!-- 单个商品区域 -->
      <div class="box" v-for="item in returnList" :key="item.orderId">
        <!-- 头部区域不包含商品信息 -->
        <div class="top">
          <span class="left">
            <img src="@/assets/imagea/position.png" alt />
            <span v-for="it in item.detailList">{{it.goodsAddress}}</span>
          </span>
        </div>

        <!-- 商品详情 -->
        <div class="goods" v-for="items in item.detailList" :key="items.id">
          <div class="imgContainer">
            <img :src="items.goodsImage" alt="商品图片" />
          </div>

          <div class="rightInfo">
            <p>{{ items.goodsName }}</p>
            <span class="kg" v-if="item.weight">净含量{{ items.weight }}</span>
            <!--<span class="kg" v-if="item.weight">净含量{{ items.weight }}千克</span>-->
          </div>

          <div class="right">
            <span class="s3">
              <span class="t1">¥{{ items.goodsMoney }}</span>
              <span class="t2">数量 {{ items.goodsNum }}</span>
            </span>
          </div>
        </div>

        <div class="all">
          <span class="jf" v-if="item.returnType === 1">退货退款</span>
          <span class="jf" v-else>换货状态</span>

          <!-- 退货退款换态 1待退款 2已同意,退货中 3已退款 , -->
          <span class="tk" v-if="item.refundStatus == 1">待退款 </span>
          <span class="tk" v-if="item.refundStatus == 2">已同意,退货中 </span>
          <span class="tk" v-if="item.refundStatus == 3">已退款</span>

          <!-- 换货状态 1待换货 2已同意,换货中 3已换货  -->
          <span class="tk" v-if="item.exchangeStatus == 1">待换货 </span>
          <span class="tk" v-if="item.exchangeStatus == 2">已同意,换货中 </span>
          <span class="tk" v-if="item.exchangeStatus == 3">已换货</span>
        </div>

        <div class="bt">
          <ul>
            <li>
              <button @click=" $router.push({ path: '/refundDetails',query: { id: item.orderId }})">
                查看详情
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="load" v-show="loading" >
      <span>加载中</span>
      <img src="@/assets/imagea/load.gif" alt="" />
    </div>

    <div class="bottomText">
      <span v-show="isLoadAll">别再拉了，到底了</span>
    </div>
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast } from "mint-ui";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import { setInterval } from "timers";
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
        centerData: { type: 0, name: "退款售后" },
        rightData: { type: 1, name: "" }
      },
      returnList: [],
      ischecked: false,
      flag: false,
      nameF: "zzb",
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      deleteP: require("@/assets/imagea/delete.svg"),
      sreach: require("@/assets/imagea/my/search.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      garbage: require("@/assets/imagea/my/garbage.svg"),
      activeIndex: 1, //第几页
      pages: null, //总页数
      loading: false,   //显示加载gif
      isLoadAll: false //是否加载全部
    };
  },
  methods: {
    //   获取退换货包括退款列表
    getBuyerReturnOrderList() {
      ajax({
        url: "order-api-impl/orderReturn/getBuyerReturnOrderList",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.returnList = response.data ? response.data.records : {};
            this.pages = response.data.pages ? response.data.pages : {};
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // getScroll(){
    //       return {
    //         //   left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    //           top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    //       };
    //   },
    //上来加载新数据
    onScroll() {
      //可滚动容器的高度
      let innerHeight = document.querySelector(".content").clientHeight; //屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight; //可滚动容器超出当前窗口显示范围的高度 
    //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 //解决不同浏览器的兼容性
      console.log(innerHeight + " " + outerHeight + " " + scrollTop);
      if (innerHeight < outerHeight + scrollTop) {
        //加载更多操作
        console.log("loadmore");

        if (this.activeIndex < this.pages) {
          //当前页数小于总页数，进行加载
          this.activeIndex++;
          ajax({
            url: "order-api-impl/orderReturn/getBuyerReturnOrderList",
            optionParams: {
              pageIndex: this.activeIndex,
              pageSize: 10
            }
          })
            .post()
            .then(response => {
              if (response.code === 200) {
                this.temp = response.data ? response.data.records : {}; //新请求的数据
                this.loading = true; //显示加载提示库
                setInterval(() => {
                  this.loading = false; //隐藏加载弹框
                }, 600);
                this.returnList = this.returnList.concat(this.temp); 
                console.log(this.returnList);
              } else {
                console.log(response);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.isLoadAll = true;
        }
      }
    }
  },
  created() {
    this.getBuyerReturnOrderList();
    window.addEventListener("scroll", this.onScroll); //监听屏幕滚动的距离
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/refund.scss";
</style>
