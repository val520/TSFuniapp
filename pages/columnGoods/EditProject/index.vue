<template>
	<view>
		<view class="box">
			<u--form labelPosition="left" :model="model1" labelWidth="80" :rules="rules" ref="form1">
				<u-form-item label="项目名称" required="true" prop="userInfo.projectName" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.projectName" border="none"></u--input>
				</u-form-item>
				<u-form-item label="项目类型" required="true" prop="userInfo.projTypeId" borderBottom ref="item1">
					<hg-select v-model="model1.userInfo.projTypeId" :localdata="requireSorts" @change="change">
					</hg-select>
				</u-form-item>
				<u-form-item label="联系人" required="true" prop="userInfo.leader" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.leader" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<u-form-item label="手机号" required="true" prop="userInfo.phone" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.phone" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<!-- <u-form-item label="所属机构" prop="userInfo.orgName" borderBottom @click="showTree" ref="item1">
					<u--input v-model="model1.userInfo.orgName" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item> -->
				<u-form-item label="所属机构" required="true" prop="userInfo.orgName" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.orgName" disabled disabledColor="#ffffff" placeholder="请选择"
						border="none"></u--input>
				</u-form-item>
				<u-form-item label="地理位置" required="true" prop="userInfo.remark" borderBottom ref="item1">
					<view class="potion" @click="mapClick">
						<u--input disabled disabledColor="#ffffff" placeholder="请选择" v-model="model1.userInfo.remark"
							border="none"></u--input>
						<u-icon name="map-fill" color="#DCA842" size="28"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="上传附件" required="true" prop="userInfo.fileList" borderBottom ref="item1">
					<u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" name="3" multiple
						:maxCount="3" :previewFullImage="true"></u-upload>
				</u-form-item>
			</u--form>
		</view>
		<view class="btn" @click="onsbment">
			<view>
				确 认
			</view>
		</view>
		<!-- 组织机构选择 -->
		<peng-tree ref="pengTree" :range="range" idKey="id" nameKey="name" allKey="value" :multiple="false"
			:cascade="false" :selectParent="true" :foldAll="false" confirmColor="#DCA842" cancelColor="#DCA842"
			title="组织机构" titleColor="#DCA842" @cancel="treeCancel" @confirm="treeConfirm">
		</peng-tree>
	</view>

