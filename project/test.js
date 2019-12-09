const fs = require("fs");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");//使用cookie验证登录状态，node端解析cookie对象
const jwt = require('jsonwebtoken');  //用来生成token
const expressJwt = require('express-jwt')
app.use(cookieParser());
const session = require("express-session");//node端的session中间件，主要用作配置session的属性并生成
const secret = 'jwt'
app.use(session({secret:"wy",name:"nodejs",cookie:{maxAge:80000},resave:false,saveUninitialized:true}));//添加session中间件
const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded());
const captcha = require("./modules/captcha.js");//图片验证码
const encode = require("./modules/md5.js");//md5加密
const con = require("./modules/conn.js");
const http = require('http');
const path = require('path');
var multipart = require('connect-multiparty'); //在处理模块中引入第三方解析模块 
var multipartMiddleware = multipart();
const multer = require('multer');//是nodejs中处理multipart/form-data数据格式(主要用在上传功能中)的中间件
var upload = multer({ dest: 'public/uploads/' });  // 保存路径
//配置express的静态目录
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/',(req,res)=>{
  // res.sendFile(__dirname+'/index.html')
// })
//配置diskStorage来控制文件存储的位置以及文件名字等
// var storage = multer.diskStorage({
  //确定图片存储的位置
  // destination: function (req, file, cb){
    // cb(null, './public/uploadImgs/')
  // },
  //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
  // filename: function (req, file, cb){
    // cb(null, Date.now()+file.originalname)
  // }
// });
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
// var upload = multer({storage: storage});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//所有代码必须执行的代码
app.all("*",function(req,res,next){
	res.setHeader('Content-Type','text/html;charset=utf-8');
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.hasHeader('Access-Control-Allow-Origin','*');
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", '3.2.1')
	if(req.method == 'OPTIONS'){return res.end();}
    next();
});
//生成token的方法
// function generateToken(data){
	// let created = Math.floor(Date.now()/1000);
	// let cert = fs.readFileSync(path.join(__dirname,'../config/pri.pem'));//私钥
	// let token = jwt.sign({
		// data,
		// exp:created + 3600 * 24
	// },cert,{algorithm:'RS256'});
	// return token;
