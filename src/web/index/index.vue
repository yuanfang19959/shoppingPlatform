<template>
  <div style="background: white;" class="main">
    <!-- 黄色div -->
       <top :pageType="1"></top>  
   
    <div class="yeBox"></div>

    <!-- 轮播图区域 -->
    <div class="swiper-container" id="investproSwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="i in bannerList" :key="i.id">
          <img :src="i.picture" />
        </div>
      </div>
      <div class="swiper-pagination" id="swp"></div>
      <div class="investproTab investpro-prev" id="investpro-prev"></div>
      <div class="investproTab investpro-next" id="investpro-next"></div>
    </div>

    <!-- 滑动分类,勿删除防止哪天产品要求改回来 -->
    <!-- <div class="swiper-container2">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in goodslist" :key="item.id" @click="goCLS(item.id)">
          <div class="box">
            <img :src="item.imageAddress" alt="这是图" />
          </div>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <br />
      <div class="swiper-scrollbar" id="sw2"></div>
    </div> -->

     <!-- 滑动分类,新 -->
  <div class="swiper-container2">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in forwardTypeList" :key="item.id" @click="toPage(item)">
          <div class="box">
            <img :src="item.imageAddress" alt="这是图" />
          </div>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <br />
      <div class="swiper-scrollbar" id="sw2"></div>
    </div>

    <div class="middle">
      <!-- 垂直滚动公告区域 -->
      <div class="laba">
        <div class="swiper-container5" id="scoll">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="i in noticePOList" :key="i.id">
              <img src="../../assets/imagea/laba.svg" alt />
              <span>{{i.title}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 打折商品 -->
      <div class="swiper-container4">
        <div class="top">
          <span class="hm">惠民专区</span>
          <div class="more" @click="toGoodsList('热销商品',1)">
            <a>更多</a>
            <img :src="more" alt />
          </div>
        </div>
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="i in discountGoods" @click="toNew(i.id)" :key="i.id" >
            <img :src="i.imageAddress" alt="这是图" />
            <div class="right">
              <p>{{ i.name }}</p>
              <div class="twoSpan">
                <!-- <div>七折</div> -->
                <div>同城</div>
              </div>
              <span class="price">¥ {{ i.discounPrice }}</span>
              <span class="weight">{{ i.specification }}</span>
            </div>
          </div>
        </div>
        <br />
        <div class="ht"></div>
        <div class="swiper-scrollbar" id="sw4"></div>
      </div>
      <div class="full"></div>

      <!-- 农副产品 -->
      <div class="swiper-container3" v-for="io in goodslist" :key="io.id" v-show="io.childList.length != 0">
        <div class="top">
          <span class="hm">{{io.name}}</span>
        </div>
        <div class="swiper-wrapper">
          <!-- <div class="swiper-slide" v-for="(item, index) in io.childList" :key="index" @click="
              $router.push({ path: '/goodsList', query: { id: item.id,val:item.name } })
            " > -->
            
            <div class="swiper-slide" v-for="(item, index) in io.childList" :key="index" @click="toGoodsList(item.name)" >
            <div class="box">
              <img :src="item.imageAddress" alt />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <br />
      </div>

    </div>
    <div class="brace"></div>
    <foot></foot>
  </div>
</template>
<script>
import ajax from "@utils/config";
import store from "@/store";
import BScroll from "better-scroll";
import foot from "@/components/footer.vue";
import top from "@/components/header.vue";
export default {
  data() {
    return {
      img2: require("@/assets/imagea/sc.png"),
      img3: require("@/assets/imagea/sp.png"),
      more: require("@/assets/imagea/arrowRight.svg"),
      lbt: require("@/assets/imagea/lbt.png"),
      pro: require("@/assets/imagea/pro.png"),
      axsc: require("@/assets/imagea/axsc.png"),
      pic: require("@/assets/imagea/indexmenu/hunqing.png"),
      bannerList: [], //轮播图
      goodslist: [], //商品分类 （误删除防止哪天产品要求改回来）
      discountGoods: [], //打折商品
      noticePOList:[], //垂直公告
      forwardTypeList:[] //商品分类 新
    };
  },
  computed: {},
  created() {
    this.getHomePage();
  },
  mounted() {
    setTimeout(() => {
      //延时加载，否在动态渲染的数据 无法正常滑动 会出问题
      var abcSwiper = new this.$Swiper("#investproSwiper", {
        speed: 2000,
        autoplay: {
          delay: 3000, //1秒切换一次
          disableOnInteraction: false, //用户滑动之后，可以继续自动播放
        },
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: false
      });

      var mySwiper = new this.$Swiper(".swiper-container2", {
        slidesPerView: 5, //一行显示5个
        // slidesPerView: 'auto',
        slidesPerColumn: 2, //显示2行
        slidesPerGroup: 5, //每次滑动滚动的数量
        scrollbar: {
          el: "#sw2",
          dragSize: 53
        },
        draggable: false,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: false,
        slidesPerColumnFill: "row"
      });
      mySwiper.scrollbar.$el.css("height", "15px");
      mySwiper.scrollbar.$dragEl.css("background", "#F2414C");
      mySwiper.scrollbar.$el.css("width", "157px");
      mySwiper.scrollbar.updateSize();

      var mySwiper3 = new this.$Swiper(".swiper-container3", {
        slidesPerView: 5,
        slidesPerColumn: 2,
        slidesPerColumnFill: "row"
      });
      var scoll = new this.$Swiper(".swiper-container5", {
        slidesPerView: 1,
        autoplay: {
          delay: 2500, //1秒切换一次
          disableOnInteraction: false, //用户滑动之后，可以继续自动播放
        },
        loop: true,
        direction: "vertical" //垂直方向
      });

      var mySwiper4 = new this.$Swiper(".swiper-container4", {
        slidesPerView: 2, //一行显示2个
        slidesPerGroup: 2,
        scrollbar: {
          el: "#sw4",
          dragSize: 53
        },
        draggable: false,
        observer: true,
        observeParents: true
      });
      mySwiper4.scrollbar.$el.css("height", "15px");
      mySwiper4.scrollbar.$dragEl.css("background", "#F2414C");
      mySwiper4.scrollbar.$el.css("width", "157px");
      mySwiper4.scrollbar.updateSize();
    }, 600);
  },
  methods: {
    getHomePage() {
      ajax({
        url: "member-api-impl/user/getHomePageInfo",
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.goodslist = res.data ? res.data.goodsType.menuList : {};
            this.bannerList = res.data ? res.data.bannerList : {};
            this.discountGoods = res.data ? res.data.discountGoods : {};
            this.noticePOList = res.data?res.data.noticePOList:{};
            this.forwardTypeList = res.data?res.data.forwardTypeList:{};
          } else {
            console.log(res);
          } 
        })
        .catch(error => {
          console.log(error);
        });
    },
    toNew(id) {
      this.$router.push({ path: "/index/detail", query: { id: id } });
    },
    //保留，防止改需求
    // goCLS(type) {
    //   let tmpType = type;
    //   this.$router.push({ path: "/cls", query: { type: tmpType } });
    // },
    toPage(item){
        if(item.jumpWay === 1){
            //判断是否跳外部链接
        if(item.level === 1){
            this.$router.push({ path: "/cls", query: { type: item.id, level:item.level } });
        }else if(item.level === 2){
            let parentIds = item.parentIds;
            let arr = [];
            arr = parentIds.split(',');
            let id = arr[0]*1;
             this.$router.push({ path: "/cls", query: { type: id, level:item.level } });
        }else{
            // this.$router.push({ path: "/goodsList", query: { val: item.name } });
            
            this.toGoodsList(item.name)
        }}else{
            console.log(item.url)
            window.location.href =item.url;
        }
    },
    toGoodsList(name,type){
        //跳转至商品列表
        this.$router.push({ path: "/goodsList"});
        localStorage.setItem("val", name)
        console.log(type)
        if(type != undefined){
            localStorage.setItem("selectHotGoods", type)
        }
    }
  },

  filters: {},
  components: {
    foot,
    top
  }
};

//
</script>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>