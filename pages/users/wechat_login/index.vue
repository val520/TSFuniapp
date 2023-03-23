<template>
	<view class="page">
		<view class="system-height" :style="{height:statusBarHeight}"></view>
		<!-- #ifdef MP -->
		<view class="title-bar" style="height: 43px;">
			<view class="icon" @click="back" v-if="!isHome">
				<image src="../static/left.png"></image>
			</view>
			<view class="icon" @click="home" v-else>
				<image src="../static/home.png"></image>
			</view>
			账户登录
		</view>
		<!-- #endif -->
		<view class="wechat_login">
			<view class="img">
				<image src="../static/wechat_login.png" mode="widthFix"></image>
			</view>
			<view class="btn-wrapper">
				<!-- #ifdef H5 -->
				<button hover-class="none" @click="wechatLogin" class="bg-green btn1">微信登录</button>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<!-- <button hover-class="none" @click="loginwwwwwwwwww" class="bg-green btn1">微信登录</button> -->
				<!-- <button hover-class="none" @open-type="getPhoneNumber" @getphonenumber="WXlogin"  class="bg-green btn1">微信登录</button> -->
				<button style="margin-top:6rpx;background-color: #5AC725;color: #FFF;border: none;" type="success"
					open-type="getPhoneNumber" @getphonenumber="WXlogin">微信手机号快捷登录</button>
				<!-- #endif -->
				<!-- <button hover-class="none" @click="isUp = true" class="btn2">手机号登录</button> -->
			</view>
			<!-- <view>
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" :src="avatarUrl"></image>
				</button>
				<input type="nickname" class="weui-input" placeholder="请输入昵称" v-model="nickName" @blur="onNickName" />
			</view> -->
		</view>
		<block v-if="isUp">
			<mobileLogin :isUp="isUp" @close="maskClose" :authKey="authKey" @wechatPhone="wechatPhone"></mobileLogin>
		</block>
		<block v-if="isPhoneBox">
			<routinePhone :logoUrl="logoUrl" :isPhoneBox="isPhoneBox" @close="bindPhoneClose" :authKey="authKey">
			</routinePhone>
		</block>
	</view>
</template>

