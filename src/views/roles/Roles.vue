<template>
  <div class="roles">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolesList" :stripe="true" border style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag closable @close="removeTagById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTagById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeTagById(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightsVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色模块 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addRolesClose"
    >
      <el-form
        :model="addRolesFormList"
        :rules="addRolesFormRule"
        ref="addRolesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFormList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesFormList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户模块 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editRolesVisible"
      width="50%"
      @close="editRolesClose"
    >
      <el-form
        :model="editRolesForm"
        :rules="editRolesRule"
        ref="editRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限模块 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightsVisible"
      @close="allotRightsClose"
      width="50%"
    >
      <el-tree
        :data="rightList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        ref="treeRef"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRolesVisible: false,
      addRolesFormList: {
        roleName: '',
        roleDesc: '',
      },
      addRolesFormRule: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2到 8 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      editRolesVisible: false,
      editRolesForm: {},
      editRolesRule: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      SetRightsVisible: false,
      rightList: [],
      rightsProps: {
        children: 'children',
        label: 'authName',
      },
      defKeys: [],
      rolesId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取全部角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 监听添加新角色对话框的关闭事件，重置表单数据
    addRolesClose() {
      this.$refs.addRolesRef.resetFields()
    },
    // 点击添加新的角色
    addRoles() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'roles',
          this.addRolesFormList
        )
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addRolesVisible = false
        this.getRolesList()
      })
    },
    // 通过id来展示编辑角色对话框
    async showEditRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRolesForm = res.data
      this.editRolesVisible = true
    },
    // 监听编辑角色对话框的关闭事件，重置表单数据
    editRolesClose() {
      this.$refs.editRolesRef.resetFields()
    },
    // 点击编辑角色
    editRoles() {
      this.$refs.editRolesRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editRolesVisible = false
        this.getRolesList()
      })
    },
    // 通过id来删除角色
    async removeRolesById(id) {
      const confirmResults = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResults !== 'confirm')
        return this.$message.info('已取消删除角色')

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    async removeTagById(role, rightId) {
      const confirmResults = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResults !== 'confirm')
        return this.$message.info('已取消删除角色')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    async showSetRightsVisible(role) {
      this.rolesId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.SetRightsVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    allotRightsClose() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.rolesId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.SetRightsVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>