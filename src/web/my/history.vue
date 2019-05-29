<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <img class="blackup" :src="blackup" alt="" @click="$router.push('/my/index')"/>
      <span class="center_1">浏览历史</span>
      <img :src="garbage" alt="" class="garbage" @click="deleteH"/>
    </div>

    <div class="select_nav">
      <select v-model="year" @click="chooseYear">
        <option :value="item.yy" v-for="item in yearlist" :key="item.yy">
          {{ item.yy }}年</option>
      </select>
      <select v-model="month" @click="chooseMonth">
        <option :value="item.dd" v-for="item in monthlist" :key="item.dd">
          {{ item.dd }}月</option
        >
      </select>
      <button>选择时间</button>
    </div>
    <div class="content">
      <!-- 某一天的浏览历史 -->
      <div class="thisdayHistory">
          <div v-show="flag" class="imgShow">
              <img :src="checked" alt="" class="c1" v-if="!ischecked" @click="select"/>
            <img :src="checkedH" alt="" class="c1" v-else="ischecked" @click="select"/>
          </div>
        <span class="date">
          3月27日
        </span>
        <!-- 单个商品 -->
        <div class="goodsContent" v-for="item in hisList" :key="item.id">
          <div class="goods">
            <img :src="item.pic" alt="" />
            <div class="goodBottom">
                <div class="Bottom_left" v-show="flag">
                    <img :src="checked" alt="" class="c1" v-if="!ischecked" @click="select"/>
                    <img :src="checkedH" alt="" class="c1" v-else="ischecked" @click="select"/>
                </div>
                <div class="Bottom_right">
                   <p>{{ item.name }}</p>
                  <span>¥{{ item.price }}</span> 
                </div>
            </div>
          </div>
        </div>
      </div>
<!-- 某一天的浏览历史 -->
      <div class="thisdayHistory">
          <div v-show="flag" class="imgShow">
              <img :src="checked" alt="" class="c1" v-if="!ischecked" @click="select"/>
            <img :src="checkedH" alt="" class="c1" v-else="ischecked" @click="select"/>
          </div>    
        <span class="date">
          3月26日
        </span>
        <!-- 单个商品 -->
        <div class="goodsContent" v-for="item in hisList" :key="item.id">
          <div class="goods">
            <img :src="item.pic" alt="" />
            <div class="goodBottom">
                <div class="Bottom_left" v-show="flag">
                    <img :src="checked" alt="" class="c1" v-if="!ischecked" @click.step="select"/>
                    <img :src="checkedH" alt="" class="c1" v-else="ischecked" @click.step="select"/>
                </div>
                <div class="Bottom_right">
                   <p>{{ item.name }}</p>
                  <span>¥{{ item.price }}</span> 
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
     <!--底部功能-->
    <div class="bottom_pay" v-show="flag">
      <div class="checked_btn">
        <div class="img_layer">
          <img :src="checked" alt=""  />
          <img :src="checkedH" alt=""  />
        </div>
        <div class="checked_btn_text" >全选</div>
      </div>
      
      <div class="sub_btn">删除</div>
    </div>
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast,DatetimePicker  } from "mint-ui";
import { parseTime } from '@/filters';
export default {
  data() {
    return {
      ischecked: false,
      flag: false,
      nameF: "zzb",
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      deleteP: require("@/assets/imagea/delete.svg"),
      sreach: require("@/assets/imagea/my/search.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      garbage: require("@/assets/imagea/my/garbage.svg"),
      hisList: [
        // {
        //   id: 1,
        //   name: "食在川铭 新鲜冷冻毛...",
        //   price: 180,
        //   pic: require("@/assets/imagea/goods.png")
        // },
        {
          id: 2,
          name: "食在川铭 新鲜冷冻毛...",
          price: 180,
          pic: require("@/assets/imagea/goods.png")
        },
        {
          id: 3,
          name: "食在川铭 新鲜冷冻毛...",
          price: 180,
          pic: require("@/assets/imagea/goods.png")
        },
        {
          id: 4,
          name: "食在川铭 新鲜冷冻毛...",
          price: 180,
          pic: require("@/assets/imagea/goods.png")
        },
        {
          id: 5,
          name: "食在川铭 新鲜冷冻毛...",
          price: 180,
          pic: require("@/assets/imagea/goods.png")
        },
        {
          id: 6,
          name: "食在川铭 新鲜冷冻毛...",
          price: 180,
          pic: require("@/assets/imagea/goods.png")
        }
      ],
      yearlist: [{ yy: 2019 }, { yy: 2020 }],
      monthlist: [
        { dd: 1 },
        { dd: 2 },
        { dd: 3 },
        { dd: 4 },
        { dd: 5 },
        { dd: 6 },
        { dd: 7 },
        { dd: 8 },
        { dd: 9 },
        { dd: 10 },
        { dd: 11 },
        { dd: 12 }
      ],
      year: null,
      month: null,
      pickerValue:null,

    };
  },
  created() {
    var date = new Date(),arr=[];
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    var startYear=date.getFullYear()-20;//起始年份 
    var endYear=date.getFullYear()+20;//结束年份 
    for (var i=startYear;i<=endYear;i++) {
      arr.push({yy:i})
    }
    this.yearlist=arr;
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
    chooseYear() {
      console.log(this.year);
    },
    chooseMonth() {
      console.log(this.month);
    },
    select(){
        this.ischecked=!this.ischecked;
    },
    getpagelist() {
        ajax({
          url: 'tAppUser/userInfo',
          optionParams: {}
        }).post()
          .then(response => {
            if (response.code === 200) {
              this.balance = response.data.balance;
            } else {
              console.log(response)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
  },
  
};
</script>

<style lang="scss" scoped>
@import "./scss/history.scss";
</style>
