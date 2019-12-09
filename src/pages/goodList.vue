<template>
  <div class="shop">
    <div class="seach">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="商品名称">
					<el-input v-model="goodValue" placeholder="商品名称"></el-input>
				</el-form-item>
				<el-form-item label="商品编号">
					<el-input v-model="spuValue" placeholder="商品编号"></el-input>
				</el-form-item>
				<el-form-item label="商品类型">
					<el-select placeholder="商品分类" v-model="value">
						<el-option v-for="item in classArr"
							:key="item.id"
							:label="item.type"
							:value="item.type">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main" v-show="show">
			<template>
				<el-table
					:data="tableData"
					border
					style="width: 100%">
					<!-- 展开数据 -->
					<el-table-column type="expand">
						<template slot-scope="props">
							<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="商品名称">
								<span>{{ props.row.name }}</span>
							</el-form-item>
							<el-form-item label="商品 ID">
								<span>{{ props.row.id }}</span>
							</el-form-item>
							<el-form-item label="商品原价">
								<span>{{ props.row.price }}</span>
							</el-form-item>
							<el-form-item label="商品售价">
								<span>{{ props.row.saleprice }}</span>
							</el-form-item>
							<el-form-item label="商品类型">
								<span>{{ props.row.type }}</span>
							</el-form-item>
							<el-form-item label="商品编码">
								<span>{{ props.row.spu }}</span>
							</el-form-item>
							<el-form-item label="商品规格">
								<div v-for="(item,index) in props.row.specs" :key="index" class="sku">
									<span>颜色：{{item.color}}</span>
									<span>码数：{{item.size}}</span>
									<span>库存：{{item.sku}}</span>	
								</div>
								<!-- <span>{{ props.row.specs }}</span> -->
							</el-form-item>
							<el-form-item label="商品总库存">
								<span>{{props.row.skutotal}}</span>
							</el-form-item>
							</el-form>
						</template>
					</el-table-column>


					<!-- 显示数据 -->
					<el-table-column
						align="center"
						prop="id"
						label="ID"
						width="100">
					</el-table-column>
					<el-table-column
						align="center"
						prop="imgurl"
						label="商品描述">
						<template  slot-scope="prop">
							<img :src="prop.row.imgurl" width="20" height="20">
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="name"
						label="商品名称">
					</el-table-column>
					<el-table-column
						align="center"
						prop="price"
						sortable
						label="原价(元)">
					</el-table-column>
					<el-table-column
						align="center"
						prop="saleprice"
						sortable
						label="销售价(元)">
					</el-table-column>
					<el-table-column
						align="center"
						prop="type"
						label="类型">
					</el-table-column>
					<el-table-column
						align="center"
						prop="spu"
						label="编码">
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button
							size="mini"
							@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button
							size="mini"
							type="danger"
							@click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
						
						</el-table-column>
					</el-table>
			</template>
			<el-dialog
				title="提示"
				:visible.sync="centerDialogVisible"
				width="30%"
				center>
				<span>确认删除这条商品记录吗</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="canselDel()">取 消</el-button>
					<el-button type="primary" @click="suerDel()">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<div v-show="show1" class="error">{{this.message}}</div>
		<!-- 编辑弹框 -->
		<el-dialog title="修改商品信息" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm">
				<el-form-item label="商品名称" :label-width="formLabelWidth">
				<el-input v-model="ruleForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品原价" :label-width="formLabelWidth">
				<el-input v-model="ruleForm.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品售价" :label-width="formLabelWidth">
				<el-input v-model="ruleForm.saleprice" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品类型" :label-width="formLabelWidth">
				<el-select v-model="ruleForm.type" placeholder="请选择商品类型">
					<el-option v-for="item in classArr"
							:key="item.id"
							:label="item.type"
							:value="item.type"></el-option>
				</el-select>
				</el-form-item>
				<el-form-item label="商品图片" prop="imgUrl">
					<el-upload
						class="avatar-uploader"
						action="http://localhost:8888/chk/"
						:show-file-list="false"
						:headers="header"
						:with-credentials="true"
						:on-success="handleServiceAvatarScucess"
						:before-upload="beforeAvatarUpload"
					>
						<img v-if="ruleForm.imgurl" :src="'http://localhost:8888/'+ruleForm.imgurl" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<el-row style="overflow: auto; text-align: center;">
	                <el-table
				    :data="ruleForm.specs"
				    style="margin-bottom: 20px;"
				    :row-class-name="tableRowClassName">
					 <el-table-column
					      prop="color"
					      label="颜色">
					    </el-table-column>
						<el-table-column
					      prop="size"
					      label="码数">
					    </el-table-column>
					    <el-table-column
					      prop="sku"
					      label="库存">
					    </el-table-column>
					    
					   
					    <el-table-column label="操作" >
					    <template slot-scope="scope">
					        <el-button
					          size="small"
					          type="danger"
					          @click="deleteSpecs(scope.$index)">删除</el-button>
					    </template>
					    </el-table-column>
					</el-table>
					<el-button type="primary" @click="specsFormVisible = true" style="margin-bottom: 10px;">添加规格</el-button>
				</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateGood">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="添加规格" :visible.sync="specsFormVisible">
			<el-form :rules="rules" :model="specsForm">
				<el-form-item label="颜色" label-width="100px">
					<el-input v-model="specsForm.color" type="text"></el-input>
				</el-form-item>
				<el-form-item label="码数" label-width="100px">
					<el-input v-model="specsForm.size"></el-input>
				</el-form-item>
				<el-form-item label="库存" label-width="100px">
					<el-input v-model="specsForm.sku" auto-complete="off" type="number"></el-input>
				</el-form-item>
			
			
			</el-form>
			<div slot="footer" class="dialog-footer">
			<el-button @click="specsFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="addspecs">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 分页 -->
		<div class="block">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage4"
			:page-sizes="[10, 20, 30, 40]"
			:page-size="10"
			layout="total, sizes, prev, pager, next, jumper"
			:total="totals">
			</el-pagination>
 	 </div>
  </div>
