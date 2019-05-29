<template>

 <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">

    <mt-loadmore  :bottom-method="loadBottom"  :topMethod="loadtop" :bottom-all-loaded="bottomAllLoaded" ref="loadmore" @bottom-status-change="handleBottomChange"  @top-status-change="handleTopChange" :auto-fill="false">

 <div  v-for="item in topics">
       <h4> {{item.title}}</h4>

 </div>

  </mt-loadmore>
 </div>

</template>

<script>
import foot from "@/components/footer.vue";
import { MessageBox, Toast,Loadmore } from "mint-ui";
import ajax from "@utils/config";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import axios from 'axios';
export default {
  components: {
    foot,
    top,
    blank
  },

  data() {
    return {
      searchKey: {
          page: 1,
          limit: 20,
          tab: 'all',
          mdrender: true
      },
      topics:[],
      bottomAllLoaded:false,
      allLoaded :false,
      wrapperHeight :null,
    };
  },
  created() {
    // this.getCountAndPrice();
    // this.getList();
  },
  mounted() {
    this.activeIndex = this.$route.query.type ? this.$route.query.type : 0;
    this.getTopics();    
    this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapper.getBoundingClientRect().top;
  },
  methods: {
    handleBottomChange(status) {
      console.log("handleBottomChange===");
      this.bottomStatus = status;
      console.log("this.bottomStatus==",this.bottomStatus);
    },
    handleTopChange(status) {
      console.log("handleBottomChange===");
      this.topStatus  = status;
      console.log("this.handleTopChange==",this.topStatus);
    },
    loadtop() {
      setTimeout(() => {
        this.getTopics();
        this.$refs.loadmore.onTopLoaded();
      }, 1000);
    },
    loadBottom() {
        setTimeout(() => {
          this.searchKey.page++;
          this.getTopics();
          this.$refs.loadmore.onBottomLoaded();
        }, 1000);
      },
      getTopics() {
        let params = JSON.stringify(this.searchKey);
        console.log("params", params);
        axios.get('https://cnodejs.org/api/v1/topics?' + params).then(response => {
          console.log(response.data)
          this.topics = this.topics.concat(response.data.data);
          if (response.data.data.length < this.searchKey.limit) {
            this.bottomAllLoaded = true;
          }
        }).catch(error => {
          console.log(error)
        })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/myOrder.scss";
.default {
  color: black;
}
.default-active {
  color: #e1212d;
  border-bottom: 1px solid #e1212d;
}
.page-loadmore-wrapper {
    overflow: scroll
}
</style>
