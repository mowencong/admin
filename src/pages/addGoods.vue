<template>
  <div class="addGood">
    <head-top :toChildMsg="title"></head-top>
    <div class="main">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择商品类型">
            <el-option label="上衣" value="上衣"></el-option>
            <el-option label="裤子" value="裤子"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品原价" prop="price">
          <el-input v-model="ruleForm.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="saleprice">
          <el-input v-model="ruleForm.saleprice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="spu">
          <el-input v-model="ruleForm.spu"></el-input>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-radio class="radio" v-model="goodSpecs" label="one">单规格</el-radio>
          <el-radio class="radio" v-model="goodSpecs" label="more">多规格</el-radio>
        </el-form-item>
        <el-row v-if="goodSpecs == 'one'">
          <el-form-item label="商品库存">
            <el-input-number v-model="ruleForm.specs[0].sku" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="商品码数">
            <el-input v-model="ruleForm.specs[0].size"></el-input>
          </el-form-item>
          <el-form-item label="商品颜色">
            <el-input v-model="ruleForm.specs[0].color"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-else style="overflow: auto; text-align: center;">
          <el-button type="primary" @click="mwc" style="margin-bottom: 10px;">添加规格</el-button>
          <el-table
            :data="ruleForm.specs"
            style="margin-bottom: 20px;"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="sku" label="库存"></el-table-column>
            <el-table-column prop="size" label="码数"></el-table-column>
            <el-table-column prop="color" label="颜色"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-form-item label="商品图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8889/chk/"
            :show-file-list="false"
            :headers="header"
            :with-credentials="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="添加规格" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" :model="specsForm">
          <el-form-item label="库存" label-width="100px">
            <el-input v-model="specsForm.sku" auto-complete="off" type="number"></el-input>
          </el-form-item>
          <el-form-item label="码数" label-width="100px">
            <el-input v-model="specsForm.size"></el-input>
          </el-form-item>
          <el-form-item label="颜色" label-width="100px">
            <el-input v-model="specsForm.color" type="text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addspecs">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop.vue";
import { Message } from "element-ui";
export default {
  data() {
    return {
      goodSpecs: "one",
      dialogFormVisible: false,
      specsForm: {
        sku: "",
        size: "",
        color: ""
      },
      session_token: "",
      header: {
        Authorization: "Bearer" + " " + window.sessionStorage.getItem("key")
      }, //添加认证凭证
      dynamicTags: [], //颜色数组
      dynaSize: [], //码数数组
      inputVisible: false, //颜色控制显示
      sizeVisible: false, //码数控制显示
      inputValue: "", //颜色字段
      sizeValue: "", //码数字段
      dynastock: "", //库存数组
      stockVisible: false, //库存控制显示
      stockValue: "", //库存字段
      //   url: "", //上送图片字段
      imageUrl: "", //显示的图片地址
      title: {
        id: "2-1",
        title: "首页 / 添加数据 / 添加商品"
      },
      skutotal:0,
      ruleForm: {
        name: "",
        type: "",
        spu: "",
        price: "",
        saleprice: "",
        imageUrl: "",
        specs: [
          {
            sku: 0,
            size: "XL",
            color: "白色"
          }
        ],
        skutotal:0
      },
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
      }
    };
  },
  components: {
    headTop
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const parmas = {
            ...this.ruleForm
          };
          this.$request.post("/add", parmas).then(res => {
            if (res.status == 1) {
              console.log("添加信息成功", res);
              Message({
                message: res.message,
                center: true
              });
              this.ruleForm = {
                name: "",
                type: "",
                spu: "",
                price: "",
                saleprice: "",
                imageUrl: "",
                specs: [
                  {
                    sku: 0,
                    size: "",
                    color: ""
                  }
                ],
                skutotal:0
              };
            } else {
              Message({
                message: res.message,
                center: true
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //   图片上传成功的钩子函数
    handleAvatarSuccess(res, file) {
      console.log("图片路径", file.name);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.ruleForm.imageUrl = file.name;
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
    //码数
    sizehandleClose(tag) {
      this.dynaSize.splice(this.dynaSize.indexOf(tag), 1);
    },
    sizeshowInput() {
      this.sizeVisible = true;
      this.$nextTick(_ => {
        this.$refs.sizeTagInput.$refs.input.focus();
      });
    },
    sizehandleInputConfirm() {
      let sizeValue = this.sizeValue;
      console.log("标签码数", this.sizeValue);
      if (sizeValue) {
        this.dynaSize.push(sizeValue);
        console.log("标签码数", this.dynaSize);
      }
      this.sizeVisible = false;
      this.sizeValue = "";
    },
    //颜色
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      console.log("标签颜色", this.inputValue);
      if (inputValue) {
        this.dynamicTags.push(inputValue);
        console.log("标签颜色", this.dynamicTags);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleDelete(index) {
      this.ruleForm.specs.splice(index, 1);
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
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
      this.dialogFormVisible = false;
    },
    mwc() {
      this.dialogFormVisible = true;
      console.log("隐藏", this.dialogFormVisible);
    }
  },
  created() {
    this.session_token = window.sessionStorage.getItem("key");
    console.log("隐藏字段", this.dialogFormVisible);
  },
  mounted(){
    console.log('总库存',this.ruleForm.skutotal)
  }
};
</script>
<style lang='less'>
@import "../style/mixin";
/* //图片样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.form {
  min-width: 400px;
  margin-bottom: 30px;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    border-radius: 6px;
    transition: all 400ms;
  }
}
.food_form {
  border: 1px solid #eaeefb;
  padding: 10px 10px 0;
}
.form_header {
  text-align: center;
  margin-bottom: 10px;
}
.category_select {
  border: 1px solid #eaeefb;
  padding: 10px 30px 10px 10px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.add_category_row {
  height: 0;
  overflow: hidden;
  transition: all 400ms;
  background: #f9fafc;
}
.showEdit {
  height: 185px;
}
.add_category {
  background: #f9fafc;
  padding: 10px 30px 0px 10px;
  border: 1px solid #eaeefb;
  border-top: none;
}
.add_category_button {
  text-align: center;
  line-height: 40px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border: 1px solid #eaeefb;
  border-top: none;
  transition: all 400ms;
  &:hover {
    background: #f9fafc;
    span,
    .edit_icon {
      color: #20a0ff;
    }
  }
  span {
    .sc(14px, #999);
    transition: all 400ms;
  }
  .edit_icon {
    color: #ccc;
    transition: all 400ms;
  }
}
.cell {
  text-align: center;
}
</style>
<style lang="less" scoped>
.main {
  height: 100%;
  padding-top: 50px;
}
.el-input {
  width: 30%;
}
.el-select {
  width: 30%;
}
.el-input__inner {
  width: 30%;
  padding: 0;
}
.el-input--suffix .el-input__inner {
  padding: 0;
}
.el-select .el-input__inner {
  padding: 0;
}
</style>