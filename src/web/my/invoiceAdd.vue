<template>
  <div class="invoice_page invoiceAdd_page">
    <top :barType='barType' :barText='barText' @subSave='subForm'></top>
    <blank></blank>
    <div class="context">
      <!--发票主体数据-->
      <div class="invoice_info">
        <ul class="invoice_infoList">
          <li>
            <span class="name">抬头类型</span>
            <span class="radioList">
              <span @click='form={};form.titleTypes=1'>
                <img v-show="form.titleTypes!=1" :src="checked" alt="">
                <img v-show="form.titleTypes==1" :src="checkedH" alt="">
                个人或事业单位
              </span>
              <span class="radioSecond" @click='form={};form.titleTypes=2'>
                <img v-show="form.titleTypes!=2" :src="checked" alt="">
                <img v-show="form.titleTypes==2" :src="checkedH" alt="">
                企业
              </span>
            </span>
          </li>
          <li>
            <span class="name">发票抬头</span>
            <span class=""><input type="text" v-model='form.content' placeholder="抬头名称"></span>
          </li>
          <li v-if="form.titleTypes==2">
            <span class="name">税号</span>
            <span class=""><input type="text" v-model='form.taxNumber ' placeholder="纳税人识别号或社会统一征信代码"></span>
          </li>
        </ul>
      </div>
      <!--开户银行-->
      <div class="invoice_info" v-if="form.titleTypes==2">
        <ul class="invoice_infoList">
          <li>
            <span class="name">开户银行</span>
            <span class=""><input type="text" v-model='form.bankDeposit' placeholder="选填"></span>
          </li>
          <li>
            <span class="name">银行账号</span>
            <span class=""><input type="text" v-model='form.bankAccount' placeholder="选填"></span>
          </li>
          <li>
            <span class="name">企业地址</span>
            <span class=""><input type="text" v-model='form.enterpriseAddress ' placeholder="选填"></span>
          </li>
          <li>
            <span class="name">企业电话</span>
            <span class=""><input type="text" v-model='form.enterprisePhone ' placeholder="选填"></span>
          </li>
        </ul>
      </div>
      <!--发票内容-->
      <div class="invoice_detail">
        <div class="flexbox">
          <span class="flex1">设为默认抬头</span>
          <span class="" @click='form.tacitlyApprove=!form.tacitlyApprove'>
            <img v-show='!form.tacitlyApprove' :src="checked" alt="">
            <img v-show='form.tacitlyApprove' :src="checkedH" alt="">
          </span>
        </div>
      </div>
      <!--底部删除按钮-->
      <div @click='delData' v-if='type==1' class="delBtn">删除</div>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>

<script>
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import { Toast, Popup, MessageBox } from "mint-ui";
import ajax from "@utils/config";
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
        centerData: { type: 0, name: "发票抬头" },
        rightData: { type: 0, name: "保存" }
      },
      topimg: require("@/assets/imagea/meat.png"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      dwH: require("@/assets/imagea/dw.svg"),
      itemBack: require("@/assets/imagea/itemBack.svg"),
      downimg: require("@/assets/imagea/my/downimg.svg"),
      isInvoiceType: 1, //1 个人和事业单位 2 企业
      isDefault: false,
      popupVisible: !false,
      type: null,
      sheetVisible: false,
      actions: [
        { name: "纸质发票", method: this.checkSex1, value: 1 },
        { name: "电子发票", method: this.checkSex2, value: 2 }
      ],
      invoiceType: { type: "1", name: "纸质发票" }, //发票类型
      form: {
        bankAccount: "", //银行账户
        bankDeposit: "", //开户银行 ,
        content: "", //抬头名称
        enterpriseAddress: "", //企业地址
        taxNumber: "", //税号
        titleTypes: 1, //抬头类型
        tacitlyApprove: 0, //是否设置为默认 1是默认 0是普通
        taxNumber: "", //税号
        enterprisePhone: "", //企业电话
        types: "" //发票类型
        // mailbox :'',//开票人邮箱
      }
    };
  },
  created() {},
  mounted() {
    this.type = this.$route.query.type ? this.$route.query.type : "";

    if (this.type) {
      this.barText.centerData.name = "编辑抬头";
      let invoiceData = JSON.parse(this.$route.query.invoiceData);
      this.form = invoiceData ? invoiceData : [];
      console.log("this.form==", this.form);
    }
  },

  computed: {},
  methods: {
    // type=1 为编辑提交   默认为保存操作
    subForm() {
      // console.log("111");
      if (!this.form.content) {
        Toast("抬头名称不能为空！");
        return;
      }

      let url = "addinvoicetitle";

      if (this.type == 1) {
        url = "updateinvoicetitle";
        let tacitlyApprove = this.form.tacitlyApprove;
        tacitlyApprove ? (tacitlyApprove = 1) : (tacitlyApprove = 0);
        this.form.tacitlyApprove = tacitlyApprove;
      }
      ajax({
        url: "order-api-impl/invoicetitle/" + url,
        optionParams: this.form
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            console.log("response==", response);
            if (!this.type) {
              Toast("发票抬头新增成功~");
            } else {
              Toast("发票抬头编辑成功~");
            }
            this.$router.push("/my/invoice");
            // this.balance = response.data.balance;
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 删除开票抬头
    delData() {
      let id = 11;
      MessageBox.confirm("确认后该抬头被删除", "您是否确认删除该抬头？").then(
        action => {
          ajax({
            url: "order-api-impl/invoicetitle/delinvoicetitle",
            optionParams: { id: id }
          })
            .post()
            .then(response => {
              if (response.code === 200) {
                Toast({
                  message: "确认成功",
                  duration: 1500
                });
              } else {
                console.log(response);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      );
    },
    checkSex1() {
      this.invoiceType = { type: "1", name: "纸质发票" };
      this.form.types = "1";
    },
    checkSex2() {
      this.invoiceType = { type: "2", name: "电子发票" };
      this.form.types = "2";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/invoice.scss";
</style>
