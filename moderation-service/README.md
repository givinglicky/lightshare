# LightShare 内容审核服务

这是一个基于 FastAPI + Google Gemini API 的内容审核微服务。

## 功能特点

- ✅ **AI 审核内容** - 使用 Google Gemini API 进行智能内容审核
- ✅ **本地关键词过滤** - 第一道防线，快速过滤敏感词
- ✅ **异步处理** - FastAPI 异步支持，不阻塞服务器
- ✅ **零成本** - Gemini 1.5 Flash 免费额度充足
- ✅ **易于集成** - 简单的 REST API 接口

## 安装

### 1. 安装依赖

```bash
cd moderation-service
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 Gemini API Key：

```bash
cp .env.example .env
```

在 `.env` 文件中设置：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**获取 Gemini API Key：**
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建或获取你的 API Key
3. 将 Key 填入 `.env` 文件

## 运行服务

### 开发环境

```bash
python main.py
```

服务将在 `http://localhost:8000` 启动。

### 生产环境

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API 端点

### 健康检查

```
GET /health
```

响应：
```json
{
  "status": "ok"
}
```

### 内容审核

```
POST /api/moderate
```

请求体：
```json
{
  "content": "要审核的内容",
  "title": "标题（可选）"
}
```

响应（通过）：
```json
{
  "status": "approved",
  "message": "内容安全，准予发布",
  "confidence": 0.95
}
```

响应（拒绝）：
```json
{
  "status": "blocked",
  "message": "内容审核未通过",
  "reason": "内容包含敏感词汇: 暴力"
}
```

## 前端集成示例

### JavaScript/TypeScript

```typescript
async function submitPost(content: string, title?: string) {
  try {
    const response = await fetch('http://localhost:8000/api/moderate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        title: title || ''
      })
    });

    const result = await response.json();

    if (result.status === 'blocked') {
      alert(`发文失败！原因：${result.reason}`);
      return false;
    } else {
      alert('发文成功！');
      // 执行存入数据库的逻辑
      return true;
    }
  } catch (error) {
    console.error('审核请求失败:', error);
    return false;
  }
}
```

### React Hook 示例

```typescript
import { useState } from 'react';

export function useModeration() {
  const [isChecking, setIsChecking] = useState(false);

  const checkContent = async (content: string, title?: string) => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: title || '' })
      });
      const result = await response.json();
      return result;
    } finally {
      setIsChecking(false);
    }
  };

  return { checkContent, isChecking };
}
```

## 部署

### Zeabur 部署

1. 在项目根目录创建 `zeabur.yaml`:

```yaml
services:
  - name: moderation-service
    type: web
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
    env:
      GEMINI_API_KEY: ${GEMINI_API_KEY}
```

2. 在 Zeabur 控制台设置环境变量 `GEMINI_API_KEY`

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
```

构建并运行：

```bash
docker build -t moderation-service .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key moderation-service
```

## 自定义敏感词

在 `main.py` 中修改 `SENSITIVE_WORDS` 列表：

```python
SENSITIVE_WORDS = [
    "暴力", "色情", "仇恨", "辱骂", "威胁",
    "诈骗", "赌博", "毒品", "自杀", "自残",
    # 添加更多敏感词...
]
```

## 成本说明

- **Gemini 1.5 Flash 免费额度**：
  - 每分钟 15 次请求
  - 每天 1500 次请求
  - 完全免费

对于个人小型应用，免费额度完全足够。

## 故障排除

### 问题：未设置 GEMINI_API_KEY

服务会自动回退到本地关键词过滤模式，仅使用敏感词列表进行审核。

### 问题：API 请求超时

检查网络连接，确保能访问 Google API。在中国大陆可能需要代理。

## 许可证

MIT License
