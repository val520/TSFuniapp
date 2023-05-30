<template>
	<view class="map_container">
		<map class="map" :longitude='longitude' :latitude='latitude' scale="14" show-location="true" @tap="clickMap">
		</map>
		<!-- 搜索框区域 -->
		<view class="search">
			<view class="cent">
				<u-input placeholder="请输入位置名称" clearable suffixIcon="map-fill" border="surround" v-model="value"
					@change="change">
				</u-input>
			</view>
		</view>
		<!-- 搜索框结果展示 -->
		<view class="seacherbox" v-show="scrdeShow">
			<view class="box">
				<view class="postionInfo" v-for="(item,index) in serachList" :key="index" @click="positionInfoOk(item)">
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 点击地图搜索结果区域 -->
		<u-popup class="botindex" :show="show" @close="close" @open="open" :round="10">
			<view class="bot">
				<view class="title">
					<span>周边地址：</span>
					<u-icon @click="close" name="close-circle-fill" size="28" color="#DFB76D"></u-icon>
				</view>
				<view class="botcent">
					<view class="postionInfo" v-for="(item,index) in positionList" :key="index"
						@click="positionInfoOk(item)">
						{{item.address}}
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
				amapFile: require('../../../gdlibs/amap-wx.js'),
				config: require('../../../gdlibs/config.js'),
				positionList: [],
				serachList: [],
				latitude: '29.563332',
				longitude: '106.548503',
				value: '',
				scrdeShow: false,
				show: false
			}
		},
		onShow() {
			this.storage_key = uni.getStorageSync("storage_key")
			console.log(this.storage_key, '当前缓存的值');
		},
		onLoad() {
			let that = this
			uni.getLocation({
				type: 'wgs84',
				geocode: true, //设置该参数为true可直接获取经纬度及城市信息
				success: function(res) {
					console.log('获取定位信息', res);
					that.latitude = res.latitude;
					that.longitude = res.longitude;
				},
				fail: function(err) {
					console.log("获取定位失败", err);
					uni.showToast({
						title: '获取地址失败，将导致部分功能不可用',
						icon: 'none'
					});
				}
			});
		},
		onHide: function() {
			console.log('App Hide')
			this.cancelPosition()
		},
		methods: {
			// 搜索位置
			change() {
				console.log(this.value.length);
				if (this.value.length > 0) {
					let that = this;
					let keywords = this.value;
					let amapFile = require('../../../gdlibs/amap-wx.js');
					let config = require('../../../gdlibs/config.js');
					let key = config.Config.key;
					let myAmapFun = new amapFile.AMapWX({
						key: key
					});
					myAmapFun.getInputtips({
						keywords: keywords,
						location: that.longitude + ',' + that.latitude,
						// city: city,
						success: function(data) {
							if (data && data.tips) {
								console.log(data.tips);
								data.tips.forEach(function(item, index) {
									item.latitude = item.location.split(',')[1],
										item.longitude = item.location.split(',')[0],
										item.address = item.name
								})
								that.serachList = data.tips
								console.log(that.serachList);
								that.scrdeShow = true
							}
						}
					})

				} else {
					this.scrdeShow = false
				}

			},
			//取消定位
			cancelPosition() {
				this.positionInfo = ""
				this.isPosition = false
			},
			// 点击位置跳转对应的页面
			positionInfoOk(item) {
				console.log(item, this.storage_key);
				this.isPosition = false
				// item = item.address
				switch (this.storage_key) {
					case '1':
						let pag = getCurrentPages(); //获取所有页面栈实例列表
						let nowPage = pag[pag.length - 1]; //当前页页面实例
						let prevPage = pag[pag.length - 2]; //上一页页面实例
						prevPage.$vm.model1.userInfo.positionSpace = item.longitude + "," + item.latitude; //修改上一页data里面的 参数值
						prevPage.$vm.model1.userInfo.remark = item.address; //修改上一页data里面的 参数值
						uni.navigateBack({
							delta: 1
						});
						break;
					case '2':
						let buy = getCurrentPages(); //获取所有页面栈实例列表
						let nowPagebuy = buy[buy.length - 1]; //当前页页面实例
						let prevPagebuy = buy[buy.length - 2]; //上一页页面实例
						prevPagebuy.$vm.model1.userInfo.positionSpace = item.longitude + "," + item.latitude; //修改上一页data里面的 参数值
						prevPagebuy.$vm.model1.userInfo.remark = item.address; //修改上一页data里面的 参数值
						uni.navigateBack({
							delta: 1
						});
						break;
					case '3':
						let up = getCurrentPages(); //获取所有页面栈实例列表
						let nowPageup = up[up.length - 1]; //当前页页面实例
						let prevPageup = up[up.length - 2]; //上一页页面实例
						prevPageup.$vm.projectInfo.positionSpace = item.longitude + "," + item.latitude; //修改上一页data里面的 参数值
						prevPageup.$vm.projectInfo.address = item.address; //修改上一页data里面的 参数值
						uni.navigateBack({
							delta: 1
						});
						break;
				}
			},
			//点击地图查询周边
			clickMap(e) {
				uni.showLoading({
					title: '查询中',
				});
				console.log('e', e)
				this.scrdeShow = false
				this.value = ''
				let that = this
				let latitude = e.detail.latitude
				let longitude = e.detail.longitude
				let amapFile = require('../../../gdlibs/amap-wx.js');
				let config = require('../../../gdlibs/config.js');
				let key = config.Config.key;
				console.log('输出key', key);
				var myAmapFun = new amapFile.AMapWX({
					key: key
				});
				var params = {
					iconPathSelected: '../../static/mapIcon_green.png',
					iconPath: '../../static/mapIcon_green.png',
					location: longitude + ',' + latitude,
					success: function(data) {
						// 隐藏loading
						uni.hideLoading();
						console.log('周边地址', data);
						that.isPosition = true
						that.positionList = data.markers;
						var poisData = data.poisData;
						that.open()
					}
				}
				myAmapFun.getPoiAround(params)

			},
			open() {
				this.show = true
			},
			close() {
				this.show = false
				// console.log('close');
			},
		}
	}
</script>

<style scoped lang="scss">
	.map_container {
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.map {
		height: 105%;
		width: 100%;
	}

	.search {
		width: 100%;
		position: fixed;
		top: 0rpx;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.cent {
		width: 100%;
		background: #FFF;
		border-radius: 10rpx;
	}

	.botindex {
		position: fixed;
		bottom: 0rpx;
	}

	.bot {
		width: 100%;
		background: #FFF;
		padding: 20rpx;
		box-sizing: border-box;
		border-radius: 10rpx 10rpx 0 0;
	}

	.botcent {
		height: 800rpx;
		overflow: hidden;
		overflow-y: auto;
	}

	.postionInfo {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 80rpx;
		margin: auto;
		// width: 95%;
		line-height: 80rpx;
		font-size: 30rpx;
		color: #666;
		font-weight: bold;
		border-bottom: 1rpx dashed #80808082;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #DFB76D;
		font-weight: bold;
	}

	.seacherbox {
		width: 100%;
		position: fixed;
		top: 100rpx;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
	}

	.box {
		background: #FFF;
		height: 600rpx;
		overflow: hidden;
		overflow-y: auto;
		border-radius: 10rpx;
		padding: 20rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
	}
</style>
