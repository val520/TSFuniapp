<template>
	<view>
		<view class="orgclass">
			<u-icon :label="orgName" labelColor="#FFF" color="#FFF" size="20" name="map-fill"></u-icon>
		</view>
		<!-- 顶部搜索框 -->
		<view class="header">
			<view class="headerinput">
				<u--input placeholder="请输入机械名称" prefixIcon="search" v-model="queryValue" @change="query"
					@clear="queryValue = ''" border="surround" shape="circle" clearable>
				</u--input>
			</view>
		</view>
		<!-- 机械分类 -->
		<view class="tagtype">
			<u-sticky bgColor="#fff">
				<u-tabs @change="taglist" lineColor="#DCA842"
					:activeStyle="{ color: '#DCA842',fontWeight: 'bold',transform: 'scale(1.05)'}" :scrollable="true"
					:list="requireSorts"></u-tabs>
			</u-sticky>
		</view>
		<!-- 机械展示区域 -->
		<view class="boxcenter">
			<view v-if="tempArr.length === 0"  style="margin: auto;">
				<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
				</u-empty>
			</view>
			<view class="boxlist" v-else v-for="(item,index) in tempArr" :key="index" @click="goDetail(item)">
				<!-- //顶部图片 -->
				<view class="pictrue">
					<image :src="item.attUrl" mode="aspectFill"></image>
				</view>
				<view class="text-info">
					<view class="title line1">{{item.machineName}}</view>
					<view class="old-price line1">描述：<text>{{item.remark}}</text></view>
					<view class="old-price line1">类型：<text>{{item.categoryTypeName}}</text></view>
					<view class="old-price line1">所属机构：<text>{{item.orgName}}</text></view>
				</view>
			</view>
		</view>
		<!-- 返回TOP -->
		<u-back-top :scroll-top="scrollTop" icon="arrow-up" :customStyle="custom" :iconStyle="iconStyle"></u-back-top>
	</view>
</template>
<script>
	export default {
		data: function() {
			return {
				scrollTop:0,
				custom: {
					background: '#DCA842'
				},
				iconStyle: {
					fontSize: '32rpx',
					color: '#FFF'
				},
				//机械类型数据
				requireSorts: [],
				//机械数据
				tempArr: [],
				//机械查询数据
				queryValue: "",
				//当前机械类型id
				dateId: '',
				//当前机构id
				orgId:"",
				//当前机构名称
				orgName:""
			}
		},
		onLoad: function(option) {
			//接收机构id
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				this.orgId = item.orgId
				this.orgName = item.orgName
				console.log('编辑信息', item)
			}
		},
		onShow() {
			this.mutypelist()
			this.query()
		},
		onReady() {

		},
		onPageScroll(e) {

		},
		methods: {
			//查看机械详情
			goDetail(e){
				uni.navigateTo({
					url: '/pages/users/muckCar/indexpostioninfo?item='+ encodeURIComponent(JSON.stringify(e)
						.replace(/%/g, '%25'))
				})
			},
			//查询项目列表数据
			query() {
				this.size = 1
				let val = {
					pageNo: this.size,
					pageSize: 10,
					machineName: this.queryValue,
					homePageFlag: true,
					categoryTypeId: this.dateId,
					orgId:this.orgId
				}
				this.$myRequest({
					url: "/machine/wxList",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.tempArr = res.data.result.records
					} else {
						this.tempArr = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			//点击类型查询数据
			taglist(e) {
				console.log(e);
				if (e.name === '全部') {
					this.dateId = ''
				} else {
					this.dateId = e.id
				}
				this.query()
			},
			// 获取机械类型数据
			mutypelist() {
				let val = {
					dictId: '1663806026770640898',
					pageNo: 1,
					pageSize: 10000
				}
				this.$myRequest({
					url: "/sys/dictItem/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 0) {
						res.data.result.records.forEach((res) => {
							res.name = res.itemText
							res.value = res.id
						})
						this.requireSorts = res.data.result.records
						this.requireSorts.unshift({
							name: '全部',
							value: '59005'
						})
					} else {
						uni.$u.toast(res.data.message)
						this.requireSorts = []
					}
				})
			},

		},
		onReachBottom() {
			this.size = this.size + 1
			let val = {
				pageNo: this.size,
				pageSize: 10,
				projectName: this.queryValue,
				homePageFlag: true,
				categoryTypeId: this.dateId,
				orgId:this.orgId
			}
			this.$myRequest({
				url: "/machine/wxList",
				// url: "/tsf/tsfBusProject/list",
				method: "get",
				data: val
			}).then(res => {
				if (res.data.code === 200) {
					if (this.tempArr.length === res.data.result.total) {
						uni.$u.toast('没有更多了')
					} else {
						this.tempArr = [...this.tempArr, ...res.data.result.records]
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
		background-color: #DCA842;
		padding: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// box-shadow: 0 0 12rpx #d7d7d7;
	}

	.headerinput {
		width: 100%;
		border-radius: 200rpx;
		background: #FFF;
	}

	.tagtype {}

	.boxcenter {
		padding: 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.boxlist {
		width: 335rpx;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
		background-color: #fff;
		box-shadow: 0 0 12rpx #d7d7d7;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.pictrue {
		position: relative;

		image {
			width: 100%;
			height: 330rpx;
		}

	}

	.text-info {
		padding: 10rpx 20rpx 15rpx;

		.title {
			color: #000;
		}

		.old-price {
			margin-top: 8rpx;
			font-size: 20rpx;
			color: #666;
			// text-decoration: line-through;

			text {
				color: #999;
				margin-right: 2px;
				font-size: 20rpx;
			}
		}

	}
	.orgclass{
		padding-left: 20rpx;
		color: #FFF;
		background: #DCA842;
		
	}
</style>