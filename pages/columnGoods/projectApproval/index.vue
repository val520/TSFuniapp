<template>
	<view>
		<!-- 搜索区域 -->
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入内容" prefixIcon="search" @change="query" v-model="queryValue" @clear="queryValue = ''"
					border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 占位符 -->
		<view style="margin-top:120rpx ;"></view>
		<u-empty mode="data" v-if="datalist.length === 0" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<!-- 项目列表区域 -->
		<view class="boxlist" v-else v-for="(item,index) in datalist" :key="index" @click="projectDate(item)">
			<view class="">
				<!-- 项目名称 -->
				<view class="textName">
					{{item.projectName}}
				</view>
				<view class="center">
					<span style="color: #666;">项目位置：</span>{{item.remark}}
				</view>
				<view class="center">
					<span style="color: #666;">所属机构：</span>{{item.orgName}}
				</view>
				<view class="center">
					<span style="color: #666;">创建时间：</span>{{item.createTime}}
				</view>
			</view>
			<view class="mintxt" v-if="item.projectStatus === 1">
				已通过
			</view>
			<view class="minred" v-else-if="item.projectStatus === 2">
				未通过
			</view>
			<view class="" v-else>
				<view class="btn1" @click.stop="approvalShow(item)">
					审核
				</view>
			</view>
		</view>
		<u-loadmore v-if="datalist.length !=0" status="nomore" />
		<!-- 提示框 -->
		<u-modal :show="show" title="提示" confirmColor="#DCA842" @confirm="addshow" @cancel="noshow" @close='showclose'
			:closeOnClickOverlay="true" showCancelButton="true" confirmText='通过' cancelText='不通过'>
			<template Slots="default">
				<view>
					<u-input placeholder="请输入意见" clearable v-model="yjvalue"></u-input>
				</view>
			</template>
		</u-modal>
		<!-- 返回TOP -->
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" :customStyle="custom" :iconStyle="iconStyle"></u-back-top>
	</view>

</template>
<script>
	export default {
		name: "projectConten",
		data: function() {
			return {
				scrollTop: 0,
				show: false,
				// 搜索变量值
				queryValue: "",
				// 意见变量
				yjvalue: "",
				custom: {
					background: '#DCA842'
				},
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				datalist: [],
				// 页数
				size: 1,
				// 要审核的数据
				approvaldata: null
			}
		},
		onLoad: function(option) {
			this.query()
		},
		onShow() {
			this.query()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			// 查询项目列表数据
			query() {
				this.size = 1
				let val = {
					pageNo: this.size,
					pageSize: 10,
					projectName: this.queryValue
				}
				this.$myRequest({
					url: "/tsf/tsfBusProject/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.datalist = res.data.result.records
					} else {
						this.datalist = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 跳转项目详情
			projectDate(item) {
				uni.navigateTo({
					url: '/pages/columnGoods/Projectinfo/index?item=' + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
			},
			// 关闭弹窗
			showclose() {
				this.show = false
				this.yjvalue = ""
			},
			// 打开弹窗
			approvalShow(e) {
				this.show = true
				this.approvaldata = e
			},
			// 点击不通过
			noshow() {
				if (this.yjvalue === "") {
					uni.$u.toast('请先输入意见')
				} else {
					let val = {
						checkOpinion: this.yjvalue,
						checkStatus: 1,
						projectId: this.approvaldata.id
					}
					this.$myRequest({
						url: "/tsf/tsfProjectCheck/check",
						method: "post",
						data: val
					}).then(res => {
						if (res.data.code === 200) {
							this.show = false
							this.yjvalue = ""
							this.query()
						} else {
							uni.$u.toast(res.data.message)
						}
					})
				}
			},
			// 弹窗点击确认
			addshow() {
				let val = {
					checkOpinion: this.yjvalue,
					checkStatus: 0,
					projectId: this.approvaldata.id
				}
				this.$myRequest({
					url: "/tsf/tsfProjectCheck/check",
					method: "post",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.show = false
						this.yjvalue = ""
						this.query()
					} else {
						uni.$u.toast(res.data.message)
					}
				})
			}
		},
		onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 10,
				projectName: this.queryValue
			}
			this.$myRequest({
				url: "/tsf/tsfBusProject/list",
				method: "get",
				data: val
			}).then(res => {
				if (res.data.code === 200) {
					if (this.datalist.length = res.data.result.total) {
						uni.$u.toast('没有更多了')
					} else {
						this.datalist = [...this.datalist, ...res.data.result.records]
					}
				} else {
					uni.$u.toast(res.data.message)
				}
			})
		}
	};
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
	}

	.boxlist {
		padding: 20rpx;
		margin: 20rpx;
		background: #FFF;
		border-bottom: 10rpx solid #DCA842;
		border-radius: 10rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn1 {
		background-color: #DCA842;
		color: #FFF;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
	}

	.btn2 {
		margin-top: 10rpx;
		background-color: red;
		color: #FFF;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
	}

	.textName {
		width: 500rpx;
		font-weight: bold;
		font-size: 30rpx;
		margin-bottom: 10rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
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
		color: #00aa00;
		font-weight: bold;
	}

	.minred {
		color: red;
		font-weight: bold;
	}
</style>
