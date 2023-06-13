// const BASE_URL = 'http://192.168.12.30:8080/jeecg-boot'// 何渝都
// const BASE_URL = 'https://tsf.ccle.cn/testTsf'// 测试环境
const BASE_URL = 'https://tsf.ccle.cn/tsf' // 公网地址
export const myRequest = (options) => {
	const header_tmp = {
		"X-Access-Token": uni.getStorageSync("X-Access-Token") || '',
		"Content-Type": options.Type || 'application/json'
	};
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中'
		});
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header_tmp,
			success: (res) => {
				//隐藏加载框
				uni.hideLoading();
				if (res.data.message === 'Token失效，请重新登录') {
					uni.showToast({
						title: "Token失效，请重新登录",
						icon: "none"
					})
					setTimeout(function() {
						uni.navigateTo({
							url: '/pages/users/wechat_login/index'
						})
					}, 1000);
				} else {
					if (res.statusCode !== 200 && res.statusCode !== 201) {
						return uni.showToast({
							title: "请求失败",
							icon: "none"
						})
					};
				}
				resolve(res)
			},
			fail: (err) => {
				return uni.showToast({
					title: "请求接口失败",
					icon: "none"
				})
				reject(err)
			},


		})
	})

}
