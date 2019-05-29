# web
H5+Vue 移动端电商项目，前后端分离。用了一点es6，出来实习第一次做大项目。部分地方不是很好，scss写的不太好，日后会有提升的。


#项目总结
## 页面结构方面：
1.这次写的移动端页面比较多，开始时没有琢磨页面的大致结构。直接上手，导致页面做的比较慢。后来采用导师的建议，写代码前先在纸上画出大致结构然后在进行；另外在class命名方面有待欠缺，有待改善；

## scss方面：
1.由于之前对这个不是很熟悉，项目中很多样式可以复用的地方。没有定义在公共common.scss中；例如比较统一的样式，定义在commin中，可以方便后期维护；
2.写样式的时候最好有一个规则，按照一定的顺序来；

## js代码方面：
1.项目后期，考虑到代码的维护性。期间阅读了《高性能js》书籍，对部分代码做了调整；尽量少使用全局变量，数组迭代的时候最好缓存长度等；学的还不够多，后面多看点然后尽量提升代码的性能；
2.手写遮罩的时候，想用一个定时器让遮罩在3秒以后显示。结果半天遮罩不消失，原因在于setTimeout中的this和外部的this不一样。这个时候可以用箭头函数，或者apply等方式进行传值；
3.vue框架中动态给一个数组对象追加新属性的时候，直接使用了使用了obj.property = "xxx"方法追加。虽然追加成功，但是此方法不能触发视图更新。此时可以用this.$set(i, "ischecked", false)；
4.业务上有分页的需求，于是使用原生js写了一个加载。写的时候遇到了点问题，在chrome下可以正常运行。到了safari确失效了。由于没有苹果电脑，只能在手机上滑动的时候弹出alert显示scrollTop的高度；
问题就出在scrollTop上，safari只支持window.pageYOffset,于是对代码做了改进；

##let innerHeight = document.querySelector(".content").clientHeight; //屏幕尺寸高度
##let outerHeight = document.documentElement.clientHeight; //可滚动容器超出当前窗口显示范围的高度 
//scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
##let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 //解决不同浏览器的兼容性

5.首页轮播图使用了swiper.js动态加载后端传来的数据时，会造成无法滑动的问题。这个时候要用定时器，进行延时加载；才能正常滑动；

##目前暂时只有这么多，下一个项目需要加强规范；多碰问题多提升；