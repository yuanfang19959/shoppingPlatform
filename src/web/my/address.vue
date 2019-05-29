<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">

      <top :barType='barType' :barText='barText' @subSave='subSave'></top>
      <blank></blank>
    </div>

    <div class="clear"></div>
    <!-- 默认地址 -->
    <div class="content" v-for='(i,index) in list' v-if='i.isDefault' :class="{activeContent2:i.isDefault}" @click="goPageOther(i)">
      <span class="defaultAddress">默认地址</span>
      <div class="c1">
        <div class="left">
          <div class="top">
            <span class="s1">{{i.name}}</span>
            <span class="phone">{{i.phone}}</span>
          </div>
          <div class="addressTest">
            {{i.addressDetail}}
          </div>
        </div>
        <span class="line"></span>
        <span class="edit" @click.stop="edit(i.id)"> 编辑</span>
      </div>
    </div>

    <!-- 地址列表 -->
    <div class="content" v-for='(i,index) in list' v-if='!i.isDefault' :class="{notactiveContent2:!i.isDefault}" @click="goPageOther(i)">
      <div class="c1">
        <div class="left">
          <div class="top">
            <span class="s1">{{i.name}}</span>
            <span class="phone">{{i.phone}}</span>
          </div>
          <div class="addressTest">
            {{i.addressDetail}}
          </div>
        </div>
        <span class="line"></span>
        <span class="edit" @click.stop="edit(i.id)"> 编辑</span>
      </div>
    </div>
    <div class="bottomBlank"></div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from "@utils/config";
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
        leftData: {
          type: 2,
          name: require("@/assets/imagea/blackup.svg"),
          path: "/my/index"
        },
        centerData: { type: 0, name: "收货地址管理" },
        rightData: { type: 0, name: "添加" }
      },
      list: [],
      pageType: 0 //页面跳转类型  1 跳转到确认订单 2 订单详情修改地址
    };
  },
  created() {
    this.getaddressList();
  },
  mounted() {
    if (this.$route.query.pageType) {
      this.pageType = this.$route.query.pageType;
      if (this.pageType == 1) {
        this.barText.leftData.path = "/confirmTheOrder";
      } else if (this.pageType == 2) {
        this.barText.leftData.path =
          "/orderDetails?id=" + this.$route.query.orderId;
      } else {
        this.barText.leftData.path = "/my/index";
      }
    }
  },
  methods: {
    //获取地址列表
    getaddressList() {
      ajax({
        url: "member-api-impl/user/deliveryAddressList ",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.list = response.data ? response.data : [];
            let Ishav = 0;
            this.list.map(item => {
              if (item.isDefault == 1) {
                Ishav = 1;
              }
            });
            // 判断是否有默认地址
            // Ishav==0?this.list[0].isDefault=1:'';
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    subSave() {
      let pageType = this.$route.query.pageType;
      //存在pageType则最开始的入口是我的订单
      if (pageType) {
        this.$router.push("/my/addressAdd?pageType=1");
      } else {
        this.$router.push("/my/addressAdd");
      }
    },
    // 判断跳转其他页面
    goPageOther(item) {
      let url,
        type = this.pageType;

      if (type == 1) {
        this.$router.push({
          path: "/confirmTheOrder",
          query: { addressId: item.id }
        });
      } else if (type == 2) {
        if (this.$route.query.orderId) {
          let orderId = this.$route.query.orderId;
          url = "/orderDetails?id=" + orderId;
          this.$router.push({
            path: url,
            query: { OrderAddrData: JSON.stringify(item) }
          });
        }
      }
    },

    edit(id) {
      //编辑带pageType=1
      if (this.$route.query.pageType) {
        this.$router.push({
          path: "/my/addressEdit",
          query: { addressId: id, pageType: 1 }
        });
      } else {
        this.$router.push({
          path: "/my/addressEdit",
          query: { addressId: id }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/address.scss";
</style>
