<template>
	<view>
		<!-- 新建项目 -->
		<view class="box">
			<u--form labelPosition="left" :model="projectInfo" labelWidth="80" :rules="rules" ref="form1">
				<!-- 项目名称 -->
				<u-form-item label="项目名称" required="true" prop="projectId" borderBottom ref="item1">
					<hg-select v-model="projectInfo.projectId" placeholder="请选择" :localdata="requireSorts"
						@change="prjchange">
					</hg-select>
				</u-form-item>
				<u-form-item label="商品品类" required="true" prop="categoryTypeId" borderBottom ref="item1">
					<data-picker placeholder="请选择类型" :map="{text:'name',value:'id'}" popup-title="请选择商品类型"
						clear-icon='false' :localdata="dataTree" v-model="projectInfo.categoryTypeId"
						@change="shopechange">
					</data-picker>
				</u-form-item>
				<u-form-item label="商品类型" required="true" prop="productTypeId" borderBottom ref="item1">
					<hg-select v-model="projectInfo.productTypeId" placeholder="请选择" :localdata="objType"
						@change="shopeType">
					</hg-select>
				</u-form-item>
				<!-- <u-form-item label="地理位置" required="true" prop="address" borderBottom ref="item1">
					<view class="potion" @click="mapClick">
						<u--input disabled disabledColor="#ffffff" v-model="projectInfo.address" border="none"
							placeholder="请选择"></u--input>
						<u-icon @click="mapClick" name="map-fill" color="#DCA842" size="28"></u-icon>
					</view>
				</u-form-item> -->
				<u-form-item label="购买审核" required="true" prop="isBuyCheck" borderBottom ref="item1">
					<u-radio-group v-model="projectInfo.isBuyCheck" iconPlacement="right" placement="row">
						<u-radio activeColor="#DCA842" :customStyle="{marginLeft: '8px'}"
							v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.label"
							@change="radioChange">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<!-- <u-form-item label="支付审核" required="true" prop="cashCheck" borderBottom ref="item1">
					<u-radio-group v-model="projectInfo.cashCheck" iconPlacement="right" placement="row">
						<u-radio activeColor="#DCA842" :customStyle="{marginLeft: '8px'}"
							v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.label"
							@change="payChange">
						</u-radio>
					</u-radio-group>
				</u-form-item> -->
				<u-gap height="1" bgColor="#DCA842"></u-gap>
				<u-form-item label="商品名称" required="true" prop="productName" borderBottom ref="item1">
					<u--input v-model="projectInfo.productName" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<u-form-item label="商品描述" required="true" prop="remark" borderBottom ref="item1">
					<u--input v-model="projectInfo.remark" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<u-form-item label="商品库存" required="true" prop="totalAmount" borderBottom ref="item1">
					<u-row justify="space-between" gutter="10">
						<u-col span="6">
							<u--input v-model="projectInfo.totalAmount" type="number" border="none"
								placeholder="请输入商品库存">
							</u--input>
						</u-col>
						<u-col span="3">
							<view @click="unit"
								style="color: #666;font-size: 30rpx;display: flex;justify-content: center;align-items: center;">
								{{unitValue}}
								<u-icon name="arrow-right" color="#DCA842" size="20"></u-icon>
							</view>
						</u-col>
					</u-row>

				</u-form-item>
				<u-form-item label="商品售价" required="true" prop="sellPrice" borderBottom ref="item1">
					<u--input v-model="projectInfo.sellPrice" type="number" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<u-gap height="1" bgColor="#DCA842"></u-gap>
				<!-- <u-form-item label="上架时间" required="true" prop="onShelfTime" borderBottom ref="item1">
					<time-picker v-model="projectInfo.onShelfTime" @change="uptimelist" type="datetime" />
				</u-form-item> -->
				<u-form-item label="交易时间" required="true" prop="time" borderBottom ref="item1">
					<time-picker v-model="projectInfo.time" @change="timelist" type="datetimerange"
						rangeSeparator="至" />
				</u-form-item>
				<!-- <u-form-item label="下架时间" prop="downtime" borderBottom ref="item1">
					<time-picker v-model="projectInfo.downtime" @change="downtimelist" type="datetime" />
				</u-form-item> -->
				<u-gap height="1" bgColor="#DCA842"></u-gap>
				<u-form-item label="封面图片" required="true" prop="coverImg" borderBottom ref="item1">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" name="2" multiple
						:maxCount="1" :previewFullImage="true"></u-upload>
				</u-form-item>
				<u-form-item label="轮播图片" required="true" prop="RotationImg" borderBottom ref="item1">
					<u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" name="3" multiple
						:maxCount="3" :previewFullImage="true"></u-upload>
				</u-form-item>
				<u-form-item label="详情图片" required="true" prop="detailsImg" borderBottom ref="item1">
					<u-upload :fileList="fileList4" @afterRead="afterRead" @delete="deletePic" name="4" multiple
						:maxCount="3" :previewFullImage="true"></u-upload>
				</u-form-item>
			</u--form>
		</view>
		<view class="btn" @click="onsbment">
			<view>
				确 认
			</view>
		</view>
		<!-- 选择商品单位弹窗 -->
		<u-picker :show="unitshow" :columns="unitcolumns" :defaultIndex='unitArry' closeOnClickOverlay='true'
			@confirm="unitfirm" @cancel="unitclose" @close="unitclose" keyName="name"></u-picker>
	</view>
