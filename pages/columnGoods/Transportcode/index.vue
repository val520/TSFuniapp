<template>
	<view>
		<!-- 头部标签 -->
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入司机名称" prefixIcon="search" v-model="value" @change="change" @clear="closevalue"
					border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 占位符 -->
		<view style="margin-top:120rpx;"></view>
		<!-- 列表区域 -->
		<view>
			<view v-if="projectList.length===0">
				<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
				</u-empty>
			</view>
			<view class="content" v-else v-for="(item,index) in projectList" :key="index" @click="codeClick(item)">
				<view class="contheader">
					<view class="contleft">
						<view style="color: #70695F;font-weight: bold;font-size: 40rpx;">
							{{item.driver}}
						</view>
						<!-- <view class="tag">
							{{item.projectType}}
						</view> -->
					</view>
					<view>
						<view v-if="item.ticketStatus == '生效中'" class="btn">
							生效中
						</view>
						<view v-else-if="item.ticketStatus == '待审核'" class="btns">
							待审核
						</view>
						<view v-else class="btns">
							已核销
						</view>
					</view>
				</view>
				<view class="contlin">
					土石方量: <span>{{item.applyEarth}}</span> m³
				</view>
				<view class="contbottom">
					<p>{{item.createTime}}</p>
					<p>电话：{{item.telephone}}</p>
				</view>
			</view>
			<!-- 站位 -->
			<view style="height: 30rpx;">

			</view>
		</view>
		<!-- 返回TOP -->
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" :customStyle="custom" :iconStyle="iconStyle">
		</u-back-top>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// 输入框参数
				value: "",
				scrollTop: 0,
				custom: {
					background: '#DCA842'
				},
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				vHeight: 0,
				projectList: [],
				size: 1,
				valueItem: '',
				statues: ""
			}
		},
		onLoad(option) {
			this.size = 1
			this.screadd()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		// 触底事件
		async onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 10,
				driver:this.value,
				adminCheckFlag: false
			}
			this.$myRequest({
				url: "/tsf/tsfTransportTicket/wxList",
				method: "get",
				data: val
			}).then(res => {
				if (res.data.code === 200) {
					if (this.projectList.length === res.data.result.total) {
						uni.showToast({
							title: `没有更多了`,
							icon: "none"
						})
					} else {
						this.projectList = [...this.projectList, ...res.data.result.records]
					}

				}
			})
			console.log("onReachBottom");
		},
		onShow() {
			this.size = 1
			this.screadd()
		},
		methods: {
			//搜索
			change() {
				this.size = 1
				this.screadd()
			},
			//清空搜索
			closevalue() {
				this.size = 1
				this.value = ''
				this.screadd()
			},
			// 查询分票
			screadd() {
				let val = {
					pageNo: this.size,
					pageSize: 10,
					driver:this.value,
					adminCheckFlag: false
				}
				this.$myRequest({
					url: "/tsf/tsfTransportTicket/wxList",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.projectList = res.data.result.records
					} else {
						this.projectList = []
					}
				})
			},
			//运输码
			codeClick(item) {
				console.log('运输码', item)
				uni.navigateTo({
					// url: "/pages/columnGoods/Transportinfo/Transportinfo?item=" + encodeURIComponent(JSON
					// 	.stringify(item)
					// 	.replace(/%/g, '%25'))
					url: `/pages/columnGoods/Transportinfo/Transportinfo?id=${item.id}`
					// url: `/pages/columnGoods/Transportlook/Transportlook?id=${item.id}`
				})
			},
			//删除
			deleteClick(item) {
				console.log('删除')
			},
			menuClick(item) {
				console.log('item', item.name)
				this.size = 1
				if (item.key === '1') {
					this.statues = ''
					this.screadd()
				} else {
					this.statues = item.name
					this.screadd()
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
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

	.content {
		background: #FFF;
		border-radius: 10rpx;
		margin: 20rpx;
		padding: 30rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
	}

	.contheader {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.contleft {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.tag {
		background: #FFF;
		border: 1rpx solid #707070;
		border-radius: 20rpx;
		margin-left: 20rpx;
		font-size: 30rpx;
		color: #918c80;
		padding: 0rpx 20rpx;
	}

	.btn {
		border: 1rpx solid #549F43;
		background: #EDF6EC;
		color: #549F43;
		border-radius: 10rpx;
		padding: 10rpx 30rpx;
	}

	.btns {
		border: 1rpx solid #ACACAC;
		background: #F7F7F7;
		color: #ACACAC;
		border-radius: 10rpx;
		padding: 10rpx 30rpx;
	}

	.contlin {
		color: rgba(112, 105, 95, 1);

		span {
			color: rgba(56, 160, 69, 1);
			margin: 0rpx 10rpx;
		}
	}

	.contbottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #918C80;
		font-size: 30rpx;
		letter-spacing: 0.05px;
		margin-top: 10rpx;
	}
</style>