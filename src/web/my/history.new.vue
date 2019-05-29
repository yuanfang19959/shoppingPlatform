<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <!--<img class="blackup" :src="blackup" alt="" @click="$router.push('/my/index')"/>
      <span class="center_1">浏览历史</span>
      <img :src="garbage" alt="" class="garbage" @click="deleteH" />-->
      <top :barType='barType' :barText='barText' @subSave='deleteH'></top>
      <blank></blank>
    </div>

    <div class="flexbox select_nav">
      <div class="flex1 showYear" @click='toShow'>{{year}}年</div>
      <div class="flex1 showMonth" @click='toShow'>{{month}}月</div>
    </div>
    <div class="content">
      <!-- 莫一天的数据 -->
      <div class="thisdayHistory" v-for="(i,findex) in allData" :key="i.date">
        <div v-show="flag" class="imgShow">
          <img :src="checked" alt="" class="c1" v-show="!i.isAllChecked" @click="selectAllp(findex)" />
          <img :src="checkedH" alt="" class="c1" v-show="i.isAllChecked" @click="selectAllp(findex)" />
        </div>
        <span class="date">
         {{i.browsingTime|dateFormat}}
        </span>
        <!-- 单个商品 -->
        <div class="goodsContent" v-for="(item, index) in i.browsingHistoryPO" @click='$router.push({path:"/index/detail",query:{id:item.goodsId}})'>

          <div class="goods">
            <img :src="item.goods.imageAddress" alt="" />
            <div class="goodBottom">
              <div class="Bottom_left" v-show="flag">
                <img :src="checked" alt="" class="c1" v-show="!item.ischecked" @click.step="selectp(findex,index)" />
                <img :src="checkedH" alt="" class="c1" v-show="item.ischecked" @click.step="selectp(findex,index)" />
              </div>
              <div class="Bottom_right">
                <p>{{ item.goods.name }}</p>
                <span>¥{{ item.goods.price}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
    <!--底部功能-->
    <div class="bottom_pay" v-show="flag" @click="deleteGoods">
      <div class="sub_btn">删除</div>
    </div>
    <!--时间弹框-->
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom" class="popupShow">
      <vue-pickers :show="show" :defaultData="defaultData" :selectData="pickData" value-key="text" :columns="2" @cancel="close"
        @confirm="confirmFn">
      </vue-pickers>
    </mt-popup>
  </div>
</template>

<script>
  import ajax from "@utils/config";
  import { Toast, DatetimePicker, Popup, Picker } from "mint-ui";
  import { parseTime } from "@/filters";
  import vuePickers from 'vue-pickers';
  import top from "@/components/header2.vue";
  import blank from "@/components/blank.vue";
  export default {
    components: {
      vuePickers,
      top,
      blank,
    },
    data() {
      return {
        barType: '0',
        barText: {
          leftData: { type: 1, name: require("@/assets/imagea/blackup.svg") },
          centerData: { type: 0, name: '浏览历史' },
          rightData: { type: 1, name: require("@/assets/imagea/my/garbage.svg") },
        },
        flag: false,
        popupVisible: false,
        blackup: require("@/assets/imagea/blackup.svg"),
        head: require("@/assets/imagea/head.svg"),
        leftarrow: require("@/assets/imagea/leftarrow.svg"),
        deleteP: require("@/assets/imagea/delete.svg"),
        sreach: require("@/assets/imagea/my/search.svg"),
        checked: require("@/assets/imagea/checked.svg"),
        checkedH: require("@/assets/imagea/checkedH.svg"),
        garbage: require("@/assets/imagea/my/garbage.svg"),
        allData: [],
        defaultData: [
          {
            text: "1990年",
            value: "1990",
          },
          {
            text: "1月",
            value: "1",
          }
        ],
        pickData: {
          data1: [],
          data2: [],
        },
        year: null,
        month: null,
        pickerValue: null,
        toExpo: false,//用于触发watch
        show: false,//
        dataSelected: '',
        params: { page: 0, pageSize: 10 },
        delData: { delAll: false, childDTOList: [] },//选中数据
      };
    },
    created() {
      var date = new Date(),
        arr = [], arr2 = [],
        yearData = date.getFullYear(),
        monthData = date.getMonth() + 1,
        startYear = yearData - 20, //起始年份
        endYear = yearData + 20; //结束年份
      for (var i = startYear; i <= endYear; i++) {
        arr.push({ text: i + '年', value: i });
      }
      for (var i = 1; i <= 12; i++) {
        arr2.push({ text: i + '月', value: i });
      }

      this.pickData = { data1: arr, data2: arr2 }
      this.year = yearData;
      this.month = monthData;
      // console.log("this.pickData===",this.pickData);
      this.gethistorylist();
    },
    methods: {
      deleteH() {
        this.flag = !this.flag;
        this.ischecked = false;
      },
      checkedGoods(index) {
        // console.log(1111);
        this.ischecked = !this.ischecked;
      },
      gethistorylist() {
        ajax({
          url: "product-api-impl/app/getUserBrowsingHistory",
          optionParams: { year: this.year, month: this.month }
        }).post()
          .then(response => {
            if (response.code === 200) {
              this.allData = response.data ? response.data : [];
              this.allData.map(item => {
                this.$set(item, 'isAllChecked', false);
                let goodsInfo = item.browsingHistoryPO;
                goodsInfo.map(itemSecond => {
                  // console.log("itemSecond==",itemSecond.goods);
                  let goodssecond = itemSecond.goods
                  this.$set(goodssecond, 'ischecked', false);
                })

              })
              // console.log("this.allData==",this.allData);
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      close() {
        this.show = false;
        this.popupVisible = false;
      },
      confirmFn(val) {
        this.show = false;
        this.popupVisible = false;
        this.defaultData = [val.select1, val.select2]
        // console.log("val==",val);
        this.year = val.select1.value;
        this.month = val.select2.value;
        this.gethistorylist();
      },
      toShow() {
        console.log("111");
        this.popupVisible = true;
        this.show = true
      },
      selectp(findex, index) {
        //单选
        let arr = [], 
          historyId = this.allData[findex].browsingHistoryPO[index].historyId,
          time=this.allData[findex].browsingHistoryPO[index].browsingTime;
        this.allData[findex].browsingHistoryPO[index].ischecked = !this.allData[findex].browsingHistoryPO[index].ischecked;
        if (!this.allData[findex].browsingHistoryPO[index].ischecked) {
          this.allData[findex].isAllChecked = false;
          this.listenACK(findex)
          //  console.log("ccc==",this.allData[findex].browsingHistoryPO[index].historyId);

          //  console.log("取消  "+this.allData[findex].browsingTime+"  第"+index+1+"条")
          this.delData.childDTOList.map((item, index) => {
            if (item.historyId == historyId) {
              this.delData.splice(index, 1)
            }
          })

        } else {
          this.allData[findex].browsingHistoryPO.map(item => {
            if (item.ischecked) {
              this.allData[findex].isAllChecked = true;
              this.listenACK(findex);
            }

          });
          
          let arr2 = this.delData.childDTOList,tmpData={ time: time, historyId: historyId};
          if(arr2.indexOf(tmpData)==-1){
            arr2.push(tmpData);
          }
          
          console.log("arr2==", arr2);
          this.delData.childDTOList=arr2;
        }


      },
      selectAllp(findex) {
        //全选
        let arr = [];
        this.allData[findex].isAllChecked = !this.allData[findex].isAllChecked;
        this.allData[findex].browsingHistoryPO.map(item => {
          this.allData[findex].isAllChecked ? (item.ischecked = true) : (item.ischecked = false);
          arr.push({ time: item.browsingTime, historyId: item.historyId })
        });
        this.delData.childDTOList = arr;
      },
      listenACK(findex) {
        //相当于watch中监听allDara[findex].isAllchececk变化，
        this.allData[findex].browsingHistoryPO.map(item => {
          if (!item.ischecked) {
            this.allData[findex].isAllChecked = false;
          }
        });
      },
      deleteGoods() {
        // this.allData.map((item,index)=>{
        //     if(item.isAllChecked){
        //         // 如果被选中，则这一索引的json全删
        //         this.allData.splice(index,1)

        //     }else{
        //         // 个别选中但是没有选满，继续遍历删除
        //         for(var i =0;i<(this.allData.length);i++){
        //             this.allData[i].browsingHistoryPO.map((item,index)=>{
        //                 if(item.ischecked){
        //                     this.allData[i].browsingHistoryPO.splice(index,1)
        //                 }
        //             })
        //         }
        //     }
        // })
        ajax({
          url: "product-api-impl/app/delUserBrowsingHistory ",
          optionParams: this.delData
        }).post()
          .then(response => {
            if (response.code === 200) {
              this.gethistorylist();
              this.flag=false;
              // console.log("this.allData==",this.allData);
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    filters: {
      dateFormat(val) {
        if (!val) return;
        return val.split('-')[1] + '月' + val.split('-')[2] + '日'
      }
    }

  };
</script>

<style lang="scss" scoped>
@import "./scss/history.scss";
</style>