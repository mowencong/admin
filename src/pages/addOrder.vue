<template>
    <div class="order">
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
        <div class="item" v-for="item in tableData" :key="item.id">
            <div class="left">
                <div class="pic"><img :src="item.imgurl" alt=""></div>
                <div class="name">
                    <div>{{item.name}}</div>
                    <div class="saleprice">￥{{item.saleprice}}</div>
                </div>
            </div>
            <div class="right" @click="specification(item)">
                <span>选规格</span>

            </div>
            <!-- 弹出框 -->
         <el-dialog :title="name" :visible.sync="dialogFormVisible">
            <div class="color">
                <div class="colorTitle">颜色：</div>
                <div class="colorItem" :class="{checked:index==nowIndex}" v-for="(list,index) in spec" :key="index" @click="getColor(index,list)">{{list.color}}</div>
            </div>
            <div class="size">
                <div class="sizeTitle">尺寸：</div>
                <div class="sizeItem" :class="{checked:index==sizeIndex}" v-for="(list,index) in sizeItem" :key="index" @click="getSize(index,sizeItem[index])">{{sizeItem[index]}}</div>
            </div>
            <div class="sku">库存:{{sku}}</div>
            <div slot="footer" class="dialog-footer">
                <div class="price"><span class="first">￥{{item.saleprice}}</span><span class="second" v-if="typeobj!=''">{{typeobj}}</span></div>
                <div class="cart" v-if="isTrue"><el-button type="primary" @click="addCart(item)">加入购物车</el-button></div>
                <div class="cart" v-if="!isTrue"><el-input-number v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number></div>
            </div>
        </el-dialog>
        </div>
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
export default {
    data(){
        return{
            list:[],
            count:10,
            classArr:[],
            currentPage4:1,
            goodValue:'',
            spuValue:'',
            value:'',
            tableData: [],
            totals:0,
            show:true,
            show1:false,
            skutotal:0,
            dialogFormVisible:false,
            spec:[],
            name:'',
            nowIndex:'',
            sizeIndex:'',
            isTrue:true,
            typeobj:{},
            num: 1,
            imgurl:'',
            saleprice:'',
            spu:'',
            good:{},
            sizeItem:[],
            sku:''
        }
    },
    methods:{
        getList(params){
				this.$request
				 .post('/list',params).then(res=>{
					 if(res.status == 1){
						this.tableData = res.list || []
						this.totals = res.total
						// this.skuTotal = 0
						this.tableData.map(t=>{
							t.specs.map(item=>{
								item.sku = item.sku*1
								// this.skuTotal += item.sku
								console.log('6666',this.skuTotal)
								// t.skuTotal = this.skuTotal
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
            onSubmit(){
				this.$request.post('/search',{
					className:this.value,
					goodName:this.goodValue,
					goodSpu:this.spuValue
				}).then(res=>{
					if(res.status == 1){
						// this.tableData = [];
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
            specification(item){
                this.dialogFormVisible = true
                this.name = item.name
                this.imgurl = item.imgurl
                this.saleprice = item.saleprice
                this.spec = item.specs
                this.typeobj.color = this.spec[0].color
                this.typeobj.size = this.spec[0].size
                this.sku = this.spec[0].sku
                this.skutotal = item.skutotal
                this.spu = item.spu
                this.good = item
                this.sizeItem = item.specs[0].size.split(",")
                console.log('fdfdf',this.sizeItem)
            },
            //选择颜色
            getColor(index,item){
                this.nowIndex = index
                this.typeobj.color = item.color
                this.sku = item.sku
                console.log('帆帆帆帆',item)
                this.sizeItem = item.size.split(",")
                this.typeobj.size = this.sizeItem[0]
                console.log('fdfdf',this.sizeItem)
            },
            //选择码数
            getSize(index,size){
                this.sizeIndex = index
                this.typeobj.size = size
                
            },
            //加入购物车
            addCart(){
                // console.log('这是当前数据',item)
                let params = {
                    name:this.name,
                    imgUrl:this.imgurl,
                    color:this.typeobj.color,
                    size:this.typeobj.size,
                    saleprice:this.saleprice,
                    totalprice:this.saleprice*this.num,
                    num:this.num,
                    spu:this.spu
                }
                this.$request.post('/addOrder',params).then(res=>{
                    if(res.status == 1){
                        this.isTrue = !this.isTrue
                        this.$message({
                            message: res.message,
                            center: true
                            });
                        this.good.specs.map(specItem=>{
                            if(specItem.size == this.typeobj.size && specItem.color == this.typeobj.color){
                                specItem.sku = specItem.sku*1-this.num
                                return
                            }
                        })
                        let goods = {
                            name:this.good.name,
                            price:this.good.price,
                            saleprice:this.good.saleprice,
                            specs:this.good.specs,
                            spu:this.good.spu,
                            type:this.good.type,
                            imgurl:this.good.imgurl,
                            skutotal:this.good.skutotal*1-this.num
                        }
                        this.$request.post('/editGood',goods).then(result=>{
                            console.log('修改成功吗？')
                        })
                    }
                })
            },
            handleChange(value) {
                let params = {
                    name:this.name,
                    imgUrl:this.imgurl,
                    color:this.typeobj.color,
                    size:this.typeobj.size,
                    saleprice:this.saleprice,
                    totalprice:this.saleprice*value,
                    num:value,
                    spu:this.spu
                }
                console.log(value);
                this.$request.post('/ediOrder',params).then(res=>{
                    if(res.status == 1){
                        console.log('添加数量成功')
                    }
                })
            }
    },
    mounted(){
        let obj = {page:this.currentPage4,count:this.count}
		this.all = obj
        // this.skutotal = 0
        this.getList(this.all)
        this.getType()
        console.log('fdfdf',this.sizeItem)
    }
}
</script>
<style>
.el-dialog__header{
    text-align: center;
}
</style>
<style scoped>
.order{
    margin:50px 30px;
}
.item{
    display: flex;
    padding:10px 0;
}
.item .left,.item .right{
    flex:1;
}
.left{
    display: flex;
}
.left .pic{
    display: inline-block;
    width:100px;
    height:100px;
    border:1px solid #ccc;
}
.left .name{
    line-height: 50px;
    padding:0 10px;
}
.left .name .saleprice{
    color:#f00;
}
.right{
    text-align: right;
    line-height: 100px;
    cursor: pointer;
}
.right span{
    display: inline-block;
    border:1px solid #ccc;
    border-radius:10px;
    height:30px;
    line-height: 30px;
    width:60px;
    text-align: center;
    background:yellow;
}
.colorItem,.sizeItem{
    display: inline-block;
    width:50px;
    text-align: center;
    border:1px solid #000;
    margin:0 10px;
    cursor: pointer;
}
.colorTitle,.sizeTitle,.sku{
    line-height: 50px;
}
.dialog-footer{
    display: flex;
    background:#ccc;
}
.price{
    padding:0 10px;
    line-height: 50px;
}
.price .first{
    color:#f00;
}
.price .second{
    padding:0 10px;
}
.cart{
    flex:1;
    padding:0 10px;
    line-height: 50px;
}
.cart .el-button--primary{
    border-radius: 10px;
}
.checked{
    background:#f00;
    color:#fff;
}
</style>