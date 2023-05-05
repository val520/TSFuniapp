<template>
	<view class="">
		<view class="wrapper">
			<u--form labelPosition="left" :model="userInfo" :rules="rules" ref="uForm">
				<u-form-item label="姓名" required="true" prop="name" borderBottom ref="item1">
					<view class="rightClass">
						<input type="nickname" @blur='nicknameValue' @input="bindinput" v-model="userInfo.realname"
							class="weui-input" placeholder="请输入昵称" />
					</view>
				</u-form-item>
				<u-form-item label="头像" required="true" ref="item1">
					<view class="rightClass">
						<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<view class="pictrue">
								<image class="avatar" :src="userInfo.avatar"></image>
							</view>
						</button>
					</view>
				</u-form-item>
			</u--form>
		</view>
		<view class="logOut cart-color acea-row row-center-wrapper" @click="okedit">确认</view>
	</view>
</template>

<script>
	import {
		BASE_URL
	} from '@/config/app.js'
	export default {
		data() {
			return {
				userInfo: {
					realname: "",
					avatar: "",
					id: uni.getStorageSync("userInfo").id
				},
				rules: {
					'name': {
						type: 'string',
						required: true,
						max: 3,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onLoad: function(option) {
			this.userdata()
		},
		onShow() {
			this.userdata()
		},
		methods: {
			//获取用户信息
			userdata() {
				this.$myRequest({
					url: "/sys/user/detailById",
					method: "get",
					data: {
						id: uni.getStorageSync("userInfo").id
					}
				}).then(res => {
					if (res.data.code === 0) {
						console.log(res.data.result.records[0]);
						this.userInfo = res.data.result.records[0]
					} else {
						uni.$u.toast(res.data.message)
					}
				})
			},
			//获取用户名赋值
			nicknameValue(e) {
				console.log(e.detail);
				this.userInfo.realname = e.detail.value
			},
			bindinput(e) {
				console.log(e.detail);
				this.userInfo.realname = e.detail.value
			},
			//获取用户头像
			onChooseAvatar(e) {
				console.log(e.detail, 11111);
				// this.userInfo.avatar = e.detail
				//获取头像地址 调用文件上传
				uni.uploadFile({
					url: `${BASE_URL}/attachment/tsfAttachment/fileUpload`,
					filePath: e.detail.avatarUrl,
					name: 'file',
					header: {
						"X-Access-Token": uni.getStorageSync("X-Access-Token") //token校验
					},
					formData: {
						user: 'test',
						fileType: "6"
					},
					success: (res) => {
						console.log(JSON.parse(res.data).result.interRqUrl);
						this.userInfo.avatar = JSON.parse(res.data).result.interRqUrl
					},
					fail: (err) => {
						uni.$u.toast('文件上传失败')
					}
				});
			},
			//修改用户确认
			okedit() {
				if (this.userInfo.realname === '') {
					uni.$u.toast('请填写用户名')
				} else if (this.userInfo.avatar === '') {
					uni.$u.toast('请上传头像')
				} else {
					this.$myRequest({
						url: "/sys/user/wxEdit",
						method: "post",
						data: this.userInfo
					}).then(res => {
						if (res.data.code === 200) {
							uni.$u.toast(res.data.message)
							// 新增成功返回上一级
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1000);
						} else {
							uni.$u.toast(res.data.message)
						}
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.pictrue {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		position: relative;
		border:1rpx solid #999;
	}

	.pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.wrapper {
		margin: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx 30rpx 0rpx 30rpx;
	}

	.logOut {
		font-size: 32rpx;
		text-align: center;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 30rpx auto 0 auto;
	}

	.rightClass {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		text-align: right;
	}
</style>