<template>
  <div class="breadcrumb">
    <img
      :src="img"
      v-show="pageType == '0' || pageType == '4'"
      alt=""
      class="back"
      @click="goUrl()"
    />
    <img
      :src="indextopImg"
      v-show="pageType == 1"
      alt=""
      class="back"
      @click="$router.push({ path: '/cls' })"
    />
    <img
      :src="clsTopImg"
      v-show="pageType == 2"
      alt=""
      class="back"
      @click="goUrl()"
    />
    <span class="center_input" v-if="pageType != '4'">
      <img class="searchimg" :src="searchimg" alt="" />
      <div class="searchinput_layer">
        <input
          class="searchinput"
          type="text"
          :placeholder="placeholder"
          @click="$router.push({ path: '/goodsList' })"
        />
      </div>
    </span>
    <span v-else class="centerText">
      <span v-text="centerText"></span>
    </span>
    <span class="back backR backRText">
      <img
        v-if="!mesUnread"
        :src="imgR"
        alt=""
        @click="$router.push({ path: '/message' })"
        class="readMes"
      />
      <img
        v-if=" mesUnread"
        :src="imgU"
        alt=""
        @click="$router.push({ path: '/message' })"
        class="readMes"
      />
      <span v-else v-text="rigthText" @click="subSave"></span>
    </span>
  </div>
</template>

<script>
// import isWeiXin from '@/assets/js/commin';
import ajax from "@utils/config";
export default {
  props: {
    pageType: {
      type: Number,
      default: function() {
        return "0";
      }
    },
    centerText: {
      type: String,
      default: function() {
        return "";
      }
    },
    rigthText: {
      type: String,
      default: function() {
        return "";
      }
    },
    placeholder: {
      type: String,
      default: function() {
        return "输入搜索关键词 商品/服务/乡村";
      }
    }
  },
  data() {
    return {
      img: require("@/assets/imagea/blackup.svg"),
      imgR: require("@/assets/imagea/msgimg.svg"),
      imgU: require("@/assets/imagea/unlook.svg"),
      indextopImg: require("@/assets/imagea/indextopImg.svg"), //首页图标 pageType 1
      clsTopImg: require("@/assets/imagea/clsTopImg.svg"), //商品分类 pageType 2
      searchimg: require("@/assets/imagea/searchimg.svg"),
      mesUnread: false //判断是否有未读消息的boolean
    };
  },
  created() {
    this.newMessage();
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
    //路由跳转监听
    goUrl() {
      if (
        window.location.href.indexOf("token=") != -1 ||
        window.location.href.indexOf("approuter") != -1
      ) {
        window.location.href = "https://www.baidu.com";
      } else {
        this.$router.go(-1);
      }
    },
    subSave() {
      console.log("请求父组件方法");
      this.$emit("subSave"); //使用$emit()引入父组件中的方法
    },
    newMessage() {
      //获取未读消息数量来显示图标
      ajax({
        url: "member-api-impl/message/getMessageListByUserId",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            let unreadCount = response.data ? response.data[0].unreadCount : {};
            if (unreadCount != 0) {
              this.mesUnread = true;
            }
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
<style lang='scss' scoped>
.breadcrumb {
  background: #e1212d;
  /*height: 31px;*/
  font-size: 31px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  height: 92px;
  line-height: 92px;
  width: 100%;
  text-align: center;
  /* position: relative;*/
  position: fixed;
  top: 0;
  z-index: 999;
  .back {
    /*width: 18px;
        height: 32px;*/
    position: absolute;
    left: 36px;
    top: 20px;
    &.backR {
      right: 36px;
      left: auto;
    }
    &.backRText {
      top: 0px;
      color: #fff;
    }
  }
  .centerText {
    color: #fff;
    letter-spacing: 4px;
  }
  .center_input {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 61px;
    line-height: 61px;
    background: rgba(244, 246, 249, 0.4);
    border-radius: 31px;
    width: 70%;
    margin: auto;
    text-align: center;
    .searchimg {
      position: absolute;
      left: 23px;
      top: 13.5px;
    }
    .searchinput_layer {
      width: 80%;
      /*background: rgba(244, 246, 249, 0);*/
      input.searchinput {
        border: 0px;
        /*background: rgba(244, 246, 249, 0);*/
        background: transparent;
        font-size: 27px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        /*color: #fff;*/
        /*opacity: 1;*/
        width: 100%;
        margin-left: 70px;
        text-indent: 5px;
        display: inline-block;
        &::-webkit-input-placeholder {
          color: #fff;
        }
      }
    }
    input:focus {
      outline: 0;
    }
  }
  .readMes {
    position: relative;
    top: 10px;
    right: -15px;
  }
}
</style>
