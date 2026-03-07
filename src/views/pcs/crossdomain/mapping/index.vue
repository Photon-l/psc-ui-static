<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="警务类型" prop="policeTypeCode">
        <el-select v-model="queryParams.policeTypeCode" placeholder="请选择警务类型" clearable>
          <el-option 
            v-for="type in policeTypeOptions" 
            :key="type.code" 
            :label="type.name" 
            :value="type.code" 
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pcs:mapping:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['pcs:mapping:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['pcs:mapping:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mappingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="警务类型" align="center" prop="policeTypeCode">
        <template slot-scope="scope">
          {{ getPoliceTypeName(scope.row.policeTypeCode) }}
        </template>
      </el-table-column>
      <el-table-column label="表名" align="center" prop="fieldInfo.tableName" />
      <el-table-column label="字段名" align="center" prop="fieldInfo.fieldName" />
      <el-table-column label="字段标签" align="center" prop="fieldInfo.fieldLabel" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pcs:mapping:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改警务类型字段映射对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="警务类型" prop="policeTypeCode">
          <el-select v-model="form.policeTypeCode" placeholder="请选择警务类型" @change="handlePoliceTypeChange">
            <el-option 
              v-for="type in policeTypeOptions" 
              :key="type.code" 
              :label="type.name" 
              :value="type.code" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="可访问字段" prop="fieldIds">
          <el-transfer
            v-model="form.fieldIds"
            :titles="['可选字段', '已选字段']"
            :button-texts="['移除', '添加']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="filteredFieldOptions"
            filterable
            filter-placeholder="搜索字段"
            :props="{
              key: 'fieldId',
              label: 'fieldLabel'
            }"
          >
            <template slot="left-footer">
              <el-button size="small" @click="getFieldList">刷新字段列表</el-button>
            </template>
            <template slot="right-footer">
              <span style="margin-left: 15px; font-size: 12px; color: #909399;">
                提示：选择警务类型后会自动加载已配置的字段
              </span>
            </template>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMapping, getMapping, delMapping, addMapping, updateMapping, saveMapping, getFieldIdsByTypeCode, getPoliceTypes } from "@/api/pcs/crossdomain/mapping";
import { listAllFieldDefinition } from "@/api/pcs/crossdomain/fielddefinition";

export default {
  name: "PoliceTypeFieldMapping",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      mappingList: [],
      fieldOptions: [],
      // 警务类型选项
      policeTypeOptions: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        policeTypeCode: null
      },
      form: {
        policeTypeCode: null,
        fieldIds: []
      },
      rules: {
        policeTypeCode: [{ required: true, message: "警务类型不能为空", trigger: "change" }],
        fieldIds: [{ required: true, type: 'array', message: "请至少选择一个字段", trigger: "change" }]
      }
    };
  },
  computed: {
    // 过滤出huji_basic表的字段
    filteredFieldOptions() {
      return this.fieldOptions.filter(field => field.tableName === 'huji_basic');
    }
  },
  created() {
    this.getList();
    this.getFieldList();
    this.getPoliceTypeList();
  },
  methods: {
    getList() {
      this.loading = true;
      listMapping(this.queryParams).then(response => {
        this.mappingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getFieldList() {
      listAllFieldDefinition().then(response => {
        this.fieldOptions = response.data.map(item => {
          return {
            fieldId: item.fieldId,
            fieldLabel: `${item.fieldLabel} (${item.fieldName})`,
            tableName: item.tableName,
            fieldName: item.fieldName
          };
        });
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        policeTypeCode: null,
        fieldIds: []
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加警务类型字段映射";
      // 新增时清空已选字段
      this.form.fieldIds = [];
    },
    handleUpdate(row) {
      this.reset();
      if (row.policeTypeCode) {
        this.form.policeTypeCode = row.policeTypeCode;
        this.open = true;
        this.title = "修改警务类型字段映射";
        // 选择警务类型后自动加载已配置的字段
        this.loadFieldsByPoliceType(row.policeTypeCode);
      }
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveMapping(this.form.policeTypeCode, this.form.fieldIds).then(response => {
            this.$modal.msgSuccess("保存成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除警务类型字段映射编号为"' + ids + '"的数据项？').then(function() {
        return delMapping(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 警务类型变化处理 */
    handlePoliceTypeChange(policeTypeCode) {
      if (policeTypeCode) {
        this.loadFieldsByPoliceType(policeTypeCode);
      } else {
        // 清空已选字段
        this.form.fieldIds = [];
      }
    },
    /** 根据警务类型加载已配置的字段 */
    loadFieldsByPoliceType(policeTypeCode) {
      // 获取已映射的字段ID列表
      getFieldIdsByTypeCode(policeTypeCode).then(response => {
        this.form.fieldIds = response.data || [];
      }).catch(() => {
        // 如果获取失败（比如新的警务类型还没有配置），则清空已选字段
        this.form.fieldIds = [];
      });
    },
    /** 获取警务类型列表 */
    getPoliceTypeList() {
      getPoliceTypes().then(response => {
        this.policeTypeOptions = response.data || [];
      });
    },
    /** 根据警务类型代码获取名称 */
    getPoliceTypeName(code) {
      const type = this.policeTypeOptions.find(item => item.code === code);
      return type ? type.name : code;
    }
  }
};
</script> 