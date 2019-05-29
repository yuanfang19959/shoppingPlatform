<template>
  <div>
    <top :pageType="2"></top>
    <!-- 黄色头部区域 -->
    <div class="nav"></div>

    <!-- 左边按钮区域 -->
    <div class="navLeft" id="navLeft">
      <ul>
        <li v-for="(item, index) in ListOne" class="default" @click="
            selectActive(item.id);
            getListTwo(item.id);
          "
          :class="[activeIndex === item.id ? 'active' : '']" :key="index">
          {{ item.name }}
          <span v-if="activeIndex === item.id"></span>
        </li>
      </ul>
    </div>

    <!-- 右边div模块 -->
    <div class="navRight" id="navRight">
      <div class="box" v-for="i in ListTwo" :key="i.id">
        <span class="title1">{{ i.name }}</span>
        <ul>
          <li v-for="item in i.childList" @click="toGoodsList(item.name)" :key="item.id">
            <img :src="item.imageAddress" alt />
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom"></div>
    <foot></foot>
  </div>
</template>

<script>
import foot from "@/components/footer.vue";
import top from "@/components/header.vue";
import ajax from "@utils/config";
import { setTimeout } from "timers";
import { Toast } from "Mint-ui";
export default {
  components: {
    foot,
    top
  },
  data() {
    return {
      ListOne: [],
      ListTwo: [], //二级三级菜单
      activeIndex: 0,
      pic: require("@/assets/imagea/classfication/pig.png"),
      loadNum: 0
    };
  },
  created() {
    this.getListOne();
  },
  mounted() {
    this.loadSize();
    setTimeout(() => {
      this.activeIndex = this.$route.query.type
        ? this.$route.query.type
        : this.loadNum;
      this.getListTwo(this.activeIndex);
      console.log(this.activeIndex);
    }, 500);
  },
  methods: {
    //div出滚动条函数，适配不同屏幕尺寸
    loadSize() {
      var divheight = 0;
      var clienth =
        document.compatMode === "CSS1Compat"
          ? document.documentElement.clientHeight
          : document.body.clientHeight;
      divheight = clienth - 91 - 104;
      var navLeft = document.getElementById("navLeft");
      var navRight = document.getElementById("navRight");
      navLeft.style.height = divheight + "px";
      navRight.style.height = divheight + "px";
    },
    //改变样式函数
    selectActive(index) {
      this.activeIndex = index;
    },
    toNew() {
      this.$router.push({ path: "/goodsList" });
    },
    getListOne() {
      let temp = [];
      ajax({
        url: "product-api-impl/goodsType/menuList?parentId=0",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.ListOne = response.data ? response.data : {};
            this.loadNum = this.ListOne[0].id;
            console.log(this.loadNum);
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getListTwo(id) {
      this.ListTwo = [];
      let temp = [];
      ajax({
        url:
          "product-api-impl/goodsType/menuAppDownList?id=" + id + "&childNum=2",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            temp = response.data ? response.data : null;
            this.ListTwo = temp;
            if (temp.length == 0) {
              Toast({
                message: "列表为空",
                duration: 500
              });
            }
            console.log(this.ListTwo);
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toGoodsList(name) {
      //跳转至商品列表
      this.$router.push({ path: "/goodsList" });
      localStorage.setItem("val", name);
    }
  }
};
</script>

<style lang="scss" scoped>
//下面两个是选中和非选中时的样式
.default {
  background-color: #fff;
  color: black;
  font-family: "PingFangSC-Thin";
  font-weight: 100;
}
.active {
  color: #1a1a1a;
  background-color: #f7f7f7;
  font-family: "PingFangSC-Regular";
  font-weight: 400;
  overflow: hidden;
  .leftBorder {
    border-right: 5px solid #df0715;
    padding: 0 10px;
  }
}
.default.active::after {
  border: none;
}
@import "./scss/classfication.scss";
</style>
