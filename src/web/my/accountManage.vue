<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <img class="blackup" :src="blackup" alt="" @click="$router.push('/my/index')" />
      <span>账号设置</span>
    </div>
    <div class="content">
      <div class="c1" @click='sheetVisible=!sheetVisible;actions=actions1'>
        <span class="s1">我的头像</span>
        <img :src="infoData.userImage" alt="" style="height: 95px;width: 95px;" />
      </div>
      <div class="flexbox c1 " @click="$router.push({path:'/my/account/modify',query:{nickname:infoData.nickname}})">
        <span class="width140">我的昵称</span>
        <div class="flex1">
          <span class="flexbox">
            <span class="s2 flex1" style="text-align: right">{{infoData.nickname}}</span>
            <img :src="leftarrow" alt="" />
          </span>
        </div>
      </div>
      <div class="c1">
        <span>我的ID</span>
        <span class="s3"> {{infoData.userNum}}</span>
      </div>
      <div class="c1" @click='sheetVisible=!sheetVisible;actions=actions2'>
        <span>我的性别</span>
        <div>
          <span class="s2" v-for='i in actions2' v-show="i.value==infoData.sex" v-text='i.name'></span>
          <img :src="leftarrow" alt="" />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="c1" v-show='false'>
        <span>绑定微信账号</span>
        <span class="s2">远方19959</span>
      </div>
      <!--<div class="c1" >-->
      <div class="c1" @click="$router.push({path:'/my/modifyPhone',query:{phone:infoData.phone}})">
        <span>绑定手机号</span>
        <span class="s2"> {{infoData.phone}}</span>
      </div>
    </div>
    <div class="content">
      <div class="c1">
        <span>注册时间</span>
        <span class="s2">{{infoData.createTime}}</span>
      </div>
      <div class="c1" @click="$router.push({path:'/my/modifyPhone',query:{phone:infoData.phone}})">
        <span>更改绑定</span>
        <div>
          <img :src="leftarrow" alt="" />
        </div>
      </div>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetVisible">
    </mt-actionsheet>
    <input v-show='false' ref="filElem" accept="image/*" type="file" capture="camera" @change='getFile(1)'>
    <input v-show='false' ref="filElem2" type="file" accept="image/png,image/gif,image/jpeg" class="upload-file"
      @change="getFile(2)">
  </div>
</template>

<script>
import ajax from "@utils/config";
import { Toast, Actionsheet } from "mint-ui";
export default {
  data() {
    return {
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      sheetVisible: false,
      actions: [],
      actions1: [
        { name: "拍照", method: this.getCamera },
        { name: "从相册中选择", method: this.getLibrary }
      ],
      actions2: [
        { name: "男", method: this.checkSex, value: 0 },
        { name: "女", method: this.checkSex1, value: 1 }
      ],
      sexData: "保密",
      imgSrc: require("@/assets/imagea/head.svg"),
      infoData: {}
    };
  },
  created() {
    this.getInfoData();
  },
  methods: {
    getCamera() {
      console.log("getCamera");
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    getLibrary() {
      console.log("getLibrary");
      this.$refs.filElem2.dispatchEvent(new MouseEvent("click"));
    },
    getFile(type) {
      let that = this,
        inputFile;
      if (type == 1) {
        inputFile = this.$refs.filElem.files[0];
      } else {
        inputFile = this.$refs.filElem2.files[0];
      }
      if (
        inputFile.type !== "image/jpeg" &&
        inputFile.type !== "image/png" &&
        inputFile.type !== "image/gif"
      ) {
        Toast("不是有效的图片文件！");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onload = function(e) {
        that.infoData.userImage = this.result;
      };
      this.updateInfo(2, inputFile);
    },

    checkSex() {
      this.updateInfo(1, 0);
    },
    checkSex1() {
      this.updateInfo(1, 1);
    },
    getInfoData() {
      this.infoData.userImage = "";
      ajax({
        url: "member-api-impl/user/accountDetail",
        optionParams: {}
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.infoData = res.data ? res.data : {};
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 数据更新  0 nickname 1 sex  2 userImage
    updateInfo(type, data) {
      let dataobj = {},
        updateData = data,
        contentType = "";
      if (type == 0) {
        dataobj = { nickname: updateData };
      } else if (type == 1) {
        if (this.infoData.sex == data) return;
        dataobj = { sex: updateData };
      } else {
        contentType = "multipart/form-data";
        dataobj = { userImage: updateData };
      }
      ajax({
        url: "member-api-impl/user/updAccountDetail",
        optionParams: dataobj,
        contentType: "multipart/form-data"
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            Toast("修改成功");
            this.getInfoData();
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/accountManage.scss";
</style>