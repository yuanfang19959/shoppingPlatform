<template>
    <div class="maxBox"  v-if="imgShow" @click="clickFalse()">
    <div class="confirmBox">
        
    </div>
    <img :src="url" alt="" class="msgBox">
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    name: 'imgPreview',
    props: {
        // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来imgShow = false;
        url: {
            type: String,//Boolean Array Object
            default: function() {
                return ''
            }
        },
        //弹框是否出现
        imgShow: {
            type: Boolean,//Boolean Array Object
            default: function() {
                return false
            }
        }
    },
    data() {
        return {
            isShow: false,
        }
    },
    created() {
        // this.isShow = this.imgShow;
        // console.log(this.isShow);
    },
    mounted () {
        this.$emit("listenChange");
    },
    computed: {
        // isShow(){
        //     return this.imgShow;
        // }
    },
    methods: {
        clickFalse() {

        },
        savePicture() {

            // 创建下载任务
            picurl="http://*************/Public/Uploads/dingwei/erwei.png";
            //图片保存到手机后的路径
            picname="_downloads/erwei.png";
            var dtask = plus.downloader.createDownload(picurl, {}, function ( d, status ) {
            // 下载完成
            if ( status == 200 ) { 
            //	alert( "Download success: " + d.filename );
            plus.gallery.save(picname,function() {//保存到相册方法
            console.log('已保存到手机相册');
            }, function() {
            console.log('保存失败，请重试！');
            });
            } else {
            //	alert( "Download failed: " + status ); 
            }
            });
            //dtask.addEventListener( "statechanged", onStateChanged, false );
            dtask.start();//开始下载
        }
    }
}
</script>
<style lang='scss' scoped>
.maxBox{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    .confirmBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .8;
    background: #000;
    // z-index: 2012;
    
    }
    .msgBox {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        // height: 154px;
        // width: 154px;

    }
}

</style>
