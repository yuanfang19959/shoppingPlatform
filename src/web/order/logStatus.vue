<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>
    <div class="clear"></div>
    <div class="content">
      <div v-for='item in detailList'>
        <img :src="item.goodsImage" alt="" />
        <p>{{item.goodsName}}</p>
      </div>
      <div class="contbottom">
        <span class="s1">已签收</span>
        <span class="s2">包裹签收</span>
      </div>
    </div>

    <div class="content2">
      <div class="cont">
        <img :src="pro" alt="" />
        <div class="contLeft">
          <span class="s1">{{expressVO.expressName}}</span>
          <span class="s2">官方电话 <a :href="'tel:' + this.phone">{{expressVO.expressPhone}}</a>
            <img :src="leftarrow" alt="" /></span>
        </div>
      </div>

      <div class="contbt">
        <span class="s3">
          {{expressVO.expressName}}
          <span id="foo">{{ orderInfo.expressTicket }}</span>
        </span>
        <img :src="copy" alt="" />
        <span class="s4 btn" data-clipboard-target="#foo" @click="copyT">复制</span>
      </div>
    </div>

    <!-- 物流信息 -->
    <div class="wl">
      <!-- 地址 -->
      <div class="address">
        <img :src="shouhuo" alt="" />
        <div class="addressleft">
          <p>收货地址：{{orderInfo.receiveAddress}}</p>
        </div>
      </div>

      <div class="cell" v-if='tracesList[0]'>
        <div class="cleft">
          <span class="s1">{{tracesList[0].acceptDay}}</span>
          <span class="s2">{{tracesList[0].acceptHour}}</span>
          <div class="bg">
            <img :src="gou" alt="" v-if='tracesList[0].acceptType==6' />
            <img :src="paisr" alt="" v-if='tracesList[0].acceptType==5' />
            <img :src="yunshur" alt="" v-if='tracesList[0].acceptType==4' />
            <img :src="lanjian" alt="" v-if='tracesList[0].acceptType==3' />
            <img :src="fahuor" alt="" v-if='tracesList[0].acceptType==2' />
            <img :src="xiadanr" alt="" v-if='tracesList[0].acceptType==1' />
          </div>
        </div>
        <div class="cright">
          <span>{{tracesList[0].acceptTypeStr}}</span>
          <p v-for='item in tracesList[0].childTracesList' v-text='item.acceptStation'></p>
        </div>
      </div>
      <span class="bts" @click="flag=true" v-show="!flag">点击查看更多详情<img :src="circleb" alt="" /></span>

      <!-- 影藏的物流信息 -->
      <div class="flagShow" v-show="flag" v-if='tracesList[1]'>
        <div class="cell">
          <div class="cleft">
            <span class="s1">{{tracesList[1].acceptDay}}</span>
            <span class="s2">{{tracesList[1].acceptHour}}</span>
            <div class="bg">
              <img :src="paisr" v-show="!flag" alt="" />
              <img :src="pais" v-show="flag" alt="" />
            </div>
          </div>
          <div class="cright">
            <span>{{tracesList[1].acceptTypeStr}}</span>
            <p v-for='item in tracesList[1].childTracesList' v-text='item.acceptStation'></p>
          </div>
        </div>

        <div class="cell" v-if='tracesList[2]'>
          <div class="cleft">
            <span class="s1">{{tracesList[2].acceptDay}}</span>
            <span class="s2">{{tracesList[2].acceptHour}}</span>
            <div class="bg">
              <img :src="yunshur" v-show="!flag" alt="" />
              <img :src="yunshu" v-show="flag" alt="" />
            </div>
          </div>
          <div class="cright">
            <span>{{tracesList[2].acceptTypeStr}}</span>
            <p v-for='item in tracesList[2].childTracesList' v-text='item.acceptStation'></p>
          </div>
        </div>

        <div class="cell" v-if='tracesList[3]'>
          <div class="cleft">
            <span class="s1">{{tracesList[3].acceptDay}}</span>
            <span class="s2">{{tracesList[3].acceptHour}}</span>
            <div class="bg">
              <img :src="lanjianred" v-show="!flag" alt="" />
              <img :src="lanjian" v-show="flag" alt="" />
            </div>
          </div>
          <div class="cright">
            <span>{{tracesList[3].acceptTypeStr}}</span>
            <p v-for='item in tracesList[3].childTracesList' v-text='item.acceptStation'></p>
          </div>
        </div>

        <div class="cell" v-if='tracesList[4]'>
          <div class="cleft">
            <span class="s1">{{tracesList[4].acceptDay}}</span>
            <span class="s2">{{tracesList[4].acceptHour}}</span>
            <div class="bg">
              <img :src="fahuor" v-show="!flag" alt="" />
              <img :src="fahuo" v-show="flag" alt="" />
            </div>
          </div>
          <div class="cright">
            <span>{{tracesList[4].acceptTypeStr}}</span>
            <p v-for='item in tracesList[4].childTracesList' v-text='item.acceptStation'></p>
          </div>
        </div>

        <div class="cell" v-if='tracesList[5]'>
          <div class="cleft">
            <span class="s1">{{tracesList[5].acceptDay}}</span>
            <span class="s2">{{tracesList[5].acceptHour}}</span>
            <div class="bg">
              <img :src="xiadanr" v-show="!flag" alt="" />
              <img :src="xiadan" v-show="flag" alt="" />
            </div>
          </div>
          <div class="cright">
            <span>{{tracesList[5].acceptTypeStr}}</span>
            <p>{{tracesList[5].acceptStation}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 窗口 -->
    <div class="alertbox" v-show="alrFlag">
      <img :src="suc" alt="" />
      <span>已复制到剪贴板</span>
    </div>
  </div>
</template>

<script>
import Vue from "Vue";
import { Toast, Popup } from "mint-ui";
import ajax from "@utils/config";
import Clipboard from "clipboard"; //复制内容插件
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
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "物流详情" },
        rightData: { type: 0, name: "" }
      },
      copyNumber: "4185646874684678",
      alrFlag: false,
      flag: false,
      suc: require("@/assets/imagea/sh/suc.svg"),
      lanjian: require("@/assets/imagea/sh/lanjian.svg"),
      lanjianred: require("@/assets/imagea/sh/lanjianred.svg"),
      fahuo: require("@/assets/imagea/sh/fahuo.svg"),
      fahuor: require("@/assets/imagea/sh/fahuor.svg"),
      pais: require("@/assets/imagea/sh/pais.svg"),
      paisr: require("@/assets/imagea/sh/paisr.svg"),
      xiadan: require("@/assets/imagea/sh/xiadan.svg"),
      xiadanr: require("@/assets/imagea/sh/xiadanr.svg"),
      yunshu: require("@/assets/imagea/sh/yunshu.svg"),
      yunshur: require("@/assets/imagea/sh/yunshured.svg"),

      circleb: require("@/assets/imagea/circleb.svg"),
      gou: require("@/assets/imagea/gou.svg"),
      shouhuo: require("@/assets/imagea/shouhuo.svg"),
      copy: require("@/assets/imagea/copy.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      blackup: require("@/assets/imagea/blackup.svg"),
      pro: require("@/assets/imagea/meat.png"),
      phone: 12306,
      goodList: [
        {
          spid: 1,
          place: "西湖区",
          spname: "烟台大樱桃车厘子两斤 新鲜党纪水果 两件包邮",
          kg: "1000",
          price: 180,
          count: 2,
          pic: require("@/assets/imagea/meat.png")
        }
      ],
      orderId: "",
      detailList: [], //商品详情
      expressVO: [], //快递公司信息
      orderInfo: [], //订单信息
      tracesList: [] //包裹详情轨迹
    };
  },
  mounted() {},
  created() {
    // this.orderId= 28;
    this.orderId = this.$route.query.orderId;
    this.getpagelist();
  },
  methods: {
    change() {
      this.flag = true;
    },
    copyT() {
      let clipboard = new Clipboard(".btn"); //注意要使用let或者const，不能使用var，否则会出现复制次数叠加的问题，即复制不止一次。
      //因为var是全局变量，let和const是局部
      clipboard.on("success", e => {
        // Toast("已复制到剪贴板");
        this.alrFlag = !this.alrFlag;
        clipboard.destroy(); //使用destroy可以清楚缓存
      });
      clipboard.on("error", e => {
        alert("failed");
        clipboard.destroy();
      });
    },
    getpagelist() {
      ajax({
        url: "order-api-impl/express/getOrderTraces",
        optionParams: { orderId: this.orderId }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            // this.balance = response.data.balance;
            (this.detailList = response.data.detailList
              ? response.data.detailList
              : []), //商品详情
              (this.expressVO = response.data.expressVO
                ? response.data.expressVO
                : {}), //快递公司信息
              (this.orderInfo = response.data.orderInfo
                ? response.data.orderInfo
                : {}); //订单信息
            this.tracesList = response.data.tracesList
              ? response.data.tracesList
              : []; //包裹详情轨迹
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    alrFlag(a, b) {
      setTimeout(
        function() {
          this.alrFlag = false;
          console.log(this.alrFlag);
        }.bind(this),
        2500
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/logStatus.scss";
//禁止选中时高亮
span {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent; /* For some Androids */
}
.alertbox {
  margin: auto;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  background: rgba(38, 38, 38, 0.4);
  border-radius: 20px;
  font-size: 30px;
  font-family: SourceHanSansCN-Regular;
  font-weight: 400;
  color: #fff;
  padding: 71px 0;
  width: 436px;

  text-align: center;
  img {
    vertical-align: sub;
  }
}
</style>
