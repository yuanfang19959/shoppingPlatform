<template>
  <div class="index_page">
    <div class="index_page_top">
      <div class="avatarimg">
        <div class="avatarimg_layer">
          <img :src="userInfo.userImage" alt="" />
        </div>
      </div>
      <div class="userinfo">
        <div class="userinfo_lv">{{userInfo.nickname}}</div>
        <div class="userinfo_num">
          <span class="userNumLayer">
            <img :src="shengfenzheng" alt="" />
            <span class="userNum"> {{userInfo.userNum}}</span>
          </span>
          <span>
            <img :src="zuanshi" alt="" />
            {{userInfo.gradeName}}
          </span>
        </div>
      </div>
      <div class="setting" @click="$router.push('/my/account')">
        <img :src="mySetting" alt="" />
        <span class="settingBtn">账号设置</span>
      </div>
    </div>
    <!--我的账号栏目-->
    <div class="my_mode">
      <ul class="my_modeList">
        <li @click="$router.push('/my/myAccount')">
          <div class="layer myAccout">
            <img :src="userinfo1" alt="" />
          </div>
          <div class="item_li">我的账户</div>
        </li>
        <li @click="$router.push('/my/integral')">
          <div class="layer">
            <img :src="userinfo2" alt="" />
          </div>
          <div class="item_li">我的积分</div>
        </li>
        <li @click="$router.push('/my/collection')">
          <div class="layer">
            <img :src="userinfo3" alt="" />
          </div>
          <div class="item_li">我的收藏</div>
        </li>
        <li @click="$router.push('/my/history')">
          <div class="layer">
            <img :src="userinfo4" alt="" />
          </div>
          <div class="item_li">浏览历史</div>
        </li>
      </ul>
    </div>
    <!--我的订单-->
    <div class="my_order">
      <div class="my_order_top">
        <div class="my_order_top_title">我的订单</div>
        <div class="my_order_top_btn" @click='goOrder(-2)'>
          查看全部
        </div>
      </div>
      <ul class="my_orderList">
        <li @click='goOrder(0,1)'>
          <span class="number">{{userOrderInfo.waitPayOrderCount|zeroFilter}}</span>
          <img :src="order1" alt="" />
          <div class="item_li">待付款</div>
        </li>
        <li @click='goOrder(1,2)'>
          <span class="number">{{userOrderInfo.waitSendOrderCount|zeroFilter}}</span>
          <img :src="order2" alt="" />
          <div class="item_li">待发货</div>
        </li>
        <li @click='goOrder(2,3)'>
          <span class="number">{{userOrderInfo.waitReceiveOrderCount|zeroFilter}}</span>
          <img :src="order2" alt="" />
          <div class="item_li">待收货</div>
        </li>
        <li @click="$router.push('/evaluationCenter')">
          <span class="number">{{userOrderInfo.waitCommentOrderCount|zeroFilter}}</span>
          <img :src="order3" alt="" />
          <div class="item_li">评价</div>
        </li>
        <li @click="$router.push('/refund')">
          <img :src="order4" alt="" />
          <div class="item_li">退换/售后</div>
        </li>
      </ul>
    </div>
    <!--底部功能-->
    <div class="bottom_btn">
      <ul class="bottom_btnList">
        <li @click="gomyCard">
          <div class="layer_img">
            <img :src="coupon" alt="" />
          </div>
          <span>我的卡券</span>
        </li>
        <li @click="$router.push({ path: '/my/customerService' })">
          <div class="layer_img">
            <img :src="myProblem" alt="" />
          </div>
          <span>帮助与客服</span>
        </li>
        <li @click="$router.push({ path: '/my/address' })">
          <div class="layer_img">
            <img :src="myAddress" alt="" />
          </div>
          <span>收货地址管理</span>
        </li>

        <li @click="loginout">
          <div class="layer_img">
            <img :src="checklogin" alt="" />
          </div>
          <span>切换登录</span>
        </li>
      </ul>
      <div style="height: 100px;"></div>
    </div>

    <foot></foot>
  </div>
</template>
<script>
import ajax from "@utils/config";
import store from "@/store";
import foot from "@/components/footer.vue";
import loginout from "@/assets/js/loginout";
import { Toast } from "mint-ui";
export default {
  components: {
    foot
  },
  data() {
    return {
      img: require("@/assets/imagea/axsc.png"),
      mySetting: require("@/assets/imagea/my/my_setup_icon@2x.svg"),
      myProblem: require("@/assets/imagea/my/my_zhuanrang_problem_icon@2x.svg"),
      // 我的订单
      myAddress: require("@/assets/imagea/address.svg"),
      order1: require("@/assets/imagea/my/order1.svg"),
      order2: require("@/assets/imagea/my/order2.svg"),
      order3: require("@/assets/imagea/my/order3.svg"),
      order4: require("@/assets/imagea/my/order4.svg"),
      // 我的账号
      userinfo1: require("@/assets/imagea/my/userinfo1.svg"),
      userinfo2: require("@/assets/imagea/my/userinfo2.svg"),
      userinfo3: require("@/assets/imagea/my/userinfo3.svg"),
      userinfo4: require("@/assets/imagea/my/userinfo4.svg"),

      checklogin: require("@/assets/imagea/my/checklogin.svg"),
      coupon: require("@/assets/imagea/my/coupon.svg"),
      shengfenzheng: require("@/assets/imagea/my/shengfenzheng.svg"),
      zuanshi: require("@/assets/imagea/my/zuanshi.svg"),
      userInfo: {},
      userOrderInfo: {}
    };
  },
  computed: {},
  created() {
    this.getInfoData();
  },
  mounted() {},
  methods: {
    // 退出登录
    loginout() {
      ajax({
        url: "member-api-impl/longin/logout",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            // this.balance = response.data.balance;
            Toast("退出登录成功");
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });

      loginout();
    },
    getInfoData() {
      ajax({
        url: "member-api-impl/user/myHome",
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.userInfo = res.data.userInfo ? res.data.userInfo : {};
            this.userOrderInfo = res.data.userOrderInfo
              ? res.data.userOrderInfo
              : {};
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goOrder(type, index) {
      let tmpType = type;
      if (type === -2) {
        this.$router.push("/order");
      } else {
        this.$router.push({
          path: "/order",
          query: { type: tmpType, iindex: index }
        });
      }
    },
    gomyCard() {
      Toast("程序猿开发中~");
    }
  },

  filters: {
    zeroFilter(val) {
      if (val == 0) {
        return "";
      } else {
        return val;
      }
    }
  }
};

//
</script>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>