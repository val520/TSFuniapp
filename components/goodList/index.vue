<template>
	<view class='goodList'>
		<block v-for="(item,index) in bastList" :key="index">
			<view @click="goDetail(item)" class='item acea-row row-between-wrapper' hover-class="none">
				<view class='pictrue'>
					<image :src='item.coverAttIds[0].interRqUrl' mode="aspectFill"></image>
					<span class="pictrue_log pictrue_log_class" v-if="item.activityH5 && item.activityH5.type === '1'">秒杀</span>
					<span class="pictrue_log pictrue_log_class" v-if="item.activityH5 && item.activityH5.type === '2'">砍价</span>
					<span class="pictrue_log pictrue_log_class" v-if="item.activityH5 && item.activityH5.type === '3'">拼团</span>
				</view>
				<view class='underline'>
					<view class='text'>
						<view class='line1'>{{item.productName}}</view>
						<view class='money font-color'>￥<text class='num'>{{item.sellPrice}}</text></view>
						<view class='vip-money acea-row row-middle'><text class='num'>库存：{{item.forSellAmount}}</text></view>
					</view>
				</view>
				<view class='iconfont icon-gouwuche cart-color acea-row row-center-wrapper'></view>
			</view>
		</block>
	</view>
</template>

<script>
	import {mapGetters} from "vuex";
	import { goShopDetail } from '@/libs/order.js'
	export default {
		computed: mapGetters(['uid']),
		props: {
			status: {
				type: Number,
				default: 0,
			},
			bastList: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		data() {
			return {

			};
		},
		methods: {
			goDetail(item){
				goShopDetail(item,this.uid).then(res=>{
					uni.navigateTo({
						url:`/pages/goods_details/index?id=${item.id}`
					})
				})
			}
			
		}
	}
</script>

<style scoped lang='scss'>
	.goodList .item {
		position: relative;
		padding-left: 30rpx;
	}

	.goodList .item .pictrue {
		width: 180rpx;
		height: 180rpx;
		position: relative;
	}

	.goodList .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.goodList .item .pictrue .numPic {
		position: absolute;
		left: 7rpx;
		top: 7rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}

	.goodList .item .underline {
		padding: 30rpx 30rpx 30rpx 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.goodList .item:nth-last-child(1) .underline {
		border-bottom: 0;
	}

	.goodList .item .text {
		font-size: 30rpx;
		color: #222;
		width: 489rpx;
	}

	.goodList .item .text .money {
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 50rpx;
	}

	.goodList .item .text .money .num {
		font-size: 34rpx;
	}

	.goodList .item .text .vip-money {
		font-size: 24rpx;
		color: #282828;
		font-weight: bold;
		margin-top: 15rpx;
	}

	.goodList .item .text .vip-money image {
		width: 46rpx;
		height: 21rpx;
		margin: 0 22rpx 0 5rpx;
	}

	.goodList .item .text .vip-money .num {
		font-size: 22rpx;
		color: #aaa;
		font-weight: normal;
		margin: -2rpx 0 0 0;
	}

	.goodList .item .iconfont {
		position: absolute;
		right: 30rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		font-size: 30rpx;
		bottom: 38rpx;
	}
</style>
