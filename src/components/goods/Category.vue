<template>
  <div class="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     class="addCategory"
                     @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="categoryList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  border
                  :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: green;"></i>
          <i class="el-icon-error"
             v-else
             style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success"
                  size="mini"
                  v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning"
                  size="mini"
                  v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     class="el-icon-edit"
                     size="mini"
                     @click="editCategory(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger"
                     class="el-icon-delete"
                     size="mini"
                     @click="deleteCategory(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCategoryDialogVisible"
               width="50%"
               @close="addCateDialogClosed">
      <el-form :model="addCateForm"
               :rules="addCateRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类："
                      prop="cat_level">
          <el-cascader v-model="selectedIndex"
                       :options="parentList"
                       :props="cascaderProps"
                       @change="parentCateChanged"
                       clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类弹框 -->
    <el-dialog title="编辑分类"
               :visible.sync="editDialogVisible"
               width="50%">
      <el-form ref="editCategoryFormRef"
               :model="editCategoryForm"
               :rules="editCateRules"
               label-width="150px">
        <el-form-item label="分类id：">
          <el-input v-model="editCategoryForm.cat_id"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCategoryInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data () {
    return {
      // 保存请求参数，页码，每页显示的数据
      queryInfo: {
        type: 3,
        // 页码 默认请求第一页的数据
        pagenum: 1,
        // 每页显示的数据
        pagesize: 5
      },
      // 商品分类的数据列表 默认为空
      categoryList: [],
      // 商品总数
      total: 0,
      // 表格各列的数据
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 表示将当列自定义为模板列
        type: 'template',
        // 表示当前列的模板名称
        template: 'isOk'
      }, {
        label: '排序',
        // 表示将当列自定义为模板列
        type: 'template',
        // 表示当前列的模板名称
        template: 'order' // 排序
      }, {
        label: '操作',
        // 表示将当列自定义为模板列
        type: 'template',
        // 表示当前列的模板名称
        template: 'opt' // 操作
      }],
      // 控制分类弹框的显示
      addCategoryDialogVisible: false,
      // 用来保存新添加分类商品的数据
      addCateForm: {
        // 分类的父id
        cat_pid: 0,
        // 分类的名称
        cat_name: '',
        // 分类的等级，默认为1级分类
        cat_level: 0
      },
      // 分类数据的表单验证规则
      addCateRules: {
        cat_name: [{
          required: true, message: '请输入分类名称', trigger: 'blur'
        }]
      },
      // 保存前两级分类数据
      parentList: [],
      // 保存分类时选择的数据
      selectedIndex: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      // 控制编辑按钮的显示
      editDialogVisible: false,
      // 保存即将要编辑的商品的信息
      editCategoryForm: {},
      // 保存编辑分类的验证规则
      editCateRules: {
        cat_name: [{
          required: true, message: '请输入分类名称', trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getGoodsCategory()
  },
  methods: {
    async getGoodsCategory () {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      // 保存商品分类
      this.categoryList = res.data.result
      // 保存商品总数
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCategory()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsCategory()
    },
    // 控制分类弹框的功能
    showAddCate () {
      this.getParentCateList()
      this.addCategoryDialogVisible = true
    },
    // 获取前两级分类数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.parentList = res.data
    },
    // 选项发生改变时触发
    parentCateChanged () {
      // 如果 selectedIndex的长度不为0 说明选中了
      if (this.selectedIndex.length > 0) {
        // 记录父级分类id
        this.addCateForm.cat_pid = this.selectedIndex[this.selectedIndex.length - 1]
        // 并记录当前的分类等级
        this.addCateForm.cat_level = this.selectedIndex.length
      } else {
        // 如果 selectedIndex的长度为0 说明用户没选分类 此时给一个默认的一级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定按钮，添加新的分类
    addCategory () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getGoodsCategory()
        this.addCategoryDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedIndex = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 点击编辑按钮 打开编辑弹框 并实现编辑
    async editCategory (id) {
      console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      this.editCategoryForm = res.data
      this.editDialogVisible = true
    },
    // 提交分类信息
    editCategoryInfo () {
      this.$refs.editCategoryFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCategoryForm.cat_id, {
          cat_name: this.editCategoryForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('提交更改信息失败')
        }
        this.$message.success('提交更改信息成功')
        this.getGoodsCategory()
        this.editDialogVisible = false
      })
    },
    // 删除分类数据
    async deleteCategory (id) {
      const removeResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err)
      // console.log(removeResult)
      // 点击确定 则removeResult=confirm
      // 点击取消 则removeResult=cancel
      if (removeResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      if ((this.total - 1) % this.queryInfo.pagesize === 0 && this.total !== 0) {
        --this.queryInfo.pagenum
      }
      this.getGoodsCategory()
    }
  }
}
</script>

<style scoped >
.addCategory {
  margin: 20px 0;
}
.el-pagination {
  margin-top: 20px;
  display: flex;
}
.el-cascader {
  width: 100%;
}
</style>