</template>
<script>
	import {
		HTTP_ADMIN_URL
	} from '@/config/app.js';
	import {
		BASE_URL
	} from '@/config/app.js'
	import hgSelect from '@/components/uni-data-select/uni-data-select.vue'
	import pengTree from '@/components/peng-tree/peng-tree.vue'
	export default {
		components: {
			hgSelect,
			pengTree
		},
		data: function() {
			return {
				// 表单数据
				model1: {
					userInfo: {
						// 项目名称
						projectName: '',
						// 联系人
						leader: "",
						// 手机号码
						phone: "",
						// 机构id
						orgId: '',
						// 机构名称
						orgName: "",
						// 备注
						remark: "",
						// 项目类型id
						projTypeId: "",
						// 附件id
						attachmentIds: '',
						// 坐标
						position: ""
					},
				},
				// 文件上传列表
				fileList3: [],
				// 组织机构数据
				range: [],
				// 项目类型数据
				requireSorts: [],
				// 校验规则
				rules: {
					'userInfo.projectName': {
						type: 'string',
						required: true,
						message: '请填项目名称',
						trigger: ['blur', 'change']
					},
					'userInfo.leader': {
						type: 'string',
						required: true,
						message: '请填联系人名称',
						trigger: ['blur', 'change']
					},
					'userInfo.phone': [{
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
					'userInfo.remark': {
						type: 'string',
						required: true,
						message: '请选择地理位置',
						trigger: ['blur', 'change']
					},
					'userInfo.projTypeId': {
						type: 'string',
						required: true,
						message: '请选择类型',
						trigger: ['blur', 'change']
					},
					'userInfo.orgname': {
						type: 'string',
						required: true,
						message: '请选择所属机构',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onLoad: function(option) {
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log('编辑信息', item)
				this.model1.userInfo = item
				this.model1.userInfo.attachmentVoList.forEach((res) => {
					res.url = res.interRqUrl
				})
				this.fileList3 = this.model1.userInfo.attachmentVoList
			}
		},
		onShow() {
			if (this.model1.userInfo.remark != '') {
				this.$refs.form1.validateField('userInfo.remark')
			}
			// this.queryTreeList()
			this.projectObjlist()
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form1.setRules(this.rules)
		},
		onPageScroll(e) {

		},
		methods: {
			// 获取项目类型数据
			projectObjlist() {
				let val = {
					pageNo: 1,
					pageSize: 10000
				}
				this.$myRequest({
					url: "/tsf/tsfProjectType/list",
					method: "get",
					data: val
				}).then(res => {
					if (res.data.code === 200) {
						res.data.result.records.forEach((res) => {
							res.value = res.id
							res.text = res.typeName
						})
						this.requireSorts = res.data.result.records

					} else {
						uni.$u.toast(res.data.message)
						this.requireSorts = []
					}
				})
			},
			// 获取组织机构
			queryTreeList() {
				this.$myRequest({
					url: "/sys/sysDepart/queryTreeList",
					method: "get"
				}).then(res => {
					if (res.data.code === 0) {
						this.range = res.data.result
						this.changeId2(this.range, "title", "name");
					} else {
						this.range = []
					}
				})
			},
			// 修改树形结构的键值 把label替换为title
			changeId2(objAry, key, newkey) {
				if (objAry != null) {
					objAry.forEach((item) => {
						Object.assign(item, {
							[newkey]: item[key],
						});
						delete item[key];
						this.changeId2(item.children, key, newkey);
					});
				}
			},
			// 选择类型
			change(e) {
				console.log(e);
				this.$refs.form1.validateField('userInfo.requireSorts')
			},
			// 点击跳转地图
			mapClick() {
				uni.setStorageSync('storage_key', '2')
				uni.navigateTo({
					url: "/pages/columnGoods/lineMap/index"
				})
			},
			// 确认方法
			onsbment() {
				this.$refs.form1.validate().then(res => {
					if (this.fileList3.length === 0) {
						uni.$u.toast('请上传附件')
					} else {
						if(this.fileList3[0].id != undefined){
							let val = []
							// 循环组装图片id
							this.fileList3.forEach((res) => {
								console.log(res);
								val.push(res.id)
							})
							this.model1.userInfo.attachmentIds = val
							this.$myRequest({
								url: "/tsf/tsfBusProject/edit",
								method: "post",
								data: this.model1.userInfo
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
						}else{
							uni.$u.toast('请等待图片上传')
						}
						
					}
				}).catch(errors => {
					uni.$u.toast(errors[0].message)
				})
			},
			// 打开组织机构
			showTree() {
				//打开选择器
				this.$refs.pengTree._show();
				//关闭选择器
				//this.$refs.pengTree._hide();
			},
			treeCancel(e) {
				console.log("你点击了取消")
				console.log(e)
			},
			treeConfirm(e) {
				console.log(e)
				this.model1.userInfo.orgName = e[0].name
				this.model1.userInfo.orgId = e[0].id
				this.$refs.form1.validateField('userInfo.orgName')
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				console.log(event.file[0].name);
				// 判断文件后缀是否为jpg或者png
				let type = event.file[0].url.split('.')
				if (type[1] === 'jpg' || type[1] === 'png' || type[1] === 'JPG' || type[1] === 'PNG') {
					let lists = [].concat(event.file)
					console.log(lists);
					let fileListLen = this[`fileList${event.name}`].length
					lists.map((item) => {
						this[`fileList${event.name}`].push({
							...item,
							status: 'uploading',
							message: '上传中'
						})
					})
					for (let i = 0; i < lists.length; i++) {
						const result = await this.uploadFilePromise(lists[i].url)
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
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: `${BASE_URL}/attachment/tsfAttachment/fileUpload`,
						filePath: url,
						name: 'file',
						header: {
							"X-Access-Token": uni.getStorageSync("X-Access-Token") //token校验
						},
						formData: {
							user: 'test',
							fileType: "1"
						},
						success: (res) => {
							setTimeout(() => {
								resolve(JSON.parse(res.data).result)
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
