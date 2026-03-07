<template>
  <div class="address-select">
    <el-cascader
      v-model="selectedValues"
      :options="options"
      :props="props"
      @change="handleChange"
      placeholder="请选择省/市/区"
      clearable
    ></el-cascader>
  </div>
</template>

<script>
import { getDictData } from "@/api/system/dict/data";

export default {
  name: "AddressSelect",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectedValues: [],
      options: [],
      props: {
        value: "dictValue",
        label: "dictLabel",
        children: "children",
        checkStrictly: true,
        emitPath: false
      },
      provinceList: [],
      cityList: [],
      districtList: []
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && this.options.length > 0) {
          this.selectedValues = val;
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadAddressData();
  },
  methods: {
    // 加载地址数据
    loadAddressData() {
      getDictData("huji_area_code").then(response => {
        const dictData = response.data;
        
        // 提取省级数据
        this.provinceList = dictData.filter(item => 
          item.dictValue.endsWith("0000"));
        
        // 提取市级数据
        this.cityList = dictData.filter(item => 
          !item.dictValue.endsWith("0000") && item.dictValue.substring(2) === "0000");
        
        // 提取区级数据
        this.districtList = dictData.filter(item => 
          !item.dictValue.endsWith("0000") && item.dictValue.substring(4) !== "00");
        
        // 构建级联选择器数据
        this.buildCascaderOptions();
      });
    },
    
    // 构建级联选择器数据结构
    buildCascaderOptions() {
      this.options = this.provinceList.map(province => {
        // 查找当前省下的所有市
        const cities = this.cityList.filter(city => 
          city.dictValue.substring(0, 2) === province.dictValue.substring(0, 2));
        
        return {
          dictValue: province.dictValue,
          dictLabel: province.dictLabel,
          children: cities.map(city => {
            // 查找当前市下的所有区
            const districts = this.districtList.filter(district => 
              district.dictValue.substring(0, 4) === city.dictValue.substring(0, 4));
            
            return {
              dictValue: city.dictValue,
              dictLabel: city.dictLabel,
              children: districts.map(district => ({
                dictValue: district.dictValue,
                dictLabel: district.dictLabel
              }))
            };
          })
        };
      });
      
      // 如果有初始值，设置选中项
      if (this.value) {
        this.selectedValues = this.value;
      }
    },
    
    // 选择变更事件
    handleChange(value) {
      this.$emit("input", value);
      this.$emit("change", value);
    }
  }
};
</script> 