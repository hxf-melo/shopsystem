<template>
  <div class="goods_add">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- alert警告框 -->
      <el-alert
        show-icon
        center
        :closable="false"
        title="添加商品信息"
        type="info"
      >
      </el-alert>
      <!-- 步骤条组件 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        :label-position="'top'"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTAbsLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称:" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格:" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量:" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量:" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类:" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox> </el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeaders"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="暂无图片" class="preview" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      // 添加表单验证规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
          },
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur',
          },
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur',
          },
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur',
          },
        ],
      },
      // 商品分类的数据
      cateList: [],
      // 级联选择器的props
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 商品动态参数数据
      manyTableData: [],
      onlyTableData: [],
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的请求头添加token
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      previewVisible: false,
      previewPath: '',
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTAbsLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClick() {
      // activeIndex === '1'时获取动态参数数据
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        console.log(res)
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTableData = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 移除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      // 通过findIndex查找pics数组中有filePath的项并且返回索引值
      const i = this.addForm.pics.findIndex((item) => item.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    // 图片上传成功
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要表单项')

        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数数据
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })

        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 15px !important;
}
.preview {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>