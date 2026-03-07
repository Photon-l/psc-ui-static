<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 左侧地区树 -->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="areaSearch"
            placeholder="请输入地区名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="tree-container">
          <el-tree
            :data="areaOptions"
            :props="areaProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </el-col>

      <!-- 右侧户籍列表 -->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="姓名" prop="xm">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="身份证号" prop="gmsfhm">
            <el-input
              v-model="queryParams.gmsfhm"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="性别" prop="xbdm">
            <el-select v-model="queryParams.xbdm" placeholder="请选择性别" clearable>
              <el-option
                v-for="dict in dict.type.sys_user_sex"
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
              v-hasPermi="['huji:basic:add']"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['huji:basic:edit']"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['huji:basic:remove']"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['huji:basic:export']"
            >导出
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="hujiList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="姓名" align="center" prop="xm"/>
          <el-table-column label="身份证号" align="center" prop="gmsfhm"/>
          <el-table-column label="性别" align="center" prop="xbdm">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.xbdm"/>
            </template>
          </el-table-column>
          <el-table-column label="出生日期" align="center" prop="csrq" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.csrq, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="zt">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.huji_status" :value="scope.row.zt"/>
            </template>
          </el-table-column>
          <el-table-column label="所属地区" align="center" prop="ssssxdm">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.huji_area_code" :value="scope.row.ssssxdm"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['huji:basic:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['huji:basic:remove']"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleDetail(scope.row)"
                v-hasPermi="['psystem:huji:query']"
              >详情
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-custom"
                @click="handleCrjInfo(scope.row)"
                v-hasPermi="['huji:basic:query']"
              >出入境信息
              </el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改户籍对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-tabs v-model="activeFTab">
          <!-- 基本信息标签页 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" prop="xm">
                  <el-input v-model="form.xm" placeholder="请输入姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族" prop="mzdm">
                  <el-select v-model="form.mzdm" placeholder="请选择民族" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_nation" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名汉语拼音" prop="xmhypy">
                  <el-input v-model="form.xmhypy" placeholder="请输入姓名汉语拼音"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别" prop="xbdm">
                  <el-select v-model="form.xbdm" placeholder="请选择性别" style="width: 100%">
                    <el-option
                      v-for="dict in dict.type.sys_user_sex"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="出生日期" prop="csrq">
                  <el-date-picker v-model="form.csrq" type="date" placeholder="选择出生日期" value-format="yyyy-MM-dd"
                                  style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证" prop="xm" v-if="isEdit">
                  <el-input v-model="form.gmsfhm"/>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="所属地区" prop="ssssxdm">
                  <el-popover
                    placement="bottom-start"
                    width="320"
                    trigger="click"
                    @show="formPopoverShow = true"
                    @hide="formPopoverShow = false"
                  >
                    <area-tree-select v-model="form.ssssxdm" @change="handleFormAddressChange" />
                    <el-input
                      slot="reference"
                      v-model="formAreaName"
                      placeholder="请选择所属地区"
                      readonly
                      :suffix-icon="formPopoverShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                    />
                  </el-popover>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-tab-pane>

          <!-- 地址信息标签页 -->
          <!-- <el-tab-pane label="地址信息" name="address">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="地区名" prop="dqm">
                  <el-input v-model="form.dqm" placeholder="请输入地区名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="派出所名称" prop="pcsmc">
                  <el-input v-model="form.pcsmc" placeholder="请输入派出所名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="派出所代码" prop="pcsdm">
                  <el-input v-model="form.pcsdm" placeholder="请输入派出所代码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="责任区名称" prop="zrqmc">
                  <el-input v-model="form.zrqmc" placeholder="请输入责任区名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="责任区代码" prop="zrqdm">
                  <el-input v-model="form.zrqdm" placeholder="请输入责任区代码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="乡镇街道名称" prop="xzjdmc">
                  <el-input v-model="form.xzjdmc" placeholder="请输入乡镇街道名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="乡镇街道代码" prop="xzjddm">
                  <el-input v-model="form.xzjddm" placeholder="请输入乡镇街道代码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="街路巷名称" prop="jlxmc">
                  <el-input v-model="form.jlxmc" placeholder="请输入街路巷名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="门楼牌号" prop="mlph">
                  <el-input v-model="form.mlph" placeholder="请输入门楼牌号" />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="社区居委会名称" prop="sqjcwhmc">
                  <el-input v-model="form.sqjcwhmc" placeholder="请输入社区居委会名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="门楼详细地址" prop="mlxxdz">
                  <el-input v-model="form.mlxxdz" type="textarea" placeholder="请输入门楼详细地址" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 个人详情标签页 -->
          <el-tab-pane label="个人详情" name="personal">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="曾用名" prop="zym">
                  <el-input v-model="form.zym" placeholder="请输入曾用名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生时间" prop="cssj">
                  <el-input v-model="form.cssj" placeholder="请输入出生时间"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="出生地详细地址" prop="csdqhnxxdz">
                  <el-input v-model="form.csdqhnxxdz" type="textarea" placeholder="请输入出生地详细地址"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="籍贯" prop="jgssxdm">
                  <el-select v-model="form.jgssxdm" placeholder="请选择籍贯" filterable style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_area_code" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="宗教信仰" prop="zjxydm">
                  <el-select v-model="form.zjxydm" placeholder="请选择宗教信仰" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_religion" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学历" prop="xldm">
                  <el-select v-model="form.xldm" placeholder="请选择学历" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_education" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="婚姻状况" prop="hyzkdm">
                  <el-select v-model="form.hyzkdm" placeholder="请选择婚姻状况" style="width: 100%">
                    <el-option
                      v-for="dict in dict.type.huji_marital_status"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="兵役状况" prop="byzkdm">
                  <el-select v-model="form.byzkdm" placeholder="请选择兵役状况" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_military_service" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身高(cm)" prop="sg">
                  <el-input-number v-model="form.sg" placeholder="请输入身高" :min="0" controls-position="right"
                                   style="width: 100%"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="血型" prop="xxdm">
                  <el-select v-model="form.xxdm" placeholder="请选择血型" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_blood_type" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="lxdh">
                  <el-input v-model="form.lxdh" placeholder="请输入联系电话"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="职业" prop="zy">
                  <el-input v-model="form.zy" placeholder="请输入职业"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="服务处所" prop="fwcs">
                  <el-input v-model="form.fwcs" placeholder="请输入服务处所"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="身份证有效期起" prop="yxqqsrq">
                  <el-date-picker v-model="form.yxqqsrq" type="date" placeholder="选择起始日期"
                                  value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证有效期止" prop="yxqjzrq">
                  <el-date-picker v-model="form.yxqjzrq" type="date" placeholder="选择截止日期"
                                  value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 关系信息标签页 -->
          <el-tab-pane label="关系信息" name="relation">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="户号" prop="hh">
                  <el-input v-model="form.hh" placeholder="请输入户号"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户类型" prop="hlx">
                  <el-select v-model="form.hlx" placeholder="请选择户类型" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_household_type" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="与户主关系" prop="yhzgxdm">
                  <el-select v-model="form.yhzgxdm" placeholder="请选择与户主关系" style="width: 100%">
                    <el-option v-for="dict in dict.type.huji_householder_relation" :key="dict.value" :label="dict.label"
                               :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="父亲姓名" prop="fqxm">
                  <el-input v-model="form.fqxm" placeholder="请输入父亲姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="父亲身份证号" prop="fqgmsfhm">
                  <el-input v-model="form.fqgmsfhm" placeholder="请输入父亲身份证号"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="母亲姓名" prop="mqxm">
                  <el-input v-model="form.mqxm" placeholder="请输入母亲姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="母亲身份证号" prop="mqgmsfhm">
                  <el-input v-model="form.mqgmsfhm" placeholder="请输入母亲身份证号"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="配偶姓名" prop="poxm">
                  <el-input v-model="form.poxm" placeholder="请输入配偶姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="配偶身份证号" prop="pogmsfhm">
                  <el-input v-model="form.pogmsfhm" placeholder="请输入配偶身份证号"/>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="监护人一姓名" prop="jhryxm">
                  <el-input v-model="form.jhryxm" placeholder="请输入监护人一姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="监护人一身份证" prop="jhrysfzhm">
                  <el-input v-model="form.jhrysfzhm" placeholder="请输入监护人一身份证号" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="监护人二姓名" prop="jhrexm">
                  <el-input v-model="form.jhrexm" placeholder="请输入监护人二姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="监护人二身份证" prop="jhregmsfzhm">
                  <el-input v-model="form.jhregmsfzhm" placeholder="请输入监护人二身份证号" />
                </el-form-item>
              </el-col>
            </el-row> -->
          </el-tab-pane>

          <!-- 状态信息标签页
          <el-tab-pane label="状态信息" name="status">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="业务类型" prop="ywlx">
                  <el-input v-model="form.ywlx" placeholder="请输入业务类型" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="受理时间" prop="slsj">
                   <el-date-picker v-model="form.slsj" type="datetime" placeholder="选择受理时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="注销标识" prop="zxbs">
                  <el-input v-model="form.zxbs" placeholder="请输入注销标识" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="死亡日期" prop="swrq">
                  <el-date-picker v-model="form.swrq" type="date" placeholder="选择死亡日期" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="迁出日期" prop="qcrq">
                  <el-date-picker v-model="form.qcrq" type="date" placeholder="选择迁出日期" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="迁往地址" prop="qwdmlxxdz">
                  <el-input v-model="form.qwdmlxxdz" placeholder="请输入迁往地址" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane> -->
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 数据对比弹窗 -->
    <el-dialog
      title="数据变更确认"
      :visible.sync="compareDialogVisible"
      width="60%"
      append-to-body
    >
      <el-alert
        title="请仔细核对以下变更项"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px"
      />
      <el-table :data="changedFields" border>
        <el-table-column prop="field" label="字段" width="180"/>
        <el-table-column prop="oldValue" label="原值" width="180">
          <template slot-scope="scope">
            <dict-tag v-if="isDictField(scope.row.field)" :options="getDictOptions(scope.row.field)"
                      :value="scope.row.oldValue"/>
            <span v-else>{{ scope.row.oldValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="newValue" label="新值">
          <template slot-scope="scope">
            <dict-tag v-if="isDictField(scope.row.field)" :options="getDictOptions(scope.row.field)"
                      :value="scope.row.newValue"/>
            <span v-else>{{ scope.row.newValue }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="compareDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSubmit">确 认 提 交</el-button>
        </span>
    </el-dialog>

    <!-- 户籍详情对话框 -->
    <el-dialog
      title="户籍详情"
      :visible.sync="detailOpen"
      width="800px"
      append-to-body
    >
      <huji-detail :huji-id="detailId"></huji-detail>
    </el-dialog>

    <!-- 出入境信息对话框 -->
    <el-dialog :title="crjDialogTitle" :visible.sync="crjDialogVisible" width="1200px" append-to-body>
      <!-- 权限不足提示 -->
      <div v-if="crjPermissionDenied" class="permission-denied-container">
        <el-alert
          title="权限不足"
          type="warning"
          :closable="false"
          show-icon
          style="margin-bottom: 20px">
          <template slot="description">
            <p>您暂无查看出入境信息的权限，请联系管理员申请相关权限。</p>
            <p>需要申请的权限类型：<strong>常住人口普查 (RESIDENT_CENSUS)</strong></p>
            <p>申请流程：系统管理 → 跨域协作中心 → 跨域申请管理</p>
          </template>
        </el-alert>
        <div class="permission-actions">
          <el-button type="primary" icon="el-icon-s-promotion" @click="goToApplyPermission">
            申请权限
          </el-button>
          <el-button icon="el-icon-refresh" @click="recheckPermission">
            重新检查权限
          </el-button>
        </div>
      </div>

      <!-- 无数据提示 -->
      <div v-else-if="crjNoData && !crjLoading" class="no-data-container">
        <el-empty 
          :image-size="120"
          description="暂无出入境记录">
          <template slot="description">
            <p>该人员暂无出入境记录信息</p>
            <p class="text-secondary">如有疑问，请联系出入境管理部门核实</p>
          </template>
        </el-empty>
      </div>

      <!-- 数据表格 -->
      <div v-else>
        <!-- 数据统计信息 -->
        <div v-if="crjInfoList.length > 0" class="data-summary">
          <el-alert
            :title="`共找到 ${crjInfoList.length} 条出入境记录`"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 15px">
          </el-alert>
        </div>

        <el-table 
          v-loading="crjLoading" 
          :data="crjInfoList" 
          border
          stripe
          :empty-text="crjLoading ? '加载中...' : '暂无数据'"
          max-height="500">
          
          <!-- 动态列渲染 - 只显示有权限且有数据的列 -->
          <el-table-column 
            v-if="shouldShowColumn('xm')"
            label="姓名" 
            align="center" 
            prop="xm" 
            width="100"
            fixed="left">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.xm) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('ryxmypy')"
            label="姓名拼音" 
            align="center" 
            prop="ryxmypy" 
            width="120">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.ryxmypy) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('xbdm')"
            label="性别" 
            align="center" 
            prop="xbdm" 
            width="80">
            <template slot-scope="scope">
              <dict-tag v-if="scope.row.xbdm" :options="dict.type.sys_user_sex" :value="scope.row.xbdm"/>
              <span v-else class="empty-value">无</span>
            </template>
          </el-table-column>
          
          <el-table-column 
            v-if="shouldShowColumn('csrq')"
            label="出生日期" 
            align="center" 
            prop="csrq" 
            width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.csrq">{{ parseTime(scope.row.csrq, '{y}-{m}-{d}') }}</span>
              <span v-else class="empty-value">无</span>
            </template>
          </el-table-column>
          
          <el-table-column 
            v-if="shouldShowColumn('gjdm')"
            label="国籍" 
            align="center" 
            prop="gjdm" 
            width="80">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.gjdm) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('cyzjdm')"
            label="证件类型" 
            align="center" 
            prop="cyzjdm" 
            width="100">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.cyzjdm) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('zjhm')"
            label="证件号码" 
            align="center" 
            prop="zjhm" 
            width="180">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.zjhm) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('zgqzzldm')"
            label="签证类型" 
            align="center" 
            prop="zgqzzldm" 
            width="100">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.zgqzzldm) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('crrq')"
            label="出境日期" 
            align="center" 
            prop="crrq" 
            width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.crrq">{{ parseTime(scope.row.crrq, '{y}-{m}-{d}') }}</span>
              <span v-else class="empty-value">无</span>
            </template>
          </el-table-column>
          
          <el-table-column 
            v-if="shouldShowColumn('crsj')"
            label="出境时间" 
            align="center" 
            prop="crsj" 
            width="100">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.crsj) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column 
            v-if="shouldShowColumn('crkadm')"
            label="出境口岸" 
            align="center" 
            prop="crkadm" 
            width="120">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.crkadm) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('jtfs')"
            label="交通工具" 
            align="center" 
            prop="jtfs" 
            width="100">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.jtfs) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('jtgjbs')"
            label="航班号" 
            align="center" 
            prop="jtgjbs" 
            width="120">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.jtgjbs) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('qwddmc')"
            label="前往地" 
            align="center" 
            prop="qwddmc" 
            width="150">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.qwddmc) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('crjdjkh')"
            label="登记卡号" 
            align="center" 
            prop="crjdjkh" 
            width="150">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.crjdjkh) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('bz')"
            label="备注" 
            align="center" 
            prop="bz" 
            width="120">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.bz) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('tdh')"
            label="台号" 
            align="center" 
            prop="tdh" 
            width="80">
            <template slot-scope="scope">
              <span>{{ formatCellValue(scope.row.tdh) }}</span>
            </template>
          </el-table-column>
            
          <el-table-column 
            v-if="shouldShowColumn('gxsj')"
            label="更新时间" 
            align="center" 
            prop="gxsj" 
            width="160"
            fixed="right">
            <template slot-scope="scope">
              <span v-if="scope.row.gxsj">{{ parseTime(scope.row.gxsj) }}</span>
              <span v-else class="empty-value">无</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="crjDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addHuji, delHuji, getAreaList, getHujiDetail, listHuji, updateHuji} from "@/api/huji/basic"; // Import getHujiDetail
