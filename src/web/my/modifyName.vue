<template>
    <div class="main">
        <!-- 上部红色区域 -->
        <div class="bannerShow">
            <!--<img class="blackup" :src="blackup" alt="" @click='$router.go(-1)'>
            <span class="center_1">修改昵称</span>
            <span class="leftS" @click="updateInfo">保存</span>-->
            <top :barType='barType' :barText='barText' @subSave='updateInfo'></top>
            <blank></blank>
        </div>
        <div class="content">
            <p>设置爱心购物昵称</p>
            <div class="inputBox">
                <input type="text" v-model="nickName" placeholder="请输入昵称" style="width: 90%">
                <img :src="deleteP" alt="" @click="clear">
            </div>
            <span>默认昵称使用微信昵称，该昵称只会在与卖家交流时出现</span>
        </div>

    </div>
</template>

<script>
    import { Toast } from "mint-ui";
    import ajax from '@utils/config';
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
                    centerData:{type:0,name:'修改昵称'},
                    rightData:{type:0,name:'保存'},
                },
                // nameF: "zzb",
                blackup: require("@/assets/imagea/blackup.svg"),
                head: require("@/assets/imagea/head.svg"),
                leftarrow: require("@/assets/imagea/leftarrow.svg"),
                deleteP: require("@/assets/imagea/delete.svg"),
                nickName:null,
            }
        },
        mounted () {
            this.nickName=this.$route.query.nickname?this.$route.query.nickname:'';
        },
        methods: {
            saveSuccess() {
                Toast({
                    message: "保存成功",
                    duration: 1500
                });
            },
            clear() {
                this.nickName = null
            },
            updateInfo() {
                if(!this.nickName){
                    Toast("昵称不能为空");
                    return;
                }
                ajax({
                    url: 'member-api-impl/user/updAccountDetail',
                    optionParams: {nickname:this.nickName},
                    contentType: 'multipart/form-data',
                }).post()
                    .then(res => {
                        if (res.code === 200) {
                            Toast("修改成功");
                            this.$router.push("/my/account");
                        } else {
                            console.log(res)
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
@import "./scss/modifyName.scss";
</style>