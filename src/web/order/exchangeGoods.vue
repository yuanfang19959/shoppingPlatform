<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType="barType" :barText="barText" @subSave="submit"></top>
      <blank></blank>
    </div>

    <div class="clear"></div>

    <div v-show="!check" v-if="!showTrue">
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
          <span>换货原因</span>
        </div>
        <div class="wl_right">
          <span>{{ reason.backDescription }}</span>
          <img :src="leftarrow" alt="" />
        </div>
      </div>

      <div class="box_content">
        <div class="wl_left">
          <span>换货说明:</span>
        </div>
        <input type="text" placeholder="选填" v-model="inpValue" />
      </div>

      <!-- 默认地址 -->
      <div class="content" @click="seleAddress">
        <div class="c1">
          <img :src="dw" alt="" class="dw" />
          <div class="left">
            <div class="top">
              <span class="s1">{{ address.consigneeName }}</span>
              <span class="phone">{{ address.consigneePhone }}</span>
            </div>
            <div class="addressTest">
              {{ address.receiveAddress }}
            </div>
          </div>
          <div class="right">
            <img :src="leftarrow" alt="" />
          </div>
        </div>
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
            <img :src="camera" alt="" @click="sheetVisible = !sheetVisible;actions = actions1;" />
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

        <div class="popSelected" v-for="(item, index) in checkReason" :key="item.id" @click="change(item)">
          <span>{{ item.backDescription }}</span>
          <div>
            <img :src="selectnull" alt="" v-show="!item.iflag" />
            <img :src="select" alt="" v-show="item.iflag" />
          </div>
        </div>
      </div>
    </mt-popup>

    <!-- 选择退货地址 -->
    <div v-show="check">
      <div class="content" v-for="(i, index) in addressList" @click="backC(i.id)">
        <div class="c1">
          <div class="left">
            <div class="top">
              <span class="s1">{{ i.name }}</span>
              <span class="phone">{{ i.phone }}</span>
            </div>
            <div class="addressTest">
              {{ i.addressDetail }}
            </div>
          </div>
          <span class="line"></span>
        </div>
      </div>
    </div>

    <!-- 提交成功显示的内容 -->
    <div class="successContent" v-show="showTrue">
      <img :src="file" alt="" />
      <div class="suc">换货申请已提交</div>
      <div class="btn">
        <button @click="$router.push('/refundDetails')">查看详情</button>
        <button @click="$router.push('/index')">返回首页</button>
      </div>
    </div>

    <!-- 上传照片 -->
    <mt-actionsheet :actions="actions" v-model="sheetVisible"> </mt-actionsheet>
    <input v-show="false" ref="filElem1" accept="image/*" type="file" capture="camera" @change="getFile(1)" />
    <input v-show="false" ref="filElem2" type="file" accept="image/png,image/gif,image/jpeg" class="upload-file"
      @change="getFile(2)" />
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
        centerData: { type: 0, name: "申请换货" },
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
      showTrue: false, //显示提交成功后的boolean 和下面check的boolean互不影响，但是缺一不可
      check: false, //用以显示地址列表
      sheetVisible: false,
      inpValue: "",
      reason: [],
      checkReason: [],
      listDetail: [],
      addressList: [], //地址列表
      actions1: [
        { name: "拍照", method: this.getCamera },
        { name: "从相册中选择", method: this.getLibrary }
      ],
      actions: [],
      address: {
        consigneeName: "",
        consigneePhone: "",
        receiveAddress: "",
        deliveryAddressId: null
      },
      selectAdd: null,
      orderId: null, //订单id
      backDescription: "", //退货理由
      returnPic: {}, //存储图片传值
      imgSrc: [],
      imgFiles:[]
    };
  },
  created() {
    let id = this.$route.query.id ? this.$route.query.id : null;
    this.orderId = id;
    console.log(this.orderId);
    this.getOrderDetails(id);
    this.getorderReason();
    this.getaddressList();
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
        optionParams: { backType: 2 }
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
    submit(obj) {
      //提交换货申请
      var returnPic = new FormData();
      this.imgFiles.forEach((item,index)=>{
          returnPic.append("returnPic"+index, item)
      })
      this.backDescription = this.reason.backDescription + "," + this.inpValue;
      if (this.reason.backDescription === undefined) {
        Toast("请选择退款原因！");
      } else {
        ajax({
          url:
            "order-api-impl/orderReturn/submitOrderinfoBack?orderId=" +
            this.orderId +
            "&returnType=2&backDescription=" +
            this.backDescription +
            "&deliveryAddressId=" +
            this.address.deliveryAddressId,
        //    optionParams: {returnPic0:returnPic.get("returnPic0"), returnPic1:returnPic.get("returnPic1"), returnPic2:null},
         optionParams: returnPic,
        //   contentType: "multipart/form-data"
        })
          .post()
          .then(response => {
            if (response.code === 200) {
              this.showTrue = true;
              Toast("提交成功！");
            } else {
              Toast(response.msg);
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    // 获取地址列表
    getaddressList() {
      ajax({
        url: "member-api-impl/user/deliveryAddressList ",
        optionParams: {}
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.addressList = response.data ? response.data : [];
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
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
          let len = this.$refs.filElem1.files.length;
          inputFile = this.$refs.filElem1.files[0];
          for(var i=0; i<len; i++){
            this.imgFiles.push(this.$refs.filElem1.files[i]);
          } 
      }else{
          inputFile = this.$refs.filElem2.files[0];
      }
    //   console.log(returnPic)
      if (
        inputFile.type !== "image/jpeg" &&
        inputFile.type !== "image/png" &&
        inputFile.type !== "image/gif"
      ) {
        Toast("不是有效的图片文件！");
        return;
      }
      
      let reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onload = function(e) {
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
            let list = response.data ? response.data : {};
            this.address.consigneeName = list.consigneeName;
            this.address.consigneePhone = list.consigneePhone;
            this.address.receiveAddress = list.receiveAddress;
            this.address.deliveryAddressId = list.deliveryAddressId;
            console.log(this.listDetail);
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 选择换货地址
    seleAddress() {
      this.check = true;
    },
    //选择地址列表的地址用以显示出来
    backC(id) {
      this.check = false;
      this.addressList.forEach(item => {
        if (item.id === id) {
          this.address.consigneeName = item.name;
          this.address.consigneePhone = item.phone;
          this.address.receiveAddress = item.addressDetail;
          this.address.deliveryAddressId = item.id;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/applyRefund.scss";
@import "./scss/exchangeGoods.scss";
</style>
