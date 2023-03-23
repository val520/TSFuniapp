<template>
	<view class="index">
		<map class="map" :longitude='longitude' :latitude='latitude' scale="14" show-location="true" :markers=markers
			@markertap="makertap" @tap="clickMap"></map>

		<!-- 输入框 -->
		<view class="headerlist">
			<view class="input-conten">
				<view class='search acea-row row-between-wrapper'>
					<view class='input acea-row row-between-wrapper'>
						<text class='iconfont icon-sousuo2'></text>
						<input type='text' :value='searchValue' :focus="focus" placeholder='点击搜索商品'
							placeholder-class='placeholder' @input="setValue"></input>
					</view>
					<!-- <view class='bnt' @tap='setValue'>搜索</view> -->
				</view>
			</view>
		</view>
		<!-- 详情弹窗框 -->
		<u-popup :show="show" closeOnClickOverlay closeable="true" safeAreaInsetTop="true" round="10" @close="close">
			<view class="box" @click="projectDate(markerValue)">
				<!-- // 图片区域 -->
				<view style="margin-right: 10rpx;">
					<u--image :showLoading="true" radius="20rpx" :src="markerValue.coverAttIds[0].interRqUrl"
						width="160rpx" height="160rpx"></u--image>
				</view>
				<!-- // 文字区域 -->
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<view class="">
						<view class="center">
							<view class="cenbox">
								<view class="">
									<!-- 商品名称 -->
									<span style="color: #666;">名称：</span>{{markerValue.productName}}
								</view>
								<!-- 按钮 -->
								<!-- <view class="mintxt" @click.stop="buyroute(markerValue)">
									购买
								</view> -->

							</view>
						</view>
						<view class="center">
							<!-- 商品类型 -->
							<span style="color: #666;">类型：</span>{{markerValue.categoryTypeName}}
						</view>
						<view class="center">
							<!-- 商品描述 -->
							<span style="color: #666;">描述：</span>{{markerValue.remark}}
						</view>
						<view class="boxPrice">
							<view class="Price">
								<!-- 商品价格 -->
								<span style="color: #666;">价格：</span>￥{{markerValue.sellPrice}}
							</view>
							<!-- 按钮 -->
							<!-- <view class="mintxtline" @click.stop="route(markerValue)">
								路线
							</view> -->
						</view>
					</view>
					<view class="">
						按钮
					</view>
				</view>
			</view>
		</u-popup>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				amapFile: require('../../gdlibs/amap-wx.js'),
				config: require('../../gdlibs/config.js'),
				markers: [],
				// 搜索类容
				searchValue: "",
				// 默认 经纬度
				latitude: '29.563707',
				longitude: '106.550483',
				// 详情数据
				markerValue: "",
				show: false,
			}
		},
		mounted() {

		},
		onShow() {
			this.markerlist()
		},
		onLoad() {},
		onHide: function() {},
		methods: {
			// 购买
			buyroute(e) {
				let obj = {
					commodityId: e.mapid,
					buyNum: 1
				}
				this.$myRequest({
					url: "/tsf/tsfSystemOrder/add",
					method: "post",
					data: [obj]
				}).then(res => {
					if (res.data.code === 200) {
						this.show = false
						uni.$u.toast(res.data.message)
						uni.redirectTo({
							//关闭当前页面，跳转到应用内的某个页面。
							url: '/pages/columnGoods/ticketPurchase/index'
						});
					} else {
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 跳转项目详情
			projectDate(item) {
				uni.navigateTo({
					url: '/pages/columnGoods/lookdemand/index?item=' + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
				this.show = false
			},
			route(e) {
				let that = this
				//组装数据
				let val = [{
						iconPath: require('../../static/images/mapicon_navi_s.png'),
						id: 0,
						latitude: that.latitude,
						longitude: that.longitude,
						width: 23,
						height: 33
					},
					{
						iconPath: require('../../static/images/mapicon_navi_e.png'),
						id: 1,
						latitude: e.latitude,
						longitude: e.longitude,
						width: 24,
						height: 34,
						title: e.productName
					}
				]
				this.show = false
				uni.navigateTo({
					url: '/pages/columnGoods/postionMap/index?item=' + encodeURIComponent(JSON.stringify(val)
						.replace(/%/g, '%25'))

				})

			},
			// 关闭弹窗
			close() {
				this.show = false
			},
			// 获取点位
			markerlist() {
				let val = {
					pageNo: 1,
					pageSize: 100,
					status: 1, //0 待审核，1通过2，未通过
					productName: this.searchValue,
					wxHomeFlag: true
				}
				this.$myRequest({
					url: "/tsf/tsfBusCommodity/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						for (var i = 0; i < res.data.result.records.length; i++) {
							res.data.result.records[i].longitude = res.data.result.records[i].position.split(',')[
								0]
							res.data.result.records[i].latitude = res.data.result.records[i].position.split(',')[1]
							res.data.result.records[i].iconPath = "../../static/images/mapIcon_green.png"
							res.data.result.records[i].iconTapPath = "../../static/images/mapIcon_green.png"
							res.data.result.records[i].title = res.data.result.records[i].productName
							res.data.result.records[i].height = 50
							res.data.result.records[i].width = 40
							res.data.result.records[i].alpha = 1
							res.data.result.records[i].mapid = res.data.result.records[i].id
							res.data.result.records[i].id = Math.floor(Math.random() * (9999 - 1000)) + 1000
						}
						this.markers = res.data.result.records
					} else {
						this.markers = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 点击标记
			makertap: function(e) {
				console.log('点击图标点', e)
				var that = this;
				var id = e.markerId;
				for (var i = 0; i < that.markers.length; i++) {
					if (that.markers[i].id === id) {
						that.markerValue = that.markers[i]
						this.show = true
					}
				}
				console.log(that.markerValue)
				console.log('点击图标点', e)
			},
			// 点击地图
			clickMap() {
				console.log('点击了地图')
			},
			// 点击搜索
			setValue(e) {
				console.log('点击了搜索', e)
				this.searchValue = e.detail.value
				this.markerlist()
			}
		}
	}
</script>

<style scoped lang="scss">
	.index {
		height: 100vh;
		width: 100%;
		overflow: hidden;
	}

	.map {
		height: 105vh;
		width: 100%;
	}

	.headerlist {
		position: absolute;
		top: 0;
		width: 100%;
		padding: 10rpx;
	}

	.input-conten {
		width: 100%;
		padding: 10rpx;
		background: #FFF;
		border-radius: 10rpx;
	}

	.bnt {
		color: #DCA842;
	}

	.box {
		margin: 10rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.center {
		color: #999;
		width: 500rpx;
		margin-bottom: 10rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
	}

	.mintxt {
		color: #FFF;
		font-weight: bold;
		padding: 10rpx;
		background-image: linear-gradient(to right, #fa6514 0%, #e93323 100%);
		border-radius: 10rpx;
		border: 1rpx solid #DCA842;
	}

	.mintxtline {
		font-weight: bold;
		padding: 10rpx;
		background-color: #FFF;
		border-radius: 10rpx;
		color: #DCA842;
		border: 1rpx solid #DCA842;
	}

	.minbox {
		color: #999;
		font-weight: bold;
	}

	.minred {
		color: red;
		font-weight: bold;
	}

	.cenbox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.Price {
		color: #DCA842;
	}

	.boxPrice {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
