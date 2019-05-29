 <template>
  <div class="breadcrumb">
    <ul class="flexbox barType0" v-if="barType == 0">
      <!--判断是否需要判断跳转特定地址-->
      <li
        class=" leftItem"
        v-if="barText.leftData && barText.leftData.type != 2"
        @click="clearVal"
      >
        <div
          v-if="barText.leftData.type == 0"
          v-text="barText.leftData.name"
        ></div>
        <img v-else :src="barText.leftData.name" />
      </li>
      <li
        class=" leftItem"
        v-if="barText.leftData && barText.leftData.type == 2"
        @click="$router.push(barText.leftData.path)"
      >
        <div
          v-if="barText.leftData.type == 0"
          v-text="barText.leftData.name"
        ></div>
        <img v-else :src="barText.leftData.name" />
      </li>
      <li class="flex2 centerItem">
        <div :class="{ center_input: barText.centerData.type == 3 }">
          <img
            v-if="barText.centerData.type == 3"
            class="searchimg"
            :src="searchimg"
            alt=""
          />
          <div
            v-if="barText.centerData.type == 0"
            v-text="barText.centerData.name"
          ></div>
          <img
            v-if="barText.centerData.type == 1"
            :src="barText.centerData.name"
          />
          <div class="searchinput_layer" v-if="barText.centerData.type == 3">
            <input
              @keyup.enter="inputSub"
              v-model="inputVal"
              class="searchinput"
              type="text"
              :placeholder="barText.centerData.name"
              ref="search"
            />
          </div>
          <img
            v-if="barText.centerData.type == 3"
            class="searchimg"
            :src="searchimg"
            alt=""
          />
        </div>
      </li>
      <li class="rightItem" @click="subSave">
        <div
          v-if="barText.rightData.type == 0"
          v-text="barText.rightData.name"
        ></div>
        <img v-else :src="barText.rightData.name" />
      </li>
    </ul>
    <ul class="flexbox barType1" v-if="barType == 1">
      <li class="flex1">
        <div class="center_input leftData">
          <img class="searchimg" :src="searchimg" alt="" />
          <div class="searchinput_layer">
            <input
              @keyup.enter="inputSub"
              class="searchinput"
              v-model="inputVal"
              type="text"
              :placeholder="barText.leftData.name"
            />
          </div>
          <img class="searchimg" :src="searchimg" alt="" />
        </div>
      </li>
      <li class="centerData" @click="subSave">
        <div
          v-if="barText.centerData.type == 0"
          v-text="barText.centerData.name"
        ></div>
        <img v-else :src="barText.centerData.name" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // bar样式 0 常用样式  1 左边占满，右边只有按钮或者文本 2
    barType: {
      type: String,
      default: function() {
        return "0";
      }
    },
    // pageType: {
    //     type: Number,
    //     default: function() {
    //         return '0';
    //     }
    // },
    // 显示的数据 type 0 为文本 1 为图片 2 为中间区域特殊样式
    // leftData type 2 path 跳转为非默认跳转
    barText: {
      type: Object,
      default: function() {
        return {
          leftData: { type: 0, name: "返回" },
          centerData: { type: 0, name: "" },
          rightData: { type: 0, name: "保存" }
        };
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
    },
    //输入框的值非placeholder
    seachValue: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      img: require("@/assets/imagea/blackup.svg"),
      imgR: require("@/assets/imagea/msgimg.svg"),
      indextopImg: require("@/assets/imagea/indextopImg.svg"), //首页图标 pageType 1
      clsTopImg: require("@/assets/imagea/clsTopImg.svg"), //商品分类 pageType 2
      searchimg: require("@/assets/imagea/searchimg.svg"),
      inputVal: "" //输入框传值
    };
  },
  created() {},
  mounted() {
    let val = localStorage.getItem("val");
    console.log(val);
    if (this.barText.centerData.type == 3) {
      if (val === null || val === "") {
        this.$refs["search"].focus();
      }
    }
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
      this.$emit("subSave", this.inputVal); //使用$emit()引入父组件中的方法
    },
    inputSub() {
      console.log("请求父组件方法 输入提交");
      // inputVal
      this.$emit("inputSub", this.inputVal);
      this.$refs["search"].blur(); //回车失去焦点，隐藏键盘；
    },
    clearVal() {
      //页面跳转之前先清除localstorage中的搜索值，跟别的页面是有关联的
      localStorage.setItem("val", "");
      this.$router.go(-1);
      localStorage.setItem("selectHotGoods",0);
    }
  },
  watch: {
    seachValue(newValue, oldValue) {
      this.inputVal = newValue;
    }
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/scss/commin.scss";
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
}
</style>
<style lang='scss' scoped>
@import "@/assets/scss/commin.scss";
.breadcrumb {
  font-size: 35px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  /*padding: 0 15px;*/
  line-height: 92px;
  height: 92px;
  vertical-align: middle;
  img {
    vertical-align: middle;
  }
  .leftItem {
    text-align: left;
    padding-left: 15px;
  }
  .rightItem {
    text-align: right;
    padding-right: 15px;
  }
  .searchinput_layer {
    /*width: 100%;*/
    display: inline-block;
    background: rgba(244, 246, 249, 0);
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
      /*margin-left: 70px;*/
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
  .barType1 {
    .leftData {
      width: 72%;
      left: 30px;
      right: auto;
      text-align: left;
    }
    .centerData {
      width: 200px;
      text-align: center;
    }
  }
  .barType0 {
    .center_input {
      .searchinput_layer {
        input.searchinput {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
