<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText' @subSave='submitForm'></top>
      <blank></blank>
    </div>

    <div class="clear"></div>

    <div class="topmain">
      <!-- //商品简要信息 -->
      <div class="ones" v-for="(i,index) in goodsInfo" :key="i.id">
        <div class="topContent">
          <img :src="i.goodsImage" alt="" />
          <div class="topLeft">
            <p>{{i.goodsName}}</p>
            <span>净含量{{i.goodsSpecification}}克</span>
          </div>
        </div>

        <div class="write">
          <star @func="getStarCount" class="star" :itemIndex='i.index'></star>
          <textarea v-model='i.content' placeholder="在这里输入评价" rows="8" cols="47"> </textarea>
        </div>
        <!-- 若要遍历，从上面开始下面为底部匿名按钮 -->
        <div class="write_bottom" @click="change(index)">
          <span>匿名</span>
          <img :src="select" alt="" v-show="i.isAnon==2" />
          <img :src="selectnull" alt="" v-show="i.isAnon==1" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { Toast, Popup } from "mint-ui";
import ajax from "@utils/config";
import star from "@/components/star.vue";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    star,
    top,
    blank
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "编写评价" },
        rightData: { type: 0, name: "发布" }
      },
      meat: require("@/assets/imagea/meat.png"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      camera: require("@/assets/imagea/camera.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      file: require("@/assets/imagea/file.svg"),
      flag: false,
      StarCount: null,
      goods: [],
      form: {
        content: [], //评价内容
        isAnon: [2, 2], // 是否匿名 1-匿名 2-非匿名
        productId: 0, //产品id
        rank: [] //星级
      },
      goodsInfo: [],
      orderId: ""
    };
  },
  created() {
    // this.getaddressList();
  },
  mounted() {
    let id = this.$route.query.orderId;
    this.orderId = id ? id : "";
    this.getGoodsCommentData();
  },
  methods: {
    change(index) {
      let isAnon = this.goodsInfo[index].isAnon;
      isAnon == 1 ? (isAnon = 2) : (isAnon = 1);
      this.goodsInfo[index].isAnon = isAnon;
    },
    //获取子组件星星的值
    getStarCount(fromSon, index) {
      this.StarCount = fromSon;
      this.goodsInfo[index].rank = fromSon;
    },
    // 通过订单号获取未评价商品
    getGoodsCommentData() {
      ajax({
        url: "order-api-impl/orderComm/list?orderId=" + this.orderId,
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.goodsInfo = res.data ? res.data : [];
            this.goodsInfo.map((item, index) => {
              this.$set(item, "isAnon", 1);
              this.$set(item, "index", index);
              this.$set(item, "rank", 0);
              this.$set(item, "content", "");
            });
            console.log("this.goodsInfo==", this.goodsInfo);
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 提交评价
    submitForm() {
      let form = {
          orderId: this.orderId,
          commList: []
        },
        commList = [];
      this.goodsInfo.map(item => {
        commList.push({
          content: item.content,
          isAnon: item.isAnon,
          productId: item.id,
          rank: item.rank
        });
      });
      form.commList = commList;
      ajax({
        url: "order-api-impl/orderComm/submit",
        optionParams: form
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.userInfo = res.data.userInfo ? res.data.userInfo : {};
            this.userOrderInfo = res.data.userOrderInfo
              ? res.data.userOrderInfo
              : {};
            Toast("发布成功");
            this.$router.push("/evaluationSuc");
          } else {
            console.log(res);
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
@import "./scss/writeEvaluation.scss";
.star {
  width: 471px;
  position: relative;
  right: -218px;
}
</style>
