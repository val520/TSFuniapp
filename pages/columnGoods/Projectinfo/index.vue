<template>
	<view>
		<view class="box">
			<u--form labelPosition="left" :model="model1" labelWidth="80" ref="form1">
				<u-form-item label="创建人" prop="userInfo.createBy" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.createBy" disabled disabledColor="#ffffff" border="none">
					</u--input>
				</u-form-item>
				<u-form-item label="创建时间" prop="userInfo.createTime" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.createTime" disabled disabledColor="#ffffff" border="none">
					</u--input>
				</u-form-item>
				<u-form-item label="项目名称" prop="userInfo.projectName" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.projectName" disabled disabledColor="#ffffff" border="none">
					</u--input>
				</u-form-item>
				<u-form-item label="项目类型" prop="userInfo.projTypeId" borderBottom ref="item1">
					<hg-select v-model="model1.userInfo.projTypeId" disabled :localdata="requireSorts">
					</hg-select>
				</u-form-item>
				<u-form-item label="所属机构" prop="userInfo.orgName" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.orgName" isabled disabledColor="#ffffff" placeholder="请选择"
						border="none"></u--input>
				</u-form-item>
				<u-form-item label="地理位置" prop="userInfo.poption" borderBottom ref="item1">
					<view class="potion">
						<u--input disabled disabledColor="#ffffff" placeholder="请选择" v-model="model1.userInfo.remark"
							border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="附件" prop="userInfo.fileList" borderBottom ref="item1">
					<u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" name="3" multiple
						:maxCount="0" :previewFullImage="true" :deletable="false"></u-upload>
				</u-form-item>
			</u--form>
		</view>
	</view>

</template>
<script>
	import hgSelect from '@/components/uni-data-select/uni-data-select.vue'
	export default {
		components: {
			hgSelect
		},
		data: function() {
			return {
				// 表单数据
				model1: {
					userInfo: {
						username: "",
						time: "",
						name: '',
						org: '',
						poption: '',
						projTypeId:"",
						requireSorts: 0
					},
				},
				// 文件上传列表
				fileList3: [],
				// 项目类型数据
				requireSorts: []
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
			this.projectObjlist()
		},
		onReady() {

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
</style>
