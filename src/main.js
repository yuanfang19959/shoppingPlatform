import 'babel-polyfill'; //开发环境显示  360和ie
import App from './App'
import Vuex from 'vuex';
import Vue from 'vue';
import router from './router';
import store from './store';
import * as filters from './filters/index.js'
import '@/assets/scss/reset.scss'; //重置样式
import Cookies from 'js-cookie';
import Swiper from 'swiper';
import MintUI from 'mint-ui'
import FastClick from 'fastclick'
import 'mint-ui/lib/style.css'
import '@/assets/scss/commin.scss';

Vue.use(MintUI)
// 赋值到Vue的原型上面，在页面就可以使用this.$ + name获取到了
Vue.prototype.$Swiper = Swiper;
Vue.prototype.$Cookies = Cookies;

//全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
Vue.use(Vuex);

/* eslint-disable no-new */


//全局钩子作用于所有路由，里面的参数to表示即将要进入的路由对象，from表示即将要离开的路由对象 路由进入之前
router.beforeEach((to, from, next) => {
  // if (to.path == '/') {
  //   next();
  // }
  /* 路由发生变化修改页面meta */ //搜索关键字什么的可以使用
  if (to.meta.content) {
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    meta.content = to.meta.content;
    head[0].appendChild(meta)
  }
  /* 路由发生变化修改页面title */ //document.title = window.localStorage.getItem("token")?window.localStorage.getItem("token"):'';
  // if (to.meta.title) {
  //   if (to.path.indexOf('/debt/detailsdeb') != -1 || to.path.indexOf('/my/detail') != -1) {
  //     document.title = window.localStorage.getItem("title") ? window.localStorage.getItem("title") : '';
  //   } else {
  //     document.title = to.meta.title;
  //   }

  // } else {
  //   document.title = window.localStorage.getItem("title") ? window.localStorage.getItem("title") : '';
  // }
  //登录且有用户信息
    if (store.getters.token) {
        console.log(11112);
        next();
    } else if (!store.getters.token && window.localStorage.getItem('token')) {
        // 登录且没有用户信息
        console.log(11113);
        store.dispatch('SETTOKEN', { token: window.localStorage.getItem('token') });
        next();
    } else if (to.path.indexOf('/login') != -1 ||  to.path == '/') {
        console.log(11115);
        next();
    } else {
        console.log(11116);
        next('/login');

    }

  // next();
});
// //路由进入之后
router.afterEach((to, from) => {

});


new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
