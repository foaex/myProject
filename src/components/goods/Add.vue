<template>
  <div class="add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息"
                type="info"
                show-icon
                center
                :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200"
                :active="activeIndex - 0"
                finish-status="success"
                align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs 标签 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               class="demo-ruleForm"
               label-position="top">
        <el-tabs :tab-position="'left'"
                 v-model="activeIndex"
                 :before-leave="beforeLeave"
                 @tab-click="tabClick">
          <el-tab-pane label="基本信息"
                       name='0'>
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addForm.goods_number"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <!-- 商品分类 -->
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader v-model="addForm.goods_cat"
                           :options="catelist"
                           :props="cateProps"
                           @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name='1'>
            <el-form-item :label="item.attr_name"
                          v-for="item in manyData"
                          :key="item.attr_id">
              <!-- 参数渲染 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="items"
                             v-for="(items,index) in item.attr_vals"
                             :key="index"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name='2'>
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name='3'>
            <!-- 图片上传没有调用axios 所以要手动添加header -->
            <el-upload :action="upLoadUrl"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :headers="headersObj"
                       :on-success="successUpLoad">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name='4'>
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary"
                       class="btnAdd"
                       @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览"
               :visible.sync="previewVisible"
               width="50%">
      <img :src="previewURL"
           alt="图片"
           class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 引入深拷贝方法包
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      // 记录在第几步
      activeIndex: '0',
      // 保存添加商品的信息
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: 0,
        goods_weight: '',
        // 商品所属的分类数组
        goods_cat: [],
        // 图片信息
        pics: [],
        // 保存商品描述
        goods_introduce: '',
        // 保存商品参数和属性
        attrs: []
      },
      // 添加商品时的验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      // 商品分类列表
      catelist: [],
      // 指定级联选择器的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 保存动态参数
      manyData: [],
      // 保存静态属性
      onlyData: [],
      // 定义图片上传的地址
      upLoadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 定义图片组件的请求头信息 即手动添加 token
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制预览窗口的显示
      previewVisible: false,
      // 保存预览图片的路径
      previewURL: ''
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 获取三级分类id
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange () {
      // console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 监听tabs标签页的切换
    beforeLeave (activName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 定义tabs点击事件
    async tabClick () {
      // 如果是1，表示访问的是动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // })
        this.onlyData = res.data
      }
    },
    // 预览前的事件
    handlePreview (file) {
      this.previewURL = file.response.data.url
      this.previewVisible = true
    },
    // 删除图片的事件
    handleRemove (file) {
      // console.log(file)
      // 1 拿到将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2 找到该图片在数组中的索引
      const index = this.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      // 3 删除该图片
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功时调用的函数
    successUpLoad (response) {
      // 拼接一个对象
      // console.log(response)
      if (response.meta.status !== 200) {
        return this.$message.error('图片上传失败')
      }
      const picsInfo = { pic: response.data.tmp_path }
      // 将对象添加进数组中
      this.addForm.pics.push(picsInfo)
      this.$message.success('图片上传成功')
      // console.log(this.addForm)
    },
    // 添加商品
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // console.log(this.addForm)
        // 深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 将attrs添加到form中
        form.attrs = this.addForm.attrs
        console.log(form)
        if (this.addForm.goods_name.trim().length === 0 || this.addForm.goods_price.trim().length === 0 || this.addForm.goods_weight.trim().length === 0) {
          return this.$message.error('不能为空')
        }
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.back(-1)
      })
    }

  }
}
</script>

<style scoped >
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 20px;
}
</style>
