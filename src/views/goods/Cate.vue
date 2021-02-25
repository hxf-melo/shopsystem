<template>
  <div class="goods_cate">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品分类模块 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        class="tree-table"
        :data="categoriesList"
        :columns="columns"
        :selectable="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            style="color: green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="showEditCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类模块 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--options指定数据源  -->
          <!-- props指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类模块 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      categoriesList: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          title: '分类名称',
          key: 'cat_name',
          width: '400px',
        },
        {
          title: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          title: '排序',
          type: 'template',
          template: 'order',
        },
        {
          title: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 父级分类的id
        cat_pid: 0,
        // 将要添加的分类名称
        cat_name: '',
        // 分类的等级,默认添加的是一级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2到 8 个字符', trigger: 'blur' },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        // value表示选中的值
        value: 'cat_id',
        // label表示显示的值
        label: 'cat_name',
        // children表示父子嵌套的属性
        children: 'children',
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制修改分类对话框的显示和隐藏
      editCateDialogVisible: false,
      editCateForm: {},
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2到 8 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoriesList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategoriesList()
    },
    showAddCateVisible() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示添加分类对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      this.parentCateList = res.data
    },
    // 级联选择器的选中项发生变化触发这个函数
    parentCateChange() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的length大于0,证明选中了父级分类
      // 反之则说明没有选中如何的父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // console.log(res)
        this.$message.success(res.meta.msg)
        this.getCategoriesList()
        this.addCateDialogVisible = false
      })
    },
    // 展示修改分类对话框
    async showEditCate(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 监听修改分类对话框的关闭事件，重置表单数据
    editCateDialogClose() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击通过id修改分类信息
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name,
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editCateDialogVisible = false
        this.getCategoriesList()
      })
    },
    // 通过用户的id来删除分类
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm')
        return this.$message.info('已取消删除分类')

      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCategoriesList()
    },
  },
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>