// }
//用户登录
app.post("/login",function(req,res){
	var strname = req.body.username;
	var strpass = req.body.password;
	//输入验证
	if(strname === undefined && strpass === undefined){
		return strname?"用户名不能为空":strpass?"密码不能为空":""
	}
	if(strname.replace(/(^s*)|(s*$)/g, "").length ==0 && strpass.replace(/(^s*)|(s*$)/g, "").length ==0 ){
		return strname?"参数不能包含空格":strpass?"参数不能包含空格":""
	}
	if(strname != '' && strpass != ''){
		var sql = "select * from user where username = '"+strname+"' and password = '"+strpass+"'";
		con.query(sql,function(err,result){
			if(err){
				console.log(err)
			}
			if(result.length == 0){
				let r = {
					message:"账号密码不存在",
					status:401,
					code:'0'
				}
				res.end(JSON.stringify(r));
				console.log('数据',result)
				
			}else{
				console.log(result)
				let content = {name:req.body.username};//要生成token得主题信息
				let secretOrPrivateKey="jwt";// 这是加密的key（密钥）
				let token = jwt.sign(content, secretOrPrivateKey, {
					expiresIn: 1000*60*60*1*24  // 1天过期
				});
				if(strpass != result[0].password){
					let res = {
						status:res.statusCode,
						message:'密码错误，请重新输入',
						code:'2'
					}
					res.end(res)
					return false
				}
				var r = {
					id:result[0].id,
					message:"登录成功",
					status:res.statusCode,
					code:'1',
					token:token,
					user_name:req.body.name
				}
				res.end(JSON.stringify(r));
				console.log(JSON.stringify(r))
			}
		})
	}else{
		res.send('请输入用户名和密码')
	}
});
//用户退出登录
app.post('/checklogin',function(req,res){
	var token = req.body.token
	if(token){
		//清空session中用户信息
		req.session.user = null;
		req.flash('success','登出成功');
		//登出成功后跳转到主页
		res.redirect('/');
		res.end({'status':1})
	}else{
		res.end({'status':0})
	}
	
});
//使用中间件验证token的合法性
app.use(expressJwt({
	secret:secret
}).unless({
	path:['/login','getUserInfo']//除了这些地址，其他的url都需要验证
}));
//拦截器
app.use(function(err,req,res,next){
	//当token验证失败时会抛出如下错误
	if(err.name === 'UnauthorizedError'){
		res.status(401).send({'message':'invalid token,please login first'});
	}
	next()
});
//添加数据
app.post('/add',function(req,res){
		var shopname = req.body.name
		var shopprice = req.body.price
		var shopsaleprice = req.body.saleprice
		var shoptype = req.body.type
		var shopspu = req.body.spu
		var specs = JSON.stringify(req.body.specs)
		var skutotal = req.body.skutotal
		var url = '/uploads/' + req.body.imageUrl
		console.log(shopname,shopprice,shopsaleprice,shoptype,shopspu,specs,skutotal,url)
		// if(shopname && shopprice && shopsaleprice && shopsku && shoptype && shopspu && shopsize && shopcolor !=undefined){
			if(shopname != '' && shopprice != '' && shopsaleprice != '' && shoptype != '' && shopspu != '' && specs != '' && skutotal != '' && url != ''){
				let sql = "insert into shoplist (name,price,saleprice,type,spu,specs,skutotal,imgurl) values ('"+shopname+"','"+shopprice+"','"+shopsaleprice+"','"+shoptype+"','"+shopspu+"','"+specs+"','"+skutotal+"','"+url+"')"
				 con.query(sql,function(err,result){
					 if(err){
							console.log(err)
						}
					 console.log('jieguo',result)
					 if(result != undefined){
						 let r = {
							 code:res.statusCode,
							 status:1,
							 message:'添加商品成功'
						 }
						 res.end(JSON.stringify(r))
						 console.log('成功数据',result)
					 }else{
						 let r = {
							 code:res.statusCode,
							 status:400,
							 message:'添加商品失败'
						 }
						 res.end(JSON.stringify(r))
						 console.log('失败数据',result)
					 }
				 })
			}else{
			res.end("请输入商品信息");
			console.log(result)
		}
		// }
		
})
//商品列表加分页实现
app.post('/list',function(req,res){
	var page = req.body.page;
	var count = req.body.count;
	var start = (page-1)*count;
	var sql = "select * from shoplist";
	con.query(sql,function(err,result){
		if(err){
				console.log(err)
			}
		if(result.length == 0){
			let ress = {
				list:[],
				code:res.statusCode,
				message:'商品列表为空',
				status:'0',
				page:null,
				total:null
			}
			res.end(ress)
		}
		else if(count != undefined){
			let a = Math.ceil(result.length/count);
			let b = result.length;
			var sql = "select * from shoplist limit "+start+","+count+"";
			con.query(sql,function(err,result){
            console.log('分页查询数据',err);
			for(let i=0;i<result.length;i++){
				result[i].specs = JSON.parse(result[i].specs)
			}
			
				let r = {
					list:result,
					message:'sussecc',
					code:res.statusCode,
					status:1,
					page:a,
					total:b
				}
				
				res.end(JSON.stringify(r));
			})  
		}
		else{
			let data = {
				list:result,
				message:'sussecc',
				code:res.statusCode,
				status:1
			}
			res.end(JSON.stringify(data))
		}
	})
})
//修改商品
app.post('/editGood',function(req,res){
	console.log('修改商品')
	let name = req.body.name;
	let price = req.body.price;
	let saleprice = req.body.saleprice;
	let skutotal = req.body.skutotal;
	let specs = JSON.stringify(req.body.specs);
	let spu = req.body.spu;
	let type = req.body.type;
	let imgurl = req.body.imgurl;
	if(name != undefined && price != undefined && saleprice != undefined && skutotal != undefined && specs != undefined && spu != undefined && type != undefined && imgurl != undefined){
		let sql = "update shoplist set name='"+name+"',price='"+price+"',saleprice='"+saleprice+"',type='"+type+"',specs='"+specs+"',skutotal='"+skutotal+"',imgurl='"+imgurl+"' where spu = '"+spu+"'";
		con.query(sql,function(err,result){
			console.log('修改进来了吗')
			if(err){
				res.end("修改失败:" + err);
				console.log('修改数据',err);
			}else{
				console.log('修改成功进来了吗')
				let data = {
					// code = res.statusCode,
					status:1,
					message:'修改成功'
				}
				res.end(JSON.stringify(data));
			}
		})
	}
})
// 删除商品
app.post('/delGood',function(req,res){
	let id = req.body.id;
	let sql = "delete from shoplist where id = '"+id+"'"
	con.query(sql,function(err,result){
		if(err){
			res.end("删除失败:" + err);
		}else{
			let data = {
				status:1,
				message:'删除成功'
			}
			res.end(JSON.stringify(data))
		}
	})
})
//获取分类
app.post('/classList',function(req,res){
	var sql = "select type,id from shoplist group by type";
	con.query(sql,function(err,result){
		if(err){
				console.log(err)
			}
		console.log('分类',result)
		// return false
		if(result.length == 0){
			let data = {
				typeList:result,
				code:res.statusCode,
				status:0,
				message:'获取分类失败'
			}
			res.end(JSON.stringify(data))
		}else{
			let data = {
				typeList:result,
				code:res.statusCode,
				status:1,
				message:'获取分类成功'
			}
			res.end(JSON.stringify(data))
		}
	})
})
// 搜索查询
app.post('/search',function(req,res){
	let className = req.body.className
	let goodName = req.body.goodName
	let goodSpu = req.body.goodSpu
	console.log(className,goodName,goodSpu)
	var sql = "select * from shoplist where name='"+goodName+"' or type='"+className+"' or spu='"+goodSpu+"'";
	con.query(sql,function(err,result){
		if(err){
				console.log(err)
			}
		if(result.length == 0){
			let data = {
				list:[],
				code:res.statusCode,
				status:0,
				message:'很抱歉，暂时没有找到您想要的结果',
				total:result.length,
				page:Math.ceil(result.length/10)
			}
			res.end(JSON.stringify(data))
		}else{
			let data = {
				list:result,
				code:res.statusCode,
				status:1,
				message:res.message,
				total:result.length,
				page:Math.ceil(result.length/10)
			}
			res.end(JSON.stringify(data));
		}
	})
})
//上传图片
app.post("/chk",upload.single('file'),function(req,res){
	console.log('文本域',req.body);//文本域
	console.log('上传文件',req.file);//上传文件
	var arr = req.file.originalname.split(".");
	var ext = arr[arr.length-1];//上传文件扩展名
	var newFile = req.file.path+"."+ext;
	fs.renameSync(req.file.path,newFile);//改名
	console.log('上传的图片',req.file)
	if(req.file){
		let data = {
			code:res.statusCode,
			status:1,
			message:res.message,
			file:req.file
		}
		res.end(JSON.stringify(data))
	}
})
//添加订单
app.post("/addOrder",function(req,res){
	let imgUrl = req.body.imgUrl
	let name = req.body.name
	let color = req.body.color
	let size = req.body.size
	let saleprice = req.body.saleprice
	let totalprice = req.body.totalprice
	let num = req.body.num
	let spu = req.body.spu
	if(imgUrl !='' && name != '' && color != '' && size != '' && saleprice != '' && totalprice != '' && num != '') {
		function genID(length){
			return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
		}
		let orderNumber = genID(12)
		let sql = "insert into addOrder (imgUrl,name,color,size,saleprice,totalprice,num,orderNumber,spu) value ('"+imgUrl+"','"+name+"','"+color+"','"+size+"','"+saleprice+"','"+totalprice+"','"+num+"','"+orderNumber+"','"+spu+"')"
		con.query(sql,function(err,result){
			if(err){
				console.log(err)
			}
				console.log('jieguo',result)
			if(result != undefined){
				let r = {
					code:res.statusCode,
					status:1,
					message:'添加订单成功'
			 }
				res.end(JSON.stringify(r))
				console.log('成功订单数据',result)
			 }else{
			 let r = {
				 code:res.statusCode,
				 status:400,
				 message:'添加订单失败'
			 }
				res.end(JSON.stringify(r))
				console.log('失败订单数据',result)
			 }
		})
	}else{
		res.end('请选择商品规格')
	}
})
//修改订单
app.post('/ediOrder',function(req,res){
	let imgUrl = req.body.imgUrl
	let name = req.body.name
	let color = req.body.color
	let size = req.body.size
	let saleprice = req.body.saleprice
	let totalprice = req.body.totalprice
	let num = req.body.num
	let spu = req.body.spu
	if(imgUrl !='' && name != '' && color != '' && size != '' && saleprice != '' && totalprice != '' && num != ''){
		let sql = "update addorder set imgUrl='"+imgUrl+"',name='"+name+"',color='"+color+"',size='"+size+"',saleprice='"+saleprice+"',totalprice='"+totalprice+"',num='"+num+"' where spu = '"+spu+"'";
		con.query(sql,function(err,result){
			console.log('修改进来了吗')
			if(err){
				res.end("修改失败:" + err);
				console.log('修改数据',err);
			}else{
				console.log('修改成功进来了吗')
				let data = {
					// code = res.statusCode,
					status:1,
					message:'修改成功'
				}
				res.end(JSON.stringify(data));
			}
		})
	}
})
//获取订单列表
app.get('/orderLisr',function(req,res){
	
})
app.listen(8081);