import AreaTreeSelect from "./components/AreaTreeSelect";
import HujiDetail from "./components/HujiDetail";
import {getCrjInfo} from "@/api/huji/crj";

export default {
  name: "HujiBasic",
  components: {
    AreaTreeSelect,
    HujiDetail
  },
  dicts: ['sys_user_sex', 'huji_nation', 'huji_status', 'huji_area_code', 'huji_blood_type', 'sys_occupation',
    'huji_religion', 'huji_education', 'huji_marital_status', 'huji_military_service', 'huji_household_type',
    'huji_householder_relation', 'huji_handle_status'],
  data() {
    return {
      // 原始数据存储
      originalData: {},
      // 对比弹窗控制
      compareDialogVisible: false,
      // 变更字段集合
      changedFields: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 户籍表格数据
      hujiList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详情弹出层
      detailOpen: false,
      // 当前查看的详情ID
      detailId: null,
      // 当前选中的标签页
      activeTab: 'basic',
      // 详情数据
      detail: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xm: null,
        gmsfhm: null,
        xbdm: null,
        ssssxdm: null,
        areaPrefix: null
      },
      // 表单参数
      form: { // Initialize with nested objects for clarity
        // basic: {},
        // address: {},
        // personal: {},
        // relation: {},
        // status: {}
      },
      // 表单校验
      rules: {
        xm: [
          {required: true, message: "姓名不能为空", trigger: "blur"}
        ],
        xbdm: [
          {required: true, message: "性别不能为空", trigger: "change"}
        ],
        csrq: [
          {required: true, message: "出生日期不能为空", trigger: "blur"}
        ],
        mzdm: [
          {required: true, message: "民族不能为空", trigger: "change"}
        ],
        csdqhnxxdz: [
          {required: true, message: "出生地详细地址不能为空", trigger: "blur"}
        ],
        jgssxdm: [
          {required: true, message: "籍贯不能为空", trigger: "change"}
        ],
        hh: [
          {required: true, message: "户号不能为空", trigger: "blur"}
        ],
        hlx: [
          {required: true, message: "户类型不能为空", trigger: "change"}
        ],
        yhzgxdm: [
          {required: true, message: "与户主关系不能为空", trigger: "change"}
        ]
        // ssssxdm: [
        //   { required: true, message: "所属地区不能为空", trigger: "change" }
        // ]
      },
      // 地区选择相关
      popoverShow: false,
      formPopoverShow: false,
      areaName: "",
      formAreaName: "",
      // 新增：地区树相关数据
      areaSearch: '',
      areaOptions: [],
      areaProps: {
        children: "children",
        label: "label",
        value: "value"
      },
      // 当前选中的地区
      currentSelectedArea: null,
      // 表单标签页
      activeFTab: 'basic',
      // 出入境信息对话框
      crjDialogVisible: false,
      // 出入境信息对话框标题
      crjDialogTitle: '出入境信息',
      // 出入境信息加载状态
      crjLoading: false,
      // 出入境信息列表
      crjInfoList: [],
      // 权限被拒绝标识
      crjPermissionDenied: false,
      // 无数据标识
      crjNoData: false,
      // 当前查询的人员信息
      currentPersonInfo: null,
    };
  },
  created() {
    this.getAreaTree();
    this.getList();
  },
  watch: {
    areaSearch(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 判断是否为字典字段
    isDictField(field) {
      const dictFields = {
        xbdm: 'sys_user_sex',
        zt: 'huji_status',
        ssssxdm: 'huji_area_code',
        mzdm: 'huji_nation',
        zjxydm: 'huji_religion',
        xldm: 'huji_education',
        hyzkdm: 'huji_marital_status',
        byzkdm: 'huji_military_service',
        hlx: 'huji_household_type',
        yhzgxdm: 'huji_householder_relation',
        blzt: 'huji_handle_status'
      };
      return Object.keys(dictFields).includes(field);
    },
    // 获取字典选项
    getDictOptions(field) {
      const dictMapping = {
        xbdm: this.dict.type.sys_user_sex,
        zt: this.dict.type.huji_status,
        ssssxdm: this.dict.type.huji_area_code,
        mzdm: this.dict.type.huji_nation,
        zjxydm: this.dict.type.huji_religion,
        xldm: this.dict.type.huji_education,
        hyzkdm: this.dict.type.huji_marital_status,
        byzkdm: this.dict.type.huji_military_service,
        hlx: this.dict.type.huji_household_type,
        yhzgxdm: this.dict.type.huji_householder_relation,
        blzt: this.dict.type.huji_handle_status
      };
      return dictMapping[field] || [];
    },
    /** 查询户籍列表 */
    getList() {
      this.loading = true;
      listHuji(this.queryParams).then(response => {
        this.hujiList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取地区树数据 */
    getAreaTree() {
      getAreaList().then(response => {
        this.areaOptions = response.data;

        // 如果地区树成功加载，自动执行初始查询
        if (this.areaOptions && this.areaOptions.length > 0) {
          this.$nextTick(() => {
            this.autoSelectAreaAndLoad();
          });
        }
      }).catch(error => {
        console.error("加载地区数据失败:", error);
      });
    },
    /** 自动选择地区并加载数据 */
    autoSelectAreaAndLoad() {
      // 如果地区树为空或没有节点，直接返回
      if (!this.areaOptions || this.areaOptions.length === 0) {
        return;
      }

      // 获取第一个省级节点
      const rootNode = this.areaOptions[0];
      if (rootNode) {
        // 只需模拟点击该节点，不做其他复杂操作
        this.handleNodeClick(rootNode);

        // 不需要额外的树节点选择和展开操作
        // 因为用户可以手动点击展开按钮，这样更加可靠
      } else {
        // 如果没有找到根节点，执行全局查询
        this.queryParams.ssssxdm = null;
        this.queryParams.areaPrefix = null;
        this.handleQuery();
      }
    },
    /** 地区树筛选 */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /** 地区树节点点击 */
    handleNodeClick(data) {
      this.currentSelectedArea = data;

      // 根据区域代码长度判断层级，用不同的查询方式
      const areaCode = data.value;
      // 清空之前的区域筛选条件
      this.queryParams.ssssxdm = null;
      this.queryParams.areaPrefix = null;

      if (areaCode) {
        // 如果是区县级（6位完整代码且不以00结尾）
        if (areaCode.length === 6 && !areaCode.endsWith('00')) {
          // 精确匹配区县
          this.queryParams.ssssxdm = areaCode;
        } else if (areaCode.endsWith('0000')) {
          // 省级，取前2位作为前缀
          this.queryParams.areaPrefix = areaCode.substring(0, 2);
        } else if (areaCode.endsWith('00')) {
          // 市级，取前4位作为前缀
          this.queryParams.areaPrefix = areaCode.substring(0, 4);
        }
      }

      // 更新当前选中地区名称显示
      this.areaName = data.label || "";

      // 执行查询
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = { // Reset with the detailed structure
        hujiId: null,
        xm: null,
        gmsfhm: null,
        xbdm: null,
        csrq: null,
        mzdm: null,
        zt: null,
        ssssxdm: null,
        dqm: null,
        pcsmc: null,
        pcsdm: null,
        zrqmc: null,
        zrqdm: null,
        xzjdmc: null,
        xzjddm: null,
        jlxmc: null,
        mlph: null,
        mlxxdz: null,
        sqjcwhmc: null,
        hh: null,
        hlx: null,
        yhzgxdm: null,
        fqxm: null,
        fqgmsfhm: null,
        mqxm: null,
        mqgmsfhm: null,
        poxm: null,
        pogmsfhm: null,
        jhryxm: null,
        jhrysfzhm: null,
        jhrexm: null,
        jhregmsfzhm: null,
        zym: null,
        cssj: null,
        csdqhnxxdz: null,
        zjxydm: null,
        xldm: null,
        hyzkdm: null,
        byzkdm: null,
        sg: null,
        jgssxdm: null,
        lxdh: null,
        fwcs: null,
        xxdm: null,
        zy: null,
        yxqqsrq: null,
        yxqjzrq: null,
        ywlx: null,
        slsj: null,
        zxbs: null,
        swrq: null,
        qcrq: null,
        qwdmlxxdz: null
        // address: {}, // Keep nested structure if preferred, but direct mapping is simpler now
        // relation: {}
      };
      this.formAreaName = ""; // Reset area name display
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.loading = true;
      // 查询前可以清空特定筛选条件，保留其他
      listHuji(this.queryParams).then(response => {
        this.hujiList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.ssssxdm = this.currentSelectedArea ? this.currentSelectedArea.value : null;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // 如果已选择地区，则默认使用当前选中的地区
      if (this.currentSelectedArea) {
        this.form.ssssxdm = this.currentSelectedArea.value;
        this.formAreaName = this.currentSelectedArea.label;
      }
      this.open = true;
      this.title = "户籍信息登记";
      this.isEdit = false; // 标记为新增
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.detailOpen = true;
      this.detailId = row.hujiId || row.huji_id;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.hujiId || item.huji_id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const hujiId = row.hujiId || this.ids[0];
      getHujiDetail(hujiId).then(response => {
        this.form = response.data || {};
        this.originalData = JSON.parse(JSON.stringify(response.data));
        // Ensure nested objects exist if API might return null/undefined for them
        // this.form.address = this.form.address || {};
        // this.form.relation = this.form.relation || {};
        // ... add similar checks for other nested structures if needed
        this.open = true;
        this.title = "修改户籍信息";
        this.activeFTab = 'basic'; // Reset to the first tab
        this.isEdit = true; // 标记为编辑
        // Manually set area name if needed, based on ssssxdm
        this.updateFormAreaName(this.form.ssssxdm);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.changedFields = Object.keys(this.form)
              .filter(key => JSON.stringify(this.form[key]) !== JSON.stringify(this.originalData[key]))
              .map(key => ({
                field: key,
                oldValue: this.originalData[key],
                newValue: this.form[key]
              }));
            if (this.changedFields.length === 0) {
              this.$modal.msgWarning("未检测到数据变更");
              return;
            }
            this.compareDialogVisible = true;
          } else {
            addHuji(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    getChangedFields() { // 此方法不再需要，可以考虑移除或注释掉
      const changes = {};
      for (const key in this.form) {
        if (JSON.stringify(this.originalData[key]) !== JSON.stringify(this.form[key])) {
          changes[key] = this.form[key];
        }
      }
      return changes;
    },

    confirmSubmit() {
      const payload = {
        hujiId: this.form.hujiId,
        ...this.getChangedFields()
      };

      updateHuji(payload).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.open = false;
        this.compareDialogVisible = false;
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const hujiIds = row.hujiId || row.huji_id || this.ids;
      this.$modal.confirm('是否确认删除户籍编号为"' + hujiIds + '"的数据项？').then(function () {
        return delHuji(hujiIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('huji/basic/export', {
        ...this.queryParams
      }, `huji_${new Date().getTime()}.xlsx`);
    },
    // 查询表单地址选择变更
    handleAddressChange(value, label) {
      this.queryParams.ssssxdm = value;
      // 更新显示的地区名称
      if (label) {
        this.areaName = label;
      } else {
        this.updateAreaName(value, 'query');
      }
    },
    // 表单地址选择变更
    handleFormAddressChange(value, node) {
      this.form.ssssxdm = value;
      this.formAreaName = node ? node.label : "";
    },
    // 更新地区名称显示
    updateAreaName(value, type) {
      if (!value) {
        if (type === 'query') {
          this.areaName = "";
        } else {
          this.formAreaName = "";
        }
        return;
      }

      const areaDict = this.dict.type.huji_area_code;
      const area = areaDict.find(item => item.value === value);
      if (area) {
        if (type === 'query') {
          this.areaName = area.label;
        } else {
          this.formAreaName = area.label;
        }
      }
    },
    /** 查看出入境信息按钮操作 */
    handleCrjInfo(row) {
      // 重置状态
      this.crjPermissionDenied = false;
      this.crjNoData = false;
      this.crjInfoList = [];
      this.currentPersonInfo = row;
      
      // 设置对话框标题
      this.crjDialogTitle = `${row.xm || '未知'} - 出入境信息`;
      
      // 显示对话框并开始加载
      this.crjLoading = true;
      this.crjDialogVisible = true;
      
      getCrjInfo(row.hujiId).then(response => {
        this.crjLoading = false;
        
        if (response.code === 200) {
          // 成功获取数据
          this.crjInfoList = response.data || [];
          this.crjNoData = this.crjInfoList.length === 0;
        } else {
          // 处理业务错误
          this.handleCrjError(response);
        }
      }).catch(error => {
        this.crjLoading = false;
        this.handleCrjError(error.response?.data || error);
      });
    },

    /** 处理出入境信息查询错误 */
    handleCrjError(error) {
      const errorMsg = error.msg || error.message || '未知错误';
      
      // 判断是否为权限问题
      if (errorMsg.includes('权限') || errorMsg.includes('无跨域访问') || error.code === 403) {
        this.crjPermissionDenied = true;
        this.crjNoData = false;
      } else {
        // 其他错误，显示为无数据
        this.crjPermissionDenied = false;
        this.crjNoData = true;
        this.$message.error(`获取出入境信息失败：${errorMsg}`);
      }
      
      this.crjInfoList = [];
    },

    /** 判断是否应该显示某列 */
    shouldShowColumn(prop) {
      // 如果权限被拒绝或无数据，不显示任何列
      if (this.crjPermissionDenied || this.crjNoData) {
        return false;
      }
      
      // 如果没有数据，不显示任何列
      if (!this.crjInfoList || this.crjInfoList.length === 0) {
        return false;
      }
      
      // 检查是否有任何一条记录包含该属性且不为空
      // 只要有一条记录有值，就显示该列
      return this.crjInfoList.some(item => {
        const value = item[prop];
        return value !== null && value !== undefined && value !== '';
      });
    },

    /** 格式化单元格值 */
    formatCellValue(value) {
      // 如果值为空、null、undefined或空字符串，显示"无"
      if (value === null || value === undefined || value === '') {
        return '无';
      }
      return value;
    },

    /** 申请权限 */
    goToApplyPermission() {
      this.$router.push('/crossdomain/apply');
      this.crjDialogVisible = false;
    },

    /** 重新检查权限 */
    recheckPermission() {
      if (this.currentPersonInfo) {
        this.handleCrjInfo(this.currentPersonInfo);
      }
    },


  }
};
</script>

<style scoped>
.permission-denied-container {
  text-align: center;
  padding: 40px 20px;
}

.permission-actions {
  margin-top: 20px;
}

.permission-actions .el-button {
  margin: 0 10px;
}

.no-data-container {
  text-align: center;
  padding: 40px 20px;
}

.text-secondary {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}

.data-summary {
  margin-bottom: 15px;
}

/* 出入境信息对话框样式优化 */
.el-dialog__wrapper .el-dialog {
  margin-top: 5vh !important;
}

.el-table {
  font-size: 12px;
}

.el-table .el-table__header th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.el-table .el-table__row:hover > td {
  background-color: #f5f7fa;
}

/* 权限提示样式 */
.el-alert--warning .el-alert__description {
  line-height: 1.6;
}

.el-alert--warning .el-alert__description p {
  margin: 8px 0;
}

.el-alert--warning .el-alert__description strong {
  color: #e6a23c;
}

/* 空值样式 */
.empty-value {
  color: #c0c4cc;
  font-style: italic;
  font-size: 12px;
}

/* 表格单元格样式优化 */
.el-table td {
  padding: 8px 0;
}

.el-table .cell {
  word-break: break-all;
}
</style>

<style scoped>
.tree-container {
  background: #fff;
  border: 1px solid #e5e6e7;
  border-radius: 4px;
  padding: 10px;
  height: calc(100vh - 230px);
  overflow: auto;
}

.head-container {
  padding-bottom: 10px;
}
</style>

// 新增：根据地区代码更新表单中的地区名称显示
updateFormAreaName(areaCode) {
if (!areaCode) {
this.formAreaName = "";
return;
}
// Find the corresponding label in the areaOptions tree
const findLabel = (nodes, code) => {
for (const node of nodes) {
if (node.value === code) {
return node.label;
}
if (node.children && node.children.length > 0) {
const foundLabel = findLabel(node.children, code);
if (foundLabel) {
return foundLabel;
}
}
}
return null;
};
this.formAreaName = findLabel(this.areaOptions, areaCode) || "未知地区";
},
