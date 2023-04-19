<template>
	<view class="content">
		<!-- 内部容器 -->
		<view class="center">
			<!-- 二维码区域 -->
			<view class="codesm">
				<ayQrcode v-if="codeList.ticketStatus == '生效中'" ref="qrcode" :modal="modal_qr" qrcode_id="ewms"
					:height="200" :width="200" :url="urls" @hideQrcode="hideQrcode" :is_themeImg="false" />
				<u-empty v-else mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
				</u-empty>
				<!-- <image style="width: 100%; height:100%;" mode="aspectFit" src="../../static/code.png"></image> -->
			</view>
			<!-- 腰线 -->
			<view class="riglt">
				<view class="leftroe"></view>
				<view class="botderCenter"></view>
				<view class="rightroe"></view>
			</view>
			<!-- 核销按钮 -->
			<view class="cenbtn">
				<view class="ctag">
					<u-tag v-if="codeList.ticketStatus == '生效中'" :text='codeList.ticketStatus' type="success" plain>
					</u-tag>
					<u-tag v-else-if="codeList.ticketStatus == '已核销'" :text='codeList.ticketStatus' type="warning"
						plain>
					</u-tag>
					<u-tag v-else-if="codeList.ticketStatus == '不通过'" :text='codeList.ticketStatus' type="error" plain>
					</u-tag>
					<u-tag v-else :text='codeList.ticketStatus' type="error" plain>
					</u-tag>
				</view>
				<view class="tfsBox" v-if="codeList.ticketStatus == '生效中' && isAdmin" @click="Write">
					<view class="tsf_name">核销</view>
				</view>
				<!-- <view class="tfsBox" v-else>
					<view class="tsf_name">待核销</view>
				</view> -->
			</view>
			<view style="margin: 20rpx 10rpx;">
				<u-line></u-line>
			</view>
			<view class="box">
				<view class="status_box">
					<span class="infoName">运输人员:</span>
					<span>{{codeList.driver}}</span>
				</view>
				<view class="status_box">
					<span class="infoName">电话:</span>
					<span>{{codeList.telephone}}</span>
				</view>
				<!-- <view class="status_box">
					<span class="infoName">起点:</span>
					<span>{{codeList.origin}}</span>
				</view>
				<view class="status_box">
					<span class="infoName">终点:</span>
					<span>{{codeList.terminus}}</span>
				</view> -->
				<!-- <view class="status_box">
					<span class="infoName">土石类型:</span>
					<span>{{codeList.projectType}}</span>
				</view> -->
				<view class="status_box">
					<span class="infoName">土石方量:</span>
					<span>{{codeList.applyEarth}}m³</span>
				</view>
				<!-- <view class="status_box">
					<span class="infoName">车辆载重:</span>
					<span>{{codeList.carLoad||''}}吨</span>
				</view> -->
				<!-- <view class="status_box">
					<span class="infoName">剩余张数:</span>
					<span>{{codeList.carLoad}}</span>
				</view> -->
				<view class="status_box">
					<span class="infoName">申请时间:</span>
					<span>{{codeList.createTime}}</span>
				</view>
				<view class="status_box">
					<span class="infoName">失效时间:</span>
					<span>{{codeList.expireTime}}</span>
				</view>
			</view>

		</view>
		<!-- // 弹窗 -->
		<u-modal :show="showFalse" @cancel="showFalse=false" title="确认核销该数据" :showCancelButton='true' @confirm="confirm"
			confirmColor="#DFB76D" ref="uModal"></u-modal>
	</view>
</template>

