<template>
  <div class="main">
    <!-- 上部红色区域 -->
    <div class="bannerShow">
      <!--<img
        class="blackup"
        :src="blackup"
        alt=""
        @click="$router.push('/my/index')"
      />
      <span class="center_1">消息</span>
      <span class="right_text">1条未读</span>-->
      <top :barType="barType" :barText="barText"></top>
      <blank></blank>
    </div>

    <!-- tabbar -->
    <div class="nav">
      <ul>
        <li
          v-for="(item, index) in list"
          @click="
            selectActive(index);
            getMessageListByUserId(item.id);
          "
          :class="[activeIndex === index ? 'default-active' : 'default']"
          :key="index"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>

    <!-- message -->
    <div class="content" v-if="messageList.length !=0">
      <!-- 单个聊天 -->
      <div
        class="msBox"
        v-for="item in messageList"
        :key="item.message.id"
        @click="
          $router.push({
            path: '/messageDetail',
            query: { id: item.message.createUserId, types: item.message.types}
          })
        "
      >
        <div class="msBox_left">
           <img :src="logo" alt="这是头像" v-show="item.message.types === 1"/> 
          <img :src="item.message.userImage" alt="这是头像" v-show="item.message.types != 1"/>
          <span class="number" v-if="item.unreadCount != 0">{{ item.unreadCount }}</span>
        </div>

        <div class="msBox_right">
          <div class="right_top">
            <div class="top_text">{{ item.userPO.nickname }}</div>
            <div class="top_text2">{{ item.message.sendTime }}</div>
          </div>
          <span>{{ item.message.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import ajax from "@utils/config";
import top from "@/components/header2.vue";
import blank from "@/components/blank.vue";
export default {
  components: {
    top,
    blank
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 2, name: require("@/assets/imagea/blackup.svg"),path:"/index" },
        centerData: { type: 0, name: "消息" },
        rightData: { type: 0, name:"0条未读" }
      },
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
      logo:  require("@/assets/imagea/lg.png"),
      activeIndex: 0,
      newURL:"",
      list: [
        {
          id: undefined,
          name: "全部"
        },
        {
          id: 0, //借口0传个人，1传系统。误删除
          name: "个人消息"
        },
        {
          id: 1,
          name: "系统消息"
        }
      ],
      messageList: [],
      unreadMES:0,
    };
  },
  mounted() {
  },
  methods: {
    selectActive(index) {
      this.activeIndex = index;
    },
    getMessageListByUserId(id) {
      if (id != undefined) {
       this.newURL = "member-api-impl/message/getMessageListByUserId?types="+id
      }else{
          this.newURL ="member-api-impl/message/getMessageListByUserId"
      }
        ajax({
          url: this.newURL,
          optionParams: {}
        })
          .post()
          .then(response => {
            if (response.code === 200) {
              this.messageList = response.data ? response.data : {};
              this.messageList.map(i=>{
                  this.unreadMES+=i.unreadCount
                  console.log(this.unreadMES)
              })
                this.barText.rightData.name = this.messageList[0].unreadCount + "条未读";
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
  },
  created() {
    this.getMessageListByUserId(undefined);//默认请求全部消息
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/message.scss";
.default {
  color: black;
}
.default-active {
  color: #e1212d;
  border-bottom: 1px solid #e1212d;
}
</style>
