<template>
  <div class="selectVillage_page">
    <headerTop :barType='barType' :barText='barText' @subSave='subSave'></headerTop>
    <blank></blank>
    <div class="center_list">
      <div class="center_list_top">
        <ul>
          <li v-if="type==1||type==2">{{form.provinceVal}}</li>
          <li v-if="type==2">{{form.cityVal}}</li>
          <li v-if="type>=3">
             <span class="bottom_text">{{form.provinceVal}} {{form.cityVal}} {{form.districtVal}} {{form.villageVal}} {{form.committeesVal}}</span>
          </li>
        </ul>
      </div>
      <ul class="areaList">
        <li v-for='i in Plist'  v-text='i.provinceName' v-show='type==null' @click='goNext(1,i,)'></li>
        <li v-for='i in Plist' v-text='i.provinceName' v-show='type==1' @click='goNext(2,i,)'></li>
        <li v-for='i in Plist' v-text='i.provinceName' v-show='type==2' @click='goNext(3,i,)'></li>
        <li v-for='i in Plist' v-text='i.provinceName' v-show='type==3' @click='goNext(4,i,)'></li>
        <li v-for='i in Plist' v-text='i.provinceName' class="555" v-show='type==4' @click='goNext(5,i,)'></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from '@utils/config'; 
import headerTop from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components:{
    headerTop,
    blank,
  },
  data() {
    return {
      barType:'0',  
      barText:{
        leftData:{type:2,name:require("@/assets/imagea/blackup.svg"),path:'/confirmTheOrder'},
        centerData:{type:0,name:'选择帮扶村'},
        rightData:{type:1,name:require("@/assets/imagea/searchimg.svg")},
      },
      Plist:[],
      form:{
        provinceVal:'',//省 
        cityVal:'',//市
        districtVal:'',// 区/县
        villageVal:'',//村
        committeesVal:'',//村居委会
      },
      type:null,//顶部页面数据
      areaType:null,
    };
  },
  created() {
    this.getByParentId(0);
  },
  methods: {
    // 通过id获取下级
    getByParentId(id){
      ajax({
        url: 'member-api-impl/address/selByParentId',
        optionParams: {parentId:id}
      }).post()
        .then(response => {
          if (response.code === 200) {
            this.Plist = response.data?response.data:[];
          } else {
            console.log(response)
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
      // 数据切换
      goNext(type,name){
        if(type==1){
          this.form.provinceVal=name.provinceName;
          this.getByParentId(name.id);
        }else if(type==2){
          this.form.cityVal=name.provinceName;
          this.getByParentId(name.id);
        }else if(type==3){
          this.form.districtVal=name.provinceName;
          // console.log("name=3=",name)
          this.getByParentId(name.id);
        }else if(type==4){
          this.form.villageVal=name.provinceName;
          console.log("name.id=4=",name.id);
          this.getByParentId(name.id);
        }else if(type==5){
          this.form.committeesVal=name.provinceName;
          let provinceName = this.form.provinceVal+this.form.cityVal+this.form.districtVal+this.form.villageVal+this.form.committeesVal;
          let searchRes={addressId:name.id,address:provinceName}
          this.$router.push({path:'/confirmTheOrder',query:{searchRes:JSON.stringify(searchRes)}})
        }
        this.type=type;
      },
      subSave() {
        this.$router.push('/my/searchVillage')
      }
    }
};
</script>

<style lang="scss" scoped>
@import "./scss/selectvillage.scss";
</style>
