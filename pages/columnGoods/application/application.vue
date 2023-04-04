<template>
	<view>
		<view class="box">
			<u--form labelPosition="left" :model="userInfo" labelWidth="100" :rules="rules" ref="form1">
				<u-form-item label="可申请总方量" borderBottom ref="item1">
					<u--input v-model="userInfo.userall" disabled disabledColor="#ffffff" border="none"></u--input>
				</u-form-item>
				<u-form-item label="运输人员" required="true" prop="driver" borderBottom ref="item1">
					<u--input v-model="userInfo.driver" border="none" placeholder="请输入人员姓名"></u--input>
				</u-form-item>
				<u-form-item label="联系电话" required="true" prop="telephone" borderBottom ref="item1">
					<u--input type='number' v-model="userInfo.telephone" border="none" placeholder="请输入联系电话"></u--input>
				</u-form-item>
				<u-form-item label="申请张数" required="true" prop="applyNumber" borderBottom ref="item1">
					<u--input @change="alldata" type='number' v-model="userInfo.applyNumber" border="none"
						placeholder="请输入申请张数">
					</u--input>
				</u-form-item>
				<!-- <u-form-item label="车载重量" prop="carLoad" borderBottom ref="item1">
					<u--input v-model="userInfo.carLoad" border="none" placeholder="请输入车载重量"></u--input>
				</u-form-item> -->
				<u-form-item label="单次运量" required="true" prop="applyEarth" borderBottom ref="item1">
					<u--input @change="alldata" v-model="userInfo.applyEarth" border="none" placeholder="请输入单次运量">
					</u--input>
				</u-form-item>
				<u-form-item label="申请总方量" borderBottom ref="item1">
					<u--input v-model="userInfo.all" disabled disabledColor="#ffffff" border="none"></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="btn" @click="onsbment">
			<view>
				确 认
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data: function() {
			return {
				// 表单数据
				userInfo: {
					// 申请数量
					applyNumber: '',
					userall: "",
					// 车载重量
					carLoad: '',
					// 司机名称
					driver: "",
					// 土石方量
					earthTotal: '',
					// 联系电话
					telephone: "",
					//外键id
					ticketId: ""
				},
				// 校验规则
				rules: {
					'driver': {
						type: 'string',
						required: true,
						message: '请填运输人员',
						trigger: ['blur', 'change']
					},
					'applyNumber': {
						type: 'string',
						required: true,
						message: '请填申请数量',
						trigger: ['blur', 'change']
					},
					'carLoad': {
						type: 'string',
						required: true,
						message: '请填车载重量',
						trigger: ['blur', 'change']
					},
					'applyEarth': {
						type: 'string',
						required: true,
						message: '请填土石方量',
						trigger: ['blur', 'change']
					},
					'telephone': [{
							required: true,
							message: '请输入联系电话',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								console.log(value);
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],

				},
			}
		},
		onLoad: function(option) {
			console.log(option);
			if (option.foo != undefined) {
				this.userInfo.ticketId = option.foo
				this.rootuser()
			}
		},
		onShow() {

		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form1.setRules(this.rules)
		},
		onPageScroll(e) {

		},
		methods: {
			// 查询可用余量
			rootuser() {
				let val = {
					"id": this.userInfo.ticketId
				}
				this.$myRequest({
					url: "/tsf/tsfEarthTicket/getTicketEarthNotApply",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res.data);
						this.userInfo.userall = res.data.result
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			// 计算总量
			alldata() {
				let val = this.userInfo.applyNumber * this.userInfo.applyEarth
				this.userInfo.all = val.toFixed(1) ==="NaN" ? '' : val.toFixed(1)
			},
			// 确认方法
			onsbment() {
				this.$refs.form1.validate().then(res => {
					this.$myRequest({
						url: "/src/tsfBusTransport/add",
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
				}).catch(errors => {
					uni.$u.toast(errors[0].message)
				})
			}
		},
		onReachBottom() {

		}
	};
</script>
<style lang="scss" scoped>
	.box {
		background-color: #FFF;
		margin: 20rpx;
		padding: 20rpx;
		box-shadow: 0 0 12rpx #d7d7d7;
		border-radius: 10rpx;
	}

	.potion {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn {
		box-shadow: 0 0 12rpx #d7d7d7;
		background: #DCA842;
		margin: 30rpx;
		border-radius: 10rpx;
		padding: 30rpx;
		text-align: center;
		color: #FFF;
		font-weight: bold;
	}
</style>