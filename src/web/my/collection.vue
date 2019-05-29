<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow" style="z-index:999">
      <img class="blackup" :src="blackup" alt="" @click="$router.push('/my/index')" />
      <span class="center_1">我的收藏</span>
      <img :src="sreach" alt="" @click="$router.push('/my/search')" />
      <span class="leftS" v-show="!flag" @click="change">管理</span>
      <span class="leftS" v-show="flag" @click="change">完成</span>
    </div>
    <div class="clear"></div>
    <div ref='wrapper' style="overflow:scroll;-webkit-overflow-scrolling: touch" :style="{height:wrapperHeight+'px'}">
      <mt-loadmore  :bottom-method="loadBottom"   :topMethod="loadtop" :bottom-all-loaded="allLoaded" ref="loadmore"
        @bottom-status-change="handleBottomChange" @top-status-change="handleTopChange" :auto-fill="false">
        <div class="content">
          <!-- 单个商品区域 -->
          <div class="goods" v-for="(i, index) in listData" :key="i.id" v-show="i">
            <div class="yc" v-show="flag" @click="checkedGoods(index)">
              <img :src="checked" v-show="!i.isShow" alt="" />
              <img :src="checkedH" v-show="i.isShow" alt="" />
            </div>
            <div class="imgContainer">
              <img :src="i.imageAddress" alt="商品图片丢失啦" @click="toNew(i.id)" />
            </div>

            <div class="rightInfo">
              <p>{{ i.name }}</p>
              <span class="kg">{{ i.explains }}</span>
              <br>
              <br>
              <div class="bottom">
                <span class="s1">
                  ¥{{ i.price }}
                  <span class="s2">{{ i.soldNumber }}人付款</span>
                </span>
              </div>
            </div>
          </div>
          <div class="blackspace"></div>
        </div>
      </mt-loadmore>
    </div>

    <!-- 底部删除 -->
    <div class="bottom_pay" v-show="flag">
      <div class="checked_btn">
        <div class="img_layer" @click="checkAll">
          <img :src="checked" alt="" v-show="!isAllChecked" />
          <img :src="checkedH" alt="" v-show="isAllChecked" />
        </div>
        <div class="checked_btn_text">全选</div>
      </div>
      <div class="sub_btn" @click="Delitem">删除</div>
    </div>
  </div>
</template>

<script>
import { Toast, Loadmore } from "mint-ui";
import ajax from "@utils/config";
import { debug } from "util";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "我的收藏" },
        rightData: { type: 0, name: "管理" }
      },
      isAllChecked: false, //是否全选
      flag: false,
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      deleteP: require("@/assets/imagea/delete.svg"),
      sreach: require("@/assets/imagea/my/search.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      listData: [],
      arr: [],
      infoData: {},
      params: {
        pageSize: 10,
        pageIndex: 1,
        selectName: "" //搜索内容
      },
      allLoaded: false,
      wrapperHeight: null,
      pages: 1, //总页数
      total: 0 //总条数
    };
  },
  watch: {
    isAllChecked(newval, oldval) {
      this.listData.map(item => {
        if (!item.isShow) {
          this.isAllChecked = false;
        }
      });
    }
  },
  created() {
    this.getList();
    setTimeout(() => {
      this.comTheAllCount();
      console.log(this.pages);
    }, 1000);
  },
  mounted() {
    let name = this.$route.query.name;
    this.params.selectName = name ? name : "";
    this.wrapperHeight =
      document.documentElement.clientHeight -
      this.$refs.wrapper.getBoundingClientRect().top;
  },
  methods: {
    getList() {
      ajax({
        url: "member-api-impl/user/myGoodsCollection ",
        optionParams: this.params
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.pages = res.data.total ? res.data.total : {};
            if (this.params.pageIndex > this.pages) {
              this.params.pageIndex--;
              // console.log("2222");
              return;
            }
            this.infoData = res.data ? res.data : {};
            this.listData = this.listData.concat(
              this.infoData.CollectionGoodsList
            );
            this.allLoaded = false;
            this.total = this.infoData.total;
            this.pages = this.infoData.total;
            this.comTheAllCount(); //请求删除后重新，计算总页数
            if (this.listData) {
              this.listData.map((item, index) => {
                this.$set(item, "isShow", false);
                //新增可以触发响应式的属性，否者使用普通方法 无法触发视图更新
              });
            } else {
              Toast("这里空空的！");
            }
            console.log(this.listData);
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
    change() {
      this.flag = !this.flag;
      this.ischecked = false;
    },
    // 商品被勾选
    checkedGoods(index) {
      this.listData[index].isShow = !this.listData[index].isShow;
      console.log(this.listData);
      if (!this.listData[index].isShow) {
        //全选状态下,取消摸个按钮的状态时 全选熄灭
        this.isAllChecked = false;
      } else {
        this.listData.map(item => {
          if (item.isShow) {
            this.isAllChecked = true;
          }
        });
      }
      console.log(this.listData);
    },
    // 全选
    checkAll() {
      this.isAllChecked = !this.isAllChecked;
      let vm = this;
      this.listData.map(item => {
        if (!vm.isAllChecked) {
          item.isShow = false;
        } else {
          item.isShow = true;
        }
        console.log(this.listData);
      });
    },
    // 删除数据
    Delitem() {
      let tempArr = [];
      console.log(this.arr);
      this.listData.map((item, index) => {
        if (item.isShow && this.arr.indexOf(item.id) == -1) {
          //防止重复插入
          this.arr.push(item.id);
          console.log(this.arr);
        } else {
          tempArr.push(item);
          console.log(tempArr);
        }
      });
      ajax({
        //取消收藏ajax
        url: "member-api-impl/userInfo/CollectionAction",
        optionParams: { productIds: this.arr, type: 2 }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            Toast("取消收藏成功！");
            if (this.arr.length >= 10) {
              this.getList();
            }
            this.isAllChecked = false;
            this.arr = []; //请求删除后清空arr否则下一次请求会失败
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.listData = tempArr;
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadtop() {
      setTimeout(() => {
        this.params.pageIndex = 1;
        this.listData = [];
        this.allLoaded = false;
        this.getList();
        if (this.params.pageIndex <= 1) {
          this.allLoaded = true;
        } else {
          this.params.pageIndex--;
          this.getList();
        }
        this.$refs.loadmore.onTopLoaded();
      }, 1000);
    },
    loadBottom() {
      if (this.params.pageIndex < this.pages) {
        this.params.pageIndex++;
        this.getList();
      } else {
        Toast("已加载全部！");
        this.allLoaded = true;
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    comTheAllCount() {
      //通过数据总数，求总页数；
      if (this.total > 10) {
        let newPage = parseInt((this.total - 1) / 10);
        this.pages = newPage + 1;
      } else {
        this.pages = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/collection.scss";
</style>