<template>
	<view>
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入内容" prefixIcon="search" v-model="value" @change="change" @clear="closevalue"
					border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 占位符 -->
		<view style="margin-top:80rpx;"></view>
		<view class="index">
			<view class="listCalss">
				<view v-if="proList.length===0">
					<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
					</u-empty>
				</view>
				<view class="content" v-else v-for="(item,index) in proList" :key="index" @click="clickProject(item)">
					<view class="content_left">
						<view class="status_box" v-if="item.ticketStatus==='生效中'" style="background:#18b566;">
							{{item.ticketStatus}}
						</view>
						<view class="status_box" v-else-if="item.ticketStatus==='待审核'" style="background:#b5b5b5;">
							{{item.ticketStatus}}
						</view>
						<view class="status_box" v-else-if="item.ticketStatus==='审核不通过'" style="background:red;">
							不通过
						</view>
						<view class="status_box" v-else-if="item.ticketStatus==='退票中'" style="background:#DFB76D;">
							{{item.ticketStatus}}
						</view>
						<view class="status_box" v-else-if="item.ticketStatus==='过期'" style="background:#999;">
							{{item.ticketStatus}}
						</view>
						<view class="status_box" v-else-if="item.ticketStatus==='已撤回'" style="background:#fab6b6;">
							{{item.ticketStatus}}
						</view>
						<view class="status_box" v-else style="background:green;">
							生效中
						</view>
					</view>
					<view class="content_center">
						<view class="pro_name">{{item.name}}</view>
						<view class="pro_num">总量:<span>{{item.totalEarth}}</span></view>
						<view class="pro_num">余量:<span>{{item.residueAmount}}</span></view>
						<view class="pro_msg">{{item.address}}</view>
					</view>
					<!-- <view class="">
						<u-collapse>
							<u-collapse-item title="更多" name="Docs guide">
								<text class="u-collapse-content">涵盖uniapp各个方面，给开发者方向指导和设计理念，让您茅塞顿开，一马平川</text>
							</u-collapse-item>
						</u-collapse>
					</view> -->
					<view class="bottomClass" v-if="item.ticketStatus==='生效中'">
						<view style="color: #918c80;">
							<span>{{item.createTime}}</span>
						</view>
						<!-- 	<view class="btnpop" @click.stop="clickCode(item)">
							<span>运输码</span>
						</view> -->
						<view class="btnpop" v-if="item.residueAmount>0" @click.stop="clickFp(item)">
							<span>分票码</span>
						</view>
					</view>
				</view>
				<!-- 占位 -->
				<view style="height: 100rpx"></view>
			</view>

			<!-- 弹窗 -->
			<u-modal :show="showFalse" @cancel="showFalse=false" title="确认退票" :showCancelButton='true'
				@confirm="confirm" confirmColor="#DFB76D" ref="uModal"></u-modal>
		</view>
		<!-- 返回TOP -->
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" :customStyle="custom" :iconStyle="iconStyle"></u-back-top>
		<u-popup :show="showpup" closeOnClickOverlay="true" :round="10" mode="center" overlay="true"
			@close="showpup =false" @open="open">
			<view class="boxindex" @click="addflase">
				<view style="text-align: center;margin-bottom: 10rpx;">分票码</view>
				<image style="width: 210px; height: 200px;" mode="aspectFill" :src="imageurl"></image>
			</view>
		</u-popup>
	</view>
