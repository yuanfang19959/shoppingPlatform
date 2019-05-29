<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <!--<img
        class="blackup"
        :src="blackup"
        alt=""
        @click="$router.push('/my/address')"
      />
      <span class="center_1">添加地址</span>
      <span class="leftS" @click='submitForm'>保存</span> -->
      <top :barType='barType' :barText='barText' @subSave='submitForm'></top>
      <blank></blank>
    </div>

    <!-- 地址编辑出 -->
    <div class="content">
      <!-- 输入框1 -->
      <div class="inputBox">
        <input type="text" v-model='form.name' placeholder="收货人姓名" />
        <img :src="deleteP" alt="" @click="clear(1)" />
      </div>

      <!-- 输入框2 -->
      <div class="inputBox" id="inputBox2">
        <input type="text" v-model='form.phone' placeholder="收货人联系方式" maxlength="11"/>
        <img :src="deleteP" alt="" @click="clear(2)" />
      </div>

      <!-- 内容 -->
      <div class="c1"  @click="AreaType=0;toShow()">
        <span>选择省份</span>
        {{PSelected.text}}
      </div>
      <div class="c1" @click="AreaType=1;getByParentId(PSelected.value)">
        <span>选择城市</span>
        {{CSelected.text}}
      </div>
      <div class="c1" @click="AreaType=2;getByParentId(CSelected.value)">
        <span>选择区县</span>
        {{DSelected.text}}
      </div>
      <div class="c1" id="xh" @click="AreaType=3;getByParentId(DSelected.value)">
        <span>选择街道</span>
        {{SSelected.text}}
      </div>
      <!--<div class="c1" id="xh" @click="AreaType=4;getByParentId(DSelected.value)">
        <span>选择村庄</span>
        {{VSelected.text}}
      </div>-->
      <!-- 输入框2 -->
      <div class="inputBox" id="inputBox3">
        <input type="text" v-model='form.addressSupple' placeholder="详细地址" style="width: 98%" />
        <img :src="deleteP" alt="" @click="clear(3)" />
      </div>

      <!-- 默认地址
      -->
      <div class="c1" id="xh2">
        <span>设为默认地址</span>
        <div @click="flag=!flag">
          <img :src="selectnull" alt="" v-show="!flag" />
          <img :src="select" alt="" v-show="flag" />
        </div>
      </div>
    </div>
    <!-- <span class="dele">删除地址</span> -->
     <!-- 弹出窗口 -->
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      position="bottom" class="popupShow"
    >
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
import { Toast,Popup,Picker } from "mint-ui";
import ajax from "@utils/config";
import { validatPhone } from '@/assets/js/validate';
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
      barType:'0',  
      barText:{ 
        leftData:{type:2,name:require("@/assets/imagea/blackup.svg"),path:'/my/address'},
        centerData:{type:0,name:'添加地址'},
        rightData:{type:0,name:'保存'},
      },
        flag: false,
      //   nameF: "zzb",
      //   phone:"188888888",
      address: "留和路299号",
      deleteP: require("@/assets/imagea/delete.svg"),
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      select: require("@/assets/imagea/c1.png"),
      selectnull: require("@/assets/imagea/c2.png"),
      form:{
        name:'', //收货人姓名
        phone:'', 
        isDefault:'', //是否设置为默认地址 1为默认
        addressSupple:'', //addressSupple
        zoneId :'010', //区号Id
      },
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
      defaultData: [
        {
          text: "北京市",
          value: "11",
        }
      ],
      pickData:{
        data1:[],
      },
      res: null,
      // popupVisible:!false,
      popupVisible:false,
      show:false,
      AreaType:0,//数据选择类型 
    };
  },
    created () {
      this.getAreaList();
  },
  mounted () {
      if(this.$route.query.pageType){
            this.barText.leftData.path =  "/my/address?pageType=1";
        }
  },
  methods: {
    // 获取地区信息
    getAreaList(type,id) {
      ajax({
        url: 'member-api-impl/address/selByParentId',
        optionParams: {parentId:0}
      }).post()
        .then(response => {
          if (response.code === 200) {
            let tmpData=[];
            this.Pdata = response.data?response.data:[];
            this.Pdata.map(item=>{
              tmpData.push({text:item.provinceName,value:item.id});
            })
            this.Pdata=tmpData;
            this.pickData.data1=this.Pdata;
            
          } else {
            console.log(response)
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
    // 通过id获取下级
    getByParentId(id){
      if(!id){
        Toast("请选择省份数据");
        return;
      }
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

            if(AreaType==1){
              this.Cdata=tmpData;

              this.Ddata=[],//街道镇
              this.DSelected={};
              this.Sdata=[],//街道镇
              this.SSelected={};
            }else if(AreaType==2){
              this.Ddata=tmpData;
              this.Sdata=[],//街道镇
              this.SSelected={};
            }else if(AreaType==3){
              this.Sdata=tmpData;
            }else if(AreaType==4){
              // this.Pdata=tmpData;
            }else{
              // this.Pdata=tmpData
            }
            this.pickData.data1=tmpData;
            this.toShow();
            
          } else {
            console.log(response)
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
    close() {
      this.show = false;
      this.popupVisible=false;
    }, 
    confirmFn(val) {
      this.show = false;
      this.popupVisible=false;
      this.defaultData = [val.select1];
      // console.log("val==",val);
      if(this.AreaType==0){
          this.PSelected=val.select1;
      }else if(this.AreaType==1){
        if(val.select1.value!=this.PSelected.value){
          this.CSelected=val.select1;
        }else{
          this.CSelected=this.Cdata[0];
        }
      }else if(this.AreaType==2){
        if(val.select1.value!=this.CSelected.value && val.select1.value!=this.PSelected.value){
          this.DSelected=val.select1;
        }else{
          this.DSelected=this.Ddata[0];
        }
      }else if(this.AreaType==3){
        if(val.select1.value!=this.DSelected.value && val.select1.value!=this.CSelected.value && val.select1.value!=this.PSelected.value){
          this.SSelected=val.select1;
        }else{
          this.SSelected=this.Sdata[0];
        }
      }

    },
    toShow() {
      this.popupVisible=true;
      this.show = true;
      if(this.AreaType==0){
        this.Pdata=[],//省
        this.Cdata=[],//市
        this.Ddata=[],//区、县
        this.Sdata=[],//街道镇
        this.PSelected={},
        this.CSelected={},
        this.DSelected={},
        this.SSelected={};
        // this.VSelected={};
        this.getAreaList();
      }
    },

    clear(value) {
      if (value === 1) {
        this.form.name = null;
      } else if (value === 2) {
        this.form.phone = null;
      } else {
        this.form.addressSupple = null;
      }
    },
    submitForm() {
        let phone = this.form.phone,addressSupple=this.form.addressSupple;
        if (!phone) {
          Toast("手机号码不能为空");
          return;
        } else {
          if (!validatPhone(phone)) {
            Toast("手机格式不正确");
            return;
          } else {
            // console.log("1111");

          }
        }
        if (!this.SSelected.text) {
          Toast("地区信息不完整，请仔细检查");
          return;
        }
        if(!addressSupple){
          Toast("详情地址不能为空");
          return;
        }

        this.form.zoneId = this.SSelected.value;
        this.flag ? (this.form.isDefault = 1) : (this.form.isDefault = 0);

        ajax({
          url: 'member-api-impl/user/addAddress ',
          optionParams: this.form,
        }).post()
          .then(res => {
            if (res.code === 200) {
              // this.infoData= res.data?res.data:{};

              // this.balance = res.data.balance;
              Toast("添加地址成功");
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
      }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/addAddress.scss";
</style>
