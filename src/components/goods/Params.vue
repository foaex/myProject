<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：值允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false"
                show-icon>
      </el-alert>
      <el-row>
        <el-col>
          <p>选择商品参数：<el-cascader v-model="selectIndex"
                         :options="cateList"
                         :props="cateProps"
                         @change="handleChange"></el-cascader>
          </p>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     size="mini"
                     :disabled="isDisabled"
                     @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData"
                    border
                    stripe
                    class="paramsTab"
                    v-show="selectIndex.length !== 0">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable
                        v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        @close="removeAttr(index,scope.row)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           class="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           class="el-icon-delete"
                           size="mini"
                           @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     size="mini"
                     :disabled="isDisabled"
                     @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData"
                    border
                    stripe
                    v-show="selectIndex.length !== 0"
                    class="paramsTab">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable
                        v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        @close="removeAttr(index,scope.row)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="attr_name"
                             label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           class="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           class="el-icon-delete"
                           size="mini"
                           @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加弹出框 -->
    <el-dialog :title="'添加' + titleText"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClose">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog :title="'添加' + titleText"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClose">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 保存参数数据
      cateList: [],
      // 保存级联选择框的配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 保存级联选择框选中的索引
      selectIndex: [],
      // 设置默认选中 many 表示动态参数
      activeName: 'many',
      // 保存动态参数
      manyData: [],
      // 保存静态属性
      onlyData: [],
      // 控制添加框的显示
      addDialogVisible: false,
      // 保存添加的内容
      addForm: {},
      // 设置验证
      addFormRules: {
        attr_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 控制编辑表单的显示
      editDialogVisible: false,
      // 保存编辑的数据
      editForm: {},
      // 设置验证
      editFormRules: {
        attr_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateParams()
  },
  methods: {
    async getCateParams () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 监听级联选择框改变事件
    handleChange () {
      if (this.selectIndex.length !== 3) {
        this.manyData = []
        this.onlyData = []
        this.selectIndex = []
      }
      this.getParamsDate()
      console.log(this.cateList)
    },
    // 获取选中页
    handleClick () {
      this.getParamsDate()
    },
    // 获取参数的列表数据
    async getParamsDate () {
      // 判断是否选中三级分类
      if (this.selectIndex.length !== 3) {
        this.selectIndex = []
        return
      }
      // 选中了三级分类 发送一个请求
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(res.data)
      // 判断是动态参数还是静态参数
      if (this.activeName === 'many') {
        // 获取动态参数
        this.manyData = res.data
      } else {
        // 静态参数
        this.onlyData = res.data
      }
    },
    // 监听关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsDate()
      })
    },
    // 控制编辑表单的显示
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 提交修改的内容
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },
    // 监听关闭事件
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除参数
    async deleteParams (id) {
      const removeResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsDate()
    },
    // 控制input的显示
    showInput (row) {
      row.inputVisible = true
      // $nextTick方法就是当页面上的元素被重新渲染后 才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加文本框失去焦点或者按下回车
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果有值就加入到attr_vals中
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发送请求
      this.saveAttrVals(row)
    },
    // 监听标签删除事件
    removeAttr (index, row) {
      row.attr_vals.splice(index, 1)
      // 在发起一次请求
      this.saveAttrVals(row)
    },
    // 封装添加参数项的函数
    async saveAttrVals (row) {
      // 发送请求
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    }
  },
  computed: {
    // 按需禁用按钮
    isDisabled () {
      if (this.selectIndex.length !== 3) {
        return true
      }
      return false
    },
    // 获取三级分类id
    cateId () {
      if (this.selectIndex.length === 3) {
        return this.selectIndex[2]
      }
      return null
    },
    // 根据选项决定标题文字
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped >
.paramsTab {
  margin-top: 20px;
}
.el-tag {
  margin: 6px;
}
.input-new-tag {
  width: 15%;
}
</style>
