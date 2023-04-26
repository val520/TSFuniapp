
let domain = 'http://192.168.1.124:20009' //何渝都
// let domain = 'http://192.168.1.106:20009' //李鑫
// let domain = 'http://localhost:20009'//本地

module.exports = {
	// 请求域名 格式： https://您的域名
	// #ifdef MP
		HTTP_REQUEST_URL: domain,
	// #endif
	HTTP_ADMIN_URL:'http://192.168.1.106:20008', //PC后台的API请求地址，上传图片用
	// #ifdef H5
		//H5接口是浏览器地址
		// HTTP_REQUEST_URL: window.location.protocol+"//"+window.location.host,
		// http://api.java.crmeb.net:20001
		HTTP_REQUEST_URL:domain,
	// #endif
	BASE_URL:'https://tsf.ccle.cn/tsf', // 公网图片上传
	// BASE_URL:'http://192.168.12.30:8080/jeecg-boot', // 本地图片上传
	// BASE_URL:'http://172.20.10.10:8080/jeecg-boot', // 本地图片上传
	HEADER:{
		'content-type': 'application/json'
	},
	HEADERPARAMS:{
		'content-type': 'application/x-www-form-urlencoded'
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'Authori-zation',
	// 缓存时间 0 永久
	EXPIRE:0,
	//分页最多显示条数
	LIMIT: 10
};
