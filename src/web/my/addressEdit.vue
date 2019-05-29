<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <top :barType='barType' :barText='barText' @subSave='subSave'></top>
      <!--<top :barType='barType' :barText='barText' @subSave='subSave'></top>-->
      <blank></blank>
    </div>

    <!-- 地址编辑出 -->
    <div class="content">
      <!-- 输入框1 -->
      <div class="inputBox">
        <input
          type="text"
          v-model="addrData.name"
          :placeholder="nameF"
        />
        <img :src="deleteP" alt="" @click="addrData.name=''" />
      </div>

      <!-- 输入框2 -->
      <div class="inputBox" id="inputBox2">
        <input type="text" v-model="addrData.phone" :placeholder="phone" maxlength="11" />
        <img :src="deleteP" alt="" @click="addrData.phone=''" />
      </div>

      <!-- 内容 -->
      <div class="c1" v-for="(item,index) in addrDataList" :id="index==3?'xh':''"  @click="toShow(index)">
        <span>{{item.name}}</span>
      </div>
      <!-- 输入框2 -->
      <div class="inputBox" id="inputBox3">
        <input type="text" v-model="addrData.addressSupple" :placeholder="address" style="width: 98%;"/>
        <img :src="deleteP" alt="" @click="addrData.addressSupple=''" />
      </div>

      <!-- 默认地址
      -->
      <div class="c1" id="xh2">
        <span>设为默认地址</span>
        <div @click="change">
          <img :src="selectnull" alt="" v-show="addrData.isDefault!=1" />
          <img :src="select" alt="" v-show="addrData.isDefault==1" />
        </div>
      </div>
    </div>
    <span class="dele" @click='delAddr(addressId)'>删除地址</span>

    <!-- 弹出窗口 -->
    <mt-popup v-model="popupVisible"  popup-transition="popup-fade" position="bottom" class="popupShow">
      <vue-pickers
        :show="show"
        :defaultData="defaultData"
        :selectData="pickData"
        value-key="text"
        @cancel="close"
        @confirm="confirmFn">
      </vue-pickers>
    </mt-popup>

  </div>
</template>

<script>
import { Toast,Popup } from "mint-ui";
import vuePickers from 'vue-pickers'
import ajax from '@utils/config';
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
import { validatPhone } from '@/assets/js/validate';
export default {
  components: {
    top,
    blank,
    vuePickers,
  },
  data() {
    return {
      barType:'0',  
      barText:{
        leftData:{type:2,name:require("@/assets/imagea/blackup.svg"),path:"/my/address"},
        centerData:{type:0,name:'编辑地址'},
        rightData:{type:0,name:'保存'},
      },
      province:"",
      flag: false,
      nameF: "",
      phone: "",
      address: "",
      deleteP: require("@/assets/imagea/delete.svg"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      isCopy: "",

      //第一个picker
      show: false,
      columns: 1,
      defaultData: [
        {
          text: "北京市",
          value: "11",
        }
      ],
      pickData: {
        // 第一列的数据结构 
        data1: []
      },
      addrData:{},
      addrDataList:[],
      Pdata:[],//省
      Cdata:[],//市
      Ddata:[],//区、县
      Sdata:[],//街道镇
      // Vdata:[],//省
      // AreaList:{
        PSelected:{},
        CSelected:{},
        DSelected:{},
        SSelected:{},
        VSelected:{},
      // },
       res: null,
       iindex:null,
      popupVisible:false,
      show:false,
    };
  },
  created () {
    this.addressId=this.$route.query.addressId?this.$route.query.addressId:{};
    this.getAddrData(this.addressId);
  },
  mounted () {
     if(this.$route.query.pageType){
          this.barText.leftData.path = '/my/address?pageType=1'
      }
  },
  methods: {
    getAddrData(id){
      ajax({
        url: 'member-api-impl/user/addressDetail',
        optionParams: {addressId:id}
      }).post()
        .then(res => {
          if (res.code === 200) {
            this.addrData=res.data?res.data:{};
            this.addrDataList= this.addrData.list;
            this.addrDataList=this.addrDataList.reverse();
          } else {
            console.log(res)
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
    subSave(){
      let phone = this.addrData.phone,formData={},code=this.addrDataList[3].code,addressSupple=this.addrData.addressSupple;
        if (!phone) {
          Toast("手机号码不能为空");
          return;
        } else {
          if (!validatPhone(phone)) {
            Toast("手机格式不正确");
            return;
          }
        }
      if(!code){
        Toast("收货地址不完整，请检查后在提交");
        return;
      }
      if(!addressSupple){
        Toast("详情地址不能为空");
        return;
      }

      formData={
        zoneId:code,
        addressSupple:this.addrData.addressSupple,
        phone:this.addrData.phone,
        name:this.addrData.name,
        id:this.addressId,
        isDefault:this.addrData.isDefault,
      }
      ajax({
        url: 'member-api-impl/user/updAddress',
        optionParams: formData
      }).post()
        .then(res => {
          if (res.code === 200) {
              Toast("编辑地址成功");
              if(this.$route.query.pageType){
                  this.$router.push("/my/address?pageType=1");
              }else{
                  this.$router.push("/my/address");
              }
          } else {
            console.log(res)
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
    change() {
      let isDefault =this.addrData.isDefault;
      isDefault==1?isDefault=0:isDefault=1;
      this.addrData.isDefault=isDefault;
    },
    close() {
      console.log("2121231");
      this.popupVisible = false;
      this.show = false;
    },
    confirmFn(val) {
      this.show = false;
      this.popupVisible = false;
      this.defaultData = [val.select1];
      this.addrDataList.map((item,index)=>{
        if(index>this.iindex){
          item.name='未设置';
          item.code='未设置';
        }else if(index==this.iindex){
          console.log("111111");
          item.name=val.select1.text;
          item.code=val.select1.value;
        }
      })
     
    },
    toShow(val) {
      this.iindex=val;
      this.popupVisible=true;
      this.show = true;
      if(val==0){
        this.getByParentId(0);
      }else{
        let valTemp=val-1;
        let id=this.addrDataList[valTemp].code
        this.getByParentId(id);
      }
    },
    // 通过id获取下级
    getByParentId(id){
      ajax({
        url: 'member-api-impl/address/selByParentId',
        optionParams: {parentId:id}
      }).post()
        .then(response => {
          if (response.code === 200) {
            let tmpData=[],AreaType = this.AreaType;
            this.Pdata = response.data?response.data:[];
            this.Pdata.map(item=>{
              tmpData.push({text:item.provinceName,value:item.id});
            })
            this.pickData.data1=tmpData;
          } else {
            console.log(response)
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除地址数据
    delAddr(id){
      ajax({
        url: 'member-api-impl/user/delAddress',
        optionParams: {addressId:id}
      }).post()
        .then(res => {
          if (res.code === 200) {
            Toast("删除成功");
            if(this.$route.query.pageType){
                  this.$router.push("/my/address?pageType=1");
              }else{
                  this.$router.push("/my/address");
              }
             
          } else {
            console.log(res)
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
@import "./scss/addressEdit.scss";

</style>
