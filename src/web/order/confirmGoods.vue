<template>
  <div class="mainCon">
    <div class="bannerShow">
      <!--<img class="blackup" :src="blackup" alt="" @click="$router.push('/order')" />
      <span class="center_1">确认收货成功</span>-->
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>
    <div class="clear"></div>

     <div class="op">
       <img :src="sucBox" alt="">  
     </div>
     <span class="op_text">卖家已收到您的付款</span>
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast } from "mint-ui";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components:{
    top,
    blank
  },
  data() {
    return {
      barType:'0',  
      barText:{
        leftData:{type:1,name:require("@/assets/imagea/blackup.svg")},
        centerData:{type:0,name:'确认收货成功'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      sucBox:require("@/assets/imagea/sucBox.svg"),
    };
  },
  created() {},
  mounted() {
   
  },
  methods: {
     getaddressList() {
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
  }
}
</script>

<style lang='scss' scoped>
@import "./scss/confirmGoods.scss";

</style>

