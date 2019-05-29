<template>
    <div class="alertBox" v-if="isShow">
        <div class="msgBox">
            <div class="msgBox_header">
                <div class="title">
                    {{title}}
                </div>
            </div>
            <div class="msgBox_content">
                <div class="msgBox_message">
                    {{message}}
                </div>
            </div>
            <div class="msgBox_btn" @click="isShow=!isShow;">
                确定
            </div>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    name: 'alertBox',
    props: {
        // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
        message: {
            type: String,//Boolean Array Object
            default: function() {
                return ''
            }
        },
        //弹框标题
        title: {
            type: String,//Boolean Array Object
            default: function() {
                return '提示'
            }
        },
        //弹框是否出现
        isShow: {
            type: Boolean,//Boolean Array Object
            default: function() {
                return false
            }
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    computed: {
        
    },
    methods: {

    }
}
</script>
<style lang='scss' scoped>
.alertBox {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 2012;
    .msgBox {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
        background-color: #fff;
        width: 60%;
        border-radius: 3px;
        font-size: 16px;
        -webkit-user-select: none;
        overflow: hidden;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transition: .2s;
        transition: .2s;
        font-size: 30px;
        .msgBox_header {
            width: 100%;
            padding: 15px 0 0;
            .title {
                text-align: center;
                padding-left: 0;
                margin-bottom: 0;
                font-size: 30px;
                font-weight: 700;
                color: #333;
            }
        }
        .msgBox_content {
            width: 100%;
            padding: 10px 20px 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            min-height: 36px;
            position: relative;
        }
        .msgBox_btn {
            width: 100%;
            text-align: center;
            line-height: 60px;
            height: 60px;
            color: #26a2ff;
            font-size: 30px;
            font-weight: 700;
        }
    }
}
</style>
