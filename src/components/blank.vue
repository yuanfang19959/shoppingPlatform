 <template>
    <div class="breadcrumb" v-if="!isWeiXi">
        <!-- 解决非微信端头部问题 -->
    </div>
</template>

<script>
import isWeiXin from '@/assets/js/commin';
export default {
    data() {
        return {
            isWeiXi: false,
        }
    },
    created() {
		this.isWeiXi = isWeiXin();
	},
    computed: {
    },
    methods: {
    }
}
</script>
<style lang='scss' scoped>
.breadcrumb {
    width: 100%;
    height: 90px;
}
</style>