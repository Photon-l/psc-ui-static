<template>
  <div class="police-dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="welcome-info">
          <h1 class="system-title">
            <i class="el-icon-office-building"></i>
            {{ stationName }}综合管理系统
          </h1>
          <p class="system-subtitle">智慧警务 · 便民服务</p>
        </div>
        <div class="header-right">
          <div class="weather-info">
            <i class="el-icon-sunny"></i>
            <span>{{ weather.condition }} {{ weather.temperature }}°C</span>
          </div>
          <div class="current-time">
            <i class="el-icon-time"></i>
            <span>{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :xs="12" :sm="6" :md="6" :lg="6" v-for="card in dashboardCards" :key="card.key">
        <div class="stat-card" :class="card.type">
          <div class="card-icon">
            <i :class="card.icon"></i>
          </div>
          <div class="card-content">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-value">{{ card.value }}</div>
            <div class="card-trend" :class="card.trend.type">
              <i :class="card.trend.icon"></i>
              <span>{{ card.trend.text }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作区域 -->
    <div class="quick-actions">
      <h3 class="section-title">
        <i class="el-icon-s-promotion"></i>
        快捷操作
      </h3>
      <el-row :gutter="15">
        <el-col :xs="12" :sm="8" :md="4" :lg="4" v-for="action in quickActions" :key="action.key">
          <div class="action-card" @click="handleQuickAction(action)">
            <div class="action-icon" :style="{ backgroundColor: action.color }">
              <i :class="action.icon"></i>
            </div>
            <div class="action-title">{{ action.title }}</div>
            <div class="action-subtitle">{{ action.subtitle }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧：待办事项和通知 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <!-- 待办事项 -->
        <div class="content-card">
          <div class="card-header">
            <h3>
              <i class="el-icon-s-order"></i>
              待办事项
              <el-badge :value="todoList.length" class="todo-badge" type="danger" />
            </h3>
            <el-button type="text" size="small" @click="refreshTodo">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
          <div class="todo-list">
            <div
              v-for="todo in todoList"
              :key="todo.id"
              class="todo-item"
              :class="todo.priority"
              @click="handleTodoClick(todo)"
            >
              <div class="todo-icon">
                <i :class="todo.icon"></i>
              </div>
              <div class="todo-content">
                <div class="todo-title">{{ todo.title }}</div>
                <div class="todo-time">{{ todo.time }}</div>
              </div>
              <div class="todo-count">
                <el-badge :value="todo.count" type="danger" />
              </div>
            </div>
          </div>
        </div>

        <!-- 系统通知 -->
        <div class="content-card">
          <div class="card-header">
            <h3>
              <i class="el-icon-bell"></i>
              系统通知
            </h3>
            <el-button type="text" size="small" @click="viewAllNotices">
              查看全部
            </el-button>
          </div>
          <div class="notice-list">
            <div
              v-for="notice in noticeList"
              :key="notice.id"
              class="notice-item"
              @click="handleNoticeClick(notice)"
            >
              <div class="notice-dot" :class="notice.type"></div>
              <div class="notice-content">
                <div class="notice-title">{{ notice.title }}</div>
                <div class="notice-time">{{ notice.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧：数据统计和工作效率 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <!-- 数据统计图表 -->
        <div class="content-card">
          <div class="card-header">
            <h3>
              <i class="el-icon-s-data"></i>
              数据统计
            </h3>
            <el-select v-model="chartPeriod" size="small" style="width: 100px">
              <el-option label="本周" value="week"></el-option>
              <el-option label="本月" value="month"></el-option>
              <el-option label="本年" value="year"></el-option>
            </el-select>
          </div>
          <div class="chart-container">
            <div ref="businessChart" class="business-chart"></div>
          </div>
        </div>

        <!-- 工作效率 -->
        <div class="content-card">
          <div class="card-header">
            <h3>
              <i class="el-icon-trophy"></i>
              工作效率
            </h3>
          </div>
          <div class="efficiency-content">
            <div class="efficiency-item" v-for="item in efficiencyData" :key="item.key">
              <div class="efficiency-label">{{ item.label }}</div>
              <div class="efficiency-value">
                <span class="value">{{ item.value }}</span>
                <span class="unit">{{ item.unit }}</span>
              </div>
              <div class="efficiency-progress">
                <el-progress
                  :percentage="item.percentage"
                  :color="item.color"
                  :show-text="false"
                  :stroke-width="6"
                />
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 底部信息 -->
    <div class="dashboard-footer">
      <div class="footer-content">
        <div class="footer-left">
          <span><i class="el-icon-phone"></i> 服务热线: 110</span>
          <span><i class="el-icon-message"></i> 联系邮箱: service@police.gov.cn</span>
        </div>
        <div class="footer-right">
          <span><i class="el-icon-office-building"></i> {{ stationName }} © 2025</span>
          <span><i class="el-icon-lock"></i> 系统安全等级: 三级</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getDashboardStats, getTodoList, getNoticeList, getBusinessChartData, getEfficiencyData, getWeatherInfo } from '@/api/dashboard'

export default {
  name: "PoliceDashboard",
  data() {
    return {
      stationName: "派出所",
      currentTime: "",
      timeInterval: null,
      chartPeriod: "month",
      businessChart: null,
      weather: {
        condition: "晴",
        temperature: 22
      },
      dashboardCards: [
        {
          key: "huji",
          title: "户籍总数",
          value: "12,345",
          icon: "el-icon-user-solid",
          type: "primary",
          trend: {
            type: "up",
            icon: "el-icon-top",
            text: "+2.3%"
          }
        },
        {
          key: "certificate",
          title: "今日办证",
          value: "28",
          icon: "el-icon-postcard",
          type: "success",
          trend: {
            type: "up",
            icon: "el-icon-top",
            text: "+12%"
          }
        },
        {
          key: "crossdomain",
          title: "跨域申请",
          value: "15",
          icon: "el-icon-connection",
          type: "warning",
          trend: {
            type: "down",
            icon: "el-icon-bottom",
            text: "-5%"
          }
        },
        {
          key: "pending",
          title: "待处理",
          value: "8",
          icon: "el-icon-warning",
          type: "danger",
          trend: {
            type: "urgent",
            icon: "el-icon-warning",
            text: "紧急"
          }
        }
      ],
      quickActions: [
        {
          key: "huji-query",
          title: "户籍查询",
          subtitle: "快速查询",
          icon: "el-icon-search",
          color: "#1890FF",
          route: "/huji/basic"
        },
        {
          key: "id-card",
          title: "身份证办理",
          subtitle: "证件办理",
          icon: "el-icon-postcard",
          color: "#52C41A",
          route: "/huji/sfz/yw"
        },
        {
          key: "residence-permit",
          title: "居住证办理",
          subtitle: "证件办理",
          icon: "el-icon-house",
          color: "#FA8C16",
          route: "/huji/jzz/yw"
        },
        {
          key: "cross-domain",
          title: "跨域申请",
          subtitle: "协作申请",
          icon: "el-icon-connection",
          color: "#722ED1",
          route: "/crossdomain/apply"
        },
        {
          key: "approval",
          title: "审批管理",
          subtitle: "流程审批",
          icon: "el-icon-s-check",
          color: "#EB2F96",
          route: "/crossdomain/approve"
        },
        {
          key: "system-manage",
          title: "系统管理",
          subtitle: "系统设置",
          icon: "el-icon-setting",
          color: "#13C2C2",
          route: "/system"
        }
      ],
      todoList: [
        {
          id: 1,
          title: "身份证审核",
          time: "2小时前",
          count: 5,
          priority: "high",
          icon: "el-icon-postcard",
          route: "/huji/sfz/yw"
        },
        {
          id: 2,
          title: "跨域申请审批",
          time: "4小时前",
          count: 3,
          priority: "medium",
          icon: "el-icon-connection",
          route: "/crossdomain/approve"
        },
        {
          id: 3,
          title: "居住证到期提醒",
          time: "1天前",
          count: 8,
          priority: "low",
          icon: "el-icon-house",
          route: "/huji/jzz/yw"
        },
        {
          id: 4,
          title: "系统消息",
          time: "2天前",
          count: 2,
          priority: "medium",
          icon: "el-icon-message",
          route: "/system/notice"
        }
      ],
      noticeList: [
        {
          id: 1,
          title: "系统升级通知",
          time: "2025-01-15 10:30",
          type: "info"
        },
        {
          id: 2,
          title: "新政策发布",
          time: "2025-01-14 16:20",
          type: "success"
        },
        {
          id: 3,
          title: "培训安排通知",
          time: "2025-01-13 09:15",
          type: "warning"
        }
      ],
      efficiencyData: [
        {
          key: "certificate-efficiency",
          label: "本月办证效率",
          value: "98.5",
          unit: "%",
          percentage: 98,
          color: "#52C41A"
        },
        {
          key: "response-time",
          label: "跨域协作响应",
          value: "24",
          unit: "小时内",
          percentage: 85,
          color: "#1890FF"
        },
        {
          key: "satisfaction",
          label: "用户满意度",
          value: "4.8",
          unit: "/5.0",
          percentage: 96,
          color: "#FA8C16"
        }
      ],
      loading: false
    }
  },
  mounted() {
    this.updateTime()
    this.timeInterval = setInterval(this.updateTime, 1000)
    this.loadDashboardData()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
    if (this.businessChart) {
      this.businessChart.dispose()
    }
  },
  watch: {
    chartPeriod() {
      this.updateChart()
    }
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    handleQuickAction(action) {
      if (action.route) {
        this.$router.push(action.route)
      }
    },
    handleTodoClick(todo) {
      if (todo.route) {
        this.$router.push(todo.route)
      }
    },
    handleNoticeClick(notice) {
      this.$message.info(`查看通知: ${notice.title}`)
    },
    async refreshTodo() {
      try {
        const res = await getTodoList()
        if (res.code === 200) {
          this.todoList = res.data
          this.$message.success("待办事项已刷新")
        }
      } catch (error) {
        this.$message.error("刷新失败")
      }
    },
    viewAllNotices() {
      this.$router.push('/system/notice')
    },
    initChart() {
      if (this.$refs.businessChart) {
        this.businessChart = echarts.init(this.$refs.businessChart)
        this.updateChart()
      }
    },
    async updateChart() {
      if (!this.businessChart) return

      const chartData = await this.getChartData()

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['户籍办理', '身份证办理', '居住证办理', '跨域申请']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartData.categories
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '户籍办理',
            type: 'line',
            stack: 'Total',
            smooth: true,
            data: chartData.huji
          },
          {
            name: '身份证办理',
            type: 'line',
            stack: 'Total',
            smooth: true,
            data: chartData.idcard
          },
          {
            name: '居住证办理',
            type: 'line',
            stack: 'Total',
            smooth: true,
            data: chartData.residence
          },
          {
            name: '跨域申请',
            type: 'line',
            stack: 'Total',
            smooth: true,
            data: chartData.crossdomain
          }
        ]
      }

      this.businessChart.setOption(option)
    },
    async loadDashboardData() {
      try {
        // 加载统计数据
        const statsRes = await getDashboardStats()
        if (statsRes.code === 200 && statsRes.data.cards) {
          this.dashboardCards = statsRes.data.cards
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }

      try {
        // 加载待办事项
        const todoRes = await getTodoList()
        if (todoRes.code === 200) {
          this.todoList = todoRes.data
        }
      } catch (error) {
        console.error('加载待办事项失败:', error)
      }

      try {
        // 加载通知列表
        const noticeRes = await getNoticeList()
        if (noticeRes.code === 200) {
          this.noticeList = noticeRes.data
        }
      } catch (error) {
        console.error('加载通知列表失败:', error)
      }

      try {
        // 加载工作效率数据
        const efficiencyRes = await getEfficiencyData()
        if (efficiencyRes.code === 200) {
          this.efficiencyData = efficiencyRes.data
        }
      } catch (error) {
        console.error('加载工作效率数据失败:', error)
      }

      try {
        // 加载天气信息
        const weatherRes = await getWeatherInfo()
        if (weatherRes.code === 200) {
          this.weather = weatherRes.data
        }
      } catch (error) {
        console.error('加载天气信息失败:', error)
      }
    },
    async getChartData() {
      try {
        const res = await getBusinessChartData(this.chartPeriod)
        if (res.code === 200) {
          return res.data
        }
      } catch (error) {
        console.error('加载图表数据失败:', error)
      }

      // 降级到静态数据
      const data = {
        week: {
          categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          huji: [12, 15, 18, 22, 25, 20, 16],
          idcard: [8, 12, 15, 18, 20, 16, 12],
          residence: [5, 8, 10, 12, 15, 12, 8],
          crossdomain: [2, 3, 5, 4, 6, 5, 3]
        },
        month: {
          categories: ['第1周', '第2周', '第3周', '第4周'],
          huji: [85, 92, 78, 88],
          idcard: [65, 72, 58, 68],
          residence: [45, 52, 38, 48],
          crossdomain: [25, 32, 18, 28]
        },
        year: {
          categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          huji: [320, 280, 350, 380, 420, 390, 410, 380, 360, 340, 320, 300],
          idcard: [240, 210, 260, 280, 310, 290, 300, 280, 270, 250, 240, 220],
          residence: [160, 140, 180, 200, 220, 200, 210, 190, 180, 170, 160, 150],
          crossdomain: [80, 70, 90, 100, 110, 100, 105, 95, 90, 85, 80, 75]
        }
      }

      return data[this.chartPeriod] || data.month
    }
  }
}
</script>

<style lang="scss" scoped>
.police-dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 84px);

  // 顶部欢迎区域
  .dashboard-header {
    background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
    border-radius: 12px;
    padding: 24px 32px;
    margin-bottom: 24px;
    color: white;
    box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .welcome-info {
        .system-title {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;

          i {
            margin-right: 12px;
            font-size: 32px;
          }
        }

        .system-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
      }

      .header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;

        .weather-info, .current-time {
          display: flex;
          align-items: center;
          font-size: 14px;
          opacity: 0.9;

          i {
            margin-right: 6px;
          }
        }
      }
    }
  }

  // 数据概览卡片
  .dashboard-cards {
    margin-bottom: 24px;

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        i {
          font-size: 28px;
          color: white;
        }
      }

      .card-content {
        flex: 1;

        .card-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .card-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .card-trend {
          font-size: 12px;
          display: flex;
          align-items: center;

          i {
            margin-right: 4px;
          }

          &.up {
            color: #52C41A;
          }

          &.down {
            color: #FF4D4F;
          }

          &.urgent {
            color: #FF4D4F;
            font-weight: 600;
          }
        }
      }

      &.primary .card-icon {
        background: linear-gradient(135deg, #1890FF, #096DD9);
      }

      &.success .card-icon {
        background: linear-gradient(135deg, #52C41A, #389E0D);
      }

      &.warning .card-icon {
        background: linear-gradient(135deg, #FA8C16, #D46B08);
      }

      &.danger .card-icon {
        background: linear-gradient(135deg, #FF4D4F, #CF1322);
      }
    }
  }

  // 快捷操作区域
  .quick-actions {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: #1890FF;
      }
    }

    .action-card {
      background: #fafafa;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        background: white;
        border-color: #1890FF;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(24, 144, 255, 0.2);
      }

      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;

        i {
          font-size: 24px;
          color: white;
        }
      }

      .action-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .action-subtitle {
        font-size: 12px;
        color: #999;
      }
    }
  }

  // 主要内容区域
  .main-content {
    .content-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0;
          display: flex;
          align-items: center;

          i {
            margin-right: 8px;
            color: #1890FF;
          }

          .todo-badge {
            margin-left: 8px;
          }
        }
      }

      // 待办事项列表
      .todo-list {
        .todo-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;

          &:hover {
            background: #f8f9fa;
          }

          &.high {
            border-left-color: #FF4D4F;
          }

          &.medium {
            border-left-color: #FA8C16;
          }

          &.low {
            border-left-color: #52C41A;
          }

          .todo-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;

            i {
              font-size: 18px;
              color: #666;
            }
          }

          .todo-content {
            flex: 1;

            .todo-title {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }

            .todo-time {
              font-size: 12px;
              color: #999;
            }
          }

          .todo-count {
            margin-left: 12px;
          }
        }
      }

      // 通知列表
      .notice-list {
        .notice-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f8f9fa;
            margin: 0 -16px;
            padding: 12px 16px;
            border-radius: 6px;
          }

          .notice-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 12px;

            &.info {
              background: #1890FF;
            }

            &.success {
              background: #52C41A;
            }

            &.warning {
              background: #FA8C16;
            }
          }

          .notice-content {
            flex: 1;

            .notice-title {
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
            }

            .notice-time {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }

      // 图表容器
      .chart-container {
        .business-chart {
          width: 100%;
          height: 300px;
        }
      }

      // 工作效率
      .efficiency-content {
        .efficiency-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          .efficiency-label {
            width: 120px;
            font-size: 14px;
            color: #666;
          }

          .efficiency-value {
            width: 80px;
            text-align: right;
            margin-right: 16px;

            .value {
              font-size: 18px;
              font-weight: 600;
              color: #333;
            }

            .unit {
              font-size: 12px;
              color: #999;
              margin-left: 2px;
            }
          }

          .efficiency-progress {
            flex: 1;
          }
        }
      }
    }
  }

  // 底部信息
  .dashboard-footer {
    background: white;
    border-radius: 12px;
    padding: 20px 32px;
    margin-top: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #666;

      .footer-left, .footer-right {
        display: flex;
        gap: 24px;

        span {
          display: flex;
          align-items: center;

          i {
            margin-right: 6px;
            color: #1890FF;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .police-dashboard {
    padding: 16px;

    .dashboard-header {
      padding: 20px;

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        .header-right {
          align-items: flex-start;
        }
      }
    }

    .dashboard-footer {
      .footer-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;

        .footer-left, .footer-right {
          flex-direction: column;
          gap: 8px;
        }
      }
    }
  }
}
</style>