<script>
	import ayQrcode from "../../../components/ay-qrcode/ay-qrcode.vue"
	export default {
		components: {
			ayQrcode
		},
		data() {
			return {
				//二维码相关参数
				modal_qr: true,
				urls: '1', // 要生成的二维码值
				showFalse: false,
				codeList: {},
				// 是否展示管理员审核界面
				isAdmin: false,
				//暂存ID
				storageID: null
			}

		},
		onShow() {
			let that = this;
			that.deit(that.storageID)
			setTimeout(function() {
				that.showQrcode(); //一加载生成二维码
			}, 1000);
			uni.getStorageSync("userInfo").userRoleList.forEach((e) => {
				if (e.roleCode === 'admin' || e.roleCode === 'orgAdmin') {
					that.isAdmin = true
				} else {
					that.isAdmin = false
				}
			})
		},
		onLoad(option) {
			console.log(option);
			if (option.q) {
				console.log(decodeURIComponent(option.q), '我是普通二维码参数');
				let val = decodeURIComponent(option.q)
				// 去点字符串的引号
				val=val.replace(/\"/g, "");
				//截取参数
				let index = val.split('=')
				let item = index[1]
				this.storageID = item
				// 调用查询运输票的详情
				this.deit(item)
				console.log('普通二维码运行中');
			} else {
				const item = option.id
				this.storageID = item
				// 调用查询运输票的详情
				this.deit(item)
				console.log('小程序二维码运行中');
			}

			uni.getStorageSync("userInfo").userRoleList.forEach((e) => {
				if (e.roleCode === 'admin' || e.roleCode === 'orgAdmin') {
					this.isAdmin = true
				} else {
					this.isAdmin = false
				}
			})
			// let val = {
			// 	name: '2',
			// 	id: item.id
			// }
			// this.urls = JSON.stringify(val)

		},
		methods: {
			//获取当前票的详情
			deit(e) {
				let val = {
					id: e
				}
				this.$myRequest({
					// url: "/tsf/tsfTransportTicket/wxList",
					url: "/tsf/tsfTransportTicket/getDetailById",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.codeList = res.data.result.records[0]
						// this.urls = `https://tsf.ccle.cn?id=${res.data.result.records[0].id}`
						this.urls = `https://tsf.ccle.cn?id=${res.data.result.records[0].id}`
						// console.log('this.codeList', this.codeList, this.urls)
					} else {
						this.codeList = {}
					}
				})
			},
			// 展示二维码
			showQrcode() {
				let _this = this;
				this.modal_qr = true;
				// uni.showLoading()
				setTimeout(function() {
					// uni.hideLoading()
					_this.$refs.qrcode.crtQrCode()
				}, 50)
			},

			//传入组件的方法
			hideQrcode() {
				this.modal_qr = false;
			},
			// 核销
			Write() {
				this.showFalse = true
			},
			confirm() {
				let val = {
					"transportId": this.codeList.id
				}
				this.$myRequest({
					url: "/src/tsfTransportDrop/verificationTransportTicket",
					method: "post",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							title: "核销成功",
							icon: 'success'
						})
						setTimeout(() => {
							// 返回上一页 delta返回的页面数 如果delta大于现有页面数，则返回首页
							uni.navigateBack({
								delta: 1
							});
						}, 1000);
						this.showFalse = false
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		padding: 20rpx;
	}

	.center {
		// height: 400rpx;
		text-align: center;
		padding-top: 40rpx;
		background: #FFF;
		// overflow: hidden;
		border-radius: 10rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
	}

	.codesm {
		margin-top: 30rpx;
		width: 450rpx;
		height: 450rpx;
		margin: 0rpx auto;
		// overflow: hidden;
	}

	.riglt {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30rpx 0rpx;
	}

	.leftroe {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-left: -20rpx;
		background: #F5F5F5;
	}

	.rightroe {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: -20rpx;
		background: #F5F5F5;
	}

	.botderCenter {
		width: 100%;
		border-bottom: 2rpx dotted #999;
	}

	.cenbtn {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tfsBox {
		margin-right: 40rpx;

		.tsf_img {
			width: 45.8rpx;
			height: 38.28rpx;
			background-size: 100% !important;
			margin: auto;
			// background: url('@/static/tushifang.png') no-repeat center;
		}

		.tsf_name {
			padding: 10rpx;
			background-color: #FFF;
			border-radius: 10rpx;
			border: 1rpx solid #DCA842;
			color: #DCA842;
		}
	}

	.ctag {
		margin-left: 40rpx;
	}

	.status_box {
		display: flex;
		height: 70rpx;

		.infoName {
			display: block;
			margin-right: 20rpx;
			font-weight: Bold;
		}

		span {
			display: block;
			line-height: 70rpx;
			color: rgba(177, 140, 74, 1);
			font-size: 32rpx;
		}
	}

	.box {
		margin: 10rpx 40rpx;
	}
</style>