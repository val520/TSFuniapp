<template>
	<view>
		<!-- 搜索区域 -->
		<view class="header">
			<view style="width: 100%;">
				<u--input placeholder="请输入内容" prefixIcon="search" @change="query" v-model="queryValue"
					@clear="queryValue = ''" border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 占位符 -->
		<view style="margin-top:120rpx ;"></view>
		<!-- 项目列表区域 -->
		<u-empty mode="data" v-if="datalist.length === 0" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view class="boxlist" v-else v-for="(item,index) in datalist" :key="index" @click="projectDate(item)">
			<view class="boxcontent">
				<!-- 左边图片 -->
				<view style="margin-right: 10rpx;">
					<u--image :showLoading="true" radius="20rpx" :src="item.coverAttIds[0].interRqUrl" width="160rpx"
						height="160rpx"></u--image>
				</view>
				<!-- 右边文字 -->
				<view class="">
					<view class="center">
						<view class="cenbox">
							<view class="">
								<!-- 商品名称 -->
								<span style="color: #666;">名称：</span>{{item.productName}}
							</view>
							<!-- 按钮 -->
							<view class="mintxt" v-if="item.status === 1">
								已通过
							</view>
							<view class="minred" v-else-if="item.status === 2">
								未通过
							</view>
							<view class="minbox" v-else>
								待审核
							</view>
						</view>
					</view>
					<view class="center">
						<!-- 商品类型 -->
						<span style="color: #666;">类型：</span>{{item.categoryTypeName}}
					</view>
					<view class="center">
						<!-- 商品描述 -->
						<span style="color: #666;">描述：</span>{{item.remark}}
					</view>
					<view class="Price">
						<!-- 商品价格 -->

						<span style="color: #666;">价格：</span>￥{{item.sellPrice}}
					</view>
				</view>
			</view>
			<view class="bombtn">
				<!-- <view class="btn2" @click.stop="show=true">
					删除
				</view> -->
				<!-- <view class="upbtn" v-if="item.type === 0" @click.stop="upclick">
					上架
				</view>
				<view class="dowbtn" v-else @click.stop="downclick">
					下架
				</view> -->
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
	import {
		getIndexData
	} from '@/api/api.js';
	export default {
		name: "projectConten",
		data: function() {
			return {
				scrollTop: 0,
				show: false,
				// 搜索变量值
				queryValue: "",
				size: 1,
				// 意见变量
				yjvalue: "",
				custom: {
					background: '#DCA842'
				},
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				datalist: []
			}
		},
		onLoad: function(option) {},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			this.query()
		},
		methods: {
			// 跳转项目详情
			projectDate(item) {
				if (item.status === 0) {
					uni.navigateTo({
						url: '/pages/columnGoods/Editdemand/index?item=' + encodeURIComponent(JSON.stringify(item)
							.replace(/%/g, '%25'))
					})
				} else {
					uni.navigateTo({
						url: '/pages/columnGoods/lookdemand/index?item=' + encodeURIComponent(JSON.stringify(item)
							.replace(/%/g, '%25'))
					})
				}

			},

			//查询项目列表数据
			query() {
				this.size = 1
				let val = {
					pageNo: this.size,
					pageSize: 10,
					productName: this.queryValue,
					status: '',
					// wxHomeFlag:true
				}
				this.$myRequest({
					url: "/tsf/tsfBusCommodity/wxList",
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
			// 关闭弹窗
			showclose() {
				this.show = false
				this.yjvalue = ""
			},
			// 点击不通过
			noshow() {
				if (this.yjvalue === "") {
					uni.$u.toast('请先输入意见')
				} else {
					this.show = false
					this.yjvalue = ""
				}
			},
			// 弹窗点击确认
			addshow() {
				this.show = false
				this.yjvalue = ""
			},
			// 商品上架
			upclick() {
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(function() {
					//隐藏加载框
					uni.hideLoading();
				}, 1000);
			},
			// 商品下架
			downclick() {
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(function() {
					//隐藏加载框
					uni.hideLoading();
				}, 1000);
			}

		},
		// 触底事件
		onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 10,
				projectName: this.queryValue,
				// wxHomeFlag:true
			}
			this.$myRequest({
				url: "/tsf/tsfBusCommodity/wxList",
				method: "get",
				data: val
			}).then(res => {
				if (res.data.code === 200) {
					if (this.datalist.length === res.data.result.total) {
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
		z-index: 9999;
	}

	.boxlist {
		padding: 20rpx;
		margin: 20rpx;
		background: #FFF;
		// border-bottom: 10rpx solid #DCA842;
		border-radius: 10rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
		// display: flex;
		// justify-content: space-between;
		// align-items: center;
	}

	.boxcontent {
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
		margin-right: 10rpx;
	}

	.upbtn {
		margin-top: 10rpx;
		background-color: green;
		color: #FFF;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
	}

	.dowbtn {
		margin-top: 10rpx;
		background-color: #DCA842;
		color: #FFF;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
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

	.Price {
		color: red;
	}

	.mintxt {
		color: #00aa00;
		font-weight: bold;
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

	.bombtn {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
</style>