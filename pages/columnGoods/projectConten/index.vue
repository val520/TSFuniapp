<template>
	<view>
		<!-- 搜索区域 -->
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入内容" prefixIcon="search" v-model="queryValue" @change="query" @clear="queryValue = ''"
					border="surround" shape="circle" clearable>
				</u--input>
			</view>
			<!-- <view @click="newproject">
				<u-button type="warning" shape="circle" text="新增"></u-button>
			</view> -->
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
			<view class="mintxt" v-if="item.projectStatus === 0">
				待审核
			</view>
			<view class="mintxtred" v-else-if="item.projectStatus === 2">
				不通过
				<view class="btn2" @click.stop="openshow(item)">
					删除
				</view>
			</view>
			<view class="" v-else>
				<view class="btn1" @click.stop="editProject(item)">
					编辑
				</view>
				<view class="btn2" @click.stop="openshow(item)">
					删除
				</view>
			</view>
		</view>
		<u-loadmore v-if="datalist.length !=0" status="nomore" />
		<!-- 提示框 -->
		<u-modal :show="show" title="提示" confirmColor="#DCA842" @confirm="addshow" @close='showclose'
			:closeOnClickOverlay="true">
			<view class="slot-content" style="text-align: center;color: #666;">
				点击 "确认" 删除项目后,不可恢复,请谨慎操作!
			</view>
		</u-modal>
		<!-- 返回TOP -->
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" :customStyle="custom" :iconStyle="iconStyle"></u-back-top>
		<!-- 新增悬浮图标 -->
		<view class="suspension" @click="newproject">
			<u-icon name="plus" color="#FFF" size="28"></u-icon>
		</view>
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
				custom: {
					background: '#DCA842'
				},
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				// 页数
				size: 1,
				// 项目数据
				datalist: [],
				// 当前删除的数据
				deletedata: null
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
			//查询项目列表数据
			query() {
				this.size = 1
				let val = {
					pageNo: this.size,
					pageSize: 10,
					projectName: this.queryValue
				}
				this.$myRequest({
					url: "/tsf/tsfBusProject/wxList",
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
			// 新建项目
			newproject() {
				uni.navigateTo({
					url: '/pages/columnGoods/NewProject/index'
				})
			},
			// 编辑项目
			editProject(item) {
				uni.navigateTo({
					url: '/pages/columnGoods/EditProject/index?item=' + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
			},
			// 跳转项目详情
			projectDate(item) {
				uni.navigateTo({
					url: '/pages/columnGoods/Projectinfo/index?item=' + encodeURIComponent(JSON.stringify(item)
						.replace(/%/g, '%25'))
				})
			},
			// 打开弹窗
			openshow(e) {
				this.show = true
				// 当前删除的数据
				this.deletedata = e
			},
			// 关闭弹窗
			showclose() {
				this.show = false
			},
			// 弹窗点击确认
			addshow() {
				let val = {
					id: this.deletedata.id
				}
				this.$myRequest({
					url: "/tsf/tsfBusProject/delete",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.show = false
						uni.$u.toast(res.data.message)
						this.query()
					} else {
						uni.$u.toast(res.data.message)
					}
				})

			}
		},
		// 触底事件
		onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 10,
				projectName: this.queryValue
			}
			this.$myRequest({
				url: "/tsf/tsfBusProject/wxList",
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
		color: #999;
		font-weight: bold;
	}

	.mintxtred {
		color: red;
		font-weight: bold;
	}

	.suspension {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #DCA842;
		position: fixed;
		z-index: 99999;
		right: 10rpx;
		bottom: 100rpx;
		padding: 20rpx;
		border-radius: 50%;
	}
</style>