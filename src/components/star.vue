<template>
  <!-- 此为评分组件值z   -->
  <div>
    <span class="pro">商品评分</span>
    <span v-for="(i, index) in starList" :key="i.id">
      <img :src="i.star" v-show="i.starFlag" @click="modifyStar(index)" />
      <img :src="i.starempty" v-show="!i.starFlag" @click="modifyStar(index)" />
    </span>
    <span class="proContent">{{ this.contenText }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      // itemIndex 确认被点击的组件index
      itemIndex: {
        type: String| Number,
        default: function () {
          return '0';
        }
      }
    },
    data() {
      return {
        starCount: null,
        contenText: null,
        content: [
          {
            count: 0,
            text: "非常差"
          },
          {
            count: 1,
            text: "差"
          },
          {
            count: 2,
            text: "一般"
          },
          {
            count: 3,
            text: "好"
          },
          {
            count: 4,
            text: "非常好"
          }
        ],
        starList: [
          {
            id: 1,
            star: require("@/assets/imagea/star.svg"),
            starempty: require("@/assets/imagea/starempty.svg"), //星星熄灭状态
            starFlag: false
          },
          {
            id: 2,
            star: require("@/assets/imagea/star.svg"),
            starempty: require("@/assets/imagea/starempty.svg"), //星星熄灭状态
            starFlag: false
          },
          {
            id: 3,
            star: require("@/assets/imagea/star.svg"),
            starempty: require("@/assets/imagea/starempty.svg"), //星星熄灭状态
            starFlag: false
          },
          {
            id: 4,
            star: require("@/assets/imagea/star.svg"),
            starempty: require("@/assets/imagea/starempty.svg"), //星星熄灭状态
            starFlag: false
          },
          {
            id: 5,
            star: require("@/assets/imagea/star.svg"),
            starempty: require("@/assets/imagea/starempty.svg"), //星星熄灭状态
            starFlag: false
          }
        ],
        // itemIndex:'',
      };
    },
    methods: {
      change() {
        this.flag = !this.flag;
      },
      alr() {
        Toast("发布成功");
      },
      modifyStar(index) {
        this.starList[index].starFlag = !this.starList[index].starFlag;
        for (var i = 0; i < index + 1; i++) {
          this.starList[i].starFlag = true;
          this.starCount = index;
          // console.log(this.starCount);
        }
        this.contenText = this.content[index].text;
        //   console.log(this.contenText)
        console.log("index 组件====",this.itemIndex);
        this.$emit("func", this.starCount, this.itemIndex);
        //这边给调用者传递星星的数量
      }
    },
    watch: {
      //监听星星数量的变化
      starCount(newValue, oldValue) {
        if (newValue < oldValue) {
          //如果新小于旧，先遍历一遍数组，恢复状态
          this.starList.map(item => {
            item.starFlag = false;
          });
          //然后根据新的索引值进行渲染
          for (var i = 0; i < newValue + 1; i++) {
            this.starList[i].starFlag = true;
            this.starCount = newValue;
          }
        }
      }
    },

  };

//调用者需要写的方法
// <star @func = "getStarCount"></star>
//获取子组件星星的值
// getStarCount(fromSon){
//     this.StarCount = fromSon
//     console.log(this.StarCount)
// }

// 如遇一个页面引入star组件，请分别写调用函数防止干扰
// 这边实际数量为console.log数+1
</script>


<style lang="scss" <style lang="scss" scoped>
div {
  display: flex;
  justify-items: center;
  padding: 20px 0;
  .pro {
    font-size: 20px;
    font-family: SourceHanSansCN-Light;
    font-weight: 300;
    color: #808080;
    line-height: 41px;
  }
  .proContent {
    font-size: 25px;
    font-family: SourceHanSansCN-Regular;
    font-weight: 400;
    color: #4d4d4d;
    line-height: 41px;
  }
}
img {
  padding: 0 12px;
}
</style>