<template>
  <div class="comfirmBox" v-if="confirmBox.boxisShow">
    <!-- 确认充值弹框 -->
    <div class="test" v-if="confirmBox.isShow">
      <div class="blank"></div>
      <!-- 弹框 -->
      <div class="messageBxo">
        <div class="blank"></div>
        <div class="title">
          支付到担保账户
          <img
            src="~@/assets/images/close.png"
            alt
            class="close"
            @click="confirmBox.isShow = false;confirmBox.boxisShow = false;"
          >
        </div>
        <div class="realTitle">实际支付</div>
        <div class="amount">¥{{confirmBox.amount | formatMoney}}元</div>
        <div class="payStyle">
          <div class="style">支付方式</div>
          <div
            class="name"
            v-if="confirmBox.payType === 2"
            @click="confirmBox.isShow = false;payStyleBox.isShow = true;"
          >
            {{confirmBox.str}}尾号{{confirmBox.bankCardNo | bankCardShow}}
            <img src="~@/assets/images/back2_icon@2x.png" alt>
          </div>
          <div
            class="name"
            v-if="confirmBox.payType === 1"
            @click="confirmBox.isShow = false;payStyleBox.isShow = true;"
          >
            余额支付(可用：¥{{balance}})
            <img src="~@/assets/images/back2_icon@2x.png" alt srcset>
          </div>
        </div>
        <div class="payStyle">
          <div class="style">折扣金额</div>
          <div class="name">{{confirmBox.amount | formatMoney}}元</div>
        </div>
        <div class="chongzhi">
          <div class="style">手续费</div>
          <div class="name">{{confirmBox.fare | formatMoney}}元</div>
        </div>
        <div class="valideCode" v-if="confirmBox.payType === 2">
          <div class="style">验证码</div>
          <input
            name="carType"
            maxlength="6"
            v-model="confirmBox.validatecode"
            type="text"
            class="input_text"
            placeholder="请输入验证码"
          >
          <div class="reSendMsg" v-show="!isShow" @click="getCode()">获取</div>
          <div class="reSendMsg countDown" v-show="isShow">{{count}} s</div>
        </div>
        <input
          type="password"
          v-if="confirmBox.payType === 1"
          maxlength="6"
          class="pwd"
          placeholder="请输入交易密码"
          v-model="confirmBox.transPassword"
        >
        <div v-if="!payStyleBox.isShow" class="payNow" @click="confirmCash()">立即支付</div>
      </div>
    </div>
    <!-- 支付方式选择 -->
    <div class="test" v-if="payStyleBox.isShow">
      <div class="blank"></div>
      <!-- 弹框 -->
      <div class="messageBxo">
        <div class="blank"></div>
        <div class="title">
          支付方式
          <img
            src="~@/assets/images/back_icon@2x.png"
            width="23"
            height="23"
            alt
            class="close"
            @click="payStyleBox.isShow = false;confirmBox.isShow = true;"
          >
        </div>
        <div
          class="payStyle"
          v-for="(item,index) in cardCheckList"
          :key="index"
          @click="tabSelectOne(index)"
        >
          <div class="style">{{item.str}}{{item.bankCardNo | bankCardShow}}</div>
          <div class="name">
            <img v-if="item.isShow" src="~@/assets/images/selected.png" alt class="close">
          </div>
        </div>
        <!-- <div class="payStyle"  @click="">
                              <div class="style">余额支付</div>
                              <div class="name"><img v-if="itemImg2Show" src="~@/assets/images/selected.png"  @click="itemImg2Show = !itemImg2Show"  alt="" class="close"></div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import ajax from "@utils/config";