</template>
<script>
	export default{
		data(){
			return{
				imageUrl:'',
				formInline:{
					goodName:'',
					goodSpu:''
				},
				ruleForm: {},
				tableData: [],
				currentPage4: 1,
				totals:0,
				currenpage:'',
				count:10,
				classArr:[],
				yeshu:'',
				tiaoshu:'',
				all:'',
				message:'',
				show:true,
				show1:false,
				value:'',
				goodValue:'',
				spuValue:'',
				dialogFormVisible: false,
				specsFormVisible:false,
				centerDialogVisible: false,
				delArr:{},
				 form: {
					name: '',
					id: '',
					price: '',
					saleprice: '',
					delivery: false,
					type:'',
					spu: '',
					specs: []
					},
					formLabelWidth: '120px',
					skuTotal:0,
					rules: {
					name: [
					{ required: true, message: "请输入活动名称", trigger: "blur" }
					/*            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' } */
					],
					type: [
					{ required: true, message: "请选择商品类型", trigger: "blur" }
					],
					price: [{ required: true, message: "请填写商品原价", trigger: "blur" }],
					saleprice: [
					{ required: true, message: "请填写商品销售价格", trigger: "blur" }
					],
					// size: [{ required: true, message: "请填写商品码数", trigger: "blur" }],
					spu: [{ required: true, message: "请填写商品编号", trigger: "blur" }],
					// sku: [{ required: true, message: "请填写商品库存", trigger: "blur" }],
					// color: [{ required: true, message: "请填写商品颜色", trigger: "blur" }],
					specs: [{ required: true, message: "请输入规格", trigger: "blur" }]
					// imgurl:[
					// 	{required:true,message:'请选择商品图片',trigger:'blur'}
					// ]
				},
				header: {
					Authorization: "Bearer" + " " + window.sessionStorage.getItem("key")
				}, //添加认证凭证
				specsForm: {
					sku: "",
					size: "",
					color: ""
				},
				skutotal:0
			}
		},
		computed: {
        	specs: function (){
        		let specs = [];
        		if (this.tableData.specs) {
	        		this.form.specs.map(item => {
	        			specs.push({
	        				sku: item.sku,
	        				size: item.size,
	        				color: item.color,
	        			})
						return
	        		})
        		}
        		return specs
        	}
        },
		created(){
			let obj = {page:this.currentPage4,count:this.count}
			this.all = obj
			console.log('333',this.skuTotal)
		},
		methods:{
			onSubmit(){
				this.$request.post('/search',{
					className:this.value,
					goodName:this.goodValue,
					goodSpu:this.spuValue
				}).then(res=>{
					if(res.status == 1){
						this.tableData = [];
						this.tableData = res.list || []
						this.currentPage4 = res.page
						this.totals = res.total
						console.log('查询数据',res)
					}else{
						this.message = res.message
						this.show1 = true
						this.show = false
					}
				})
				console.log('submit')
			},
			getSummaries(param) {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '总价';
					return;
				}
				const values = data.map(item => Number(item[column.property]));
				if (!values.every(value => isNaN(value))) {
					sums[index] = values.reduce((prev, curr) => {
					const value = Number(curr);
					if (!isNaN(value)) {
						return prev + curr;
					} else {
						return prev;
					}
					}, 0);
					sums[index] += ' 元';
				} else {
					sums[index] = 'N/A';
				}
				});

				return sums;
			},
			//获取商品列表
			getList(params){
				
				this.$request
				 .post('/list',params).then(res=>{
					 if(res.status == 1){
						this.tableData = res.list || []
						this.totals = res.total
						this.skuTotal = 0
						this.tableData.map(t=>{
							t.specs.map(item=>{
								item.sku = item.sku*1
								this.skuTotal += item.sku
								console.log('6666',this.skuTotal)
								t.skuTotal = this.skuTotal
								return
							})
							console.log('新的数组',this.tableData)
							return
						})
						
					 }else{
						 this.$message({
							showClose: true,
							message: 'res.message',
							type: 'error'
							});
					 }
					 console.log('列表',res)
				 })
			},
			//获取商品分类
			getType(){
				this.$request
					.post('/classList').then(res=>{
						console.log('分类',res)
						if(res.status == 1){
							this.classArr = res.typeList || []
						}
						console.log('赋值后的分类数组',this.classArr)
					})
			},
			//页数条数
			handleSizeChange(val) {
				console.log(111111111111)
				this.count = val
				let param = {
					page:this.currentPage4,
					count:val
				}
				this.getList(param)
				console.log(`每页 ${val} 条`);
			},
			//点击当前页获取数据
			handleCurrentChange(val) {
				console.log('22222',val)
				console.log(2222222222)
				let params = {
					page:val,
					count:this.count
				}
				this.getList(params)
			},
			// 编辑
			handleEdit(index, row) {
                this.dialogFormVisible = true;
				this.ruleForm = row
				console.log(index, row);
			},
			// 删除
			handleDelete(index, row) {
				this.centerDialogVisible = true
				this.delArr = row
				console.log(index, row);
			},
			suerDel(){
				this.$request.post('/delGood',{
					id:this.delArr.id
				}).then(res=>{
					this.centerDialogVisible = false
					this.$toast(res.message)
					console.log('这是删除的数据',res)
				})
			},
			canselDel(){
				this.centerDialogVisible = false
			},
			//   图片上传成功的钩子函数
			handleAvatarSuccess(res, file) {
			console.log("图片路径", file.name);
			this.imageUrl = URL.createObjectURL(file.raw);
			this.ruleForm.imgurl = file.name;
			},
			handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
					console.log('图片',res.file.path)
                    this.ruleForm.imgurl = res.file.destination+res.file.path
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
			//上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
			beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			return isJPG && isLt2M;
			},
			tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
		    },
			//添加规格
			addspecs() {
			this.ruleForm.specs.push({ ...this.specsForm });
			this.ruleForm.specs.map(item=>{
				item.sku = item.sku*1
				this.skutotal += item.sku
				return
			})
			
			this.ruleForm.skutotal = this.skutotal
			console.log('总库存',this.skutotal,this.ruleForm.skutotal)
			this.specsForm.sku = '';
			this.specsForm.size = '';
			this.specsForm.color = '';
			this.skutotal = 0
			this.specsFormVisible = false;
			},
			//修改数据
			async updateGood() {
				this.dialogFormVisible = false;
				try{
                	// const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                	const postData = {...this.ruleForm};
                    const res = await this.$request.post('/editGood',postData).then(res=>{
						console.log('进来了吗修改')
						if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新商品信息成功'
						});
							this.getFoods();
						}else{
							this.$message({
								type: 'error',
								message: res.message
							});
						}
					})
                    
                }catch(err){
                    console.log('更新商品信息失败', err);
                }
			}
		},
		mounted(){
			this.skuTotal = 0
			this.getList(this.all)
			this.getType()
			this.skuTotal = 0
			console.log('页数',this.totals)
		}
	}
</script>
<style lang="less">
	@import '../style/mixin';

</style>
<style scoped>
	.shop{
		margin:50px 30px;
	}
	.block{
		margin:20px 40px;
		text-align:right;
	}
	.error{
		height: 500px;
		margin: 250 auto;
		text-align: center;
		line-height: 500px;
		font-size: 28px;
	}
	.main{
		padding:0;
	}
	.sku span{
		margin:0 20px;
	}
	  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>