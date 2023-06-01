<template>
	<view>
		<!-- 运输发布 -->
		<view class="box">
			<u--form labelPosition="left" :model="projectInfo" labelWidth="80" :rules="rules" ref="form1">
				<u-form-item label="所属机构" required="true" prop="orgName" borderBottom ref="item1">
					<u--input v-model="projectInfo.orgName" disabled border="none" placeholder="请输入机构名称"></u--input>
				</u-form-item>
				<u-form-item label="机械类型" required="true" prop="categoryTypeId" borderBottom ref="item1">
					<!-- <u--input v-model="projectInfo.categoryTypeId" border="none" placeholder="请选择机械类型"></u--input> -->
					<hg-select v-model="projectInfo.categoryTypeId" :localdata="requireSorts" @change="change">
					</hg-select>
				</u-form-item>
				<u-form-item label="机械名称" required="true" prop="machineName" borderBottom ref="item1">
					<u--input v-model="projectInfo.machineName" border="none" placeholder="请输入机械名称"></u--input>
				</u-form-item>
				<u-form-item label="机械描述" required="true" prop="remark" borderBottom ref="item1">
					<u--input v-model="projectInfo.remark" border="none" placeholder="请输入机械描述"></u--input>
				</u-form-item>
				<u-form-item label="机械数量" required="true" prop="totalAmount" borderBottom ref="item1">
					<u--input v-model="projectInfo.totalAmount" type="number" border="none" placeholder="请输入机械数量">
					</u--input>
				</u-form-item>
				<u-form-item label="是否认证" required="true" prop="authFlag" borderBottom ref="item1">
					<hg-select v-model="projectInfo.authFlag" :localdata="looktype" @change="changelook">
					</hg-select>
				</u-form-item>
				<u-form-item label="联系方式" required="true" prop="contactPhone" borderBottom ref="item1">
					<u--input v-model="projectInfo.contactPhone" maxlength="11" type="number" border="none" placeholder="请输入手机号码">
					</u--input>
				</u-form-item>
				<u-gap height="1" bgColor="#DCA842"></u-gap>
				<u-form-item label="机械图片" required="true" prop="coverImg" borderBottom ref="item1">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" name="2" multiple
						:maxCount="1" :previewFullImage="true"></u-upload>
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
	import hgSelect from '@/components/uni-data-select/uni-data-select.vue'
	import {
		BASE_URL
	} from '@/config/app.js'
	export default {
		components: {
			hgSelect
		},
		data: function() {
			return {
				isnum: true,
				//发布商品信息数据
				projectInfo: {
					// 所属项目id
					orgId: "",
					//机械名称
					machineName: "",
					//是否认证
					authFlag:'',
					// 机械类型
					categoryTypeId: "",
					// 机械库存
					totalAmount: "",
					//联系方式
					contactPhone: "",
					//  机械描述
					remark: "",
					// 封面图片
					coverImg: "",
				},
				// 封面图
				fileList2: [],
				looktype: [{
					value: 0,
					text: "是"
				}, {
					value: 1,
					text: "否"
				}, ],
				// 机械类型数据
				requireSorts: [],
				//判断图片是否上传完成
				imgUp: false,
				// 表单检验规则
				rules: {
					'orgName': {
						type: 'string',
						required: true,
						message: '请填写公司名称',
						trigger: ['blur', 'change']
					},
					'remark': {
						type: 'string',
						required: true,
						message: '请填写机械描述',
						trigger: ['blur', 'change']
					},
					'authFlag': {
						type: 'number',
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					},
					'contactPhone': [{
							required: true,
							message: '请输入手机号',
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
					'machineName': {
						type: 'string',
						required: true,
						message: '请填写机械名称',
						trigger: ['blur', 'change']
					},
					'totalAmount': {
						type: 'number',
						required: true,
						message: '请填写机械数量',
						trigger: ['blur', 'change']
					},
					'categoryTypeId': {
						type: 'string',
						required: true,
						message: '请选择机械类型',
						trigger: ['blur', 'change']
					},

					'coverImg': {
						type: 'string',
						required: true,
						message: '请上传封面图片',
						trigger: ['blur', 'change']
					}
				}
			}
		},
		onLoad: function(option) {
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log('编辑信息', item)
				this.projectInfo = item
				this.projectInfo.coverImg = item.attUrl
				this.fileList2 = [{
					status: 'success',
					message: '',
					url: item.attUrl,
					id: item.coverAttIds
				}]
				this.imgUp = true
			}
		},
		onShow() {
			this.unitlist()
			//默认匹配当前用户的组织机构
			// this.projectInfo.orgname = uni.getStorageSync("userInfo").orgCodeTxt
			// this.projectInfo.orgId = uni.getStorageSync("userInfo").departIds
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form1.setRules(this.rules)
		},
		onPageScroll(e) {

		},
		methods: {
			// 选择机械类型
			change(e) {
				console.log(e);
				this.$refs.form1.validateField('projectInfo.categoryTypeId')
			},
			changelook(e) {
				console.log(e);
				this.$refs.form1.validateField('projectInfo.authFlag')
			},
			// 获取机械类型数据
			unitlist() {
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
							res.text = res.itemText
							res.value = res.id
						})
						this.requireSorts = res.data.result.records
					} else {
						uni.$u.toast(res.data.message)
						this.requireSorts = []
					}
				})
			},
			// 点击确认
			onsbment() {
				this.$refs.form1.validate().then(res => {
					if (this.isnum) {
						if (this.imgUp) {
							this.isnum = false
							let val = []
							// 循环组装封面图片id
							this.fileList2.forEach((res) => {
								val.push(res.id)
							})
							this.projectInfo.coverAttIds = val[0]
							this.$myRequest({
								url: "/machine/edit",
								method: "post",
								data: this.projectInfo
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
									this.isnum = true
									uni.$u.toast(res.data.message)
								}
							})
						} else {
							uni.$u.toast('请等待图片上传')
						}
					} else {
						uni.$u.toast('加载中')
					}

				}).catch(errors => {
					uni.$u.toast(errors[0].message)
					console.log(this.projectInfo);
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				if (event.name === "2") {
					//封面图片
					this.projectInfo.coverImg = ''
				} else if (event.name === "3") {
					// 轮播图片
					this.projectInfo.RotationImg = this[`fileList${event.name}`]
				} else {
					// 详情图片
					this.projectInfo.detailsImg = this[`fileList${event.name}`]
				}
			},
			// 新增图片
			async afterRead(event) {
				console.log(event);
				this.imgUp = false
				// 判断文件后缀是否为jpg或者png
				let type = event.file[0].url.split('.')
				if (type[1] === 'jpg' || type[1] === 'png' || type[1] === 'JPG' || type[1] === 'PNG') {
					if (event.name === "2") {
						//封面图片
						this.projectInfo.coverImg = event.file[0].url
						this.$refs.form1.validateField("coverImg")
					} else if (event.name === "3") {
						// 轮播图片
						this.projectInfo.RotationImg = event.file
						this.$refs.form1.validateField("RotationImg")
					} else {
						// 详情图片
						this.projectInfo.detailsImg = event.file
						this.$refs.form1.validateField("detailsImg")
					}
					let lists = [].concat(event.file)
					let fileListLen = this[`fileList${event.name}`].length
					lists.map((item) => {
						this[`fileList${event.name}`].push({
							...item,
							status: 'uploading',
							message: '上传中'
						})
					})
					for (let i = 0; i < lists.length; i++) {
						const result = await this.uploadFilePromise(lists[i].url, event.name)
						console.log(result)
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.interRqUrl,
							id: result.id
						}))
						fileListLen++
					}
				} else {
					uni.$u.toast('请上传png或者jpg图片')
				}
			},
			uploadFilePromise(urls, num) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: `${BASE_URL}/attachment/tsfAttachment/fileUpload`,
						filePath: urls,
						name: 'file',
						header: {
							"X-Access-Token": uni.getStorageSync("X-Access-Token") //token校验
						},
						formData: {
							user: 'test',
							fileType: num
						},
						success: (res) => {
							setTimeout(() => {
								resolve(JSON.parse(res.data).result)
								this.imgUp = true
							}, 1000)
						}
					});
				})
			},

		},
		onReachBottom() {

		}
	};
</script>
<style lang="scss" scoped>
	.box {
		background-color: #FFF;
		margin: 20rpx;
		padding: 20rpx 30rpx 20rpx 35rpx;
		overflow: hidden;
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