<script>
	const app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import mobileLogin from '@/components/login_mobile/index.vue'
	import routinePhone from '@/components/login_mobile/routine_phone.vue'
	import {
		mapGetters
	} from "vuex";
	import {
		getLogo,
		getUserPhone
	} from '@/api/public';
	import {
		LOGO_URL,
		EXPIRES_TIME,
		USER_INFO,
		STATE_R_KEY
	} from '@/config/cache';
	import {
		getUserInfo
	} from '@/api/user.js'
	import Routine from '@/libs/routine';
	import wechat from "@/libs/wechat";
	import {BASE_URL} from '@/config/app.js'
	export default {
		data() {
			return {
				avatarUrl: '', // 头像
				nickName: '', // 昵称
				isUp: false,
				phone: '',
				statusBarHeight: statusBarHeight,
				isHome: false,
				isPhoneBox: false,
				logoUrl: '',
				code: '',
				authKey: '',
				options: '',
				userInfo: {},
				codeNum: 0
			}
		},
		components: {
			mobileLogin,
			routinePhone
		},
		onLoad(options) {

		},
		methods: {
			// onChooseAvatar(e) {
			//   console.log(e);
			//   this.uploadFilePromise(e.detail.avatarUrl)
			// },
			// onNickName(e) {
			// 	this.completeMemberInfo(e.detail.value)
			// },
			// uploadFilePromise(avatarUrl) {
			// 	//调后台接口上传图片  这里的avatarUrl拿到的是微信地址 
			// 	uni.uploadFile({
			// 		url: `${BASE_URL}/attachment/tsfAttachment/fileUpload`,
			// 		filePath: avatarUrl,
			// 		name: 'file',
			// 		header: {
			// 			"X-Access-Token": uni.getStorageSync("X-Access-Token") //token校验
			// 		},
			// 		formData: {
			// 			user: 'test',
			// 			fileType: "1"
			// 		},
			// 		success: (res) => {
			// 			this.completeMemberInfo(JSON.parse(res.data).result)
			// 		}
			// 	});
			// },
			// //接收 avatarUrl / nickName 
			// completeMemberInfo(data) {
			// 	//接收 avatarUrl / nickName 调接口完善头像或者昵称信息
   //              console.log(data);
			// 	this.avatarUrl = data.interRqUrl
			// },
			// 微信登录
			WXlogin(e) {
				console.log(e);
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
								avatar: res.userInfo.avatarUrl
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
										uni.navigateBack({
											delta: 1
										});
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

			},
			back() {
				uni.navigateBack();
			},
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			// 弹窗关闭
			maskClose() {
				this.isUp = false
			},
			bindPhoneClose(data) {
				if (data.isStatus) {
					this.isPhoneBox = false
					this.$util.Tips({
						title: '登录成功',
						icon: 'success'
					}, {
						tab: 3
					})
				} else {
					this.isPhoneBox = false
				}

			},
			// #ifdef MP
			// 小程序获取手机号码
			getphonenumber(e) {
				uni.showLoading({
					title: '正在登录中'
				});
				Routine.getCode()
					.then(code => {
						this.getUserPhoneNumber(e.detail.encryptedData, e.detail.iv, code);
					})
					.catch(error => {
						uni.$emit('closePage', false)
						uni.hideLoading();
					});
			},
			// 小程序获取手机号码回调
			getUserPhoneNumber(encryptedData, iv, code) {
				getUserPhone({
						encryptedData: encryptedData,
						iv: iv,
						code: code,
						type: 'routine',
						key: this.authKey
					})
					.then(res => {
						this.$store.commit('LOGIN', {
							token: res.data.token
						});
						this.$store.commit("SETUID", res.data.uid);
						this.getUserInfo();
						this.$util.Tips({
							title: '登录成功',
							icon: 'success'
						}, {
							tab: 3
						})

					})
					.catch(res => {
						uni.hideLoading();
						that.$util.Tips({
							title: res
						});
					});
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					uni.hideLoading();
					that.userInfo = res.data
					that.$store.commit("UPDATE_USERINFO", res.data);
					that.$util.Tips({
						title: '登录成功',
						icon: 'success'
					}, {
						tab: 3
					})
				});
			},
			getUserProfile(e) {
				console.log(e)
				let self = this;
				uni.showLoading({
					title: '正在登录中'
				});
				Routine.getUserProfile()
					.then(res => {
						Routine.getCode()
							.then(code => {
								self.getWxUser(code, res);
							})
							.catch(res => {
								uni.hideLoading();
							});
					})
					.catch(res => {
						uni.hideLoading();
					});
			},

			getWxUser(code, res) {
				let self = this
				let userInfo = res.userInfo;
				userInfo.code = code;
				userInfo.spread_spid = app.globalData.spid; //获取推广人ID
				userInfo.spread_code = app.globalData.code; //获取推广人分享二维码ID
				userInfo.avatar = userInfo.userInfo.avatarUrl;
				userInfo.city = userInfo.userInfo.city;
				userInfo.country = userInfo.userInfo.country;
				userInfo.nickName = userInfo.userInfo.nickName;
				userInfo.province = userInfo.userInfo.province;
				userInfo.sex = userInfo.userInfo.gender;
				userInfo.type = 'routine'
				Routine.authUserInfo(userInfo.code, userInfo)
					.then(res => {
						self.authKey = res.data.key;
						if (res.data.type === 'register') {
							uni.hideLoading();
							self.isPhoneBox = true
						}
						if (res.data.type === 'login') {
							uni.hideLoading();
							self.$store.commit('LOGIN', {
								token: res.data.token
							});
							self.$store.commit("SETUID", res.data.uid);
							self.getUserInfo();
							self.$util.Tips({
								title: res,
								icon: 'success'
							}, {
								tab: 3
							})
						}
					})
					.catch(res => {
						uni.hideLoading();
						uni.showToast({
							title: res,
							icon: 'none',
							duration: 2000
						});
					});

			},


			// #endif
			// #ifdef H5
			// 获取url后面的参数
			getQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				var q = window.location.pathname.substr(1).match(reg_rewrite);
				if (r != null) {
					return unescape(r[2]);
				} else if (q != null) {
					return unescape(q[2]);
				} else {
					return null;
				}
			},
			// 公众号登录
			wechatLogin() {
				if (!this.code && this.options.scope !== 'snsapi_base') {
					this.$wechat.oAuth('snsapi_userinfo', '/pages/users/wechat_login/index');
				} else {
					// if (this.authKey) {
					// 	this.isUp = true;
					// }
					this.isUp = true;
				}
			},
			// 输入手机号后的回调
			wechatPhone() {
				this.$Cache.clear('snsapiKey');
				if (this.options.back_url) {
					let url = uni.getStorageSync('snRouter');
					url = url.indexOf('/pages/index/index') != -1 ? '/' : url;
					if (url.indexOf('/pages/users/wechat_login/index') !== -1) {
						url = '/';
					}
					if (!url) {
						url = '/pages/index/index';
					}
					this.isUp = false
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					})
					setTimeout(res => {
						location.href = url
					}, 800)
				} else {
					uni.navigateBack()
				}
			}
			// #endif
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
			margin-top: 86rpx;
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
	.avatar-wrapper{
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid red;
	}
</style>
