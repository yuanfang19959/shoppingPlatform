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
      <span class="center_1">消息详情</span>-->
      <top :barType="barType" :barText="barText"></top>
    </div>
    <blank></blank>
    <div class="clear"></div>
    <!-- message -->

    <div class="over">
      <div class="content" v-for="i in records" :key="i.id">
        <div class="top">{{ i.title}}</div>
        <div class="middle" v-html='i.mainBody'>
          {{i.mainBody}}
        </div>
        <div class="bottom"><span>{{i.createUserName}}</span></div>
        <div class="bottom_2"><span>{{i.sendTime}}</span></div>
      </div>

      <div class="btn" @click="$router.push({path:'/editmessage',query:{id:msgId}})" v-if="$route.query.types !=1">回复</div>
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
    blank,
    top
  },
  data() {
    return {
      barType: "0",
      barText: {
        leftData: { type: 2, name: require("@/assets/imagea/blackup.svg"),path:"/message" },
        centerData: { type: 0, name: "消息详情" },
        rightData: { type: 1, name: "" }
      },
      ischecked: false,
      flag: false,
      nameF: "zzb",
      blackup: require("@/assets/imagea/blackup.svg"),
      head: require("@/assets/imagea/head.svg"),
      leftarrow: require("@/assets/imagea/leftarrow.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      garbage: require("@/assets/imagea/my/garbage.svg"),
      activeIndex: 0,
      msgId: null, //消息id
      records:[]
    };
  },
  methods: {
    selectActive(index) {
      this.activeIndex = index;
    },
    updGetMessageTalkList() {
      ajax({
        url: "member-api-impl/message/updGetMessageTalkList",
        optionParams: {
          createUserId: this.msgId,
          pageIndex: 1,
          pageSize: 10
        }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
              this.records = res.data?res.data.records:{}
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
  },
  mounted() {
    this.msgId = this.$route.query.id;
    this.updGetMessageTalkList();
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/messegadetail.scss";
.default {
  color: black;
}
.default-active {
  color: #e1212d;
  border-bottom: 1px solid #e1212d;
}
.breadcrumb {
  height: 130px;
}
</style>
