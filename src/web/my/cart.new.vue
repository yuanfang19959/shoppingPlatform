<template>
  <div class="cart_page">
    <div class=" cart_page_top">
      <div class="flexbox">
        <div class="flex1"></div>
        <div class="flex2">购物车</div>
        <div class="flex1" v-if="isEdit" @click="isEdit = !isEdit">完成</div>
        <div class="flex1" v-else @click="isEdit = !isEdit">编辑</div>
      </div>
    </div>
    <div class="clear"></div>
    <div class="totalNum">
      共<i>{{ this.allgoodsCount }}</i>件
    </div>
    <div class="cart_list">
      <ul v-for="(i, a) in cartList" :key="a">
        <!-- 注销的是供应商名称 -->
        <li class="" v-for="(item, b) in i.goodsList" :key="b">
          <div class="flexbox itemFirst">
            <div class="checkedimg" @click="checkedGoods(item)">
              <img :src="checked" v-show="!item.ischecked" alt="" />
              <img :src="checkedH" v-show="item.ischecked" alt="" />
            </div>
            <div class="goodsImg" @click="
                $router.push({ path: '/index/detail', query: { id: item.id } })
              ">
              <img :src="item.detailImageAddress" alt="商品图" />
            </div>
            <div class="goodsText">
              <div class="goodsTextDis">{{ item.name }}</div>
              <div class="netContent">净含量{{ item.weight }}</div>
              <div class="flexbox goodsTextR">
                <span class="flex1 priceNum">￥{{ item.price }}</span>
                <span class="addORsub">
                  <img @click="cartOpera(a, b, 0, item.id, item.supplierId)" :src="cartJia" alt="" />
                  <span class="span_input">
                    <input type="number" placeholder="1" v-model="item.shopCarNum" />
                  </span>
                  <img @click="cartOpera(a, b, 1, item.id, item.supplierId)" :src="cartJian" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div class="flexbox itemsecond">
            <div class="navImg">
              <img :src="dingwei" alt="" />
            </div>
            <div class="selectVillage flex3" @click="$router.push('/my/selectVillage')">
              <div>
                选择帮扶村
              </div>
            </div>
            <div class="flex1 rateNum">
              可得积分 <i>{{ item.integral }}</i>
            </div>
          </div>
        </li>
      </ul>
      <div class="blackspace"></div>
    </div>
    <!--底部功能-->
    <div class="bottom_pay">
      <div class="checked_btn">
        <div class="img_layer" @click="checkAll">
          <img :src="checked" alt="" v-show="!ischeckAll" />
          <img :src="checkedH" alt="" v-show="ischeckAll" />
        </div>
        <div class="checked_btn_text" @click="checkAll">全选</div>
      </div>
      <div class="total_num">
        <span v-if="!isEdit">
          <span class="">总计</span>
          <span class="total_num_price">￥{{ totalNum }}</span>
        </span>
        <span v-else @click="addCollect">
          加入收藏
        </span>
      </div>
      <div class="sub_btn" v-if="!isEdit" @click="buyRightNow">结算</div>
      <div class="sub_btn" v-if="isEdit" @click="delData(1)">删除</div>
    </div>
    <foot></foot>
  </div>
