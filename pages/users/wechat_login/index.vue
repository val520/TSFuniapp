<template>
	<view class="page">
		<view class="system-height" :style="{height:statusBarHeight}"></view>
		<view class="title-bar" style="height: 43px;">
			<view class="icon" @click="back" v-if="!isHome">
				<image src="../static/left.png"></image>
			</view>
			<view class="icon" @click="home" v-else>
				<image src="../static/home.png"></image>
			</view>
			账户登录
		</view>
		<view class="wechat_login">
			<view class="img">
				<image src="../static/wechat_login.png" mode="widthFix"></image>
			</view>
			<!-- 获取微信用户名 -->
			<!-- <view class="userinfo">
			
				<input type="nickname" @blur='nicknameValue' v-model="nickName" class="weui-input"
					placeholder="点击授权微信昵称" placeholder-style="color:#00aaff" />
			</view> -->
			<view class="btn-wrapper">
				<view style="justify-content: center;align-items: center;display: flex;margin-bottom: 30rpx;">
					<u-checkbox-group @change="agree">
						<u-checkbox activeColor="#5AC725" :checked="checked" label=" "></u-checkbox>
					</u-checkbox-group>
					<view style="color: #00aaff;" @click="usershow = true">
						我同意用户使用协议
					</view>
				</view>
				<button v-if="checked" style="margin-top:6rpx;background-color: #5AC725;color: #FFF;border: none;"
					type="success" open-type="getPhoneNumber" @getphonenumber="WXlogin">微信手机号快捷登录</button>
				<button v-else style="margin-top:6rpx;background-color: #999;color: #FFF;border: none;" type="success"
					@click="WXlogin">微信手机号快捷登录</button>
			</view>

			<!-- 协议弹窗 -->
			<u-popup :show="usershow" @close="userclose" closeOnClickOverlay safeAreaInsetTop="true" round="10">
				<view style="margin: 0rpx 20rpx 20rpx 20rpx;color: #999;">
					<view style="font-weight: bold;color: #000;text-align: center;font-size: 40rpx;">
						重庆渝土方小程序用户使用协议
					</view>
					<view style="margin: 10rpx;color: #666;text-align: center;">
						一：重要提示
					</view>
					<text decode>{{onetxt}}</text>
					<view style="margin: 10rpx;color: #666;text-align: center;">
						二：用户协议
					</view>
					<text decode>{{twotxt}}</text>
					<view class="btnok" @click="agreeok">
						同意并勾选
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';

	export default {
		data() {
			return {
				onetxt: '用户可以从官方途径(即腾讯微信客户端)获取本软件。如果用户从末经官方途径授权的第三方获取本软件或与本软件名称相同的安装程序，重庆渝土方小程序无法保证该软件能够正常使用，并对因此给用户造成的损失不予负责。',
				twotxt: '用户在使用重庆渝土方小程序前需要绑定用户的微信账号。获取微信号的目的是为了获取本人的手机号作为登录账号，请用户在注册时详尽、准确地提供个人资料，并不断更新注册资料。因注册信息不真实而引起的问题，由用户自行承担相应的后果',
				usershow: false,
				avatarUrl: '', // 头像
				nickName: '', // 昵称
				isUp: false,
				phone: '',
				statusBarHeight: statusBarHeight,
				isHome: true,
				isPhoneBox: false,
				logoUrl: '',
				code: '',
				authKey: '',
				options: '',
				userInfo: {},
				codeNum: 0,
				//是否勾选用户使用协议
				checked: false,
			}
		},
		onLoad(options) {

		},
		methods: {
			//获取头像
			onChooseAvatar(e) {
				console.log(e);
				this.avatarUrl = e.detail.avatarUrl
			},
			//赋值用户名
			nicknameValue(e) {
				console.log(e.detail);
				this.nickName = e.detail.value
			},
			back() {
				// console.log(getCurrentPages(), "有几个页面");
				// let page = getCurrentPages()
				uni.navigateBack();
			},
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},

			//勾选改变状态
			agree(e) {
				if (e.length === 0) {
					this.checked = false
				} else {
					this.checked = true
				}
			},
			agreeok() {
				this.checked = true
				this.usershow = false
			},
			// 关闭弹窗
			userclose() {
				this.usershow = false
			},
			// 微信登录
			WXlogin(e) {
				// if (this.nickName === '') {
				// 	uni.$u.toast('请授权用户名')
				// } else {
					if (this.checked) {
						let that = this
						// 获取code
						let code = e.detail.code
						// 获取微信ID
						let wxid = e.detail.cloudID
						// 获取用户头像
						uni.getUserInfo({
							provider: 'weixin',
							success: function(res) {
								console.log('用户信息111', res);
								if (e.detail.errMsg === 'getPhoneNumber:ok') {
									uni.showLoading({
										title: '登录中',
									});
									let params = {
										code: code,
										wxId: wxid,
										avatar: res.userInfo.avatarUrl,
										wxNickName: that.nickName
									}
									that.$myRequest({
										url: "/thirdWxLogin/weixinLogin",
										method: "post",
										data: params
									}).then(res => {
										if (res.data.code === 200) {
											//存取个人token
											uni.setStorageSync("X-Access-Token", res
												.data.result.token)
											// 存取用户信息
											uni.setStorageSync("userInfo", res.data.result.userInfo)
											uni.showLoading({
												title: '登录成功',
											});
											setTimeout(() => {
												// 返回上一页 delta返回的页面数 如果delta大于现有页面数，则返回首页
												// uni.navigateBack({
												// 	delta: 1
												// });
												uni.switchTab({
													url: '/pages/user/index'
												})
											}, 1000);
											//隐藏加载框
											uni.hideLoading();
										} else {
											uni.showToast({
												title: res.data.message,
												icon: "none"
											})
											//隐藏加载框
											uni.hideLoading();
										}
									})
								}
							}
						});

					} else {
						uni.$u.toast('请勾选用户协议')
					}
				// }
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}

	.page {
		background: #fff;
		height: 100%;
	}

	.wechat_login {
		padding: 72rpx 34rpx;

		.img image {
			width: 100%;
		}

		.btn-wrapper {
			// margin-top: 86rpx;
			margin-top: 30rpx;
			padding: 0 66rpx;

			button {
				width: 100%;
				height: 86rpx;
				line-height: 86rpx;
				margin-bottom: 40rpx;
				border-radius: 120rpx;
				font-size: 30rpx;

				&.btn1 {
					color: #fff;
				}

				&.btn2 {
					color: #666666;
					border: 1px solid #666666;
				}
			}
		}
	}

	.title-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
	}

	.icon {
		position: absolute;
		left: 30rpx;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 86rpx;
		height: 86rpx;

		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.avatar-wrapper {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 20rpx;
		border: 1px solid #999;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #999;
		color: #666;
	}

	.userinfo {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	.btnok {
		margin-top: 50rpx;
		text-align: center;
		background: #5AC725;
		border-radius: 20rpx;
		padding: 20rpx;
		color: #FFF;
		font-weight: bold;
	}
</style>