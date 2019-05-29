import Vue from 'vue'
import Router from 'vue-router'
import APP from '../App';
Vue.use(Router)

// import classfication from '@/web/index/classfication'
const defaultRoute = [{
    path: '/',
    component: APP,
    redirect: '/index' //重定向
  },
  {
    path: '/index',
    name: 'index',
    component: resolve => require(['../web/index/index.vue'], resolve),
    meta: {
      title: '主页',
      content: '32453'
    },

  },
  {
    path: '/refund',
    name: 'refund',
    component: resolve => require(['../web/my/refund.vue'], resolve),
    meta: {
      title: '退款售后',
      content: '32453'
    },
  },
  {
    path: '/refundDetails',
    name:'refundDetails',
    meta: {
      title: '退款详情',
      content: '32453'
    },
    component: resolve => require(['../web/order/refundDetails.vue'], resolve),
  },
  {
    path: '/message',
    name: 'message',
    component: resolve => require(['../web/my/message.vue'], resolve),
    meta: {
      title: '消息',
      content: '32453'
    },
  },
  {
    path: '/messageDetail',
    name: 'messageDetail',
    component: resolve => require(['../web/my/messageDetail.vue'], resolve),
    meta: {
      title: '消息详情',
      content: '32453'
    },
  },
  {
    path: '/confirmTheOrder',
    name: 'confirmTheOrder',
     component: resolve => require(['../web/my/confirmTheOrder.vue'], resolve),
    meta: {
      title: '确认订单',
      content: '32453'
    }
  },
  {
    path: '/my/history',
    name: 'history',
    component: resolve => require(['../web/my/history.new.vue'], resolve),
    meta: {
      title: '浏览历史',
      content: '32453'
    }
  },
  {
    path: '/my/index',
    name: 'Myindex',
    component: resolve => require(['../web/my/index.vue'], resolve),
    meta: {
      title: '我的',
      content: '32453'
    }
  },
  {
    path: '/my/problem',
    name: 'problem',
    component: resolve => require(['../web/my/problem.vue'], resolve),
    meta: {
      title: '卡券相关',
      content: '32453'
    }
  },
  {
    path: '/my/myCard',
    name: 'myCard',
    component: resolve => require(['../web/my/myCard.vue'], resolve),
    meta: {
      title: '我的卡券',
      content: '32453'
    }
  },
  {
    path: '/index/detail',
    name: 'detail',
    component: resolve => require(['../web/index/detail.vue'], resolve),
    meta: {
      title: '商品详情',
      content: '32453'
    }
  },
  {
    path: '/my/myAccount',
    name: 'myAccount',
    component: resolve => require(['../web/my/myAccount.vue'], resolve),
    meta: {
      title: '我的账户',
      content: '32453'
    }
  },
  {
    path: '/my/modifyPhone',
    name: 'modifyPhone',
    component: resolve => require(['../web/my/modifyPhone.vue'], resolve),
    meta: {
      title: '更改绑定',
      content: '32453'
    }
  },
  {
    path: '/my/customerService',
    name: 'customerService',
    component: resolve => require(['../web/my/customerService.vue'], resolve),
    meta: {
      title: '帮助与客服',
      content: '32453'
    }
  },
  {
    path: '/my/accountBalance',
    name: 'accountBalance',
    component: resolve => require(['../web/my/accountBalance.vue'], resolve),
    meta: {
      title: '我的账户',
      content: '32453'
    }
  },
  {
    path: '/my/cart',
    name: 'cart',
    component: resolve => require(['../web/my/cart.vue'], resolve),
    // component: resolve => require(['../web/my/cart.new.vue'], resolve),
    meta: {
      title: '购物车',
      content: '32453'
    }
  },
  {
    path: '/my/collection',
    name: 'collection',
    component: resolve => require(['../web/my/collection.vue'], resolve),
    meta: {
      title: '我的收藏',
      content: '32453'
    }
  },
  {
    path: '/my/integral',
    name: 'integral',
    component: resolve => require(['../web/my/integral.vue'], resolve),
    meta: {
      title: '我的积分',
      content: '32453'
    }
  },
  {
    path: '/my/account',
    name: 'account',
    component: resolve => require(['../web/my/accountManage.vue'], resolve),
    meta: {
      title: '我的账户',
      content: '32453'
    },
  },
  {
    path: '/my/account/modify',
    name:'modify',
    component: resolve => require(['../web/my/modifyName.vue'], resolve),
    meta: {
      title: '修改昵称',
      content: '32453'
    }
  },
  {
    path: '/my/search',
    name: 'search',
    component: resolve => require(['../web/my/search.vue'], resolve),
    meta: {
      title: '搜索',
      content: '32453'
    }
  },
  {
    path: '/my/address',
    name: 'address',
    component: resolve => require(['../web/my/address.vue'], resolve),
    meta: {
      title: '收货地址管理',
      content: '32453'
    }
  },
  {
    path: '/my/addressAdd',
    name: 'addAddress',
    component: resolve => require(['../web/my/addressAdd.vue'], resolve),
    meta: {
      title: '添加地址',
      content: '32453'
    }
  },
  {
    path: '/my/addressEdit',
    name: 'addressEdit',
    component: resolve => require(['../web/my/addressEdit.vue'], resolve),
    meta: {
      title: '编辑地址',
      content: '32453'
    }
  },
  {
    path: '/my/invoice',
    name: 'invoice',
    component: resolve => require(['../web/my/invoice.vue'], resolve),
    meta: {
      title: '申请开票',
      content: '32453'
    }
  },
  {
    path: '/my/invoiceAdd',
    name: 'invoiceAdd',
    component: resolve => require(['../web/my/invoiceAdd.vue'], resolve),
    meta: {
      title: '添加抬头',
      content: '32453'
    }
  },
  {
    path: '/my/drawing',
    name: 'drawing',
    component: resolve => require(['../web/my/drawing.vue'], resolve),
    meta: {
      title: '提现银行卡',
      content: '32453'
    }
  },
  {
    path: '/my/drawingAddCard',
    name: 'drawingAddCard',
    component: resolve => require(['../web/my/drawingAddCard.vue'], resolve),
    meta: {
      title: '提现添加',
      content: '32453'
    }
  },
  {
    path: '/my/selectVillage',
    name: 'selectVillage',
    component: resolve => require(['../web/my/selectVillage.vue'], resolve),
    meta: {
      title: '选择帮扶村',
      content: '32453'
    }
  }, 
  {
    path: '/my/searchVillage',
    name: 'searchVillage',
    component: resolve => require(['../web/my/searchVillage.vue'], resolve),
    meta: {
      title: '搜索帮扶村',
      content: '32453'
    }
  },
  {
    path: '/cls',
    name: 'cls',
    meta: {
      title: '分类',
      content: '32453'
    },
    component: resolve => require(['../web/index/classfication.vue'], resolve),
  },
  { //商品列表
    path: '/goodsList',
    name: 'goodsList',
    meta: {
      title: '商品列表',
      content: '32453'
    },
    component: resolve => require(['../web/index/goodsList.vue'], resolve)
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      title: '我的订单',
      content: '32453'
    },
    // component: resolve => require(['../web/order/myOrderNew.vue'], resolve),
    component: resolve => require(['../web/order/myOrder.vue'], resolve),
  },
  {
    path: '/menu/1001',
    meta: {
      title: '农副产品',
      content: '32453'
    },
    component: resolve => require(['../web/index/goodsList.vue'], resolve),
  },
  {
    path: '/menu/1010',
    meta: {
      title: '更多分类',
      content: '32453'
    },
    component: resolve => require(['../web/index/classfication.vue'], resolve),
  },
  {
    path: '/menu/1020',
    meta: {
      title: '更多分类',
      content: '32453'
    },
    component: resolve => require(['../web/index/classfication.vue'], resolve),
  },
  {
    path: '/orderDetails',
    name:'orderDetails',
    meta: {
      title: '订单详情',
      content: '32453'
    },
    component: resolve => require(['../web/order/orderDetails.vue'], resolve),
  },
  {
    path: '/applyRefund',
    name:'applyRefund',
    meta: {
      title: '申请退款',
      content: '32453'
    },
    component: resolve => require(['../web/order/applyRefund.vue'], resolve),
  },
  {
    path: '/exchangeGoods',
    name:'exchangeGoods',
    meta: {
      title: '申请换货',
      content: '32453'
    },
    component: resolve => require(['../web/order/exchangeGoods.vue'], resolve),
  },
  {
    path: '/evaluationCenter',
    name:'evaluationCenter',
    meta: {
      title: '评价中心',
      content: '32453'
    },
    component: resolve => require(['../web/my/evaluationCenter.vue'], resolve),
  },
  {
    path: '/writeEvaluation',
    name:'writeEvaluation',
    meta: {
      title: '编写评价',
      content: '32453'
    },
    component: resolve => require(['../web/my/writeEvaluation.vue'], resolve),
  },
  {
    path: '/allEvaluation',
    name:'allEvaluation',
    meta: {
      title: '全部评价',
      content: '32453'
    },
    component: resolve => require(['../web/my/allEvaluation.vue'], resolve),
  },
  {
    path: '/balanceDetails',
    name:'balanceDetails',
    meta: {
      title: '余额明细',
      content: '32453'
    },
    component: resolve => require(['../web/my/balanceDetails.vue'], resolve),
  },
  {
    path: '/confirmGoods',
    name:'confirmGoods',
    meta: {
      title: '收货成功',
      content: '32453'
    },
    component: resolve => require(['../web/order/confirmGoods.vue'], resolve),
  },
  {
    path: '/evaluationSuc',
    name:'/evaluationSuc',
    meta: {
      title: '评价成功',
      content: '32453'
    },
    component: resolve => require(['../web/order/evaluationSuc.vue'], resolve),
  },  
  {
    path: '/logStatus',
    name:'/logStatus',
    meta: {
      title: '物流状态',
      content: '32453'
    },
    component: resolve => require(['../web/order/logStatus.vue'], resolve),
  },  
  {
    path: '/login',
    name:'/login',
    meta: {
      title: '登录',
      content: '32453'
    },
    // component: resolve => require(['../web/index/login.vue'], resolve),
    component: resolve => require(['../web/index/login.new.vue'], resolve),
  }, 
  {
    path: '/editmessage',
    name:'/editmessage',
    meta: {
      title: '登录',
      content: '32453'
    },
    // component: resolve => require(['../web/index/login.vue'], resolve),
    component: resolve => require(['../web/my/editmessage.vue'], resolve),
  }, 
  {
    path: '/pay',
    name:'/pay',
    meta: {
      title: '支付',
      content: '32453'
    },
    // component: resolve => require(['../web/index/login.vue'], resolve),
    component: resolve => require(['../web/order/pay.vue'], resolve),
  }, 
  {
    path: '/paySuc',
    name:'/paySuc',
    meta: {
      title: '支付成功',
      content: '32453'
    },
    // component: resolve => require(['../web/index/login.vue'], resolve),
    component: resolve => require(['../web/order/paySuc.vue'], resolve),
  }, 
];
export default new Router({ //路由懒加载 
  // mode: 'history', //去掉# //需后台配合 nginx
  routes: defaultRoute,
  scrollBehavior(to, from, savedPosition) { //第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
    if (savedPosition) { //前进后退按钮  保持原样
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      } //跳转   回顶部
    }
  }
})
