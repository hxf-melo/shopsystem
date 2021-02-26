<template>
  <div class="goods_params">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 参数列表模块 -->
    <el-card>
      <!-- alert提示框 -->
      <el-alert
        title="注意 : 只允许为第三级分类设置相关参数 ! "
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 商品分类的级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="CateList"
            :props="cascaderProps"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsClick">
        <!-- 动态参数列表 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showAddParamsVisible"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="paramsManyData" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 渲染tag标签 -->
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParamsById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性列表 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showAddParamsVisible"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="paramsOnlyData" style="width: 100%" border>
            <el-table-column type="expand">
              <!-- 渲染tag标签 -->
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParamsById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性对话框模块 -->
    <el-dialog
      :title="'添加' + paransText"
      :visible.sync="addParamsVisible"
      width="50%"
      @close="addParamsClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="paransText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数/属性模块 -->
    <el-dialog
      :title="'修改' + paransText"
      :visible.sync="editParamsVisible"
      width="50%"
      @close="editParamsClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="paransText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [],
      selectedKeys: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      activeName: 'many',
      paramsOnlyData: [],
      paramsManyData: [],
      //控制添加参数/属性对话框的显示与隐藏
      addParamsVisible: false,
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      //控制修改参数/属性对话框的显示与隐藏
      editParamsVisible: false,
      editForm: {},
      // 控制修改参数/属性校验规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //控制添加按钮的禁用
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    //保存级联选择器选中的第三级分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    paransText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  methods: {
    //获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.CateList = res.data
    },
    //监听级联选择器的选中项变化
    cateChange() {
      this.getParamsData()
    },
    //监听tabs切换的变化
    tabsClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    //获取分类参数的数据
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.paramsManyData = []
        this.paramsOnlyData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'only') {
        this.paramsOnlyData = res.data
      } else this.paramsManyData = res.data
    },
    // 展示添加参数/属性对话框
    showAddParamsVisible() {
      this.addParamsVisible = true
    },
    // 监听添加参数/属性对话框关闭，重置表单
    addParamsClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数/属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addParamsVisible = false
        this.getParamsData()
      })
    },
    // 监听修改参数/属性对话框关闭，重置表单
    editParamsClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 通过分类id和参数id获取参数数据
    async showEditParams(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editParamsVisible = true
    },
    // 通过分类id和参数id修改参数/属性
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editParamsVisible = false
        this.getParamsData()
      })
    },
    // 通过id删除分类参数
    async removeParamsById(attr_id) {
      const confirmResults = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResults !== 'confirm')
        return this.$message.info('已取消删除参数')

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    // input框失去焦点时调用该函数
    handleInputConfirm(row) {
      // 如果没有输入内容则直接return，并且把input输入框清空，切换到按钮
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 没有return则把input框的内容push到attr_vals进行展示
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求操作，添加新的选择项
      this.saveAttrVals(row)
    },
    // 显示input输入框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击删除参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 20px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>