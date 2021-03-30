<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row class="addUser">
        <el-col>
          <el-button type="primary"
                     @click="addRoledialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表展示区域 -->
      <el-table :data="roleList"
                border
                stripe>
        <!-- 展开列 -->
        <el-table-column type='expand'>
          <template slot-scope="scope">
            <!-- <el-row>{{scope.row}}</el-row> -->
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '', 'vcenter']"
                    v-for="(item,i1) in scope.row.children"
                    :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRight(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row :class="[i2!==0?'bdtop':'','vcenter']"
                        v-for="(item2,i2) in item.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="success"
                            v-for="item3 in item2.children"
                            :key="item3.id"
                            closable
                            @close="removeRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index'></el-table-column>
        <el-table-column label="角色名称"
                         prop='roleName'></el-table-column>
        <el-table-column label="角色描述"
                         prop='roleDesc'></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        content="编辑角色"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="删除角色"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         icon="el-icon-delete"
                         @click="removeRole(scope.row.id)">删除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="分配权限"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         @click="showSetRoleDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色"
               :visible.sync="addRoledialogVisible"
               width="40%"
               @closed="addRoleDialogClosed">
      <el-form :model="addRoleRuleForm"
               :rules="addRoleRuleFormRules"
               ref="addRoleRuleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRoleRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹框 -->
    <el-dialog title="修改用户"
               :visible.sync="editRoleDialogVisible"
               width="50%"
               @closed="editRoleDialogClosed">
      <el-form ref="editRoleForm"
               :model="editRoleRuleForm"
               label-width="100px"
               :rules="editRoleFormRules">
        <el-form-item label="用户ID">
          <el-input v-model="editRoleRuleForm.roleId"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称"
                      prop='roleName'>
          <el-input v-model="editRoleRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editRoleRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRoleDialogVisible"
               width="35%"
               @close="setRightDialogClosed">
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               :default-expand-all="true"
               :default-checked-keys="defkey"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 保存角色列表的数组
      roleList: [],
      // 保存所有权限数据
      rightsList: [],
      // 控制添加角色弹框的显示
      addRoledialogVisible: false,
      // 保存添加角色的信息
      addRoleRuleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 设置验证规则
      addRoleRuleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: false, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 控制编辑角色弹框的显示
      editRoleDialogVisible: false,
      // 编辑角色规则
      editRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: false, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 保存要修改的角色信息
      editRoleRuleForm: {},
      // 控制分配权限弹框的显示
      setRoleDialogVisible: false,
      // 树形控件的树形
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 保存角色的权限id
      defkey: [],
      // 保存角色的权限id
      roleId: ''
    }
  },
  components: {

  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 关闭弹框，清空所有内容
    addRoleDialogClosed () {
      this.$refs.addRoleRuleForm.resetFields()
    },
    // 添加角色
    addRole () {
      this.$refs.addRoleRuleForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleRuleForm)
        // console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.getRolesList()
        this.addRoledialogVisible = false
      })
    },
    // 关闭编辑弹框，清空所有内容
    editRoleDialogClosed () {
      this.$refs.editRoleForm.resetFields()
    },
    // 点击编辑按钮，展示角色信息
    async showEditRoleDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      this.editRoleRuleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 点击确定，提交修改后的角色信息
    editRoleInfo () {
      this.$refs.editRoleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRoleRuleForm.roleId, {
          roleName: this.editRoleRuleForm.roleName,
          roleDesc: this.editRoleRuleForm.roleDesc
        })
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败')
        }
        this.editRoleDialogVisible = false
        this.getRolesList()
        return this.$message.success('更新角色信息成功')
      })
    },
    // 删除用户功能
    async removeRole (id) {
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
      const { data: res } = await this.$http.delete('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('用户删除失败')
      }
      this.$message.success('用户删除成功')
      this.getRolesList()
    },
    // 删除用户权限
    async removeRight (role, rightId) {
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
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('权限删除失败')
      }
      role.children = res.data
    },
    // 打开分配权限弹框
    async showSetRoleDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      // 获取三级节点的id
      this.getLeafKeys(role, this.defkey)
      this.setRoleDialogVisible = true
    },
    // 获取角色三级权限的id
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 如果node中没有children属性,就是三级权限
        return arr.push(node.id)
      }
      // 遍历children当中的所有属性
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听关闭分配权限弹框
    setRightDialogClosed () {
      this.defkey = []
    },
    // 点击确定，将角色分配的权限进行更改
    async allRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys)
      // 将keys通过','拼接起来
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style scoped >
.container {
  overflow: hidden;
}
.addUser {
  text-align: left;
  margin: 20px 0;
  padding-left: 20px;
}
.el-card {
  margin-top: 20px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
