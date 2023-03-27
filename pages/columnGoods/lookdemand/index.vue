<template>
	<view>
		<!-- 新建项目 -->
		<view class="box">
			<u--form labelPosition="left" :model="projectInfo" labelWidth="80" ref="form1">
				<u-form-item label="发布人员" borderBottom ref="item1">
					<u--input v-model="projectInfo.createBy" disabled disabledColor="#ffffff" border="none"
						placeholder="请输入"></u--input>
				</u-form-item>
				<!-- 项目名称 -->
				<u-form-item label="项目名称" borderBottom ref="item1">
					<hg-select v-model="projectInfo.projectId" disabled placeholder="请选择" :localdata="requireSorts"
						@change="prjchange">
					</hg-select>
				</u-form-item>
				<u-form-item label="商品品类"  borderBottom ref="item1">
					<data-picker placeholder="请选择类型" disabled :map="{text:'name',value:'id'}" popup-title="请选择商品类型"
						clear-icon='false' :localdata="dataTree" v-model="projectInfo.categoryTypeId"
						@change="shopechange">
					</data-picker>
				</u-form-item>
				<u-form-item label="商品类型"  borderBottom ref="item1">
					<hg-select v-model="projectInfo.productTypeId" disabled placeholder="请选择" :localdata="objType"
						@change="shopeType">
					</hg-select>
				</u-form-item>
				<!-- <u-form-item label="地理位置"  borderBottom ref="item1">
					<view class="potion">
						<u--input disabled disabledColor="#ffffff" v-model="projectInfo.address" border="none"
							placeholder="请选择"></u--input>
					</view>
				</u-form-item> -->
				<u-form-item label="购买审核"  borderBottom ref="item1">
					<u-radio-group v-model="projectInfo.isBuyCheck" disabled iconPlacement="right" placement="row">
						<u-radio activeColor="#DCA842" :customStyle="{marginLeft: '8px'}"
							v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.label"
							@change="radioChange">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<!-- <u-form-item label="支付审核" borderBottom ref="item1">
					<u-radio-group v-model="projectInfo.cashCheck" disabled iconPlacement="right" placement="row">
						<u-radio activeColor="#DCA842" :customStyle="{marginLeft: '8px'}"
							v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.label"
							@change="payChange">
						</u-radio>
					</u-radio-group>
				</u-form-item> -->
				<u-gap height="1" bgColor="#DCA842"></u-gap>
				<u-form-item label="商品名称" borderBottom ref="item1">
					<u--input v-model="projectInfo.productName" disabled disabledColor="#ffffff" border="none"
						placeholder="请输入"></u--input>
				</u-form-item>
				<!-- <u-form-item label="商品单位" prop="comm_DW" borderBottom ref="item1">
					<u--input v-model="projectInfo.comm_DW" border="none" placeholder="请输入"></u--input>
				</u-form-item> -->
				<u-form-item label="商品描述" borderBottom ref="item1">
					<u--input v-model="projectInfo.remark" disabled disabledColor="#ffffff" border="none"
						placeholder="请输入"></u--input>
				</u-form-item>
				<u-form-item label="商品库存" borderBottom ref="item1">
					<u-row justify="space-between" gutter="10">
						<u-col span="6">
							<u--input v-model="projectInfo.totalAmount" type="number" border="none"
								placeholder="请输入商品库存">
							</u--input>
						</u-col>
						<u-col span="3">
							<view
								style="color: #666;font-size: 30rpx;display: flex;justify-content: center;align-items: center;">
								{{unitValue}}
								<u-icon name="arrow-right" color="#DCA842" size="20"></u-icon>
							</view>
						</u-col>
					</u-row>
				</u-form-item>
				<u-form-item label="商品售价" borderBottom ref="item1">
					<u--input v-model="projectInfo.sellPrice" disabled disabledColor="#ffffff" type="number"
						border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<u-gap height="1" bgColor="#DCA842"></u-gap>
			<!-- 	<u-form-item label="上架时间" borderBottom ref="item1">
					<time-picker v-model="projectInfo.onShelfTime" disabled @change="uptimelist" type="datetime" />
				</u-form-item> -->
				<u-form-item label="交易时间" borderBottom ref="item1">
					<time-picker v-model="time" @change="timelist" disabled type="datetimerange" rangeSeparator="至" />
				</u-form-item>
				<u-gap height="1" bgColor="#DCA842"></u-gap>
				<u-form-item label="封面图片"  borderBottom ref="item1">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" :deletable="false"
						disabled name="2" multiple :maxCount="1" :previewFullImage="true"></u-upload>
				</u-form-item>
				<u-form-item label="轮播图片"  borderBottom ref="item1">
					<u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" :deletable="false"
						disabled name="3" multiple :maxCount="3" :previewFullImage="true"></u-upload>
				</u-form-item>
				<u-form-item label="详情图片" borderBottom ref="item1">
					<u-upload :fileList="fileList4" @afterRead="afterRead" @delete="deletePic" :deletable="false"
						disabled name="4" multiple :maxCount="3" :previewFullImage="true"></u-upload>
				</u-form-item>
			</u--form>
		</view>
		<!-- <view class="btn" @click="onsbment">
			<view>
				确 认
			</view>
		</view> -->
	</view>
</template>
<script>
	// 下拉选择组件
	import hgSelect from '@/components/uni-data-select/uni-data-select.vue'
	// 时间选择组件
	import timePicker from '@/components/uni-datetime-picker/uni-datetime-picker.vue'
	// 级联选择器
	import dataPicker from '@/components/uni-data-picker/components/uni-data-picker/uni-data-picker.vue'
	export default {
		components: {
			hgSelect,
			timePicker,
			dataPicker
		},
		data: function() {
			return {
				unitValue:"",
				// // 商品交易时间
				time: [],
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
					//  商品描述
					remark: "",
					// 商品售价
					sellPrice: "",
					// 上架时间
					onShelfTime: "",

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
				// 项目数据
				requireSorts: [],
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
				dataTree: []
			}
		},
		onLoad: function(option) {
			if (option.item != undefined) {
				const item = JSON.parse(decodeURIComponent(option.item));
				console.log('编辑信息', item)
				this.projectInfo = item
				// this.$nextTick(() => {
				this.projectInfo.categoryTypeId = item.categoryTypeId
				this.time = [item.sellTimeStart, item.selllTimeEnd]
				this.projectInfo.coverAttIds.forEach((res) => {
					res.url = res.interRqUrl
				})
				//回显单位
				this.unitValue = item.unitDictItem.itemValue
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
				// })

			}
		},
		onShow() {
			this.projectData()
			this.shoneType()
			this.shonping()
		},
		onPageScroll(e) {

		},
		methods: {
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
					url: "/tsf/tsfBusProject/wxList",
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
