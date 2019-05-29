<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top
        :barType="barType"
        :barText="barText"
        @subSave="submit($route.query.id * 1)"
      ></top>
      <blank></blank>
    </div>

    <div class="clear"></div>
    <div v-show="!showTrue">
      <!-- //商品简要信息 -->
      <div class="topContent" v-for="item in listDetail">
        <img :src="item.goodsImage" alt="" />
        <div class="topLeft">
          <p>{{ item.goodsName }}</p>
          <span>净含量{{ item.weight }}</span>
        </div>
      </div>

      <div class="box_content" @click="popUP">
        <div class="wl_left">
          <span>退款原因</span>
        </div>
        <div class="wl_right">
          <span>{{ reason.backDescription }}</span>
          <img :src="leftarrow" alt="" />
        </div>
      </div>

      <div class="box_content">
        <div class="wl_left">
          <span>退款说明:</span>
        </div>
        <input type="text" placeholder="选填" v-model="inpValue" />
      </div>

      <!-- 上传图片 new -->
      <div class="camera">
        <!-- 用于存放照片显示缩略图 -->
        <div class="rightCame" v-for="(item, index) in imgSrc" :key="index">
          <img :src="item" alt="" style="width: 100px;height: 150px;" />
          <span @click="delete_img(index)" class="del">删除</span>
        </div>
        <div class="leftCame">
          <div class="imgC">
            <img :src="camera" alt="" @click="sheetVisible = !sheetVisible;actions = actions1;"/>
          </div>
          <div class="camera_text">
            <span>上传凭证</span>
          </div>
        </div>

      </div>
    </div>

    <!-- 弹出窗口 -->
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
      <div class="popContent">
        <div class="popTop">
          <span class="cancel" @click="popCancel">取消</span>
          <span class="confirm" @click="popupVisible = false">确定</span>
        </div>

        <div class="popSelected" v-for="(item) in checkReason" :key="item.id" @click="change(item)">
          <span>{{ item.backDescription }}</span>
          <div>
            <img :src="selectnull" alt="" v-show="!item.iflag" />
            <img :src="select" alt="" v-show="item.iflag" />
          </div>
        </div>
      </div>
    </mt-popup>

    <!-- 提交成功显示的内容 -->
    <div class="successContent" v-show="showTrue">
      <img :src="file" alt="" />
      <div class="suc">换货申请已提交</div>

      <div class="btn">
        <button @click="$router.push({ path: '/refundDetails',query: { id: $route.query.id }})">
          查看详情
        </button>
        <button @click="$router.push('/index')">返回首页</button>
      </div>
    </div>

    <!-- 上传照片 -->
    <mt-actionsheet :actions="actions" v-model="sheetVisible"> </mt-actionsheet>
    <input
      v-show="false"
      ref="filElem1"
      accept="image/*"
      type="file"
      capture="camera"
      @change="getFile(1)"
    />
    <input
      v-show="false"
      ref="filElem2"
      type="file"
      accept="image/png,image/gif,image/jpeg"
      class="upload-file"
      @change="getFile(2)"
    />
  </div>
</template>


<script>
import { Toast, Popup } from "mint-ui";
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
        leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
        centerData: { type: 0, name: "申请退款" },
        rightData: { type: 0, name: "提交" }
      },
      dw: require("@/assets/imagea/dw.svg"),
      meat: require("@/assets/imagea/meat.png"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      camera: require("@/assets/imagea/camera.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      file: require("@/assets/imagea/file.svg"),
      popupVisible: false,
      flag: false,
      showTrue: false,
      sheetVisible: false,
      inpValue: "",
      reason: [],
      checkReason: [],
      listDetail: [],
      actions1: [
        { name: "拍照", method: this.getCamera },
        { name: "从相册中选择", method: this.getLibrary }
      ],
      actions: [],
      param: {
        backDescription: "",
        orderId: null, //订单id
        returnType: 1, //换货状态 1退货 2换货
        returnPic: ""
      },
      imgSrc: [],
      inputFile:[]
    };
  },
  created() {
    let id = this.$route.query.id ? this.$route.query.id : null;
    this.getOrderDetails(id);
    this.getorderReason();
  },
  methods: {
    delete_img(item) {
      this.imgSrc.splice(item, 1);
    },
    getCamera() {
      console.log("getCamera");
      this.$refs.filElem1.dispatchEvent(new MouseEvent("click"));
    },
    getLibrary() {
      console.log("getLibrary");
      this.$refs.filElem2.dispatchEvent(new MouseEvent("click"));
    },
    // 获取退款原因
    getorderReason() {
      ajax({
        url: "order-api-impl/orderReason/orderReasonList",
        optionParams: { backType: 1 }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.checkReason = response.data ? response.data : [];
            this.checkReason.map(item => {
              this.$set(item, "iflag", false);
            });
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submit(orderid) {
      //请选择退款原因
      this.param.backDescription =
        this.reason.backDescription + "," + this.inpValue;
      this.param.orderId = orderid;
      if (this.reason.backDescription === undefined) {
        Toast("请选择退款原因！");
      } else {
        // returnPic
        ajax({
          url:
            "order-api-impl/orderReturn/submitOrderinfoBack?orderId=" +
            this.param.orderId +
            "&returnType=1&backDescription=" +
            this.param.backDescription,
          optionParams: { returnPic: this.param.returnPic },
          contentType: "multipart/form-data"
        })
          .post()
          .then(response => {
            if (response.code === 200) {
              this.showTrue = true;
              Toast("提交成功");
            } else {
              console.log(response);
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    popUP() {
      this.popupVisible = true;
    },
    popCancel() {
      this.popupVisible = false;
      //   this.reason.backDescription = null;
    },
    change(item) {
      //单选
      this.checkReason.forEach(item => {
        item.iflag = false;
      });
      item.iflag = true;
      this.reason = item;
    },
    getFile(type) {
      let that = this,inputFile;
      if(type == 1){
           inputFile = this.$refs.filElem1.files[0];
      }else{
           inputFile = this.$refs.filElem2.files[0];
      }
      console.log(inputFile);
      if (
        inputFile.type !== "image/jpeg" &&
        inputFile.type !== "image/png" &&
        inputFile.type !== "image/gif"
      ) {
        Toast("不是有效的图片文件！");
        return;
      }
      this.param.returnPic = inputFile;
      console.log(this.param.returnPic)
      let reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onload = function(e) {
        // alert('a')
        // console.log("this.result==", this.result);
        that.imgSrc.push(this.result);
      };
    },
    //获取订单详情
    getOrderDetails(id) {
      ajax({
        url: "order-api-impl/order/getOrderinfoView?id=" + id,
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.goodsList = response.data ? response.data : [];
            this.listDetail = response.data.listDetail
              ? response.data.listDetail
              : [];
            console.log(this.listDetail);
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
@import "./scss/applyRefund.scss";
@import "./scss/exchangeGoods.scss";
</style>
