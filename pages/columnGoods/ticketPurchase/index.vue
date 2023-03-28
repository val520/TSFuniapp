<template>
	<view>
		<!-- 搜索区域 -->
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入单号查询" prefixIcon="search" v-model="value" @change="change" @clear="closevalue"
					border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 占位符 -->
		<view style="margin-top:80rpx;"></view>
		<view class="container">
			<!-- 列表 -->
			<view class="content_box">
				<view v-if="proList.length===0">
					<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
					</u-empty>
				</view>
				<view class="content" v-else v-for="(item,index) in proList" :key="index" @click="listinfo(item)">
					<view class="ContenOne">
						<view class="dress">
							单号：<u-tooltip :text="item.orderNum" direction="bottom"></u-tooltip>
						</view>
						<view v-if="item.orderStatus === 0" class="btn">
							审核通过
						</view>
						<view v-else-if="item.orderStatus === 2" class="dshbtn">
							待审核
						</view>
						<view v-else class="redbtn">
							不通过
						</view>
					</view>
					<!-- <view class="ContenTwo">
					剩余<span class="pro_num">{{item.totalEarth}}</span>m³
				</view> -->
					<!-- <view class="dress">
					单号：{{item.orderNum}}
				</view> -->
					<view class="centerbox" v-for="(obj,indexs) in item.orderProductList" :key="indexs">
						<view class="imgLeft">
							<u--image :showLoading="true" radius="20rpx" :src="obj.productImageUrl" width="160rpx"
								height="160rpx"></u--image>
						</view>
						<view style="margin-left: 50rpx; overflow:hidden; text-overflow:ellipsis;white-space: nowrap;-o-text-overflow: ellipsis;">
							<view style="color: #999;">
								名称：{{obj.productName}}
							</view>
							<view style="color: #999;">
								单价：{{obj.sellPrice}}
							</view>
							<view style="color: #999;">
								数量：x{{obj.sellNum}}
							</view>
							<view style="color: #DCA842;font-weight: bold;">
								总价：{{item.payPrice}}
							</view>
						</view>
					</view>
					<view class="bom">
						<view class="time">
							下单日期:{{item.createTime}}
						</view>
						<view v-if="item.orderStatus ===2" class="bombtn" @click.stop="clickProject(item)">
							审核
						</view>
					</view>
				</view>
			</view>
			<u-modal :show="showFalse" :closeOnClickOverlay="true" @close="showFalse=false" confirmText='通过'
				cancelText='不通过' @cancel="noto" title="确认审核通过该记录" :showCancelButton='true' @confirm="confirm"
				confirmColor="#DFB76D" ref="uModal">
				<template Slots="default">
					<view>
						<u-input placeholder="请输入意见" clearable v-model="yjvalue"></u-input>
					</view>
				</template>
			</u-modal>
			<!-- 返回TOP -->
			<u-back-top :scroll-top="scrollTop" icon="arrow-up" :customStyle="custom"
				:iconStyle="iconStyle"></u-back-top>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				yjvalue: null,
				showFalse: false,
				proList: [],
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				custom: {
					background: '#DFB76D'
				},
				menuList: [{
						name: '全部',
						key: '1',
						checked: false,
					},
					{
						name: '已审核',
						key: '2',
						checked: false,
					},
					{
						name: '待审核',
						key: '3',
						checked: false,
					},
					{
						name: '不通过',
						key: '4',
						checked: false,
					},

				],
				//分页
				size: 1,
				Status: "",
				scrollTop: 0
			}
		},

		// 触底事件
		async onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 10,
				orderNum: this.value,
				checkStatus: 1,
				wxCheckFlag: true
			}
			this.$myRequest({
				url: '/tsf/tsfSystemOrder/wxList',
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
				}
			})
			// console.log("onReachBottom");
		},
		onShow() {
			this.size = 1
			this.sceher()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {},
		methods: {
			//点击查看详情
			listinfo(item) {
				uni.navigateTo({
					url: '/pagesone/tickInfo/tickInfo?item=' + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
			},
			//查询订单列表
			sceher() {
				let val = {
					pageNo: this.size,
					pageSize: 10,
					orderNum: this.value,
					checkStatus: 1,
					wxCheckFlag: true
				}
				this.$myRequest({
					url: '/tsf/tsfSystemOrder/wxList',
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.proList = res.data.result.records
					}
				})
			},
			//运输码
			clickCode(item) {
				uni.navigateTo({
					url: "/pagesOthers/transferManage/tansfManage?item=" + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
			},
			//点击项目
			clickProject(item) {
				this.newValue = item
				this.showFalse = true
				// uni.navigateTo({
				// 	url: "/pages/buAuditinfo/buAuditinfo?item=" + encodeURIComponent(JSON.stringify(item).replace(
				// 		/%/g, '%25'))
				// })
			},
			// 不通过
			noto() {
				let val = {
					checkOpinion: this.yjvalue,
					checkStatus: 1,
					orderId: this.newValue.id
				}
				this.$myRequest({
					url: '/tsf/orderCheck/buyCheck',
					method: 'post',
					data: val,
				}).then(res => {
					if (res.data.code === 200) {
						this.size = 1
						this.sceher()
						uni.showToast({
							title: res.data.message,
							icon: "success"
						})
						this.showFalse = false;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			// 通过
			confirm() {
				let val = {
					checkOpinion: this.yjvalue,
					checkStatus: 0,
					orderId: this.newValue.id
				}
				this.$myRequest({
					url: '/tsf/orderCheck/buyCheck',
					method: 'post',
					data: val,
				}).then(res => {
					if (res.data.code === 200) {
						this.size = 1
						this.sceher()
						uni.showToast({
							title: res.data.message,
							icon: "success"
						})
						this.showFalse = false;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},

			menuClick(item) {
				console.log('item', item)
				this.size = 1
				if (item.key === '1') {
					this.Status = ''
					this.sceher()
				} else {
					this.Status = item.name
					this.sceher()
				}
			},
			//搜索
			change() {
				this.size = 1
				this.sceher()
			},
			//清空搜索
			closevalue() {
				this.size = 1
				this.value = ''
				this.sceher()
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		padding: 20rpx;
	}

	.header {
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

	.search {
		border-radius: 10rpx;
		background: #fff;
		box-shadow: 0 0 12rpx #d7d7d7;
	}

	.body_menu {
		margin-top: 20rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
		background-color: #FFF;
	}

	.content_box {
		margin-top: 20rpx;
	}

	.content {
		padding: 20rpx;
		background-color: #FFF;
		border-radius: 10rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
		background-color: #FFF;
		margin-bottom: 20rpx;
	}

	.btn {
		border: 1rpx solid #549F43;
		background: #EDF6EC;
		color: #549F43;
		border-radius: 10rpx;
		padding: 5rpx 10rpx;
	}

	.dshbtn {
		border: 1rpx solid #999;
		background: #F1F1F1;
		color: #999;
		border-radius: 10rpx;
		padding: 5rpx 10rpx;
	}

	.nobtn {
		border: 1rpx solid #F9AE3D;
		background: #FDF6EC;
		color: #F9AE3D;
		border-radius: 10rpx;
		padding: 5rpx 10rpx;
	}

	.redbtn {
		border: 1rpx solid red;
		background: #FCE5E6;
		color: red;
		border-radius: 10rpx;
		padding: 5rpx 10rpx;
	}

	.ContenOne {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.time {
		font-size: 25rpx;
		color: #666;
	}

	.tentxt {
		color: #70695F;
		font-weight: bold;
		font-size: 40rpx;
		width: 300rpx;
		text-overflow: ellipsis;
		/*让截断的文字显示为点点。还有一个值是clip意截断不显示点点*/
		white-space: nowrap;
		/*让文字不换行*/
		overflow: hidden;
		/*超出要隐藏*/
	}

	.ContenTwo {
		color: #666;
	}

	.pro_num {
		font-size: 24rpx;
		color: green;
	}

	.dress {
		color: #666;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		// border-bottom: 1rpx solid #F9AE3D;
	}

	.bom {
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bombtn {
		border: 1rpx solid #DFB76D;
		border-radius: 10rpx;
		padding: 10rpx 40rpx;
		background-color: #DFB76D;
		color: #FFF;
	}

	.centerbox {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.imgLeft {
		margin: 10rpx;
	}
</style>