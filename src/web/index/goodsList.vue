<template>
  <div class="main">
    <div @keyup.delete="emptyText">
    <top :barType='barType' :seachValue="changeValue" :barText='barText' v-on:inputSub="inputSub" v-on:subSave="subSave"></top>
    <!-- 黄色背景处 --> </div>
    <div class="header"></div>

    <!-- 筛选栏 -->
    <div class="nav">
      <ul>
        <li v-for="(item, index) in navList" @click="selectActive(item,index)" :class='item.type!=0?"defaultActive":"default"'>
          <span>{{ item.name }}</span>
          <img :src="item.src"  class='thirdActive' v-if="item.type==0"/>
          <img :src="item.src2" class='thirdActive' v-if="item.type==1"/>
          <img :src="item.src2" v-if="item.type==2"/>
        </li>
      </ul>
    </div>

    <!-- 商品列表区域 -->
    <div  ref='wrapper' style="overflow: scroll;" :style="{height:wrapperHeight+'px'}">
      <mt-loadmore  :bottom-method="loadBottom"  :topMethod="loadtop" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="handleBottomChange"  @top-status-change="handleTopChange" :auto-fill="false">
        <div class="content">
          <!-- 单个商品区域 -->
          <div class="goods" @click="toNew(i.goodsId)" v-for='i in list'>
            <div class="imgContainer">
              <!--<img src="@/assets/imagea/goods.png" alt="商品图片" />-->
              <img class="goodsImg" :src="i.imageAddress" alt="商品图片" />
            </div>

            <div class="rightInfo">
              <p>{{i.goodsName}}</p>
              <span class="kg">{{i.explains}}</span>
              <div class="tips">
                <!-- <span>{{i.niceCommentRate}}折</span> -->
                <!--<span >{{i.niceCommentRate|niceCommentRateFilter}}折</span>-->
              </div>
              <div class="bottom">
                <span class="s1">
                  ¥{{i.price}}
                  <span class="s2">{{i.totalCommentCount}}人付款</span>
                </span>
                <img src="@/assets/imagea/addTo.svg" alt="购物车按钮图片" @click.stop="yo(i)"/>
              </div>
            </div>
          </div>
        </div>
      </mt-loadmore>
    </div>
    </div>
  </div>
</template>

