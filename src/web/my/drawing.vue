<template>
  <div class="drawing_page">
    <headerTop :barType='barType' :barText='barText'></headerTop>
    <blank></blank>
    <div class="flexbox page_top">
        <div class="itemName">到账银行</div>
        <div class="flex1" @click='popupVisible=!popupVisible'>
          <span class="bankInfo" v-if='popupList'>
            <img class="bankImg" :src="popupList.bankLogo" alt="">
            <span class="bankText">{{popupList.bankName}}({{popupList.bankCard|formaBank}})</span>
          </span>
          <span v-else>暂未绑卡</span>
        </div>
        <div class="itemRight">
          <img :src="itemBack" alt="">  
        </div>
    </div>
    <div class="center_page">
        <div class="center_page_top">提现金额</div>
        <div class="money_input">
          <i>&yen;</i>
          <input class="moneyNum" v-model='amount' type="text" placeholder="请输入金额">
        </div>
        <div class="bottom_text">
          <span class="currentMoney">当前余额 {{amountMoney}}</span>
          <!--<span class="currentMoney">当前余额 {{amount|forma1}}</span>-->
          <span class="all_btn" @click='Allmoney'>全部提现</span>
        </div>
        <div class="bottom_btn" :class='{nocardData:popupList.length<1}'>
          提现
        </div>
        <div class="blackspace"></div>
    </div>
    <mt-popup v-model='popupVisible'  position="bottom" class="popupShow">
      <div class="popup_text">
          <div class="flexbox popup_text_top">
            <span class="flex1 blackspan"></span>
            <span class="flex2">选择到账银行</span>
            <span class="flex1 popup_text_topR" @click='popupVisible=!popupVisible'>
              <img :src="downimg" alt="">
            </span>
          </div>
          <div class="popup_text_center">
              <ul class="popup_text_centerList">
                <li class="flexbox">
                    <div class="popupListLImg">
                      <img :src="popupList.bankLogo" alt="" style="width: 40px;">
                    </div>
                    <div class="flex1">
                      <div class="itemName">
                        <span>{{popupList.bankName}}({{popupList.bankCard|formaBank}})</span>
                        <span v-show='popupList.type' class="isDefault">默认</span>  
                      </div>
                      <div class="paymentDate" v-if="false">
                        {{popupList.Payment}}
                      </div>
                    </div>
                </li>
              </ul>
          </div>
          <div class="popup_btn" @click='$router.push("/my/drawingaddcard")'>
            添加新卡
          </div>
          <div class="blackspaceH45"></div>
      </div>
    </mt-Popup>
  </div>
</template>
<script>
import ajax from "@utils/config";
import store from "@/store";
import headerTop from '@/components/header2.vue';
import foot from '@/components/footer.vue';
import blank from "@/components/blank.vue";
import { Toast,Popup } from "mint-ui";
export default {
  components: {
    foot,
    headerTop,
    blank,
  },
  data() {
    return {
      barType:'0',  
      barText:{
        leftData:{type:1,name:require("@/assets/imagea/blackup.svg")},
        centerData:{type:0,name:'提现到银行卡'},
        rightData:{type:1,name:''},
      },
      // goods
      centerText:'提现到银行卡',
      itemBack: require("@/assets/imagea/itemBack.svg"),
      shengfenzheng: require("@/assets/imagea/my/shengfenzheng.svg"),
      bank1: require("@/assets/imagea/bank/bank1.svg"),
      mySetting: require("@/assets/imagea/my/my_setup_icon@2x.svg"),
      downimg: require("@/assets/imagea/my/downimg.svg"),
      popupVisible:false,
      popupList:{},
      amount:0,
      amountMoney:0,
    };
  },
  computed: {

  },
  created() {
    let money = this.$route.query.money;
    this.amountMoney=money?money:0;
    this.getpagelist();
  },
  mounted() {
    // let money = this.$route.query.money;
    // this.amount=money?money:0;
  },
  methods: {
    getpagelist() {
      ajax({
        url: 'member-api-impl/userInfo/getUserBankCard',
        optionParams: {}
      }).post()
        .then(response => {
          if (response.code === 200) {
            this.popupList = response.data?response.data:{};
            console.log("this.popupList==",this.popupList);
          } else {
            console.log(response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    goCustomerService(){
      Toast("程序猿开发中~");
    },
    Allmoney(){
      console.log('全部提现')
      
      // this.amountMoney = this.amount;
    },
  },

  filters: {}
};

//
</script>
<style lang='scss' scoped>
@import "./scss/drawing.scss";
</style>