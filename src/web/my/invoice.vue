<template>
  <div class="invoice_page">
    <top :barType='barType' :barText='barText' v-on:subSave='subSave'></top>
    <blank></blank>
    <div class="context">
      <div class="context_top" v-for='item in orderData.listDetail'>
          <div class="topimgLayer">
            <img :src="topimg" alt="">
          </div>
          <div class="topText">
            <div class="topText_first">
              <span>订单编号：</span>
              <span>{{item.orderNumber}}</span>
            </div>
            <div class="topText_second">
              <span>开票金额：</span>
              <span class="moneyNum">￥{{item.goodsMoney}}</span>
            </div>
          </div>
      </div>
      <!--发票主体数据-->
      <div class="invoice_info">
          <ul class="invoice_infoList">
            <li @click="sheetVisible=true">
              <span class="name">发票类型</span>
              <span>{{invoiceType.name}} <i><img :src="itemBack" alt=""></i></span>
            </li>
            <li>
              <span class="name">抬头类型</span>
              <span class="radioList">
                  <img  :src="checkedH" alt="">
                  <span v-if="defInvoice.titleTypes==1">个人或事业单位</span> 
                  <span v-else>企业</span> 
              </span>
            </li>
            <li @click='popupVisible=!popupVisible'>
              <span class="name">发票抬头</span>
              <span class="">{{defInvoice.content}}<i><img :src="itemBack" alt=""></i></span>
            </li>
            <li>
              <span class="name">设为默认抬头</span>
              <span class="">
                <img v-show='!defInvoice.tacitlyApprove' :src="checked" alt="">
                <img v-show='defInvoice.tacitlyApprove' :src="checkedH" alt="">
              </span>
            </li>
          </ul>
      </div>
      <!--发票内容-->
      <div class="invoice_detail">
        <div class="flexbox">
            <span class="flex1">发票内容</span>
            <span class="">明细</span>
        </div>
      </div>
      <!--发票邮箱-->
      <div class="invoice_detail">
        <div class="flexbox">
            <span class="flex1">发票邮箱</span>
            <input class="inputmail" type="text" v-model='form.mailbox' placeholder="请输入">
        </div>
      </div>
      <!--地区信息-->
      <div class="invoice_area">
        <div class="flexbox">
            <div class="navimg_layer">
              <img :src="dwH" alt="">
            </div>
            <div class="flex1">
              <div class="addrName">
                <span class="phoneName">{{orderData.consigneeName}}</span>
                <span>{{orderData.consigneePhone}}</span>
              </div>
              <div class="addrInfo">{{orderData.receiveAddress}}</div>
            </div>
            <div class="rigthItem">
              <img :src="itemBack" alt="">
            </div>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" class="popupShow">
        <div class="popup_text">
            <div class="flexbox popup_text_top">
              <span class="flex1 blackspan"></span>
              <span class="flex2">抬头选择</span>
              <span class="flex1 popup_text_topR" @click='popupVisible=!popupVisible'>
                <img :src="downimg" alt="">
              </span>
            </div>
            <!--弹框文本-->
            <div class="popupData">
              <ul class="popupDataList" v-if='true'>
                <li class="flexbox" v-for='i in dataList' @click='defInvoice=i;popupVisible=!popupVisible'>
                  <div class="flex1 popupDataListL">
                    <div>
                      <span class="name">{{i.content}}</span> 
                      <span class="isDefault" v-if='i.tacitlyApprove==1'>默认</span> 
                    </div>
                    <div class="type" v-if='i.titleTypes==1'>个人抬头</div>  
                    <div class="type" v-if='i.titleTypes==2'>企业抬头</div>  
                  </div>
                  <div class="popupDataListR" @click.stop='$router.push({path:"/my/invoiceAdd",query:{type:1,invoiceData:JSON.stringify(i)}})'>编辑</div>
                </li>
              </ul>
              <div class="notData" v-else>
                (空)
              </div>
              <div class="bottom_btn" @click='$router.push("/my/invoiceAdd")'>
                <div class="btn">添加新抬头</div>
              </div>
            </div>
        </div>
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>

<script>
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import { Toast,Popup } from 'mint-ui';
import ajax from "@utils/config";
import { isEmail } from '@/assets/js/validate';
export default {
   components: {
    top,
    blank,
  },
  data() {
    return {
      barType:'0',  
      barText:{
        leftData:{type:1,name:require("@/assets/imagea/blackup.svg")},
        centerData:{type:0,name:'申请开票'},
        rightData:{type:0,name:'提交'},
      },
      topimg: require("@/assets/imagea/meat.png"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      dwH: require("@/assets/imagea/dw.svg"),
      itemBack: require("@/assets/imagea/itemBack.svg"),
      downimg: require("@/assets/imagea/my/downimg.svg"),
      isInvoiceType:0,//0 个人和事业单位 1 企业
      // centerText:'申请开票',
      // rigthText:'提交',
      isDefault:false,
      popupVisible:false,
      form:{
        mailbox :'',// 邮箱
        titleId  :'',// 发票抬头id
        types:'',// 发票类型
        addressId:'',//地址编号
        oredrId:'',//order id
      },
      sheetVisible:false,
      actions: [
        { name: '纸质发票', method: this.checkSex1, value: 1 },
        { name: '电子发票', method: this.checkSex2, value: 2 }
      ],
      invoiceType:{type:'1',name:"纸质发票"},//发票类型
      dataList:[],
      defInvoice:{},//默认发票信息
      orderData:{},
    };
    
  },
  created() {
    
  },
  mounted () {
    this.getList();
    let orderData = JSON.parse(this.$route.query.orderData);
    this.orderData=orderData?orderData:{}

    this.form.addressId=this.orderData.deliveryAddressId;
    this.form.oredrId=this.orderData.id;

    // console.log(" = JSON.par==", orderData);
  },
  computed: {
  },
  methods: {
    // 获取发票抬头列表
        getList() {
          ajax({
            url: 'order-api-impl/invoicetitle/getInvoicetitleList',
            optionParams: {}
          }).post()
            .then(response => {
              if (response.code === 200) {
                this.dataList = response.data?response.data:[];
                this.dataList.map(item=>{
                  if(item.tacitlyApprove==1){
                    this.defInvoice=item;
                  }
                })
              } else {
                console.log(response)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }, 
        checkSex1(){
          this.invoiceType={type:'1',name:"纸质发票"};
          
        },
        checkSex2(){
          this.invoiceType={type:'2',name:"电子发票"};
        },
        subSave(){
          let mailbox = this.form.mailbox,mailboxFormat=isEmail(mailbox);
          console.log("mailboxFormat==",mailboxFormat);
          if(!mailbox){
            Toast("开票邮箱不能为空");
            return;
          }else if(mailbox&&!mailboxFormat){
              Toast("开票邮箱格式不合理");
              return;
          }
          
          this.form.titleId = this.defInvoice.id;
          this.form.types  = this.invoiceType.type;

          // console.log("this.defInvoice==",this.form);
          ajax({
            url: 'order-api-impl/invoice/addinvoice',
            optionParams: this.form
          }).post()
            .then(response => {
              if (response.code === 200) {
                this.balance = response.data.balance;
                Toast("已开票成功");
                this.$router.push('/order');
              } else {
                console.log(response)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/invoice.scss";
</style>
