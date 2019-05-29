<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType="barType" :barText="barText"></top>
      <blank></blank>
    </div>
    <blank></blank>
    <div class="clear"></div>
    <!-- message -->

    <div class="over">
      <div class="content">
        <div class="top">
          <input type="text" placeholder="标题(必填)" v-model="inputValue" />
        </div>
        <div class="middle">
          <textarea placeholder="正文(必填，15~200字)" maxlength="200" minlength="15" v-model="textValue"></textarea>
        </div>
      </div>
      <div class="btn" @click="submit">完成</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from "@utils/config";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    blank,
    top
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "编辑留言" },
        rightData: { type: 1, name: "" }
      },
      ischecked: false,
      flag: false,
      nameF: "zzb",
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      garbage: require("@/assets/imagea/my/garbage.svg"),
      activeIndex: 0,
      msgId: null, //消息id
      inputValue: "",
      textValue: ""
    };
  },
  methods: {
    selectActive(index) {
      this.activeIndex = index;
    },
    pushContent() {
      ajax({
        url: "member-api-impl/message/replyMessageTalk",
        optionParams: {
          mainBody: this.textValue,
          receiveUserId: this.msgId,
          title: this.inputValue
        }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            Toast("提交成功");
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submit() {
      if (this.inputValue.length >= 1) {
        if (this.textValue.length >= 15) {
          this.pushContent();
          this.$router.go(-1);
        } else {
          Toast("内容最少15字！");
        }
      } else {
        if (this.textValue.length >= 15) {
          Toast("请输入标题！");
        } else {
          Toast("标题最少于1字，内容最少15字！");
        }
      }
    }
  },
  created() {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
  },
  mounted() {
    this.msgId = this.$route.query.id * 1;
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/editmessage.scss";
.default {
  color: black;
}
.default-active {
  color: #e1212d;
  border-bottom: 1px solid #e1212d;
}
.breadcrumb {
  height: 130px;
}
</style>
