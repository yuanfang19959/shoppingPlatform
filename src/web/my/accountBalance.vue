<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>
    <div class="content" id="xh">
      <div class="c1">
        <span>账户余额</span>
        <span class="money">{{infoData.balanceMoney|forma1}}</span>
      </div>
    </div>
    <div class="content">

      <div class="c1" @click='gourl(0)'>
        <span>提现到微信</span>
        <div>
          <img :src="leftarrow" alt="" />
        </div>
      </div>
      <div class="c1" @click='gourl(1)'>
        <span>提现到银行卡</span>
        <div>
          <img :src="leftarrow" alt="" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ajax from "@utils/config";
import { Loadmore, MessageBox, Toast } from "mint-ui";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    top,
    blank
  },
  data() {
    return {
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "我的账户" },
        rightData: { type: 1, name: "" }
      },
      infoData: {}
    };
  },
  created() {
    this.getInfoData();
  },
  mounted() {},
  methods: {
    // 跳转方法
    gourl(type) {
      if (!type) {
        Toast("暂时不支持微信提现");
      } else {
        let money = this.infoData.balanceMoney;
        this.$router.push({ path: "/my/drawing", query: { money: money } });
      }
    },
    getInfoData() {
      ajax({
        url: "member-api-impl/user/myBalance",
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.infoData = res.data ? res.data : {};
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/accountBalance.scss";
</style>
