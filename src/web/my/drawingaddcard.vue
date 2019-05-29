<template>
  <div class="drawingaddcard_page">
    <headerTop :barType='barType' :barText='barText'></headerTop>
    <blank></blank>
    <!--数据操作区域-->
    <div class="page_center">
        <!--添加银行卡-->
        <div class="addCard" v-show='isType==0'>
            <div class="addCard_top">请绑定持卡人本人的银行卡</div>
            <ul class="addCard_list">
                <li class="">
                  <div class="liItem flexbox">
                    <div class="name">持卡人</div>
                    <div class="flex1 input_layer">
                      <input type="text" v-model="form.name">
                    </div>
                  </div>
                </li>
                <li class="">
                  <div class="liItem flexbox height93">
                    <div class="name">卡号</div>
                    <div class="flex1 input_layer">
                      <input type="text" v-model="form.bankCard" @change='getCardInfo(form.bankCard)'>
                    </div>
                  </div>
                </li>
                <li class="">
                  <div class="liItem flexbox height93">
                    <div class="name">银行</div>
                    <div class="flex1 input_layer">
                      <input type="text" v-model="form.bankAccount">
                    </div>
                  </div>
                </li>
                <li class="">
                  <div class="liItem flexbox height93">
                    <div class="name">卡类型</div>
                    <div class="flex1 input_layer">
                      <input type="text" v-model="form.type">
                    </div>
                  </div>
                </li>
                <li class="bottom_input">
                  <div class="liItem flexbox">
                    <div class="name">手机号</div>
                    <div class="flex1 input_layer">
                      <input type="text" v-model="form.phone ">
                    </div>
                  </div>
                </li>
            </ul>
            <div class="addCard_bottom" @click='checkForm'>
              下一步
            </div>
        </div>
         <!--验证手机号码-->
        <div class="authPhone" v-show='isType==1'>
            <div class="authPhone_text">
               <div class="phoneText">验证码已发送至：{{form.phone|phoneFilter}}</div> 
               <div>请注意查收</div> 
            </div>
            <div class="flexbox getcode ">
                <div class="name">验证码</div>
                <div class="flex1 codeMsg">
                  <input type="text" v-model='form.authCode' placeholder="请输入短信验证码" maxlength="6">
                </div>
                <div class="getcode_btn">
                  <span v-if='isSend' @click='getphonecodeId'>获取验证码</span>
                  <span v-else>{{count}}s</span>
                </div>
            </div>
            <div class="bottom_phone_btn" @click='submitCard'>下一步</div>
        </div>
        <!--添加成功提示-->
        <div class="successForm" v-show='isType==2'>
            <div class="successForm_top">
              <img :src="sucessImg" alt="">
            </div>
            <div class="sucessText">已添加{{form.bankAccount}}</div>
            <div class="successForm_btn" @click='$router.push("/my/drawing")'>完成</div>
        </div>
    </div>
  </div>

</template>
<script>
import ajax from "@utils/config";
import store from "@/store";
import headerTop from '@/components/header2.vue';
import blank from "@/components/blank.vue";
import foot from '@/components/footer.vue';
import { Toast } from "mint-ui";
import { validatPhone } from '@/assets/js/validate';
export default {
  components: {
    foot,
    headerTop,
    blank,
  },
  data() {
    return {
      barType:'0',  //barText.centerData.name
      barText:{
        leftData:{type:1,name:require("@/assets/imagea/blackup.svg")},
        centerData:{type:0,name:'添加银行卡'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      sucessImg: require("@/assets/imagea/sucessimg.svg"),
      TopBg:{
          background: "url(" + require("@/assets/imagea/goods.png") + ")",
          backgroundRepeat: "no-repeat",
				  backgroundSize: "100% 100%",
      },
      centerText:'添加银行卡',
      isType:0,//0 为添加银行卡  1 手机号验证 2 提交成功
      form:{
        phone:'',
        authCode:'',//手机验证码
        bankCard:'',//银行卡卡号
        bankAccount :'',//银行账户
        type :'',//卡类型
        name :'',//持卡人姓名
      },
      codeMsg:'',
      isSend: true,
			count: '',
    };
  },
  computed: {

  },
  created() {},
  mounted() {},
  methods: {
    getpagelist() {
      ajax({
        url: 'tAppUser/userInfo',
        optionParams: {}
      }).post()
        .then(response => {
          if (response.code === 200) {
            // this.balance = response.data.balance;
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
    getphonecodeId() {
        let phone = this.form.phone;
        this.checkphone(phone);

        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.isSend = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.isSend = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }

        ajax({
          url: 'member-api-impl/longin/getcode',
          optionParams: {codeType:'3',phone:phone}
        }).post()
          .then(response => {
            if (response.code === 200) {
              // this.$message.success(response.message);
              // this.resetForm('loginPwdForm');
            } else {
              // this.$message.error(response.message);
            }

          })
          .catch(error => {
            console.log(error)
          })

      },
      // 获取银行卡信息
      getCardInfo(cardNo){
        if(!cardNo) return;
        ajax({
          url: 'member-api-impl/userInfo/getUserBank',
          optionParams: {
            bankCard: this.form.bankCard
          }
        }).post()
          .then(response => {
            if (response.code === 200) {
              this.form.bankAccount=response.data.bankType;
              this.form.type=response.data.cardType;
            } else {
              Toast(response.message);
            }

          })
          .catch(error => {
            console.log(error)
          })
      },
      // 校验手机格式
      checkphone(phone){
        if (!phone) {
          Toast("手机号码不能为空");
          return;
        } else {
          if (!validatPhone(phone)) {
            Toast("手机格式不正确");
            return;
          } else {
            console.log("1111");
          }
        }
      },
      checkForm(){
        this.checkphone(this.form.phone);
        if(!this.form.bankCard){
          Toast("银行卡卡号不能为空~");
          return;
        }

        this.isType=1;
        this.barText.centerData.name="验证手机号";

      },
    // 提交新增银行卡
      submitCard(){


        ajax({
          url: 'member-api-impl/userInfo/updUserBankCard',
          optionParams: this.form
        }).post()
          .then(response => {
            if (response.code === 200) {

              this.isType=2;
              this.barText.centerData.name=" ";

            } else {
              // this.$message.error(response.message);
            }

          })
          .catch(error => {
            console.log(error)
          })
      },

  },

  filters: {}
};

//
</script>
<style lang='scss' scoped>
@import "./scss/drawingaddcard.scss";
</style>