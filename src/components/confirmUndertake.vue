<template>
    <div class="transfer"  v-if="isShow">
        <div class="blank">
        </div>
        <!-- 弹框 -->
        <div class="messageBxo">
          <div class="blank"></div>
          <div class="title">
            确认转承接人
            <img src="~@/assets/images/close.png" alt="" class="close"  @click="isShow = false">
          </div>
          <div class="realTitle">
            支付金额
          </div>
          <div class="amount">
             ¥{{realAmount | formatMoney}}元
          </div>
          <input maxlength="6" type="text" class="pwd" placeholder="请输入交易密码">
          <div class="payNow">
            确认转账
          </div>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { Toast } from 'mint-ui';
export default {
    components: {
    },
    props: {
        //所有费用包含手续费
        realAmount: {
            type: Number,//Boolean Array Object
            default: function() {
                return null
            }
        },
        //弹框是否出现
        isShow: {
            type: Boolean,//Boolean Array Object
            default: function() {
                return false
            }
        },
        //ajax参数
        params: {
            type: Object,//Boolean Array Object
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
        }
    },
    computed: {
    },
    created() {

    },
    mounted() {
    },
    methods: {
        getIt() {
        }
    },
    filters: {
      //金钱过滤
      formatMoney(val) {
          if(typeof(val)!=Number) {
              return val;
          } else {
              return val.toFixed(2);
          }
      }
    }
}
</script>
<style lang='scss' scoped>
.transfer {
   width: 100%;
   height: 100%;
   .blank{
      width: 100%;
      height: 45%;
      background:rgba(0,0,0,1);
      opacity:0.5;
   }
   .messageBxo{
      width: 100%;
      height: 55%;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .blank{
        width: 100%;
        height: 40px;
        background:rgba(255,255,255,1);
      }
      .title{
        width: 100%;
        height:35px;
        font-size:36px;
        font-family:PingFang-SC-Regular;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:35px;
        text-align: center;
        position: relative;
        .close{
          position: absolute;
          left: 39px;
          top: 7px;
        }
      }
      .realTitle{
        width:100%;
        height:23px;
        line-height:23px;
        font-size:23px;
        font-family:PingFang-SC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        margin-top: 81px;
        text-align: center;
      }
      .amount{
        width:100%;
        height:42px;
        line-height: 42px;
        font-size:42px;
        font-family:PingFang-SC-Medium;
        font-weight:bold;
        color:rgba(51,51,51,1);
        text-align: center;
        margin-top: 22px;
      }
      .pwd{
        width: 678px;
        height: 80px;
        display: block;
        text-align: center;
        margin-top: 79px;
        margin-left: 36px;
        font-size:30px;
        font-family:PingFang-SC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        border:1px solid rgba(204,204,204,1);
      }
      .payNow{
        width:680px;
        height:90px;
        line-height: 90px;
        background:rgba(86,132,252,1);
        border-radius:8px;
        margin-left: 36px;
        font-size:30px;
        font-family:PingFang-SC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-align: center;
        margin-top: 100px;
      }
   }
}
</style>