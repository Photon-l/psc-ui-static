<template>
  <div class="area-tree-select">
    <el-tree
      ref="tree"
      :data="options"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expand-all="false"
      :highlight-current="true"
      node-key="id"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
import { getAreaList } from "@/api/huji/basic";

export default {
  name: "AreaTreeSelect",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      options: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectedNode: null
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && this.options.length > 0) {
          this.$nextTick(() => {
            this.setCurrentKey(val);
          });
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadAreaData();
  },
  methods: {
    // 加载地区数据
    loadAreaData() {
      getAreaList().then(response => {
        this.options = response.data;
        console.log("地区树数据加载成功:", this.options);
        // 如果有初始值，设置选中项
        if (this.value) {
          this.$nextTick(() => {
            this.setCurrentKey(this.value);
          });
        }
      }).catch(error => {
        console.error("加载地区数据失败:", error);
      });
    },
    
    // 设置当前选中节点
    setCurrentKey(key) {
      if (this.$refs.tree) {
        this.$refs.tree.setCurrentKey(key);
      }
    },
    
    // 节点点击事件
    handleNodeClick(data) {
      this.selectedNode = data;
      this.$emit("input", data.value);
      this.$emit("change", data.value, data.label);
    }
  }
};
</script>

<style scoped>
.area-tree-select {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 5px;
}
</style> 