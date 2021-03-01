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
        <el-table-column prop="goods_number" label="商品数量" width="80px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px">
        </el-table-column>
        <el-table-column prop="goods_state" label="商品状态" width="80px">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.goods_state === 0"
              >未通过</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.goods_state === 1"
              >审核中</el-tag
            >
            <el-tag type="success" v-else>已审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_promote" label="热销品" width="80px">
          <template v-slot="scope">
            <el-switch v-model="scope.row.is_promote"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="110px">
          <template v-slot="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="upd_time" label="更新时间" width="110px">
          <template v-slot="scope">
            {{ scope.row.upd_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="showEditGoodsVisible(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="small"
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
    <!-- 修改商品列表数据 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editVisible"
      width="50%"
      @close="editFormClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称:" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格:" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量:" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量:" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品图片:">
          <img
            :class="previewShow ? 'pics_sma' : 'pics_big'"
            :src="item.pics_sma_url"
            alt=""
            v-for="item in editForm.pics"
            :key="item.pics_id"
            @click="preview"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
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
      editVisible: false,
      editForm: [],
      editFormRules: {
        goods_name: {
          required: true,
          message: '请输入商品名称',
          trigger: 'blur',
        },
        goods_price: {
          required: true,
          message: '请输入商品价格',
          trigger: 'blur',
        },
        goods_number: {
          required: true,
          message: '请输入商品数量',
          trigger: 'blur',
        },
        goods_weight: {
          required: true,
          message: '请输入商品重量',
          trigger: 'blur',
        },
      },
      previewShow: true,
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
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
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
    async showEditGoodsVisible(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      console.log(res)
      this.editVisible = true
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    editGoods() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'goods/' + this.editForm.goods_id,
          {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,
          }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editVisible = false
        this.getGoodsList
      })
    },
    preview() {
      return (this.previewShow = !this.previewShow)
    },
  },
}
</script>

<style lang="less" scoped>
.pics_sma {
  width: 50px;
}
.pics_big {
  width: 100%;
}
.el-form-item img {
  margin-left: 5px;
  border-radius: 5px;
}
</style>