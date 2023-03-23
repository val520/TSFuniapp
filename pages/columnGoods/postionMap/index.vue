<template>
	<view>
		<view class="map_box">
			<map id="navi_map" :longitude="markers[0].longitude" :latitude="markers[0].latitude" scale="12"
				:markers="markers" :polyline="polylines"></map>
		</view>
		<view class="text_box">
			<view class="text">距离：{{distance}}</view>
			<view class="detail_button" @click="goDetail">返回</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 两点距离
				markers: [],
				distance: '',
				cost: '',
				polylines: []
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			var that = this;
			// 路线参数
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log('路线位置', item)
				that.markers = item
			}
			let amapFile = require('../../../gdlibs/amap-wx.js');
			let config = require('../../../gdlibs/config.js');
			var key = config.Config.key;
			var myAmapFun = new amapFile.AMapWX({
				key: key
			});
			myAmapFun.getDrivingRoute({
				origin: that.markers[0].longitude + "," + that.markers[0].latitude, //起点
				destination: that.markers[1].longitude + "," + that.markers[1].latitude, //终点
				success: function(data) {
					var points = [];
					if (data.paths && data.paths[0] && data.paths[0].steps) {
						var steps = data.paths[0].steps;
						for (var i = 0; i < steps.length; i++) {
							var poLen = steps[i].polyline.split(';');
							for (var j = 0; j < poLen.length; j++) {
								points.push({
									longitude: parseFloat(poLen[j].split(',')[0]),
									latitude: parseFloat(poLen[j].split(',')[1])
								})
							}
						}
					}
					that.polylines = [{
						points: points,
						color: "#0091ff",
						width: 6
					}]
					if (data.paths[0] && data.paths[0].distance) {
						that.distance = data.paths[0].distance + '米'
					}
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 返回
			goDetail() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.map_box {
		position: absolute;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
	}

	#navi_map {
		width: 100%;
		height: 100%;
	}

	.text_box {
		background-color: #fff;
		position: fixed;
		bottom: 0px;
		left: 0px;
		right: 0px;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.detail_button {

		padding: 3px 5px;
		color: #fff;
		background: #b99b64;
		width: 50px;
		text-align: center;
		border-radius: 5px;
	}
</style>
