<template>
	<div class="footercontent">
		<li class="tabItem" :class="{hover: item.isHover}" @click="set(item);" v-for="item in list">
			<img :src="item.img2" alt="" v-if="item.isHover">
			<img :src="item.img1" alt="" v-else><br>{{item.name}}
		</li>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { mapState, mapMutations, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				list: [
					{
						name: '首页',
						path: '/index',
						isHover: false,
						img1: require("@/assets/imagea/menu/menu1.svg"),
						img2: require("@/assets/imagea/menu/menu1H.svg")
					},
					{
						name: '分类',
						path: '/cls',
						isHover: false,
						img1: require("@/assets/imagea/menu/menu2.svg"),
						img2: require("@/assets/imagea/menu/menu2H.svg")
					},
					{
						name: '订单',
						path: '/order',
						isHover: false,
						img1: require("@/assets/imagea/menu/menu3.svg"),
						img2: require("@/assets/imagea/menu/menu3H.svg")
					},
					{
						name: '购物车',
						path: '/my/cart',
						isHover: false,
						img1: require("@/assets/imagea/menu/menu4.svg"),
						img2: require("@/assets/imagea/menu/menu4H.svg")
					},
					{
						name: '我的',
						path: '/my/index',
						isHover: false,
						img1: require("@/assets/imagea/menu/menu5.svg"),
						img2: require("@/assets/imagea/menu/menu5H.svg")
					}
				],
			}
		},
		mounted() {
		},
		computed: {

		},
		watch: {

		},
		created() {
			this.init ();
		},
		methods: {
			init () {
				let name = this.$route.path;
				this.list.map((v)=> {
                    if (name == v.path) {
                         v.isHover = true;
					}
				})

			},
			set(item) {
				this.list.map((v)=> {
                    v.isHover = false;
				})
				item.isHover = true;
				this.$router.push({
                     path: item.path
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.footercontent{
	    width: 100%;
		display: flex;
        display: -webkit-flex;
		height: 102px;
		background:rgba(255,255,255,1);
		position: fixed;
		bottom: 0;
		border-top:1px solid rgba(225,225,225,1);
		z-index: 99;
		.tabItem{
			flex: 1;
			font-size: 20px;
			height: 102px;
			width: 50px;
			color: rgba(151,151,151,1);
			font-size:22px;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			text-align: center;
			&>img{
				width: 48px;
				height: 48px;
				margin-top: 15px;
			}
		}
		.hover{
			color: #E1212D;
			/*color: #FFB652;*/
		}
	}
</style>