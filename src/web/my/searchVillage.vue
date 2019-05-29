<template>
  <div class="selectVillage_page">
    <headerTop :barType='barType' :barText='barText' @subSave='subSave' @inputSub='inputSub'></headerTop>
    <blank></blank>
    <div class="center_history">
      <div class="center_history_top">搜索历史</div>
      <ul class="historyList">
        <li v-for='i in historyData' v-text='i.name'></li>
      </ul>
    </div>
    <div class="searchList">
      <ul class="searchList">
        <li class="flexbox" v-for='item in searchList' @click='goback(item)'>
          <span class="itemL">{{item.name}}</span>
          <span class="flex1 itemR">{{item.address}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from "@utils/config";
import headerTop from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    headerTop,
    blank
  },
  data() {
    return {
      barType: "1",
      barText: {
        leftData: { type: 2, name: "输入村名", path: "/confirmTheOrder" },
        centerData: { type: 0, name: "搜索" },
        rightData: { type: 0, name: "搜索" }
      },
      blackup: require("@/assets/imagea/blackup.svg"),
      list: [],
      historyData: [],
      searchList: []
    };
  },
  methods: {
    //获取地址列表
    getaddressList(val) {
      ajax({
        url: "member-api-impl/supplier/searchburg",
        optionParams: { serchstr: val }
      })
        .post()
        .then(response => {
          if (response.code === 200) {
            this.searchList = response.data.list ? response.data.list : [];
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    subSave(val) {
      console.log("val===", val);

      this.getaddressList(val);
    },
    inputSub(val) {
      this.getaddressList(val);
      console.log(val);
    },
    goback(val) {
      let searchRes = { addressId: val.addressId, address: val.address };
      this.$router.push({
        path: "/confirmTheOrder",
        query: { searchRes: JSON.stringify(searchRes) }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/selectvillage.scss";
</style>
