<template>
  <div>
    <div class="breadcrumb" v-if="!isWeiXi">
      <!--<span class="center_input">
        <img class="searchimg" :src="searchimg" alt="" />
        <div class="searchinput_layer">
          <input class="searchinput" type="text" :placeholder="value" 
          v-model="value" @keyup.enter="searching(value)" @click="setnull"
          />
        </div>
      </span>
      <span class="cancel" @click="$router.push('/my/collection')">取消</span>-->
      <top :barType='barType' :barText='barText' @subSave='subSave' @inputSub="inputSub"></top>
    </div>

    <!-- 搜索历史 -->
    <div class="history" v-show="!flag">
      <span class="s1">搜索历史</span>
      <div class="his">
        <span v-for="item in history" :key="item.name">{{ item.name }}</span>
      </div>
      <div class="bottom" @click="clearHistory">清除所有历史记录</div>
    </div>

    <!-- 商品列表区域 -->
    <div class="content" v-show="showContent">
      <!-- 单个商品区域 -->
      <div class="goods" @click="toNew">
        <div class="imgContainer">
          <img src="@/assets/imagea/goods.png" alt="商品图片" />
        </div>

        <div class="rightInfo">
          <p>烟台大樱桃车厘子两斤 新鲜党纪水果 两件包邮</p>
          <span class="kg">净含量1000克</span>
          <div class="tips">
            <span>七折</span>
            <span>七折</span>
          </div>
          <div class="bottom">
            <span class="s1">
              ¥999
              <span class="s2">200人付款</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 单个商品区域 -->
      <div class="goods" @click="toNew">
        <div class="imgContainer">
          <img src="@/assets/imagea/goods.png" alt="商品图片" />
        </div>

        <div class="rightInfo">
          <p>烟台大樱桃车厘子两斤 新鲜党纪水果 两件包邮</p>
          <span class="kg">净含量1000克</span>
          <div class="tips">
            <span>七折</span>
            <span>七折</span>
          </div>
          <div class="bottom">
            <span class="s1">
              ¥999
              <span class="s2">/200人付款</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

<!-- 商品信息 -->

</template>

<script>
// import isWeiXin from '@/assets/js/commin';
import ajax from '@utils/config';
import { Toast } from "mint-ui";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components:{
    top,
    blank
  },
  data() {
    return {
      barType:'1',  
      barText:{
        leftData:{type:0,name:'搜索收藏夹'},
        centerData:{type:0,name:'取消'},
        rightData:{type:0,name:'取消'},
      },
      value:"搜索收藏夹",  
      flag: false,
      showContent:false,
      img: require("@/assets/imagea/blackup.svg"),
      imgR: require("@/assets/imagea/msgimg.svg"),
      indextopImg: require("@/assets/imagea/indextopImg.svg"), //首页图标 pageType 1
      clsTopImg: require("@/assets/imagea/clsTopImg.svg"), //商品分类 pageType 2
      searchimg: require("@/assets/imagea/searchimg.svg"),
      isWeiXi: false,
      history: [
        { name: "手机" },
        { name: "三星手机" },
        { name: "microsoft laptop" },
        { name: "骑车" },
        { name: "挡风玻璃" }
      ],
      searchinput:"",
    };
  },
  mounted(){
      this.load();
  },
  created() {
    // this.isWeiXi = isWeiXin();
    // console.log(window.location.href);
  },
  computed: {
    list() {
      let result = [];
      // console.log(this.$route);
      for (var index = 0; index < this.$route.matched.length; index++) {
        //根据路由获取
        var item = this.$route.matched[index];
        if (index === 2) {
          result.push({
            title: item.meta.title,
            path: item.path
          });
        }
      }
      return result;
    }
  },
  methods: {
    inputSub(val){
      // this.searchinput=val;
      if(!val){
        Toast("请输入搜索关键字~")
        return;
      }
      this.$router.push({path:'/my/collection',query:{name:val}});
    },
    subSave(){

      this.$router.push({path:'/my/collection',query:{name:''}})
    },
    //清楚历史记录
    clearHistory() {
      this.flag = !this.flag;
      this.history = null;
    },
    searching(value){
          this.history.push({name:value})
          this.flag=true;
          this.showContent =true;
    },
    setnull(){
        this.value = null;
    },
    load(){//判断历史记录的长度，如果是空的则不显示
        if(this.history.length ===0)
        {
            this.flag = true;
        }
    },
      toNew() {
      this.$router.push({ path: "/my/detail" });
    },
    getList() {
            ajax({
                url: 'tAppUser/userInfo',
                optionParams: {}
            }).post()
            .then(response => {
                if (response.code === 200) {
                    this.balance = response.data.balance;
                } else {
                    console.log(response)
                }
            })
            .catch(error => {
                console.log(error)
            })
      },
  }
};
</script>
<style lang='scss' scoped>
@import "./scss/search.scss";
</style>