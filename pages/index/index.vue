<template>
	<view>
		<!-- 头部自定义 -->
		<view class="page-index">
			<view class="mp-header">
				<view class="sys-head" :style="{ height: statusBarHeight }"></view>
				<view class="serch-box" style="height: 40px;">
					<view class="serch-wrapper flex">
						<navigator url="/pages/goods_search/index" class="input" hover-class="none"><text
								class="iconfont icon-xiazai5"></text>
							搜索商品</navigator>
					</view>
				</view>
			</view>
			<!-- 轮播图展示 -->
			<view class="page_content" :style="'margin-top:'+(marTop)+'px;'">
				<view class="mp-bg"></view>
				<!-- banner -->
				<view class="swiper" v-if="imgUrls.length">
					<swiper indicator-dots="true" :autoplay="true" :circular="circular" :interval="interval"
						:duration="duration" indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
						<block v-for="(item,index) in imgUrls" :key="index">
							<swiper-item>
								<navigator class='slide-navigator acea-row row-between-wrapper' hover-class='none'>
									<image :src="item.pic" class="slide-image" lazy-load></image>
								</navigator>
							</swiper-item>
						</block>
					</swiper>
				</view>
				<!-- 类型切换查询 -->
				<u-sticky bgColor="#fff">
					<u-tabs @change="taglist" lineColor="#DCA842"
						:activeStyle="{ color: '#DCA842',fontWeight: 'bold',transform: 'scale(1.05)'}"
						:scrollable="false" :list="list1"></u-tabs>
				</u-sticky>
				<!-- 大厅商品 -->
				<view class="index-product-wrapper">
					<u-empty mode="data" v-if="tempArr.length === 0" icon="http://cdn.uviewui.com/uview/empty/data.png">
					</u-empty>
					<view class="list-box animated" v-else :class='tempArr.length > 0?"fadeIn on":""'>
						<view class="item" v-for="(item,index) in tempArr" :key="index" @click="goDetail(item)">
							<view class="pictrue">
								<span class="pictrue_log pictrue_log_class">NEW</span>
								<image :src="item.coverAttIds[0].interRqUrl" mode=""></image>
							</view>
							<view class="text-info">
								<view class="title line1">{{item.productName}}</view>
								<view class="old-price line1"><text>描述：{{item.remark}}</text></view>
								<view class="price line1">
									<text>￥</text>{{item.sellPrice}}
								</view>
							</view>
						</view>
					</view>
					<view class="mores-txt flex" v-if="tempArr.length !=0">
						<text>没有更多了</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 价格弹窗 -->
		<u-picker :show="priceshow" closeOnClickOverlay='true' keyName="label" :columns="pricecolumns"
			@confirm="pricefirm" @cancel="priceclose" @close="priceclose" />
		<!-- 时间弹窗 -->
		<u-picker :show="timeshow" closeOnClickOverlay='true' keyName="label" :columns="timecolumns" @confirm="timefirm"
			@cancel="timeclose" @close="timeclose" />
		<!-- //类型弹窗 -->
		<u-picker :show="typeshow" closeOnClickOverlay='true' keyName="name" :columns="typecolumns" @confirm="typefirm"
			@cancel="typeclose" @close="typeclose" />
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	let app = getApp();
	export default {
		data() {
			return {
				//价格显示隐藏弹窗
				priceshow: false,
				//时间排序弹窗
				timeshow: false,
				//类型弹窗
				typeshow: false,
				priceValue: '',
				timeValue: '',
				typeValue: '',
				//价格数据
				pricecolumns: [
					[{
						label: '价格升序',
						id: 0
					}, {
						label: '价格降序',
						id: 1
					}]
				],
				// 时间数据
				timecolumns: [
					[{
						label: '时间升序',
						id: 0
					}, {
						label: '时间降序',
						id: 1
					}]
				],
				// 类型数据
				typecolumns: [
					[]
				],
				list1: [{
					name: '推荐',
				}, {
					name: '价格'
				}, {
					name: '时间'
				}, {
					name: '类型'
				}, ],
				statusBarHeight: statusBarHeight, //头部高度
				imgUrls: [{
					pic: "https://tsf.ccle.cn/earhtWorkAttachments/0/202303206d225c48135a4f8ea65a5a350c3c982ebanner.png"
				}, {
					pic: "https://tsf.ccle.cn/earhtWorkAttachments/0/202303206d225c48135a4f8ea65a5a350c3c982ebanner.png"
				}, ], //轮播图数据
				circular: true, //是否采用衔接滑动
				autoplay: true, //是否自动切换轮播图
				interval: 3000, //自动切换时间间隔
				duration: 500, //滑动动画时长
				marTop: 0, //轮播图向下距离
				tempArr: [], //大厅商品数据
			}
		},
		onLoad() {
			let self = this
			// #ifdef MP
			// 获取小程序头部高度
			let info = uni.createSelectorQuery().select(".mp-header");
			info.boundingClientRect(function(data) {
				self.marTop = data.height
			}).exec()
			// #endif
		},
		onShow() {
			this.hall()
		},
		methods: {
			onShareAppMessage(res) {
				if (res.from === 'button') { // 来自页面内分享按钮
					console.log(res.target)
				}
				return {
					title: '重庆土石方',
					path: '/pages/index/index'
				}
			},
			//获取类型数据
			typeList() {
				let that = this
				let val = {
					pageNo: 1,
					pageSize: 99999
				}
				that.$myRequest({
					url: "/tsf/tsfBusCategory/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						let val = []
						res.data.result.records.forEach((obj) => {
							if (obj.children.length > 0) {
								val = [...val, ...obj.children]
							}
						})
						let obj =[]
						val.forEach((item) => {
							if(item.status === 1){
								obj.push(item)
							}
						})
						that.typecolumns[0] = obj

					} else {
						uni.$u.toast(res.data.message)
					}
				})
			},
			//点击标签
			taglist(e) {
				if (e.name === '推荐') {
					this.typeValue = ''
					this.timeValue = ''
					this.priceValue = ''
					this.hall()
				} else if (e.name === '价格') {
					this.typeValue = ''
					this.timeValue = ''
					this.priceshow = true
				} else if (e.name === '时间') {
					this.typeValue = ''
					this.priceValue = ''
					this.timeshow = true
				} else if (e.name === '类型') {
					this.typeshow = true
				}
			},
			//关闭价格弹窗
			priceclose() {
				this.priceshow = false
			},
			//点击价格确认
			pricefirm(e) {
				console.log(e.value[0].id);
				this.priceValue = e.value[0].id
				this.hall()
				this.priceshow = false
			},
			//关闭时间弹窗
			timeclose() {
				this.timeshow = false
			},
			//点击时间确认
			timefirm(e) {
				console.log(e.value[0].id);
				this.timeValue = e.value[0].id
				this.hall()
				this.timeshow = false
			},
			//关闭类型弹窗
			typeclose() {
				this.typeshow = false
			},
			//点击类型确认
			typefirm(e) {
				console.log(e.value[0].id);
				this.typeValue = e.value[0].id
				this.hall()
				this.typeshow = false
			},
			//获取大厅商品
			hall() {
				let val = {
					pageNo: 1,
					pageSize: 100,
					status: 1, //0 待审核，1通过2，未通过
					wxHomeFlag: true,
					priceOrderFlag: this.priceValue, //价格排序 0升1降
					timeOrderFlag: this.timeValue, //时间排序 0升1降
					categoryTypeId: this.typeValue //类型id
				}
				this.$myRequest({
					url: "/tsf/tsfBusCommodity/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.tempArr = res.data.result.records
						this.typeList()
					} else {
						this.tempArr = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 点击跳转商品详情
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${item.id}`
				})
			},
		}
	}
</script>
<style>
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss">
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);

		.mp-header {
			z-index: 999;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			/* #ifdef H5 */
			padding-bottom: 20rpx;
			/* #endif */
			background-color: $theme-color;

			.serch-wrapper {
				height: 100%;
				align-items: center;
				padding: 0 50rpx 0 53rpx;
				margin-top: 10rpx;

				image {
					width: 118rpx;
					height: 42rpx;
					margin-right: 30rpx;
				}

				.input {
					display: flex;
					align-items: center;
					/* #ifdef MP */
					width: 70%;
					/* #endif */
					height: 50rpx;
					padding: 0 0 0 30rpx;
					background: rgba(247, 247, 247, 1);
					border: 1px solid rgba(241, 241, 241, 1);
					border-radius: 29rpx;
					color: #BBBBBB;
					font-size: 28rpx;

					.iconfont {
						margin-right: 20rpx;
					}
				}
			}
		}

		.page_content {
			background-color: #f5f5f5;
			/* #ifdef H5 */
			// margin-top: 20rpx !important;
			/* #endif */
			padding: 0 30rpx;

			.swiper {
				position: relative;
				width: 100%;
				height: 280rpx;
				margin: 0 auto;
				border-radius: 10rpx;
				overflow: hidden;
				margin-bottom: 25rpx;
				/* #ifdef MP */
				z-index: 10;
				margin-top: 20rpx;

				/* #endif */
				swiper,
				.swiper-item,
				image {
					width: 100%;
					height: 280rpx;
					border-radius: 10rpx;
				}
			}

			.nav {
				padding-bottom: 26rpx;
				background: #fff;
				opacity: 1;
				border-radius: 14rpx;
				width: 100%;
				margin-bottom: 30rpx;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 20%;
					margin-top: 30rpx;

					image {
						width: 82rpx;
						height: 82rpx;
					}
				}
			}

			.index-product-wrapper {
				// margin-bottom: 110rpx;

				&.on {
					min-height: 1500rpx;
				}

				.list-box {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.item {
						width: 335rpx;
						margin-bottom: 20rpx;
						margin-top: 20rpx;
						background-color: #fff;
						box-shadow: 0 0 12rpx #d7d7d7;
						border-radius: 10rpx;
						overflow: hidden;

						image {
							width: 100%;
							height: 330rpx;
						}

						.text-info {
							padding: 10rpx 20rpx 15rpx;

							.title {
								color: #222222;
							}

							.old-price {
								margin-top: 8rpx;
								font-size: 26rpx;
								color: #AAAAAA;
								// text-decoration: line-through;

								text {
									margin-right: 2px;
									font-size: 20rpx;
								}
							}

							.price {
								display: flex;
								align-items: flex-end;
								color: $theme-color;
								font-size: 34rpx;
								font-weight: 800;

								text {
									padding-bottom: 4rpx;
									font-size: 24rpx;
									font-weight: 800;
								}

								.txt {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 28rpx;
									height: 28rpx;
									margin-left: 15rpx;
									margin-bottom: 10rpx;
									border: 1px solid $theme-color;
									border-radius: 4rpx;
									font-size: 22rpx;
									font-weight: normal;
								}
							}
						}
					}

					&.on {
						display: flex;
					}
				}
			}
		}
	}


	.pictrue {
		position: relative;
	}

	.mores-txt {
		width: 100%;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		color: #999;
		font-size: 24rpx;

		.iconfont {
			margin-top: 2rpx;
			font-size: 20rpx;
		}
	}

	.mp-bg {
		position: absolute;
		left: 0;
		/* #ifdef H5 */
		top: 98rpx;
		/* #endif */
		width: 100%;
		height: 304rpx;
		background: linear-gradient(180deg, #DAA43F 0%, #F5F5F5 100%, #F0DCB1 100%);
		// border-radius: 0 0 30rpx 30rpx;
	}
</style>