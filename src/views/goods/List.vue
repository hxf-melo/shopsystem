<template>
  <div class="goods_list">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            class="input-with-select"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goTOAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品数据表格 -->
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template v-slot="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    }
  },
  created() {
    //获取商品列表数据
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
    },
    async removeById(id) {
      const confirmReslult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmReslult !== 'confirm')
        return this.$message.info('已取消删除商品')
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.getGoodsList()
    },
    goTOAdd() {
      this.$router.push('goods/add')
    },
  },
}
</script>

<style lang="less" scoped>
</style>