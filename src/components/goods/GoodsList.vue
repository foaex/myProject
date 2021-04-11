<template>
  <div class="list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getGoodsList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格数据展示 -->
      <el-table :data="goodsList"
                stripe
                border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price"
                         label="价格"
                         width="95">
        </el-table-column>
        <el-table-column prop="goods_number"
                         label="数量"
                         width="70">
        </el-table-column>
        <el-table-column prop="add_time"
                         label="添加时间"
                         width="160">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="130">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GoodsList',
  data () {
    return {
      // 保存请求参数信息
      queryInfo: {
        // 定义请求参数
        query: '',
        // 定义默认请求第一页
        pagenum: 1,
        // 定义一页有多少条数据
        pagesize: 10
      },
      // 保存请求来的商品数据
      goodsList: [],
      // 保存商品的总数
      total: 0
    }
  },
  created () {
    // 获取商品信息的函数
    this.getGoodsList()
  },
  methods: {
    // 获取商品参数列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 添加商品方法
    addGoods () {
      this.$router.push('/goods/add')
    },
    // 删除商品
    async removeById (id) {
      const removeResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    }
  }
}
</script>

<style scoped >
.list {
  overflow: hidden;
}
</style>