<script>
import { Toast, Loadmore } from "mint-ui";
import ajax from "@utils/config";
import top from "@/components/header2.vue";
export default {
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 3, name: "输入搜索关键词 商品/服务/乡村" },
        rightData: { type: 1, name: require("@/assets/imagea/msgimg.svg") }
      },
      activeIndex: 0,
      list: {},
      total: 0,
      navList: [
        {
          id: 1001,
          name: "综合",
          type: 1,
          src: require("@/assets/imagea/goodslist/lower.svg"),
          src2: require("@/assets/imagea/goodslist/lowerr.svg")
        },
        {
          id: 1002,
          name: "销量",
          type: 0,
          src: require("@/assets/imagea/goodslist/list.svg"),
          src2: require("@/assets/imagea/goodslist/listr.svg")
        },
        {
          id: 1003,
          name: "价格",
          type: 0,
          src: require("@/assets/imagea/goodslist/list.svg"),
          src2: require("@/assets/imagea/goodslist/listr.svg")
        }
        // {
        //   id: 1004,
        //   name: "筛选",
        //   type:0,
        //   src: require("@/assets/imagea/goodslist/funnel.svg"),
        //   src2: require("@/assets/imagea/goodslist/funnelr.svg")
        // }
      ],

      params: {
        pageIndex: 1,
        pageSize: 10,
        goodsName: "",
        goodsPrice: 0, //价格排序 1升序 2降序 0默认
        saleCount: 0, //销量排序 1升序 2降序 0默认
        selectHotGoods:0, // 0否 1是热销商品;
      },
      allLoaded: false,
      wrapperHeight: null,
      pages: null,
      changeValue: ""
    };
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    // let val = this.$route.query.val;
    let val = localStorage.getItem("val")
    let type = localStorage.getItem("selectHotGoods")*1; //若local不存在selectHotGoods 会自动转为0
    if(type != 0){
        this.params.selectHotGoods = type;
    }
    if(val != null){
       this.inputSub(val);  
       this.changeValue = val; 
    }
    
  },
  methods: {
    emptyText() {
      //删除文字触发清空列表，则顺便清空localstorage反之干扰下一次搜索
      this.list = null;
      localStorage.setItem("val","");
      this.params.goodsName = "";  //清空params中的商品名，否则点击帅选。会继续显示前面搜索的内容
      localStorage.setItem("selectHotGoods",0)
      this.params.selectHotGoods = 0;
    },
    yo(data) {
      let goodsId, supplierId;
      goodsId = data.goodsId;
      supplierId = data.supplierId;
      // goodsId = parseInt(data.goodsId);
      // supplierId = parseInt(data.supplierId);
      ajax({
        url: "product-api-impl/shopcar/addAndUpdateShopCar",
        optionParams: {
          goodsId: goodsId,
        //   goodsNum: 1,
          supplierId: supplierId
        }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            Toast({
              message: "加入购物车成功"
            });
            console.log(response);
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectActive(item, index) {
      // this.activeIndex = index;
      this.allLoaded = false;
      this.navList.map(itemData => {
        if (itemData != item) {
          itemData.type = 0;
        }
      });

      if (index == 0) {
        this.params.goodsPrice = 0;
        this.params.saleCount = 0;
        item.type = 1;
      } else if (index == 1) {
        //销量
        this.params.goodsPrice = 0;
        // this.params.saleCount=0;

        if (item.type == 0) {
          item.type = 1;
          this.params.saleCount = 1;
        } else if (item.type == 1) {
          item.type = 2;
          this.params.saleCount = 2;
        } else {
          item.type = 0;
          this.params.saleCount = 0;
        }
      } else if (index == 2) {
        //价格
        // this.params.goodsPrice=0;
        this.params.saleCount = 0;

        if (item.type == 0) {
          item.type = 1;
          this.params.goodsPrice = 1;
        } else if (item.type == 1) {
          item.type = 2;
          this.params.goodsPrice = 2;
        } else {
          item.type = 0;
          this.params.goodsPrice = 0;
        }
      }
      if(this.params.selectHotGoods == 1 ){
        //热销状态
        //   默认热销商品只传selectHotGoods等于1，不穿goodsname
          this.getGoodslist();
      }else{
        //   防止非热销状态未输入内容直接出结果
          if(this.params.goodsName){
          this.getGoodslist();   
          }
      }
    },
    toNew(id) {
      this.$router.push({ path: "/index/detail", query: { id: id } });
    },
    getGoodslist() {
      ajax({
        url: "product-api-impl/app/goodsList",
        optionParams: this.params
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.list = response.data.GoodsList ? response.data.GoodsList : [];
            if (this.list.length === 0) {
              Toast("不存在此商品");
            }
            this.total = response.data.total;
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 顶部定好输入框值
    inputSub(val) {
      //每触发一次搜索，将数据覆盖之前的搜索val
      localStorage.setItem("val", val)
      if (val != undefined && val != "") {
          if(this.params.selectHotGoods == 1){ 
              //热销商品的selectHotGoods =1
              this.params.goodsName = ""
          }else{
              this.params.goodsName = val;
          }
        this.getGoodslist();
      }
    },
    subSave() {
      this.$router.push("/message");
    },
    handleTopChange(status) {
      this.topStatus = status;
      // console.log("this.handleTopChange==",this.topStatus);
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
      // console.log("this.bottomStatus==",this.bottomStatus);
    },
    loadtop() {
      setTimeout(() => {
        if(this.params.pageSize>10){
            this.params.pageSize = 10;
            this.allLoaded = false; //初始化全部加载，否在在此上滑无法更新；
        }
        this.getGoodslist();
        this.$refs.loadmore.onTopLoaded();
      }, 1000);
    },
    loadBottom() {
      setTimeout(() => {
        if (this.params.pageSize >= this.total) {
          this.allLoaded = true;
          Toast("已加载全部！")
        } else {
           this.params.pageSize +=10;
           this.getGoodslist();
        }
        this.$refs.loadmore.onBottomLoaded();
      }, 1000);
    },
    newMessage() {
      //获取未读消息数量来显示图标
      ajax({
        url: "member-api-impl/message/getMessageListByUserId",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            let unreadCount = response.data ? response.data[0].unreadCount : {};
            if (unreadCount != 0) {
              this.barText.rightData.name = require("@/assets/imagea/unlook.svg");
            }
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    // this.getGoodslist();
    this.newMessage();
  },
  components: {
    top
  }
};
</script> 

<style lang="scss" scoped>
@import "./scss/goodsList.scss";
.default {
  color: black;
}
.defaultActive {
  color: #df0715;
}
.thirdActive {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* Internet Explorer */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
  -o-transform: rotate(180deg); /* Opera */
}
</style>
