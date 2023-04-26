<template>
	<view>
		<!-- 搜索区域 -->
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入司机名称" prefixIcon="search" v-model="value" @change="change" @clear="closevalue"
					border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 占位符 -->
		<view style="margin-top:80rpx;"></view>

		<view class="container">
			<view class="search">
				<!-- 输入框 -->
				<!-- <u-input placeholder="请输入内容" clearable v-model="value">
				<template slot="suffix">
					<uni-icons @click="change" color="#928D81" size="30px" type="search"></uni-icons>
				</template>
			</u-input> -->
			</view>
			<!-- 列表 -->
			<view class="content_box">
				<view v-if="proList.length===0">
					<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
					</u-empty>
				</view>
				<view class="content" v-else v-for="(item,index) in proList" :key="index" @click="listinfo(item)">
					<view class="ContenOne">
						<view class="tentxt">
							{{item.driver}}
						</view>
						<view v-if="item.appStatus == '待审核'" class="btn">
							{{item.appStatus}}
						</view>
						<view v-else-if="item.appStatus == '生效中'" class="btnblur">
							{{item.appStatus}}
						</view>
						<view v-else class="redbtn">
							{{item.appStatus}}
						</view>
					</view>
					<!-- <view class="ContenTwo">
						申请人:{{item.createBy}}
					</view> -->
					<view class="ContenTwo">
						总方量:<span class="pro_num">{{item.earthTotal}}</span>m³
					</view>
					<view class="ContenTwo">
						申请张数:{{item.applyNumber}}
					</view>
					<view class="ContenTwo">
						单次运量:{{item.applyEarth}}
					</view>
					<view class="dress">
						联系电话:{{item.createBy}}
					</view>
					<view class="bom">
						<view class="time">
							有效日期:{{item.createTime}}
						</view>
						<view v-if="item.appStatus =='待审核'" class="bombtn" @click.stop="clickProject(item)">
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
				//禁止重复点击
				btn: 1,
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
						name: '未审核',
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
				scrollTop: 0
			}
		},

		// 触底事件
		async onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 20,
				appStatus: '待审核',
				adminCheckFlag: true,
				driver: this.value
			}
			this.$myRequest({
				url: "/src/tsfBusTransport/wxList",
				method: "get",
				data: val
			}).then(res => {
				if (res.data.code === 200) {
					if (this.proList.length === res.data.result.total) {
						uni.$u.toast('没有更多了')
					} else {
						this.proList = [...this.proList, ...res.data.result.records]
					}
				} else {
					uni.$u.toast(res.data.message)
				}
			})
		},
		onShow() {
			this.size = 1
			this.sceher()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.size = 1
			this.sceher()
		},
		methods: {
			//点击查看详情
			listinfo(item) {
				// uni.navigateTo({
				// 	url: '/pagesone/listInfo/listInfo?item=' + encodeURIComponent(JSON.stringify(item)
				// 		.replace(/%/g, '%25'))
				// })
				console.log('运输码', item)
				uni.navigateTo({
					url: "/pages/Transportinfo/Transportinfo?item=" + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
			},
			//查询购票审核
			sceher() {
				let params = {
					pageNo: this.size,
					pageSize: 20,
					appStatus: '待审核',
					adminCheckFlag: true,
					driver: this.value
				}
				this.$myRequest({
					url: "/src/tsfBusTransport/wxList",
					method: "get",
					data: params
				}).then(res => {
					if (res.data.code === 200) {
						this.proList = res.data.result.records
					}
				})
			},
			//点击审核
			clickProject(item) {
				this.newValue = item
				this.showFalse = true
				this.btn = 1
				// uni.navigateTo({
				// 	url: "/pages/buAuditinfo/buAuditinfo?item=" + encodeURIComponent(JSON.stringify(item).replace(
				// 		/%/g, '%25'))
				// })
			},
			// 不通过
			noto() {
				this.showFalse = false
				let val = {
					id: this.newValue.id,
					appStatus: '不通过',
					// checkTime: getDateTime.dateTimeStr('y-m-d h:i:s')
				}
				this.$myRequest({
					url: '/src/tsfBusTransport/transportCheck',
					method: "post",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.size = 1
						uni.showToast({
							title: res.data.message,
							icon: "success"
						})
						this.showFalse = false
						this.sceher()
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			//清空搜索
			closevalue() {
				this.size = 1
				this.value = ''
				this.sceher()
			},
			// 通过
			confirm() {
				if (this.btn === 1) {
					this.btn = 2
					let val = {
						id: this.newValue.id,
						appStatus: '通过',
						// checkTime: getDateTime.dateTimeStr('y-m-d h:i:s')
					}
					this.$myRequest({
						url: '/src/tsfBusTransport/transportCheck',
						method: "post",
						data: val,
						// Type: "application/x-www-form-urlencoded",
					}).then(res => {
						if (res.data.code === 200) {
							this.size = 1
							uni.showToast({
								title: res.data.message,
								icon: "success"
							})
							this.showFalse = false
							this.sceher()
						} else {
							this.btn = 1
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				} else {
					uni.showToast({
						title: '禁止重复提交',
						icon: "none"
					})
				}

			},

			menuClick(item) {
				console.log('item', item.name)
			},
			change() {
				this.size = 1
				this.sceher()
			},
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
		border: 1rpx solid #ACACAC;
		background: #F7F7F7;
		color: #ACACAC;
		border-radius: 10rpx;
		padding: 10rpx 30rpx;
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
		border-bottom: 1rpx solid #c7c7c7;
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

	.btnblur {
		border: 1rpx solid #549F43;
		background: #EDF6EC;
		color: #549F43;
		border-radius: 10rpx;
		padding: 10rpx 30rpx;
	}
</style>