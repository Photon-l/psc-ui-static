<template>
  <div class="huji-detail-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="basic">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">
            {{ detail.xm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证号">
            {{ detail.gmsfhm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            <dict-tag :options="dict.type.sys_user_sex" :value="detail.xbdm"/>
          </el-descriptions-item>
          <el-descriptions-item label="出生日期">
            {{ detail.csrq || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="民族">
            <dict-tag :options="dict.type.huji_nation" :value="detail.mzdm"/>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <dict-tag :options="dict.type.huji_status" :value="detail.zt"/>
          </el-descriptions-item>
          <el-descriptions-item label="所属地区">
            <dict-tag :options="dict.type.huji_area_code" :value="detail.ssssxdm"/>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
<!--      <el-tab-pane label="地址信息" name="address">-->
<!--        <el-descriptions :column="2" border>-->
<!--          <el-descriptions-item label="地区码">-->
<!--            {{ detail.dqm || '' }}-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="派出所">-->
<!--            {{ detail.pcsmc || '' }}-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="责任区">-->
<!--            {{ detail.zrqmc || '' }}-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="街道名称">-->
<!--            {{ detail.jlxmc || '' }}-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="门牌号">-->
<!--            {{ detail.mlph || '' }}-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="详细地址" :span="2">-->
<!--            {{ detail.mlxxdz || '' }}-->
<!--          </el-descriptions-item>-->
<!--        </el-descriptions>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="个人详情" name="personal">
        <el-descriptions :column="2" border>

          <el-descriptions-item label="曾用名">
            {{ detail.zym || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="出生时间">
            {{ detail.cssj || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="出生地">
            {{ detail.csdqhnxxdz || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="籍贯">
            <dict-tag :options="dict.type.huji_area_code" :value="detail.jgssxdm"/>
          </el-descriptions-item>
          <el-descriptions-item label="宗教信仰">
            <dict-tag :options="dict.type.huji_religion" :value="detail.zjxydm"/>
          </el-descriptions-item>
          <el-descriptions-item label="学历">
            <dict-tag :options="dict.type.huji_education" :value="detail.xldm"/>
          </el-descriptions-item>
          <el-descriptions-item label="婚姻状况">
            <dict-tag :options="dict.type.huji_marital_status" :value="detail.hyzkdm"/>
          </el-descriptions-item>
          <el-descriptions-item label="兵役状况">
            <dict-tag :options="dict.type.huji_military_service" :value="detail.byzkdm"/>
          </el-descriptions-item>
          <el-descriptions-item label="身高(cm)">
            {{ detail.sg || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="血型">
            <dict-tag :options="dict.type.huji_blood_type" :value="detail.xxdm"/>
          </el-descriptions-item>
          <el-descriptions-item label="身份证有效期起始日期">
            {{ detail.yxqqsrq || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证有效期截止日期">
            {{ detail.yxqjzrq || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="职业">
            {{ detail.zy || '' }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="服务处所">
            <dict-tag :options="dict.type.sys_service_place" :value="detail.fwcs"/>
          </el-descriptions-item> -->
          <el-descriptions-item label="联系电话">
            {{  detail.lxdh  }}
          </el-descriptions-item>
          <el-descriptions-item label="服务处所">
            {{  detail.fwcs  }}
          </el-descriptions-item>

<!--          <el-descriptions-item label="血型">-->
<!--            <dict-tag :options="dict.type.huji_blood_type" :value="detail.xxdm "/>-->
<!--          </el-descriptions-item>-->
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="关系信息" name="relation">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="父亲姓名">
            {{ detail.fqxm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="父亲身份证号">
            {{ detail.fqgmsfhm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="母亲姓名">
            {{ detail.mqxm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="母亲身份证号">
            {{ detail.mqgmsfhm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="配偶姓名">
            {{ detail.poxm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="配偶身份证号">
            {{ detail.pogmsfhm || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="户号">
            {{ detail.hh || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="户类型">
            <dict-tag :options="dict.type.huji_household_type" :value="detail.hlx"/>
          </el-descriptions-item>
          <el-descriptions-item label="与户主关系">
            <dict-tag :options="dict.type.huji_householder_relation" :value="detail.yhzgxdm"/>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="状态信息" name="status">
        <el-table :data="detail.hujiStatusList" border>
          <el-table-column prop="slsj" label="受理时间" width="180"/>
          <el-table-column prop="deptName" label="受理部门" width="120">
            <!-- <template #default="{row}">
              <dict-tag :options="dict.type.huji_dept" :value="row.slbm"/>
            </template> -->
          </el-table-column>
          <el-table-column prop="sljh" label="受理警号" width="120"/>
          <el-table-column label="受理原因" width="120">
            <template #default="{row}">
              <dict-tag :options="dict.type.huji_handle_reason" :value="row.slyy"/>
            </template>
          </el-table-column>
          <el-table-column prop="clxq" label="处理详情" width="300" :show-overflow-tooltip="false">
            <template #default="{row}">
              <div style="white-space: pre-line">{{ row.clxq }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="blzt" label="办理状态" width="300" :show-overflow-tooltip="false">
            <template #default="{row}">
              <dict-tag :options="dict.type.huji_handle_status" :value="row.blzt"/>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>

<el-dialog
  :visible.sync="dialogVisible"
  title="处理详情"
  width="50%"
  :modal="false"
的shu  class="custom-dialog"
>
  <div style="white-space: pre-line">{{ currentRowData.clxq }}</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { getHujiDetail } from "@/api/huji/basic";

export default {
  name: "HujiDetail",
  dicts: ['sys_user_sex', 'huji_nation', 'huji_status', 'huji_area_code',
  'huji_blood_type', 'sys_occupation', 'huji_religion','huji_education',
  'huji_marital_status', 'huji_military_service',
  'huji_household_type', 'huji_householder_relation', 'huji_handle_reason', "huji_handle_status"],
  props: {
    hujiId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      // 当前选中的标签页
      activeTab: 'basic',
      // 详情数据
      detail: {},
      // 弹窗显示控制
      dialogVisible: false,
      // 当前行数据
      currentRowData: {}
    };
  },
  watch: {
    hujiId: {
      handler(newVal) {
        if (newVal) {
          this.detail = {};
          this.getDetail();
        }
      },
      immediate: true
    }
  },
  methods: {
    /** 查看处理详情 */
    handleViewDetail(row) {
      this.currentRowData = row;
      this.dialogVisible = true;
    },
    /** 获取户籍详情 */
    getDetail() {
      getHujiDetail(this.hujiId).then(response => {
        this.detail = response.data || {};
        console.log(this.detail)
      }).catch(() => {
        this.detail = {};
      });
    }
  }
};
</script>

<style scoped>
.huji-detail-container {
  padding: 20px;
}
</style>

<style scoped>
.custom-dialog {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
