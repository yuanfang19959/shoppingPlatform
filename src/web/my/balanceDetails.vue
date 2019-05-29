<template>
  <div class="mainCon">
    <div class="bannerShow">
     
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>

    <div class="clear"></div>
    <!--<div  ref='wrapper' style="overflow: scroll;" :style="{height:wrapperHeight+'px'}">
      <mt-loadmore  :bottom-method="loadBottom"  :topMethod="loadtop" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="handleBottomChange"  @top-status-change="handleTopChange" :auto-fill="false">-->
        <div class="content" v-if="list.length>0">
            <div class="contBox" v-for="i in list" >
                <div class="contLeft">
                    <span>{{ i.types |directionMoneyFilter}}</span>
                    <span class="date">{{ i.applyTime}}</span>
                    <!--<span class="date">{{ i.date}}</span>-->
                </div>
                <div class="conRight">
                    <span>{{i.money}}</span>
                </div>
            </div>
        </div>
        <div class="content" style="text-align: center" v-else>暂无数据</div>
      <!--</mt-loadmore>-->
    <!--</div>  -->
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast ,Loadmore } from "mint-ui";
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
        centerData:{type:0,name:'余额明细'},
        rightData:{type:1,name:''},
      },
         blackup: require("@/assets/imagea/blackup.svg"),
         list:[],
         infoData:{},
         params:{
           pageIndex:'',
           pageSize:'',
         },
        allLoaded :false,
        wrapperHeight :null,
        pages:null,
    };
  },
  created() {
    this.getInfoData();
  },
  mounted () {
    //  this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapper.getBoundingClientRect().top;
  },
  methods: {
    getInfoData(){
         ajax({
          url: 'member-api-impl/accountMoney/getAccountMoneyListByUserId',
          optionParams: this.params
        }).post()
          .then(response => {
            if (response.code === 200) {
                this.infoData = response.data?response.data:[];
            } else {
              console.log(response)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      handleTopChange(status) {
      this.topStatus  = status;
      // console.log("this.handleTopChange==",this.topStatus);
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
      // console.log("this.bottomStatus==",this.bottomStatus);
    },
    loadtop() {
      setTimeout(() => {
        this.getInfoData();
        this.$refs.loadmore.onTopLoaded();
      }, 1000);
    },
    loadBottom() {
      setTimeout(() => {
        if(this.params.pageIndex>=this.pages){
          // console.log("111");
          // this.params.pageIndex--;
          this.allLoaded = true;
          // return;
        }else{
          this.params.pageIndex++;
        }
        this.getInfoData();
        this.$refs.loadmore.onBottomLoaded();
      }, 1000);
    },
  }
};
</script>

<style lang='scss' scoped>
@import "./scss/balanceDetails.scss";
</style>

