<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <top :barType='barType' :barText='barText'></top>
    <blank></blank>

    <div class="content">
      <!-- 一张卡片主体 -->
      <div class="oneCard" v-for="item in cardList" :key="item.id">
        <div class="card">
          <img :src="card" alt="" />
        </div>

        <!-- 卡卷内容需要定位 -->
        <div class="cardText">
          <div class="left">
            <span class="s0"><span class="s0_1">¥</span>{{ item.Denomination }}</span>
            <div class="left_r">
              <span class="s1">{{ item.type }}</span>
              <span class="s2">{{ item.condition }}</span>
              <span class="s3">{{ item.useTime }}</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="right">
            立即使用
          </div>
        </div>
      </div>
    </div>

    <div class="bottom" v-show="!flag">没有更多了</div>
    <div class="bottom" v-show="flag">这里空空的</div>
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
      flag: false,
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "我的卡券" },
        rightData: { type: 1, name: "" }
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      card: require("@/assets/imagea/my/card.svg"),
      cardList: [
        {
          id: 1,
          Denomination: 100,
          type: "果蔬生专用券",
          condition: "满3000.01使用",
          useTime: "2019.3.19——2019.5.19"
        },
        {
          id: 2,
          Denomination: 1000,
          type: "果蔬生专用券",
          condition: "满3000.01使用",
          useTime: "2019.3.19——2019.5.19"
        },
        {
          id: 3,
          Denomination: 100,
          type: "果蔬生专用券",
          condition: "满3000.01使用",
          useTime: "2019.3.19——2019.5.19"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    load() {
      if (cardList.length != 0) {
        this.flag = false;
      }
    },
    getList() {
      ajax({
        url: "tAppUser/userInfo",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.balance = response.data.balance;
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
@import "./scss/myCard.scss";
</style>
