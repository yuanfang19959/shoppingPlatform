<template>
  <div class="mainCon">
    <div class="bannerShow">
      <!--<img class="blackup" :src="blackup" alt="" @click="$router.go(-1)" />
      <span class="center_1">全部评价</span>-->
      <top :barType="barType" :barText="barText"></top>
      <blank></blank>
    </div>

    <div class="clear"></div>

    <!-- 上面的小tips 暂时不支持 -->
    <!--<div class="tips" :class="flag ? 'extend' : 'small'">
      <ul>
        <li
          v-for="(i, index) in toplist"
          :key="i.id"
          :class="i.topFlag ? 'redH' : 'blackH'"
          @click="modify(index)"
        >
          {{ i.name }}
        </li>
      </ul>
      <div v-show="showPic">
        <img :src="down" alt="" @click="change" v-show="!flag" class="arrow" />
        <img :src="top" alt="" @click="change" v-show="flag" class="arrow2" />
      </div>
    </div>-->

    <!-- 评论区域 -->
    <div class="app">
      <div class="all" v-for="(i, index) in commentDetailList" :key="i.id">
        <div class="evalua">
          <div class="evaRight">
            <img :src="hed" alt="" />
          </div>

          <div class="evaLeft">
            <span class="s1">{{ i.nickname }}</span>
            <span class="s2">{{ i.createTime|formatDate}} </span>
            <span class="s3">{{ i.content }}</span>
          </div>
        </div>
        <div class="bottom">
          <!-- <span>浏览{{ i.look }}次</span> -->

          <!-- 点赞，先保留 请勿删除 -->
          <!-- <div class="bottom_left" @click="zanFunc(index)">
            <img :src="zan" alt="" v-show="!i.zanFlag" />
            <img :src="zanr" alt="" v-show="i.zanFlag" />
            <span :class="[i.zanFlag ? 'red' : 'black']">{{ i.zanC }}</span>
          </div> -->
        </div>
      </div>
    </div>

    <div style="height: 120px;"></div>
    <div class="page_btn">
      <ul class="flexbox">
        <li class="flex1 customerService" @click="goCustomerService">
          <img :src="detail_btn" alt="" />
          <div class="btn_text">客服</div>
        </li>
        <li class="flex1 collectionBtn" @click="collectionBtn">
          <img v-if="!isCollection" :src="detail_btn2" alt="" />
          <img v-else :src="detail_btn2H" alt="" />
          <div class="btn_text">收藏</div>
        </li>
        <li>
          <div class="page_end_btn">
            <span class="cart_btn cartBtnCover"  @click="addtoCar">
              加入购物车
            </span>
            <span class="now_pay" @click="nowPay">
            <!--<span class="now_pay" @click="$router.push({path:'/confirmTheOrder',query:{id:$route.query.id }})">-->
              立即购买
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast } from "mint-ui";
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
        centerData: { type: 0, name: "全部评价" },
        rightData: { type: 1, name: "" }
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      zanr: require("@/assets/imagea/zanr.svg"),
      zan: require("@/assets/imagea/zan.svg"),
      hed: require("@/assets/imagea/hed.svg"),
      down: require("@/assets/imagea/down.svg"),
      top: require("@/assets/imagea/top.svg"),
      detail_btn: require("@/assets/imagea/detail_btn.svg"),
      detail_btn2: require("@/assets/imagea/detail_btn2.svg"),
      detail_btn2H: require("@/assets/imagea/detail_btn2H.svg"),
      flag: false,
      showPic: true, //用于判断上面标签数的boolean
      isCollection: false,
      toplist: [
        {
          id: 1,
          name: "全部",
          topFlag: false
        },
        {
          id: 2,
          name: "最新",
          topFlag: false
        },
        {
          id: 3,
          name: "分量足",
          topFlag: false
        },
        {
          id: 4,
          name: "不错",
          topFlag: false
        },
        {
          id: 5,
          name: "非常好",
          topFlag: false
        },
        {
          id: 6,
          name: "一般",
          topFlag: false
        },
        {
          id: 7,
          name: "中评",
          topFlag: false
        },
        {
          id: 8,
          name: "差评",
          topFlag: false
        }
      ],
      commentDetailList: [],
      GoodsDeatil: [],
      id:"",
      supplierId:"",
      arr: [],
      type: 1, // 1为收藏 2取消收藏
    };
  },
  created() {
    this.ifGoodsexist();
  },
  mounted() {
    this.id = this.$route.query.id?this.$route.query.id:''
    this.supplierId = this.$route.query.supplierId?this.$route.query.supplierId:''
    let GoodsDeatil = JSON.parse(this.$route.query.GoodsDeatil);
    this.GoodsDeatil=GoodsDeatil?GoodsDeatil:[];
    // console.log("this.GoodsDeatil==",this.GoodsDeatil);
    // console.log("this.supplierId==",this.supplierId);
    this.toplist[0].topFlag = true;
    if (this.toplist.length < 5) {
      // 若总的标签数小于5个 则不会显示上下箭头
      this.showPic = false;
    }
    
    this.getGoodslist(this.id);
    this.arr.push(this.id);
    // this.arr.push(this.id + "");
   
  },
  methods: {
    change() {
      this.flag = !this.flag;
    },
    zanFunc(index) {
      //   增加或减少赞数
      this.list[index].zanFlag = !this.list[index].zanFlag;
      if (this.list[index].zanFlag) {
        this.list[index].zanC += 1;
      } else {
        this.list[index].zanC -= 1;
      }
    },
    modify(index) {
      // 点谁谁红
      this.toplist.map(item => {
        item.topFlag = false;
      });
      this.toplist[index].topFlag = true;
    },
    goCustomerService() {
      Toast("程序猿开发中~");
    },
    collectionBtn() {
      this.isCollection = !this.isCollection;
    },
    getGoodslist(id) {
      // 获取详情  /app/getGoodsByIds
      ajax({
        url: "product-api-impl/app/getGoodsEstimateList",
        optionParams: {id:this.id}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.commentDetailList = response.data.list ? response.data.list : [];
            // this.GoodsDeatil = this.goodsInfoData.GoodsDeatil; //商品详情
            // this.commentDetailList = this.goodsInfoData.commentDetailList; //评论详情
            // this.commentTotalCount = this.goodsInfoData.commentTotalCount; //评论数目
            // this.isCollection = this.goodsInfoData.bool
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    ifGoodsexist() {
      //用于判断用户是否已经收藏过此商品，收藏列表存在的话则默认进入详情页星星点亮；反之不会
      var temp = [];
      ajax({
        url: "member-api-impl/user/myGoodsCollection ",
        optionParams: {}
      }).post()
        .then(res => {
          if (res.code === 200) {
            this.temp = res.data ? res.data.CollectionGoodsList : {};
            // console.log(this.temp);
            if(this.temp!=null){
            this.temp.map(item => {
              if (item.id === this.id * 1) {
                // console.log("存在了" + item.id);
                this.isCollection = true;
              }
            });}
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    collectionBtn() {
      // 收藏操作获取取消收藏
      if (this.isCollection) {
        this.type = 2;
      } else {
        this.type = 1;
      }
      this.isCollection = !this.isCollection;
      ajax({
        url: "member-api-impl/userInfo/CollectionAction",
        optionParams: { productIds: this.arr, type: this.type }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            if (this.type === 1) {
              Toast("收藏成功！");
            } else {
              Toast("取消成功！");
            }
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addtoCar() {
      //加入购物车
      ajax({
        url: "product-api-impl/shopcar/addAndUpdateShopCar",
        optionParams: {
          goodsId: this.id,
          // goodsNum: 1,
          supplierId: this.supplierId
        }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            Toast("购物车等你哦！");
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 立即购买
    nowPay(){
      let temp = [],temp2 = [];
        //存放多选商品id {id：商品id，count：商品数量} 存入localstorage中 
        //多选商品时，可将数组传给商品接口，离开确认订单页面时。将localsotorage删除，不影响重复提交。
          console.log("this.GoodsDeatil=22=",this.GoodsDeatil)
            // this.GoodsDeatil.forEach(i=>{
            //     if(i.ischecked){
            //         temp.push({goodsId:i.id,num:i.shopCarNum,supplierId:i.supplierId})
            //         temp2.push(i);
            //     }
            // })
          temp.push({goodsId:this.GoodsDeatil.id,num:this.GoodsDeatil.shopCarNum,supplierId:this.GoodsDeatil.supplierId})  
          temp2.push(this.GoodsDeatil);
          // console.log("temp==",temp)
        localStorage.setItem("goodArr",JSON.stringify(temp))
        localStorage.setItem("goodArr2",JSON.stringify(temp2))
        this.$router.push({path:'/confirmTheOrder',query:{id:this.id }})
    },
    
  }
};
</script>

<style lang='scss' scoped>
@import "./scss/allEvaluation.scss";
.red {
  color: #e1212d;
}
.redH {
  color: #e1212d;
  border: 1px solid #e1212d;
}
.black {
  color: #808080;
}
.blackH {
  color: #808080;
  border: 1px solid #808080;
}
.extend {
  height: 160px;
}
</style>