import { Toast } from "mint-ui";
export default {
  props: {
    // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
    confirmBox: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //弹框标题
    params: {
      type: Object, //Boolean Array Object
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      count: "",
      isShow: false,
      productlist: "",
      timer: null,
      requestnoStatus: false,
      payStyleBox: {
        //支付方式
        isShow: false,
        bankList: []
      },
      cardCheckList: [],
      balance: "" //可用余额
    };
  },
  created() {
    this.getTable();
    this.getUserInfo();
  },
  methods: {
    //获取用户基本信息
    getUserInfo() {
      ajax({
        url: "tAppUser/userInfo",
        optionParams: {}
      })
        .fetch()
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
    },
    //银行卡信息
    getTable() {
      this.cardCheckList = [];
      ajax({
        url: "userCard/list",
        optionParams: {}
      })
        .fetch()
        .then(response => {
          if (response.code === 200) {
            this.productlist = response.data ? response.data : [];
            this.productlist.map(itm => {
              var arr = itm.bankName.split("·");
              var suffix = arr[arr.length - 1];
              let str = itm.bankName.substr(0, itm.bankName.indexOf("·"));
              let obj = {
                suffix: "",
                str: "",
                bankCardNo: "",
                userCardId: "",
                isShow: false,
                payType: 2
              };

              if (itm.isMatser == 1) {
                this.product = itm;

                this.confirmBox.suffix = suffix;
                this.confirmBox.str = str;
                this.confirmBox.bankCardNo = itm.bankCardNo;
                this.confirmBox.userCardId = "";
                this.confirmBox.payType = 1;
              }
              obj.suffix = suffix;
              obj.bankCardNo = itm.bankCardNo;
              obj.str = str;
              obj.userCardId = itm.id;
              obj.payType = 2;
              obj.isShow = false;
              this.cardCheckList.push(obj);
            });
            //余额支付带入
            let obj = {
              suffix: "",
              str: "余额支付(可用：" + this.balance + ")",
              isShow: true,
              userCardId: "",
              payType: 1,
              bankCardNo: ""
            };
            this.cardCheckList.push(obj);
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //充值操作

    //第三方支付
    getCode() {
      // if (!this.confirmBox.validatecode) {
      //     Toast('请输入验证码！');
      //     return false;
      // }
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.isShow = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.isShow = false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      this.params.payType = this.confirmBox.payType;
      this.params.userCardId = this.confirmBox.userCardId;
      ajax({
        url: "orderTransfer/masterPay",
        optionParams: {
          userCardId: this.confirmBox.userCardId,
          transferId: this.confirmBox.transOrderId,
          payType: this.confirmBox.payType,
          transPassword: this.confirmBox.transPassword
        }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            Toast(response.message);
            this.confirmBox.requestno = response.data.requestno;
            this.isShow = !this.isShow;
          } else {
            Toast(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //切换支付方式事件
    tabSelectOne(index) {
      window.scrollTo(0, 0);
      let _that = this;
      this.cardCheckList.forEach(item => {
        item.isShow = false;
      });
      this.payStyleBox.isShow = false;
      this.confirmBox.isShow = true;
      this.cardCheckList[index].isShow = true;
      this.confirmBox.userCardId = this.cardCheckList[index].userCardId;
      this.confirmBox.payType = this.cardCheckList[index].payType;
      this.confirmBox.bankCardNo = this.cardCheckList[index].bankCardNo;
    },
    //支付到不死鸟
    confirmZhiFu() {
      //可用余额不能小于支付金额
      if (this.balance < this.confirmBox.realAmount) {
        Toast("支付金额大于可用余额");
        return false;
      }
      ajax({
        url: "orderTransfer/masterPay",
        optionParams: {
          userCardId: this.confirmBox.userCardId,
          transferId: this.confirmBox.transOrderId,
          payType: this.confirmBox.payType,
          transPassword: this.confirmBox.transPassword
        }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            // this.confirmBox.isShow = false;
            Toast("发布成功");
            window.localStorage.removeItem("saleDebt");
            window.localStorage.setItem("title", this.confirmBox.pfName);
            this.$router.push({
              path: "/debt/detailsdeb",
              query: { id: this.confirmBox.transOrderId, wxshare: true }
            });
          } else {
            Toast(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //充值确认
    appPayConfirm() {
      ajax({
        url: "wdrecharge/appPayConfirm",
        optionParams: {
          validatecode: this.confirmBox.validatecode,
          requestno: this.confirmBox.requestno
        }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            // this.confirmBox.isShow = false;
            Toast("已提交申请，付款成功后发布");
            window.localStorage.removeItem("saleDebt");
            this.$router.push({
              path: "/my/detailsPendingPay",
              query: { id: this.confirmBox.transOrderId }
            });
          } else {
            Toast(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //确认支付按钮
    confirmCash() {
      if (this.confirmBox.payType === 2) {
        if (!this.confirmBox.validatecode) {
          Toast("请输入验证码！");
          return false;
        }
        this.appPayConfirm();
        // this.confirmBox.isShow = false;
        // this.$router.push('/index');
        return false;
      }
      if (this.confirmBox.payType === 1) {
        if (
          !this.confirmBox.transPassword ||
          this.confirmBox.transPassword.length != 6
        ) {
          Toast("请输入6位交易密码!");
          return false;
        }
        this.params.userTransPassword = this.confirmBox.transPassword;
        this.params.payType = this.confirmBox.payType;
        this.confirmZhiFu();
        return false;
      }

      //this.saleDebt();
    },
    //金钱过滤
    formatMoney(val) {
      return val.toFixed(2);
    }
  },
  filters: {
    //银行卡显示四位
    bankCardShow(bankCardNo) {
      return bankCardNo.substring(bankCardNo.length - 4);
    },
    //金钱过滤
    formatMoney(val) {
      if (typeof val != Number) {
        return val;
      } else {
        return val.toFixed(2);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.comfirmBox {
  width: 100%;
  height: 1334px;
  background: #ccc;
  z-index: 9999;
  .test {
    width: 100%;
    height: 1334px;
    position: absolute;
    left: 0;
    top: 0;
    .blank {
      width: 100%;
      height: 45%;
      background: rgba(0, 0, 0, 1);
      opacity: 0.5;
    }
    .messageBxo {
      width: 100%;
      height: 55%;
      z-index: 99999;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: absolute;
      left: 0;
      bottom: 0;
      .blank {
        width: 100%;
        height: 40px;
        background: rgba(255, 255, 255, 1);
      }
      .title {
        width: 100%;
        height: 35px;
        font-size: 36px;
        font-family: PingFang-SC-Regular;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 35px;
        text-align: center;
        position: relative;
        .close {
          position: absolute;
          left: 39px;
          top: 7px;
        }
      }
      .realTitle {
        width: 100%;
        height: 23px;
        line-height: 23px;
        font-size: 23px;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        margin-top: 81px;
        text-align: center;
      }
      .amount {
        width: 100%;
        height: 42px;
        line-height: 42px;
        font-size: 42px;
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        margin-top: 22px;
      }
      .payStyle {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        color: rgba(153, 153, 153, 1);
        background: rgba(255, 255, 255, 1); // margin-top: 27px;
        border-bottom: 1px solid rgba(240, 240, 240, 1);
        .style {
          float: left;
          text-align: left;
          padding-left: 40px;
        }
        .name {
          float: right;
          text-align: right;
          padding-right: 40px;
        }
      }
      .valideCode {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        color: rgba(153, 153, 153, 1);
        background: rgba(255, 255, 255, 1);
        .style {
          float: left;
          text-align: left;
          padding-left: 40px;
        }
        .input_text {
          float: left;
          display: block; // padding-right: 40px;
          margin-left: 244px;
          width: 177px;
          outline: none;
          height: 70px;
          line-height: 70px;
          font-size: 28px;
          border-style: solid;
          border-top-width: 0px;
          border-right-width: 0px;
          border-bottom-width: 0px;
          border-left-width: 0px;
        }
        .reSendMsg {
          float: right;
          font-size: 28px;
          margin-top: 16px;
          margin-right: 40px;
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          color: rgba(86, 132, 252, 1);
          line-height: 38px;
          width: 140px;
          height: 38px;
          border: 1px solid rgba(86, 132, 252, 1);
          border-radius: 19px;
          text-align: center;
        }
      }
      .chongzhi {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        background: rgba(255, 255, 255, 1);
        color: rgba(153, 153, 153, 1);
        .style {
          float: left;
          text-align: left;
          padding-left: 40px;
        }
        .name {
          float: right;
          text-align: right;
          padding-right: 40px;
        }
      }
      .pwd {
        width: 678px;
        height: 80px;
        display: block;
        text-align: center;
        margin-top: 9px;
        margin-left: 36px;
        font-size: 30px;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        border: 1px solid rgba(204, 204, 204, 1);
      }
      .payNow {
        width: 680px;
        height: 90px;
        line-height: 90px;
        background: rgba(86, 132, 252, 1);
        border-radius: 8px;
        margin-left: 36px;
        font-size: 30px;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        margin-top: 70px;
        margin-bottom: 40px;
      }
    }
  }
}
</style>