</template>
<script>
import store from "@/store";
import foot from "@/components/footer.vue";
import ajax from "@utils/config";
import { Loadmore, MessageBox, Toast } from "mint-ui";
export default {
  components: {
    foot
  },
  data() {
    return {
      img: require("@/assets/imagea/pro.png"),
      dingwei: require("@/assets/imagea/dingwei.svg"),
      checked: require("@/assets/imagea/checked.svg"),
      checkedH: require("@/assets/imagea/checkedH.svg"),
      cartJian: require("@/assets/imagea/cartJian.png"),
      cartJia: require("@/assets/imagea/cartJia.png"),
      totalNum: 0, //底部显示金额
      param: {},
      params: {
        pageIndex: 0,
        pageSize: 20
      },
      ischeckAll: false,
      isEdit: false, //是否编辑状态
      arr: [], //临时存储数据
      cartList: [],
      allgoodsCount: 0 //商品总件数
    };
  },
  watch: {
    ischeckAll(newval, oldval) {
      let vm = this;
      this.cartList.forEach(it => {
        it.goodsList.forEach(i => {
          if (!i.ischecked) {
            vm.ischeckAll = false;
          }
        });
      });
    }
  },
  created() {
    this.getCartData();
  },
  mounted() {},
  methods: {
    // 获取购物车数据 /shopcar/priceShopCar
    getCartData() {
      let pageIndex = this.params.pageIndex,
        pageSize = this.params.pageSize;
      ajax({
        url:
          "product-api-impl/shopcar/shopCarList?page=" +
          pageIndex +
          "&pageSize=" +
          pageSize,
        optionParams: this.params
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.cartList = res.data ? res.data : {};
            this.cartList.map(item => {
              item.goodsList.map(i => {
                this.$set(i, "ischecked", false);
              });
            });
            this.computeThecount();
            console.log(this.cartList);
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 点击结算
    submitOrder() {
      ajax({
        url: "product-api-impl/shopcar/priceShopCar",
        optionParams: data
      })
        .post()
        .then(res => {
          if (res.code === 200) {
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 商品被勾选
    checkedGoods(item) {
      item.ischecked = !item.ischecked;
      let vm = this,
        tmpTotal = 0;
      if (!item.ischecked) {
        this.ischeckAll = false;
      } else {
        this.cartList.map(it => {
          it.goodsList.map(i => {
            if (i.ischecked) {
              vm.ischeckAll = true;
            }
          });
        });
      }

      console.log("this.arr=111=", this.arr);
      this.priceTotal();
    },
    // 统计总价格
    priceTotal() {
      let tmpTotal = 0;
      let count = 0;
      this.cartList.forEach(it => {
        it.goodsList.forEach(i => {
          if (i.ischecked) {
            tmpTotal += i.shopCarNum * i.price * 1;
          }
        });
        count += it.goodsList.length;
      });
      this.allgoodsCount = count;
      tmpTotal = Math.round(tmpTotal * 100) / 100; //解决多个浮点数累加导致小数点后无限位数的问题
      this.totalNum = tmpTotal;
    },
    // 全选
    checkAll() {
      this.ischeckAll = !this.ischeckAll;
      let vm = this;
      this.cartList.forEach(it => {
        it.goodsList.forEach(i => {
          if (!vm.ischeckAll) {
            this.$set(i, "ischecked", false);
          } else {
            this.$set(i, "ischecked", true);
          }
        });
      });
      this.priceTotal();
    },
    // type 0加 1减
    cartOpera(index, index2, type, id, supId) {
      let num = this.cartList[index].goodsList[index2].shopCarNum;
      console.log(num);

      if (!type) {
        num += 1;
      } else {
        if (num < 2) {
          num = 1;
          Toast("已为最小值啦，不能再减啦~~");
        } else {
          num -= 1;
        }
      }
      this.modifyGoods(id, num, supId);
      this.cartList[index].goodsList[index2].shopCarNum = num;
      this.priceTotal();
    },

    // 删除购物车
    delData(type) {
      var params = {};
      this.cartList.map(items => {
        var ids = [];
        items.goodsList.map(item => {
          if (item.ischecked) {
            ids.push(item.id);
            // 删除商品传值形式
            // {
            //     "厂商1"："id1，id2",
            //     "厂商2"："id1",
            // }
            params[item.supplierId] = ids.join(); //这边必须使用join否则无法拼接，删除只能删一项
          }
        });
      });
      ajax({
        url: "product-api-impl/shopcar/deleteShopCar",
        optionParams: params
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            this.getCartData();
            if (type === 1) {
              Toast("删除成功！");
            }
            this.totalNum = 0;
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 加入收藏
    addCollect() {
      let temp = [];
      this.cartList.map(item => {
        item.goodsList.map(i => {
          if (i.ischecked) {
            temp.push(i.id);
          }
        });
      });
      console.log(temp);
      ajax({
        //收藏
        url: "member-api-impl/userInfo/CollectionAction",
        optionParams: { productIds: temp, type: 1 }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            Toast("收藏夹等你哦！");
            this.delData(); //加入收藏成功删除购物车的商品列表
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    modifyGoods(goodsId, goodsNum, supId) {
      //修改商品数量
      ajax({
        url: "product-api-impl/shopcar/addAndUpdateShopCar",
        optionParams: {
          goodsId: goodsId,
          goodsNum: this.goodsNum,
          supplierId: supId
        }
      })
        .post()
        .then(res => {
          if (res.code === 200) {
            Toast("修改成功！");
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 默认计算商品件数
    computeThecount() {
      let count = 0;
      this.cartList.forEach(it => {
        // it.goodsList.forEach(i => {});
        count += it.goodsList.length;
      });
      this.allgoodsCount = count;
    },

    //测试用 可等结算接口正常后删除
    buyRightNow() {
      let temp = [],
        isWantBuy = false; //看是否有商品被选中，选中可以进行页面跳转 否则不行
      //存放多选商品id {id：商品id，count：商品数量} 存入localstorage中
      //多选商品时，可将数组传给商品接口，离开确认订单页面时。将localsotorage删除，不影响重复提交。
      this.cartList.map(item => {
        item.goodsList.forEach(i => {
          if (i.ischecked) {
            temp.push({
              id: i.id,
              count: i.shopCarNum,
              supplierId: i.supplierId
            });
            isWantBuy = true;
          }
        });
      });
      localStorage.setItem("goodArr", JSON.stringify(temp));
      isWantBuy
        ? this.$router.push("/confirmTest")
        : Toast("您没有选择宝贝哦！");
    }
  },

  filters: {}
};

//
</script>
<style lang='scss' scoped>
@import "./scss/cart.scss";
</style>
