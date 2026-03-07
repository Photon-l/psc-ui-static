<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="户籍数据权限分配" prop="areaCode">
              <el-popover
                placement="bottom-start"
                width="320"
                trigger="click"
                @show="handleAreaPopoverShow"
                @hide="areaPopoverShow = false"
              >
                <el-tree
                  :data="areaOptions"
                  :props="areaProps"
                  show-checkbox
                  node-key="value"
                  ref="areaTree"
                  highlight-current
                  :default-checked-keys="defaultAreaCheckedKeys"
                  @check="handleAreaCheck"
                  :key="treeKey"
                ></el-tree>
                <el-input
                  slot="reference"
                  v-model="areaName"
                  placeholder="请选择关联地区"
                  readonly
                  :suffix-icon="areaPopoverShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                />
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import { getAreaList } from "@/api/huji/basic";
import { getDeptAreaCodes, saveDeptAreaCodes } from "@/api/system/deptArea";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      // 新增地区选择相关数据
      areaOptions: [],
      areaProps: {
        children: "children",
        label: "label",
        value: "value"
      },
      areaPopoverShow: false,
      areaName: "",
      selectedAreaCodes: [],
      defaultAreaCheckedKeys: [],
      treeKey: 0
    };
  },
  created() {
    this.getList();
    this.getAreaTree();
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    /** 获取地区树数据 */
    getAreaTree() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        getAreaList().then(response => {
          this.areaOptions = response.data;
          this.loading = false;
          resolve(this.areaOptions);
        }).catch(error => {
          this.loading = false;
          console.error("加载地区数据失败:", error);
          reject(error);
        });
      });
    },
    /** 地区选择处理 */
    handleAreaCheck(node, checkedInfo) {
      // 获取所有选中节点
      const checkedNodes = this.$refs.areaTree.getCheckedNodes();
      // 更新选中地区
      this.selectedAreaCodes = checkedNodes.map(node => node.value);
      // 更新显示名称
      this.areaName = checkedNodes.map(node => node.label).join(", ");
    },
    /** 查询部门详细数据 */
    getDeptDetail(deptId) {
      getDept(deptId).then(response => {
        this.form = response.data;
        // 获取部门关联的地区代码
        this.getDeptAreaCodes(deptId);
      });
    },
    /** 获取部门关联的地区代码 */
    getDeptAreaCodes(deptId) {
      getDeptAreaCodes(deptId).then(response => {
        const areaCodes = response.data || [];
        this.selectedAreaCodes = areaCodes;
        this.defaultAreaCheckedKeys = areaCodes;
        
        // 更新显示名称
        if (areaCodes.length > 0) {
          // 根据地区代码查找对应的名称
          let names = [];
          this.findAreaNamesByCode(this.areaOptions, areaCodes, names);
          this.areaName = names.join(", ");
        } else {
          this.areaName = "";
        }
      });
    },
    /** 根据代码查找地区名称 */
    findAreaNamesByCode(treeData, codes, names) {
      for (let i = 0; i < treeData.length; i++) {
        const node = treeData[i];
        if (codes.includes(node.value)) {
          names.push(node.label);
        }
        
        // 递归查找子节点
        if (node.children && node.children.length > 0) {
          this.findAreaNamesByCode(node.children, codes, names);
        }
      }
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      // 重置地区相关状态
      this.areaName = "";
      this.selectedAreaCodes = [];
      this.defaultAreaCheckedKeys = [];
      this.treeKey++; // 强制重新渲染树组件
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
        
        // 加载该部门关联的地区代码
        getDeptAreaCodes(row.deptId).then(res => {
          if (res.code == 200) {
            this.selectedAreaCodes = res.data || [];
            this.defaultAreaCheckedKeys = this.selectedAreaCodes;
            
            // 更新地区名称显示
            if (this.selectedAreaCodes.length > 0) {
              // 确保地区选项已加载
              if (this.areaOptions && this.areaOptions.length > 0) {
                const areaNames = [];
                this.findAreaNamesByCode(this.areaOptions, this.selectedAreaCodes, areaNames);
                this.areaName = areaNames.join(", ");
                // 强制树组件重新渲染
                this.treeKey++;
              } else {
                // 先加载地区数据
                this.getAreaTree().then(() => {
                  const areaNames = [];
                  this.findAreaNamesByCode(this.areaOptions, this.selectedAreaCodes, areaNames);
                  this.areaName = areaNames.join(", ");
                  // 强制树组件重新渲染
                  this.treeKey++;
                });
              }
            }
          } else {
            console.error("加载部门地区权限失败:", res.msg);
          }
        });
      });
      
      listDeptExcludeChild(row.deptId).then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const deptId = this.form.deptId;
          
          // 保存部门基本信息
          if (deptId != undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              // 保存部门地区关联
              this.saveDeptAreaCodes(deptId);
            });
          } else {
            addDept(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              // 如果新增部门有选择地区，保存关联
              if (this.selectedAreaCodes.length > 0 && response.data) {
                this.saveDeptAreaCodes(response.data.deptId);
              }
            });
          }
        }
      });
    },
    /** 保存部门地区关联 */
    saveDeptAreaCodes(deptId) {
      // console.log("保存部门地区关联:", deptId, this.selectedAreaCodes);
      saveDeptAreaCodes({
        deptId: deptId,
        areaCodes: this.selectedAreaCodes
      }).then(response => {
        // console.log("部门地区关联保存成功:", response);
      }).catch(error => {
        console.error("部门地区关联保存失败:", error);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function() {
        return delDept(row.deptId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 添加popover显示时的事件处理 */
    handleAreaPopoverShow() {
      this.areaPopoverShow = true;
      // 确保在弹出时，树组件已经渲染完成并且选中状态正确
      this.$nextTick(() => {
        if (this.$refs.areaTree && this.selectedAreaCodes.length > 0) {
          // 清除现有选中状态再重新设置，避免累积选择
          this.$refs.areaTree.setCheckedKeys([]);
          this.$refs.areaTree.setCheckedKeys(this.selectedAreaCodes);
        }
      });
    }
  }
};
</script>
