<template>
  <div class="app-container">
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
        <el-input
          v-model="queryParams.policeNo"
          placeholder="请输入警号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="single"
          @click="handleApprove"
          v-hasPermiOr="['pcs:crossdomain:approve', 'pcs:crossdomain:approve:edit']"
        >审批</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="approveList" @selection-change="handleSelectionChange">
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
          <span>{{ parseTime(scope.row.effectiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限结束时间" align="center" prop="expireTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="primary">来源系统已审核</el-tag>
          <el-tag v-else-if="scope.row.status === '2'" type="success">目标系统已审核</el-tag>
          <el-tag v-else-if="scope.row.status === '3'" type="danger">已拒绝</el-tag>
          <el-tag v-else-if="scope.row.status === '4'" type="info">已过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermiOr="['pcs:crossdomain:query', 'pcs:crossdomain:approve', 'pcs:crossdomain:approve:edit']"
          >查看</el-button>
          <el-button
            v-if="scope.row.status == '1' || scope.row.status === 1"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleApprove(scope.row)"
            v-hasPermiOr="['pcs:crossdomain:approve:target:agree', 'pcs:crossdomain:approve', 'pcs:crossdomain:approve:edit']"
          >审批</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看跨域申请对话框 -->
    <el-dialog title="查看跨域申请" :visible.sync="viewOpen" width="800px" append-to-body>
      <el-form ref="viewForm" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请编号">{{ form.id }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源系统">
              <span v-if="form.sourceSystem === 'CRJ'">出入境系统</span>
              <span v-else-if="form.sourceSystem === 'PCS'">派出所系统</span>
              <span v-else>{{ form.sourceSystem }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="目标系统">
              <span v-if="form.targetSystem === 'CRJ'">出入境系统</span>
              <span v-else-if="form.targetSystem === 'PCS'">派出所系统</span>
              <span v-else>{{ form.targetSystem }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="警务类型">
              <span v-if="form.policeType === 'RESIDENT_CENSUS'">常住人口普查</span>
              <span v-else-if="form.policeType === 'BORDER_INSPECTION'">边境检查</span>
              <span v-else>{{ form.policeType }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="警号">{{ form.policeNo }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-tag v-if="form.status === '0'" type="warning">待审核</el-tag>
              <el-tag v-else-if="form.status === '1'" type="primary">来源系统已审核</el-tag>
              <el-tag v-else-if="form.status === '2'" type="success">目标系统已审核</el-tag>
              <el-tag v-else-if="form.status === '3'" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="form.status === '4'" type="info">已过期</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限生效时间">{{ parseTime(form.effectiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限结束时间">{{ parseTime(form.expireTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">{{ form.remark }}</el-form-item>
        <el-form-item label="创建时间">{{ parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-form-item>
        <el-form-item label="创建人">{{ form.createBy }}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 审批跨域申请对话框 -->
    <el-dialog title="审批跨域申请" :visible.sync="approveOpen" width="500px" append-to-body>
      <el-form ref="approveForm" :model="approveForm" :rules="approveRules" label-width="120px">
        <el-form-item label="申请编号">{{ approveForm.id }}</el-form-item>
        <el-form-item label="来源系统">
          <span v-if="approveForm.sourceSystem === 'CRJ'">出入境系统</span>
          <span v-else-if="approveForm.sourceSystem === 'PCS'">派出所系统</span>
          <span v-else>{{ approveForm.sourceSystem }}</span>
        </el-form-item>
        <el-form-item label="目标系统">
          <span v-if="approveForm.targetSystem === 'CRJ'">出入境系统</span>
          <span v-else-if="approveForm.targetSystem === 'PCS'">派出所系统</span>
          <span v-else>{{ approveForm.targetSystem }}</span>
        </el-form-item>
        <el-form-item label="警务类型">
          <span v-if="approveForm.policeType === 'RESIDENT_CENSUS'">常住人口普查</span>
          <span v-else>{{ approveForm.policeType }}</span>
        </el-form-item>
        <el-form-item label="警号">{{ approveForm.policeNo }}</el-form-item>
        <el-form-item label="审批备注" prop="approveRemark">
          <el-input v-model="approveForm.approveRemark" type="textarea" placeholder="请输入审批备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitApproveAgree">同 意</el-button>
        <el-button type="danger" @click="submitApproveReject">拒 绝</el-button>
        <el-button @click="cancelApprove">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPendingApproval, approveTargetAgree, approveTargetReject } from "@/api/pcs/crossdomain/approve";
import { getApply } from "@/api/pcs/crossdomain/apply";

export default {
  name: "PcsCrossDomainApprove",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 跨域审批表格数据
      approveList: [],
      // 查看弹出层标题
      viewOpen: false,
      // 审批弹出层标题
      approveOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        targetSystem: 'PCS',
        sourceSystem: null,
        policeType: null,
        policeNo: null,
        status: null
      },
      // 表单参数
      form: {},
      // 审批表单参数
      approveForm: {},
      // 审批表单校验
      approveRules: {
        // approveRemark: [
        //   { required: true, message: "审批备注不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询跨域审批列表 */
    getList() {
      this.loading = true;
      this.queryParams.targetSystem = 'PCS';
      listPendingApproval(this.queryParams).then(response => {
        this.approveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.viewOpen = false;
      this.approveOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        sourceSystem: null,
        targetSystem: null,
        policeType: null,
        policeNo: null,
        effectiveTime: null,
        expireTime: null,
        status: null,
        currentApprover: null,
        localApproveTime: null,
        localApprover: null,
        targetApproveTime: null,
        approveRemark: null,
        remark: null
      };
      this.approveForm = {
        id: null,
        sourceSystem: null,
        targetSystem: null,
        policeType: null,
        policeNo: null,
        status: null,
        approveRemark: null
      };
      this.resetForm("form");
      this.resetForm("approveForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getApply(id).then(response => {
        this.form = response.data;
        this.viewOpen = true;
      });
    },
    /** 审批按钮操作 */
    handleApprove(row) {
      if (row) {
        // 单个审批
        this.approveForm = Object.assign({}, row);
        this.approveOpen = true;
        this.title = "跨域申请审批";
      } else {
        // 批量审批
        if (this.ids.length === 0) {
          this.$modal.msgError("请选择要审批的记录");
          return;
        }
        if (this.ids.length === 1) {
          // 如果只选择了一个，转为单个审批
          const selectedRow = this.approveList.find(item => item.id === this.ids[0]);
          if (selectedRow) {
            this.handleApprove(selectedRow);
            return;
          }
        }
        // 批量审批确认
        this.$confirm('确认要批量审批选中的 ' + this.ids.length + ' 条记录吗？', '批量审批', {
          confirmButtonText: '同意',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.batchApproveAgree();
        }).catch(() => {});
      }
    },
    /** 提交审批 */
    submitApproveAgree() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          approveTargetAgree(this.approveForm).then(response => {
            this.$modal.msgSuccess("审批成功");
            this.approveOpen = false;
            this.getList();
          });
        }
      });
    },
    submitApproveReject() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          approveTargetReject(this.approveForm).then(response => {
            this.$modal.msgSuccess("审批已拒绝");
            this.approveOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 取消审批 */
    cancelApprove() {
      this.approveOpen = false;
    },
    /** 批量审批同意 */
    batchApproveAgree() {
      const promises = this.ids.map(id => {
        const row = this.approveList.find(item => item.id === id);
        if (row && row.status === '1') {
          return approveTargetAgree(row);
        }
        return Promise.resolve();
      });
      
      Promise.all(promises).then(() => {
        this.$modal.msgSuccess("批量审批成功");
        this.getList();
        this.ids = [];
        this.single = true;
      }).catch(error => {
        this.$modal.msgError("批量审批失败: " + error.message);
      });
    },

  }
};
</script> 