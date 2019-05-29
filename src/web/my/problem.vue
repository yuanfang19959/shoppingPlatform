<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText'></top>
      <blank></blank>
    </div>

    <span class="title">{{dataList.name}}</span>
    <div class="content">
      <div class="c1">
        <span>{{dataList.text}}</span>
      </div>
    </div>

    <div class="bottom2">
        <span class="s6" @click="$router.push('/index')">前往首页</span>
        <span class="expand"></span>
    </div>
  </div>
</template>

<script>
import ajax from '@utils/config';
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
        centerData:{type:0,name:'卡券相关'},
        rightData:{type:1,name:''},
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      dataList:{},
    };
  },
  created () {
    let id=this.$route.query.id;
    if(!id){
      Toast("未获取到帮助id");
      return;
    }
    this.getpagelist(id);
  },
  methods: {
    getpagelist(id) {
      ajax({
        url: 'member-api-impl/helpservice/getHelpServiceById',
        optionParams: {id:id}
      }).post()
        .then(response => {
          if (response.code === 200) {
            this.dataList= response.data?response.data:{};
          } else {
            console.log(response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/problem.scss";
</style>
