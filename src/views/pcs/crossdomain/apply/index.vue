<template>
  <div class="app-container">
    <!-- 搜索和操作 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="来源系统" prop="sourceSystem">
        <el-select v-model="queryParams.sourceSystem" placeholder="请选择来源系统" clearable>
          <el-option label="出入境系统" value="CRJ" />
          <el-option label="派出所系统" value="PCS" />
        </el-select>
      </el-form-item>
      <el-form-item label="目标系统" prop="targetSystem">
        <el-select v-model="queryParams.targetSystem" placeholder="请选择目标系统" clearable>
          <el-option label="出入境系统" value="CRJ" />
          <el-option label="派出所系统" value="PCS" />
        </el-select>
      </el-form-item>
      <el-form-item label="警务类型" prop="policeType">
        <el-select v-model="queryParams.policeType" placeholder="请选择警务类型" clearable>
          <el-option label="常住人口普查" value="RESIDENT_CENSUS" />
          <el-option label="边境检查" value="BORDER_INSPECTION" />
          <!-- 可以添加更多警务类型选项 -->
        </el-select>
      </el-form-item>
      <el-form-item label="警号" prop="policeNo">
        <el-input v-model="queryParams.policeNo" placeholder="请输入警号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="待审核" value="0" />
          <el-option label="来源系统已审核" value="1" />
          <el-option label="目标系统已审核" value="2" />
          <el-option label="已拒绝" value="3" />
          <el-option label="已过期" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['pcs:crossdomain:apply:add']">新增申请</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate" v-hasPermi="['pcs:crossdomain:apply:edit']" :disabled="single">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete" v-hasPermi="['pcs:crossdomain:apply:remove']" :disabled="multiple">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['pcs:crossdomain:apply:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请编号" align="center" prop="id" />
      <el-table-column label="来源系统" align="center" prop="sourceSystem">
        <template slot-scope="scope">
          <span v-if="scope.row.sourceSystem === 'CRJ'">出入境系统</span>
          <span v-else-if="scope.row.sourceSystem === 'PCS'">派出所系统</span>
          <span v-else>{{ scope.row.sourceSystem }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标系统" align="center" prop="targetSystem">
        <template slot-scope="scope">
          <span v-if="scope.row.targetSystem === 'CRJ'">出入境系统</span>
          <span v-else-if="scope.row.targetSystem === 'PCS'">派出所系统</span>
          <span v-else>{{ scope.row.targetSystem }}</span>
        </template>
      </el-table-column>
      <el-table-column label="警务类型" align="center" prop="policeType">
        <template slot-scope="scope">
          <span v-if="scope.row.policeType === 'RESIDENT_CENSUS'">常住人口普查</span>
          <span v-else-if="scope.row.policeType === 'BORDER_INSPECTION'">边境检查</span>
          <span v-else>{{ scope.row.policeType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="警号" align="center" prop="policeNo" />
      <el-table-column label="权限生效时间" align="center" prop="effectiveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.effectiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限结束时间" align="center" prop="expireTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="primary">来源系统已审核</el-tag>
          <el-tag v-else-if="scope.row.status === '2'" type="success">目标系统已审核</el-tag>
          <el-tag v-else-if="scope.row.status === '3'" type="danger">已拒绝</el-tag>
          <el-tag v-else-if="scope.row.status === '4'" type="info">已过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['pcs:crossdomain:apply:edit']" :disabled="scope.row.status !== '0'">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['pcs:crossdomain:apply:remove']" :disabled="scope.row.status !== '0'">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-check" @click="handleApprove(scope.row)" v-hasPermi="['pcs:crossdomain:approve:local:edit']" :disabled="scope.row.status !== '0'">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 新增/修改/查看 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="目标系统" prop="targetSystem">
          <el-select v-model="form.targetSystem" placeholder="请选择目标系统" :disabled="!isAdd">
            <el-option label="出入境系统" value="CRJ"></el-option>
            <el-option label="派出所系统" value="PCS"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="警务类型" prop="policeType">
          <el-select v-model="form.policeType" placeholder="请选择警务类型" :disabled="!isAdd">
            <el-option label="常住人口普查" value="RESIDENT_CENSUS" />
            <el-option label="边境检查" value="BORDER_INSPECTION" />
            <!-- 可以添加更多警务类型选项 -->
          </el-select>
        </el-form-item>
        <el-form-item label="权限生效时间" prop="effectiveTime">
          <el-date-picker 
            v-model="form.effectiveTime" 
            type="datetime" 
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间" 
            :disabled="!isAdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="权限失效时间" prop="expireTime">
          <el-date-picker 
            v-model="form.expireTime" 
            type="datetime" 
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间" 
            :disabled="!isAdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :disabled="!isAdd"/>
        </el-form-item>
        <!-- 只在详情/只读弹窗显示以下字段 -->
        <template v-if="!isAdd">
          <el-form-item label="来源系统"><span>{{ form.sourceSystem }}</span></el-form-item>
          <el-form-item label="申请编号"><span>{{ form.id }}</span></el-form-item>
          <el-form-item label="申请人警号"><span>{{ form.policeNo }}</span></el-form-item>
          <el-form-item label="申请状态">
            <el-tag v-if="form.status === '0'" type="warning">待审核</el-tag>
            <el-tag v-else-if="form.status === '1'" type="primary">来源系统已审核</el-tag>
            <el-tag v-else-if="form.status === '2'" type="success">目标系统已审核</el-tag>
            <el-tag v-else-if="form.status === '3'" type="danger">已拒绝</el-tag>
            <el-tag v-else-if="form.status === '4'" type="info">已过期</el-tag>
          </el-form-item>
          <el-form-item label="申请时间"><span>{{ parseTime(form.createTime) }}</span></el-form-item>
          <el-form-item label="来源系统审批人" v-if="form.localApprover"><el-input v-model="form.localApprover" :disabled="true"/></el-form-item>
          <el-form-item label="来源系统审批时间" v-if="form.localApproveTime"><el-input :value="parseTime(form.localApproveTime)" :disabled="true"/></el-form-item>
          <el-form-item label="目标系统审批人" v-if="form.targetApprover"><el-input v-model="form.targetApprover" :disabled="true"/></el-form-item>
          <el-form-item label="目标系统审批时间" v-if="form.targetApproveTime"><el-input :value="parseTime(form.targetApproveTime)" :disabled="true"/></el-form-item>
          <el-form-item label="审批备注" v-if="form.approveRemark"><el-input v-model="form.approveRemark" type="textarea" :disabled="true"/></el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="isAdd">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog :title="approveTitle" :visible.sync="approveDialog" width="600px" append-to-body>
      <el-form :model="approveForm" label-width="120px">
        <el-divider content-position="center">申请信息</el-divider>
        <el-row>
          <el-col :span="12"><el-form-item label="来源系统">{{ approveForm.sourceSystem }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="目标系统">{{ approveForm.targetSystem }}</el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="申请编号">{{ approveForm.id }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="申请人警号">{{ approveForm.policeNo }}</el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="警务类型">
              <span v-if="approveForm.policeType === 'RESIDENT_CENSUS'">常住人口普查</span>
              <span v-else-if="approveForm.policeType === 'BORDER_INSPECTION'">边境检查</span>
              <span v-else>{{ approveForm.policeType }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请状态">
              <el-tag v-if="approveForm.status === '0'" type="warning">待审核</el-tag>
              <el-tag v-else-if="approveForm.status === '1'" type="primary">来源系统已审核</el-tag>
              <el-tag v-else-if="approveForm.status === '2'" type="success">目标系统已审核</el-tag>
              <el-tag v-else-if="approveForm.status === '3'" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="approveForm.status === '4'" type="info">已过期</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="权限生效时间">{{ parseTime(approveForm.effectiveTime) }}</el-form-item>
        <el-form-item label="权限失效时间">{{ parseTime(approveForm.expireTime) }}</el-form-item>
        <el-form-item label="备注">{{ approveForm.remark }}</el-form-item>
        <el-form-item label="申请时间">{{ parseTime(approveForm.createTime) }}</el-form-item>
        <el-form-item label="来源系统审批人" v-if="approveForm.localApprover">{{ approveForm.localApprover }}</el-form-item>
        <el-form-item label="来源系统审批时间" v-if="approveForm.localApproveTime">{{ parseTime(approveForm.localApproveTime) }}</el-form-item>
        <el-form-item label="目标系统审批人" v-if="approveForm.targetApprover">{{ approveForm.targetApprover }}</el-form-item>
        <el-form-item label="目标系统审批时间" v-if="approveForm.targetApproveTime">{{ parseTime(approveForm.targetApproveTime) }}</el-form-item>
        <el-form-item label="审批备注" v-if="approveForm.approveRemark">{{ approveForm.approveRemark }}</el-form-item>
        <el-divider content-position="center">审核操作</el-divider>
        <el-form-item label="审核意见" prop="approveRemark">
          <el-input v-model="approveForm.approveRemark" type="textarea" placeholder="请输入审核意见" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitApproveAgree">同意</el-button>
        <el-button type="danger" @click="submitApproveReject">拒绝</el-button>
        <el-button @click="approveDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listApply, getApply, addApply, delApply, updateApply } from "@/api/pcs/crossdomain/apply";
import { approveLocalAgree, approveLocalReject } from "@/api/pcs/crossdomain/approve";
import { parseTime } from "@/utils/ruoyi";

export default {
  name: "PcsCrossDomainApply",
  // 不再使用字典，直接使用el-tag
  data() {
    return {
      loading: true,
      showSearch: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      applyList: [],
      title: "",
      open: false,
      isAdd: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sourceSystem: null,
        targetSystem: null,
        policeType: null,
        policeNo: null,
        status: null,
      },
      form: {},
      rules: {
        targetSystem: [{ required: true, message: "目标系统不能为空", trigger: "change" }],
        policeType: [{ required: true, message: "警务类型不能为空", trigger: "change" }],
        effectiveTime: [{ required: true, message: "权限生效时间不能为空", trigger: "blur" }],
        expireTime: [{ required: true, message: "权限失效时间不能为空", trigger: "blur" }],
      },
      approveDialog: false,
      approveForm: {},
      approveTitle: '',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: null,
        targetSystem: null,
        policeType: null,
        effectiveTime: null,
        expireTime: null,
        remark: null
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增跨域申请";
      this.isAdd = true;
    },
    handleView(row) {
        this.reset();
        const id = row.id;
        getApply(id).then(response => {
            this.form = response.data;
            this.open = true;
            this.title = "申请详情";
            this.isAdd = false;
        });
    },
    handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除申请编号为"' + ids + '"的数据项？').then(function() {
            return delApply(ids);
        }).then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids[0];
      getApply(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改跨域申请";
        this.isAdd = true;
      });
    },
    handleExport() {
      this.download('crossdomain/apply/export', {
        ...this.queryParams
      }, `跨域申请_${new Date().getTime()}.xlsx`);
    },
    handleApprove(row) {
      this.approveForm = { ...row, approveRemark: '' };
      this.approveDialog = true;
      this.approveTitle = '跨域申请审核';
    },
    submitApproveAgree() {
      approveLocalAgree({
        id: this.approveForm.id,
        approveRemark: this.approveForm.approveRemark
      }).then(() => {
        this.$modal.msgSuccess('审核通过');
        this.approveDialog = false;
        this.getList();
      });
    },
    submitApproveReject() {
      approveLocalReject({
        id: this.approveForm.id,
        approveRemark: this.approveForm.approveRemark
      }).then(() => {
        this.$modal.msgSuccess('审核已拒绝');
        this.approveDialog = false;
        this.getList();
      });
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // Format dates before submitting
          const submitData = {
            ...this.form,
            effectiveTime: this.form.effectiveTime ? parseTime(this.form.effectiveTime, '{y}-{m}-{d} {h}:{i}:{s}') : null,
            expireTime: this.form.expireTime ? parseTime(this.form.expireTime, '{y}-{m}-{d} {h}:{i}:{s}') : null
          };
          if (this.form.id != null) {
            updateApply(submitData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addApply(submitData).then(response => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
          }
        }
      });
    }
  }
};
</script> 