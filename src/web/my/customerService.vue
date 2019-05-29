<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <!--<img
        class="blackup"
        :src="blackup"
        alt=""
        @click="$router.push('/my/index')"
      />
      <span>帮助与客服</span>-->
      <!-- <headerTop :barType='barType' :barText='barText'></headerTop> -->
       <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>
    
    <span class="title">常见问题</span>
    <div class="content">
      <div class="c1" v-for='item in dataList' @click="$router.push({path:'/my/problem',query:{id:item.id}})">
        <span>{{item.name}}</span>
      </div>
    </div>

    <div class="content bottom_btn">
      <div class="c1" >
        <span>联系客服</span>
        <span class="s2"> <a href="tel:+86 10086">+86 10086</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import ajax from "@utils/config";
import { Toast,Popup } from "mint-ui";
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
        centerData:{type:0,name:'帮助与客服'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      dataList:[],
    };
  },
  created () {
    this.getpagelist();
  },
  mounted () {
    
  },
  methods: {
    getpagelist() {
      ajax({
        url: 'member-api-impl/helpservice/getHelpServiceList',
        optionParams: {}
      }).post()
        .then(response => {
          if (response.code === 200) {
            this.dataList= response.data?response.data:[];
          } else {
            console.log(response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
  filters: {
    
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/customerService.scss";
</style>
