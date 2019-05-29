<template>
  <div class="mainCon">
    <div class="bannerShow">
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>
    <div class="clear"></div>
    <!-- 包含倒计时 -->
    <div class="top_price">
      <span class="s1">支付剩余时间 {{ time }}</span>
      <span>¥<span class="s2">180.00</span></span>
      <span class="s3">河堤村 五谷杂粮礼盒装-5453457453153453</span>
    </div>

    <!-- 支付方式 -->
    <div class="pay_way">
      <div class="pay_m1" v-for="(i, index) in arr" :key="i.id" @click="change(index,arr)">
        <div class="left">
          <img :src="i.src" alt="" />
          <span>{{ i.name }}</span>
          <span class="card" @click="flag=true" v-show="setDefault == i.id ? true : false">{{bank}}<img :src="arbott"
              alt="" /></span>
        </div>
        <div class="right">
          <img :src="selectnull" alt="" v-show="!i.check" />
          <img :src="select" alt="" v-show="i.check" />
        </div>
      </div>

    </div>
    <span class="btn" @click="pay">确认支付</span>

    <!-- 遮罩 -->
    <div class="popContent" id="pop" v-show="flag" @click="flag=false">
      <div class="popBox">
        <div class="top">
          选择银行卡
          <img :src="close" alt="" />
        </div>

        <div class="card" v-for="(i,index) in list" :key="i.id" @click="change(index,list);selectVal(index)">
          <div class="left">
            <img :src="i.src" alt="" />
            <span>{{ i.name }}</span>
          </div>
          <div class="right">
            <img :src="selectnull" alt="" v-show="!i.check" />
            <img :src="select" alt="" v-show="i.check" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast } from "mint-ui";
import { setInterval, clearInterval } from "timers";
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
        centerData: { type: 0, name: "支付订单" },
        rightData: { type: 1, name: "" }
      },
      lastindex: "",
      setDefault: 3,
      blackup: require("@/assets/imagea/blackup.svg"),
      sucBox: require("@/assets/imagea/sucBox.svg"),
      arbott: require("@/assets/imagea/pay/arbott.svg"),
      close: require("@/assets/imagea/pay/close.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      flag: false,
      bank: "请选择银行",
      arr: [
        {
          name: "支付宝支付",
          id: "1",
          check: false,
          src: require("@/assets/imagea/pay/alipay.svg")
        },
        {
          name: "微信支付",
          id: "2",
          check: false,
          src: require("@/assets/imagea/pay/wechat.svg")
        },
        {
          name: "银行卡支付",
          id: "3",
          check: false,
          src: require("@/assets/imagea/pay/bkcard.svg")
        }
      ],
      list: [
        {
          name: "中国工商银行信用卡(0645)",
          id: "1",
          check: false,
          src: require("@/assets/imagea/pay/alipay.svg")
        },
        {
          name: "中国农业银行储蓄卡(5456)",
          id: "2",
          check: false,
          src: require("@/assets/imagea/pay/wechat.svg")
        },
        {
          name: "使用新卡支付",
          id: "3",
          check: false,
          src: require("@/assets/imagea/pay/bkcard.svg")
        }
      ],
      minutes: 14,
      seconds: 59,
      count: 0,
      time: "",
      timer: ""
    };
  },
  created() {
    this.timer = setInterval(() => {
      this.seconds -= 1;
      this.count += 1;
      if (this.seconds >= 0 && this.seconds < 10) {
        this.seconds = "0" + this.seconds;
      }
      if (this.count == 60) {
        this.minutes -= 1;
        this.seconds = 59;
        this.count = 0;
      }
      //   console.log(this.seconds, this.count);
      return (this.time = this.minutes + ":" + this.seconds);
    }, 1000);
  },
  mounted() {
    setTimeout(() => {
      Toast("支付超时！");
      clearInterval(this.timer);
      this.time = "00:00";
      //   this.$router.push("/index");
      //获取订单后给后端，交易关闭
    }, 900000); //设置15分钟订单支付时间

    this.loadSize();
    //根据屏幕大小加载遮罩的高度

    this.lastindex = this.list.length;
  },
  methods: {
    getaddressList() {
      ajax({
        url: "tAppUser/userInfo",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            // this.balance = response.data.balance;
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    change(index, array) {
      array.forEach(item => {
        item.check = false;
      });
      array[index].check = !array[index].check;
    },
    pay() {
      let sum = 0;
      this.arr.map(item => {
        if (item.check) {
          sum = 1;
          return;
        }
      });
      if (sum == 1) {
        Toast({
          message: "跳转中...",
          duration: 2000
        });
        // this.flag = true;
        this.$router.push("/paySuc");
      } else {
        Toast({
          message: "请选择一种支付方式",
          duration: 2000
        });
      }
    },
    loadSize() {
      var divheight = 0;
      var clienth =
        document.compatMode === "CSS1Compat"
          ? document.documentElement.clientHeight
          : document.body.clientHeight;
      divheight = clienth;
      var pop = document.getElementById("pop");
      pop.style.height = divheight + "px";
    },
    selectVal(index) {
      this.bank = this.list[index].name;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "./scss/pay.scss";
</style>