</template>
<script>
	// 下拉选择组件
	import hgSelect from '@/components/uni-data-select/uni-data-select.vue'
	// 时间选择组件
	import timePicker from '@/components/uni-datetime-picker/uni-datetime-picker.vue'
	// 级联选择器
	import dataPicker from '@/components/uni-data-picker/components/uni-data-picker/uni-data-picker.vue'
	import {
		BASE_URL
	} from '@/config/app.js'
	export default {
		components: {
			hgSelect,
			timePicker,
			dataPicker
		},
		data: function() {
			return {
				isnum: true,
				//默认回显
				unitArry: [0],
				unitshow: false,
				//发布商品信息数据
				projectInfo: {
					// 所属项目名称
					projectId: "",
					// 商品品类
					categoryTypeId: "",
					// 商品类型	
					productTypeId: "",
					// 商品经纬度位置
					position: "",
					// 商品位置描述
					address: "",
					// 是否需要购买审核
					isBuyCheck: "",
					// 是否需要支付审核
					paycheck: "",
					// 商品名称
					productName: "",
					// 商品库存
					totalAmount: "",
					// 商品单位
					unitId: '',
					//  商品描述
					remark: "",
					// 商品售价
					sellPrice: "",
					// 上架时间
					onShelfTime: "",
					// // 商品交易时间
					time: [],
					//开始时间
					sellTimeStart: "",
					//结束时间
					selllTimeEnd: "",
					// 封面图片
					coverImg: "",
					// 轮播图片
					RotationImg: "",
					// 详情图片
					detailsImg: ""
				},
				// 封面图
				fileList2: [],
				// 轮播图
				fileList3: [],
				// 详情图
				fileList4: [],
				//单位数据
				unitcolumns: [],
				unitValue: 'm³',
				// 项目数据
				requireSorts: [],
				// 判断图片是否上传完成
				imgUp: false,
				// 购票审核数据
				radiolist1: [{
					label: 0,
					name: "否"
				}, {
					label: 1,
					name: "是"
				}, ],
				// 物流具体类型数据
				objType: [],
				// 商品类型数据
				dataTree: [],
				// 表单检验规则
				rules: {
					'productName': {
						type: 'string',
						required: true,
						message: '请填写商品名称',
						trigger: ['blur', 'change']
					},
					'remark': {
						type: 'string',
						required: true,
						message: '请填写商品描述',
						trigger: ['blur', 'change']
					},
					'totalAmount': {
						type: 'number',
						required: true,
						message: '请填写商品库存',
						trigger: ['blur', 'change']
					},
					'productTypeId': {
						type: 'string',
						required: true,
						message: '请选择物流类型',
						trigger: ['blur', 'change']
					},
					'comm_DW': {
						type: 'string',
						required: true,
						message: '请填写商品单位',
						trigger: ['blur', 'change']
					},
					'time': {
						type: 'array',
						required: true,
						message: '请选择交易时间',
						trigger: ['blur', 'change']
					},
					'onShelfTime': {
						type: 'string',
						required: true,
						message: '请选择上架时间',
						trigger: ['blur', 'change']
					},
					'downtime': {
						type: 'string',
						required: true,
						message: '请选择下架时间',
						trigger: ['blur', 'change']
					},
					'sellPrice': {
						type: 'number',
						required: true,
						message: '请填写商品售价',
						trigger: ['blur', 'change']
					},
					'coverImg': {
						type: 'string',
						required: true,
						message: '请上传封面图片',
						trigger: ['blur', 'change']
					},
					'RotationImg': {
						type: 'array',
						required: true,
						message: '请上传轮播图片',
						trigger: ['blur', 'change']
					},
					'detailsImg': {
						type: 'array',
						required: true,
						message: '请上传详情图片',
						trigger: ['blur', 'change']
					},
					'projectId': {
						type: 'string',
						required: true,
						message: '请选择项目',
						trigger: ['blur', 'change']
					},
					'categoryTypeId': {
						type: 'string',
						required: true,
						message: '请选择类型',
						trigger: ['blur', 'change']
					},
					'isBuyCheck': {
						type: 'number',
						required: true,
						message: '请选择是否需要审核',
						trigger: ['blur', 'change']
					},
					'cashCheck': {
						type: 'number',
						required: true,
						message: '请选择是否需要审核',
						trigger: ['blur', 'change']
					},
				}
			}
		},
		onLoad: function(option) {
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log('编辑信息', item)
				this.projectInfo = item
				// this.$nextTick(() => {
				this.projectInfo.categoryTypeId = item.categoryTypeId
				//回显单位
				this.unitValue = item.unitDictItem.itemValue
				this.projectInfo.time = [item.sellTimeStart, item.selllTimeEnd]
				this.projectInfo.coverAttIds.forEach((res) => {
					res.url = res.interRqUrl
				})
				this.fileList2 = this.projectInfo.coverAttIds
				this.projectInfo.coverImg = this.fileList2[0].id
				this.$refs.form1.validateField("coverImg")
				this.projectInfo.slideAttIds.forEach((res) => {
					res.url = res.interRqUrl
				})
				this.fileList3 = this.projectInfo.slideAttIds
				this.projectInfo.RotationImg = this.fileList3
				this.$refs.form1.validateField("RotationImg")
				this.projectInfo.detailAttIds.forEach((res) => {
					res.url = res.interRqUrl
				})
				this.fileList4 = this.projectInfo.detailAttIds
				this.projectInfo.detailsImg = this.fileList4
				this.$refs.form1.validateField("detailsImg")
				this.imgUp = true
				// })

			}
		},
		onShow() {
			this.projectData()
			this.shoneType()
			this.shonping()
			this.unitlist()
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form1.setRules(this.rules)
		},
		onPageScroll(e) {

		},
		methods: {
			//选择单位
			unit() {
				this.unitshow = true
			},
			//关闭弹窗
			unitclose() {
				this.unitshow = false
			},
			//选择商品单位确认
			unitfirm(e) {
				console.log(e);
				this.unitValue = e.value[0].value
				this.projectInfo.unitId = e.value[0].id
				this.unitshow = false
			},
			// 获取库存单位数据
			unitlist() {
				let val = {
					dictId: '1638779386059649025',
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
							res.value = res.itemValue
						})
						this.unitcolumns[0] = res.data.result.records

					} else {
						uni.$u.toast(res.data.message)
						this.unitcolumns[0] = []
					}
				})
			},
			// 获取商品具体分类
			shonping(e) {
				let val = {
					pageNo: 1,
					pageSize: 99999
				}
				this.$myRequest({
					url: "/tsf/tsfCommodityType/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						res.data.result.records.forEach((res) => {
							res.value = res.id
							res.text = res.typeName
						})
						this.objType = res.data.result.records
					} else {
						this.objType = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 获取商品类型
			shoneType() {
				let val = {
					pageNo: 1,
					pageSize: 99999
				}
				this.$myRequest({
					url: "/tsf/tsfBusCategory/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.dataTree = res.data.result.records
					} else {
						this.dataTree = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			//获取审核通过的项目
			projectData() {
				let val = {
					pageNo: 1,
					pageSize: 99999
				}
				this.$myRequest({
					// url: "/tsf/tsfBusProject/wxList",
					url: "/tsf/tsfBusProject/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						this.requireSorts = []
						res.data.result.records.forEach((obj) => {
							if (obj.projectStatus === 1) {
								obj.text = obj.projectName
								obj.value = obj.id
								this.requireSorts.push(obj)
							}
						});
					} else {
						this.requireSorts = []
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 选择是否需要购买审核触发
			radioChange(e) {
				console.log(e);
			},
			// 选择是否需要支付审核触发
			payChange(e) {
				console.log(e);
			},
			// 选择项目触发
			prjchange(e) {
				console.log(e);
				// 通过项目id匹配得出项目坐标
				this.requireSorts.forEach((res) => {
					if (res.id === e) {
						this.projectInfo.position = res.position
						this.projectInfo.address = res.remark
						this.projectInfo.orgId = res.orgId
					}
				})
				this.$refs.form1.validateField('projectId')
			},
			// 选择商品类型触发
			shopechange(e) {
				console.log(e);
				// 存取数组最后一位ID
				this.projectInfo.categoryTypeId = e.detail.value[e.detail.value.length - 1].value
				this.$refs.form1.validateField('categoryTypeId')
			},
			// 选择物流类型触发
			shopeType(e) {
				console.log(e);
			},
			// 选择上架时间触发
			uptimelist(e) {
				console.log(e);
				this.$refs.form1.validateField('onShelfTime')
			},
			// 选择交易时间触发
			timelist(e) {
				console.log(e);
				this.projectInfo.sellTimeStart = e[0]
				this.projectInfo.selllTimeEnd = e[1]
				this.$refs.form1.validateField('time')
			},
			// 选择下架时间触发
			downtimelist(e) {
				this.$refs.form1.validateField('downtime')
			},
			// 点击跳转地图
			mapClick() {
				uni.$u.toast('打开地图')
				uni.setStorageSync('storage_key', '3')
				uni.navigateTo({
					url: "/pages/columnGoods/lineMap/index"
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
							this.projectInfo.coverAttIds = val
							let val2 = []
							// 循环组装轮播图片id
							this.fileList3.forEach((res) => {
								val2.push(res.id)
							})
							this.projectInfo.slideAttIds = val2
							let val3 = []
							// 循环组装详情图片id
							this.fileList4.forEach((res) => {
								val3.push(res.id)
							})
							this.projectInfo.detailAttIds = val3
							//赋值单位id
							this.unitcolumns[0].forEach((res) => {
								if (this.unitValue === res.value) {
									this.projectInfo.unitId = res.id
								}
							})
							this.$myRequest({
								url: "/tsf/tsfBusCommodity/edit",
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
							uni.$u.toast('等待图片上传')
						}
					} else {
						uni.$u.toast('加载中')
					}
				}).catch(errors => {
					uni.$u.toast(errors[0].message)
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				if (event.name === "2") {
					//封面图片
					this.projectInfo.coverImg = ''
				}
				console.log(this[`fileList${event.name}`]);
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
					console.log(this.fileList2);
					console.log(this.fileList3);
					console.log(this.fileList4);
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
		padding: 20rpx;
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