</template>
<script>
	// import ayQrcode from "@/components/ay-qrcode/ay-qrcode.vue"
	export default {
		components: {
			// taberlist,
			// ayQrcode
		},
		data() {
			return {
				modal_qr: true,
				urls: '1', // 要生成的二维码值
				num: '土石方票',
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				custom: {
					background: '#DFB76D'
				},
				// 输入框参数
				value: "",
				//弹窗参数
				showFalse: false,
				showpup: false,
				// 标签参数
				list1: [{
					name: '全部',
				}, {
					name: '生效中',
				}, {
					name: '待审核'
				}, {
					name: '已过期'
				}, {
					name: '已退票'
				}],
				// 列表数据
				proList: [],
				// 存取点击后的数据
				newVlaue: '',
				// 分页
				size: 1,
				// 状态查询
				state: "",
				//分票码
				imageurl: ""
			}
		},
		onLoad(option) {
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log('票集合', item)
				this.newData = item
				this.serch()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		// 触底事件
		async onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				projectId:this.newData.projectId,
				productId:this.newData.productId,
				pageSize: 10,
				keyword:this.value
			}
			this.$myRequest({
				url: "/tsf/tsfEarthTicket/wxList",
				method: "get",
				data: val
			}).then(res => {
				if (res.data.code === 200) {
					if (this.proList.length === res.data.result.total) {
						uni.showToast({
							title: `没有更多了`,
							icon: "none"
						})
					} else {
						this.proList = [...this.proList, ...res.data.result.records]
					}
				} else {
					uni.$u.toast(res.data.message)
				}
			})
		},
		//页面显示隐藏触发
		onShow() {
			this.size = 1
			this.serch()
		},
		methods: {
			//打开二维码弹窗
			open() {
				// this.showQrcode()
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
			//查询方法
			change() {
				console.log('搜索参数', this.value);
			},
			//查询
			serch() {
				let val = {
					pageNo: this.size,
					pageSize: 10,
					projectId:this.newData.projectId,
					productId:this.newData.productId,
					keyword: this.value
				}
				this.$myRequest({
					url: '/tsf/tsfEarthTicket/wxList',
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.proList = res.data.result.records
					} else {
						this.proList = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			//标签点击方法
			taglist(e) {
				console.log('点击标签', e);
				this.size = 1
				if (e.name === '全部') {
					this.state = ''
				} else if (e.name === '已过期') {
					this.state = '已过期'
				} else {
					this.state = e.name
				}
				this.serch()
			},
			//搜索
			change() {
				this.size = 1
				this.serch()
			},
			//清空搜索
			closevalue() {
				console.log(111)
				this.size = 1
				this.value = ''
				this.serch()
			},
			//查看详情
			clickProject(item) {
				uni.navigateTo({
					url: "/pagesone/tickInfo/tickInfo?item=" + encodeURIComponent(JSON.stringify(item).replace(
						/%/g, '%25'))
				})
			},
			//查看运输码
			clickCode(item) {
				uni.navigateTo({
					url: '/pages/columnGoods/Transportcode/index'
				})
			},
			//分票申请
			clickFp(item) {
				//打开分票弹窗
				let val = {
					name: '1',
					id: item.id
				}
				this.urls = JSON.stringify(val)
				// this.showpup = true
				this.$myRequest({
					url: "/tsf/tsfEarthTicket/getTicketWxCode",
					method: "get",
					data: {
						ticketId: item.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res);
						this.imageurl = res.data.message
						this.showpup = true
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
				// uni.navigateTo({
				// 	url: `/pages/columnGoods/application/application?fp=1&item=${item.id}`
				// })
			},
			//退票
			noticket(item) {
				this.newVlaue = item
				this.showFalse = true
			},
			//放大
			addflase() {
				uni.previewImage({
					urls: [this.imageurl],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			// 点击确认退票
			confirm() {
				let val = {
					ticketId: this.newVlaue.id
				}
				this.$myRequest({
					url: `/earth/earthTicket/refundTicketApply?ticketId=${this.newVlaue.id}`,
					method: "post",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.showFalse = false
						uni.showToast({
							title: "退票成功",
							icon: 'success'
						})
						this.size = 1
						this.serch()
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
	.index {
		padding: 20rpx;
	}

	.header {
		// background-color: #FFF;
		// padding: 10rpx;
		// border-radius: 10rpx;
		// box-shadow: 0 0 12rpx #d7d7d7;
		width: 100%;
		background-color: #FFF;
		padding: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 0 12rpx #d7d7d7;
		position: fixed;
		top: 0px;
		z-index: 99999;
	}

	.body_menu {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
	}

	.bottomClass {
		background: linear-gradient(to right, #F4E4C3 50%, #fcf8e7);
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		border-radius: 10rpx;
		align-items: center;
		z-index: 999;
	}

	.btnpop {
		padding: 5rpx 20rpx;
		background-color: orange;
		color: #FFF;
		border-radius: 10rpx;
	}

	.content {
		// padding: 20rpx;
		background: #fff;
		margin-top: 20rpx;
		border-radius: 10rpx;
		// display: flex;
		// justify-content: space-between;
		align-items: center;
		position: relative;
		box-shadow: 0 0 12rpx #d7d7d7;

		.content_left {
			// width: 10%;
			// height: 100%;
			padding: 10rpx;
			position: absolute;
			top: 10rpx;
			right: 10rpx;

			.status_box {
				padding: 5rpx 20rpx;
				// width: 60%;
				border-radius: 10rpx;
				display: flex;
				font-size: 24rpx;
				text-align: center;
				color: #fff;
			}
		}

		.content_center {
			height: 100%;
			width: 55%;
			padding: 25rpx;
			overflow: hidden;

			.pro_name {
				display: block;
				height: 40rpx;
				line-height: 40rpx;
				width: 100%;
				font-size: 32rpx;
				overflow: hidden;
				white-space: nowrap;
				font-weight: bold;
				color: #70695f;
				text-overflow: ellipsis;
			}

			.pro_msg {
				display: block;
				width: 100%;
				color: #70695f;
				font-size: 24rpx;
				height: 40rpx;
				line-height: 40rpx;
				overflow: hidden;
				margin-top: 10rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-weight: bold;
			}

			.pro_num {
				width: 100%;
				color: #70695f;
				font-size: 24rpx;
				display: flex;
				height: 40rpx;
				line-height: 40rpx;
				margin-top: 10rpx;
				bottom: 0;

				span {
					color: green;
				}
			}
		}

		.content_right {
			// height: 100%;
			// width: 35%;
			display: flex;
			position: absolute;
			top: 80rpx;
			right: 10rpx;

			.code_imgBoxDelete {
				width: 33%;
				top: 20rpx;
				right: 1%;
				position: absolute;
				color: #AFB0B2;
				font-size: 24rpx;
				text-align: center;

				.delete_img {
					height: 60rpx;
					width: 60rpx;
					background-size: 100%;
					margin: auto;
					// background: url('@/static/delete.png') no-repeat center;
				}
			}

			.code_imgBox {
				width: 33%;
				margin-top: 20rpx;

				.code_img {
					height: 60rpx;
					width: 60rpx;
					background-size: 100%;
					margin: auto;
					// background: url('@/static/ysm.png') no-repeat center;
				}

				.tickte_img {
					height: 60rpx;
					width: 60rpx;
					background-size: 100%;
					margin: auto;
					// background: url('@/static/fp.png') no-repeat center;
				}

				.backTickte_img {
					height: 60rpx;
					width: 60rpx;
					background-size: 100%;
					margin: auto;
					// background: url('@/static/tp.png') no-repeat center;
				}

				.delete_img {
					height: 60rpx;
					width: 60rpx;
					background-size: 100%;
					margin: auto;
					// background: url('../../static/delete.png') no-repeat center;
				}

				span {
					text-align: center;
					color: #AFB0B2;
					font-size: 24rpx;
					display: block;
				}
			}

		}
	}

	.boxindex {
		padding: 20rpx;
		// border: 1px solid red;
	}
</style>