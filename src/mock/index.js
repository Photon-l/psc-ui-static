/**
 * Mock 数据拦截器
 * 用于在没有后端服务的情况下模拟 API 响应
 */
import axios from 'axios'

// 是否启用 Mock
const MOCK_ENABLED = true

// 模拟网络延迟（毫秒）
const MOCK_DELAY = 300

// Mock 数据存储
const mockData = new Map()

/**
 * 注册 Mock 接口
 * @param {string} method - 请求方法 (get, post, put, delete)
 * @param {string|RegExp} url - 请求 URL 或正则表达式
 * @param {Function|Object} response - 响应数据或响应函数
 */
export function registerMock(method, url, response) {
  const key = `${method.toUpperCase()}:${url}`
  mockData.set(key, response)
}

/**
 * 匹配 Mock 接口
 * @param {string} method - 请求方法
 * @param {string} url - 请求 URL
 * @returns {Function|Object|null} 匹配的响应数据或函数
 */
function matchMock(method, url) {
  const upperMethod = method.toUpperCase()
  
  // 移除 baseURL 前缀，只保留路径部分
  let cleanUrl = url
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      cleanUrl = urlObj.pathname
    } catch (e) {
      // 如果解析失败，使用原始 URL
    }
  }
  
  console.log('[Mock] 尝试匹配:', upperMethod, cleanUrl)
  
  // 精确匹配
  const exactKey = `${upperMethod}:${cleanUrl}`
  if (mockData.has(exactKey)) {
    console.log('[Mock] 精确匹配成功:', exactKey)
    return mockData.get(exactKey)
  }
  
  // 正则匹配
  for (const [key, value] of mockData.entries()) {
    const [mockMethod, mockUrl] = key.split(':')
    if (mockMethod === upperMethod) {
      try {
        const regex = new RegExp(mockUrl)
        if (regex.test(cleanUrl)) {
          console.log('[Mock] 正则匹配成功:', key, '匹配', cleanUrl)
          return value
        }
      } catch (e) {
        // 不是正则表达式，跳过
      }
    }
  }
  
  console.log('[Mock] 未找到匹配的 Mock 接口')
  return null
}

/**
 * 生成 Mock 响应
 * @param {Function|Object} mockResponse - Mock 响应配置
 * @param {Object} config - 请求配置
 * @returns {Promise} 响应 Promise
 */
function generateMockResponse(mockResponse, config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let responseData
        
        // 如果是函数，执行函数获取响应数据
        if (typeof mockResponse === 'function') {
          responseData = mockResponse(config)
        } else {
          responseData = mockResponse
        }
        
        // 确保响应数据格式正确
        const response = {
          data: responseData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config,
          request: {}
        }
        
        resolve(response)
      } catch (error) {
        reject(error)
      }
    }, MOCK_DELAY)
  })
}

/**
 * 初始化 Mock 拦截器
 */
export function setupMock() {
  if (!MOCK_ENABLED) {
    console.log('[Mock] Mock 功能已禁用')
    return
  }
  
  console.log('[Mock] Mock 功能已启用')
  
  // 请求拦截器 - 在发送请求前拦截
  axios.interceptors.request.use(
    config => {
      const mockResponse = matchMock(config.method, config.url)
      
      if (mockResponse) {
        console.log(`[Mock] 拦截请求: ${config.method.toUpperCase()} ${config.url}`)
        
        // 标记为 Mock 请求
        config.adapter = () => {
          return generateMockResponse(mockResponse, config)
        }
      }
      
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
}

/**
 * 创建成功响应
 * @param {*} data - 响应数据
 * @param {string} msg - 响应消息
 * @returns {Object} 标准响应格式
 */
export function createSuccessResponse(data = null, msg = '操作成功') {
  return {
    code: 200,
    msg: msg,
    data: data
  }
}

/**
 * 创建分页响应
 * @param {Array} rows - 数据列表
 * @param {number} total - 总数
 * @param {string} msg - 响应消息
 * @returns {Object} 分页响应格式
 */
export function createPageResponse(rows = [], total = 0, msg = '查询成功') {
  return {
    code: 200,
    msg: msg,
    rows: rows,
    total: total
  }
}

/**
 * 创建错误响应
 * @param {string} msg - 错误消息
 * @param {number} code - 错误码
 * @returns {Object} 错误响应格式
 */
export function createErrorResponse(msg = '操作失败', code = 500) {
  return {
    code: code,
    msg: msg,
    data: null
  }
}

// 导出默认对象
export default {
  setup: setupMock,
  register: registerMock,
  createSuccessResponse,
  createPageResponse,
  createErrorResponse
}
