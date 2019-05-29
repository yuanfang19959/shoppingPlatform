<template>
  <div class="detail_page">
    <div class="page_top">
      <div class="bannerShow">
        <img class="blackup" :src="blackup" alt="" @click="$router.go(-1)" />
        <img class="topShare" :src="shareimg" alt="" />
      </div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(i, index) in goodsIMG" :key="index">
            <img :src="i" alt="" />
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div class="goodsDisp">
      <ul class="goodsDisp_list">
        <li class="first_item flexbox">
          <div class="flex1 price_num"><i>&yen;</i>{{ GoodsDeatil.price }}</div>
        </li>
        <li class="goodsName">
          <div>
            {{ GoodsDeatil.name }}
          </div>
        </li>
        <li class="weightNum">
          <div>{{ GoodsDeatil.explains }}</div>
        </li>
        <li class="flexbox checkVillage">
          <div class="flex1 checkVillageName">
            {{ GoodsDeatil.supplierName }}
          </div>
          <div class="bottom_num"><i>月销</i>{{ GoodsDeatil.soldNumber }}</div>
        </li>
      </ul>
    </div>
    <!--配送-->
    <div class="delivery ">
      <ul class="flexbox">
        <li class="name">发货</li>
        <li class="Areainfo">{{ GoodsDeatil.startAddress }}</li>
        <li class="flex1" v-if=" GoodsDeatil.isFree==1">快递：{{ GoodsDeatil.carriageTemplateMoney|forma1 }}</li>
        <li class="flex1" v-if=" GoodsDeatil.isFree==2">快递：包邮</li>
      </ul>
    </div>
    <div class="sever">
      <div class="flexbox second_item">
        <span class="name">参数</span>
        <span class="flex1">净含量 {{ GoodsDeatil.weight }}</span>
      </div>
    </div>
    <!--评价-->
    <div class="evaluate">
      <div class="flexbox evaluate_top">
        <span class="flex1 name">宝贝评价</span>
        <span class="" v-if="hasNoContent" @click="$router.push({ path: '/allEvaluation',query: { id: $route.query.id, supplierId: supplierId, GoodsDeatil: JSON.stringify(GoodsDeatil)}})">查看全部</span>
      </div>
      <!--用户信息区域-->
      <div class="userinfoShow flexbox" v-if="hasNoContent">
        <div class="avatar_layer">
          <img :src="commentDetailList.userImage" alt="" />
        </div>
        <div class="flex1 username">
          {{ commentDetailList.nickname }}
        </div>
      </div>
      <div class="bottom_text" v-if="hasNoContent">
        <span>{{ commentDetailList.content }}</span>
      </div>
      <span v-if="!hasNoContent">暂无评价</span>
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
            <span class="cart_btn cartBtnCover" @click="addtoCar">
              加入购物车
            </span>
            <span class="now_pay" @click="confirm">
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
import store from "@/store";
import foot from "@/components/footer.vue";
import { Toast } from "mint-ui";
import { setTimeout } from "timers";
export default {
  components: {
    foot
  },
  data() {
    return {
      blackup: require("@/assets/imagea/blackup.svg"),
      dingwei: require("@/assets/imagea/dingwei.svg"),
      shareimg: require("@/assets/imagea/shareimg.svg"),
      pageshareImg: require("@/assets/imagea/pageshareImg.svg"),
      avatar_detail: require("@/assets/imagea/avatar_detail.svg"),
      detail_btn: require("@/assets/imagea/detail_btn.svg"),
      detail_btn2: require("@/assets/imagea/detail_btn2.svg"),
      detail_btn2H: require("@/assets/imagea/detail_btn2H.svg"),
      TopBg: {
        background: "url(" + require("@/assets/imagea/goods.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      isCollection: false,
      goodsId: "",
      type: 1, // 1为收藏 2取消收藏
      arr: [],
      GoodsDeatil: [],
      commentDetailList: [],
      goodsInfoData: [],
      cap: "", //评论内容
      nickname: "", //昵称
      goodsNum: 1, //默认加入数量
      supplierId: 1, //供应商id
      hasNoContent: false, //判断是否有商品评论
      goodsIMG: [] //存放商品图片的数组
    };
  },
  computed: {},
  created() {
    this.goodsId = this.$route.query.id ? this.$route.query.id : "";
    this.getGoodslist(this.goodsId * 1);
    this.ifGoodsexist();
  },
  mounted() {
    this.arr.push(this.goodsId + "");
    setTimeout(() => {
      this.initbanner();
    }, 600);
  },
  methods: {
    confirm() {
      let temp = [];
      temp.push({ goodsId: this.$route.query.id, num: 1 });
      this.$router.push({ path: "/confirmTheOrder" });
      localStorage.setItem("list", JSON.stringify(temp));
    },
    initbanner() {
      var mySwiper = new this.$Swiper(".swiper-container", {
        autoplay: {
          delay: 4000, //1秒切换一次
          disableOnInteraction: false //用户滑动之后，可以继续自动播放
        },
        loop: true, // 循环模式选项
        pagination: {
          el: ".swiper-pagination"
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: false
      });
    },
    getGoodslist(id) {
      // 获取详情
      ajax({
        url: "product-api-impl/app/goodsById?id=" + id,
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.goodsInfoData = response.data ? response.data : {};
            this.GoodsDeatil = this.goodsInfoData.GoodsDeatil; //商品详情
            this.commentDetailList = this.goodsInfoData.commentDetailList[0]
              ? this.goodsInfoData.commentDetailList[0]
              : null; //评论详情

            //商品详情图片以逗号分隔，可能有只有一张图片的情况
            let imgStr = this.GoodsDeatil.detailImageAddress;
            if (imgStr.indexOf(",") != -1) {
              //多张图片
              this.goodsIMG = imgStr.split(",");
            } else {
              //只有一张图片的情况
              this.goodsIMG.push(imgStr);
            }

            // 判断商品是否有评论，不存在则不显示。否则会报错
            if (this.commentDetailList != null) {
              this.hasNoContent = true;
            }
            this.supplierId = this.GoodsDeatil.supplierId;
          } else {
            console.log(response);
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
    goCustomerService() {
      Toast("程序猿开发中~");
    },
    ifGoodsexist() {
      //用于判断用户是否已经收藏过此商品，收藏列表存在的话则默认进入详情页星星点亮；反之不会
      var temp = [];
      ajax({
        url: "member-api-impl/user/myGoodsCollection ",
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.temp = res.data ? res.data.CollectionGoodsList : {};
            console.log(this.temp);
            if (this.temp != null) {
              this.temp.map(item => {
                if (item.id === this.goodsId * 1) {
                  // console.log("存在了" + item.id);
                  this.isCollection = true;
                }
              });
            }
          } else {
            console.log(res);
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
          goodsId: this.goodsId,
          // goodsNum: this.goodsNum,
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
    }
  },

  filters: {}
};

//
</script>
<style lang='scss' scoped>
@import "./scss/detail.scss";
</style>
