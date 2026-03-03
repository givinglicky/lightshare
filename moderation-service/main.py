"""
LightShare 内容审核服务
使用 FastAPI + Google Gemini API 进行内容审核
"""

import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

# 加载环境变量
load_dotenv()

# 配置 Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("警告: 未设置 GEMINI_API_KEY，内容审核功能将使用本地关键词过滤")

app = FastAPI(
    title="LightShare 内容审核服务",
    description="使用 AI 进行内容审核的微服务",
    version="1.0.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义请求和响应模型
class PostContent(BaseModel):
    content: str
    title: Optional[str] = ""

class ModerationResult(BaseModel):
    status: str
    message: str
    reason: Optional[str] = None
    confidence: Optional[float] = None

# 敏感词列表（本地第一道防线）
SENSITIVE_WORDS = [
    "暴力", "色情", "仇恨", "辱骂", "威胁",
    "诈骗", "赌博", "毒品", "自杀", "自残"
]

def quick_local_check(text: str) -> tuple[bool, str]:
    """
    本地关键词快速检查
    返回: (是否安全, 原因)
    """
    text_lower = text.lower()
    for word in SENSITIVE_WORDS:
        if word in text_lower:
            return False, f"内容包含敏感词汇: {word}"
    return True, ""

async def ai_moderation(content: str, title: str = "") -> ModerationResult:
    """
    使用 Gemini AI 进行内容审核
    """
    if not model:
        # 如果没有配置 API Key，使用本地检查
        is_safe, reason = quick_local_check(content)
        if not is_safe:
            return ModerationResult(
                status="blocked",
                message="内容审核未通过",
                reason=reason
            )
        return ModerationResult(
            status="approved",
            message="内容安全，准予发布"
        )

    # 构建审核提示词
    prompt = f"""
你是一个社区平台的内容审核员。请检查以下内容是否包含：
1. 暴力或威胁性内容
2. 色情或露骨内容
3. 辱骂或仇恨言论
4. 诈骗或虚假信息
5. 其他违反社区准则的内容

标题：{title}
内容：{content}

如果内容是安全的，请只回复 'PASS'。
如果内容违规，请回复 'REJECT' 并简要说明原因（使用中文）。

请直接回复结果，不要添加其他解释。
"""

    try:
        response = model.generate_content(prompt)
        result = response.text.strip()

        if "REJECT" in result:
            reason = result.replace("REJECT", "").strip()
            return ModerationResult(
                status="blocked",
                message="内容审核未通过",
                reason=reason if reason else "内容违反社区准则"
            )

        return ModerationResult(
            status="approved",
            message="内容安全，准予发布",
            confidence=0.95
        )

    except Exception as e:
        print(f"AI 审核出错: {str(e)}")
        # 如果 AI 出错，回退到本地检查
        is_safe, reason = quick_local_check(content)
        if not is_safe:
            return ModerationResult(
                status="blocked",
                message="内容审核未通过",
                reason=reason
            )
        return ModerationResult(
            status="approved",
            message="内容安全，准予发布"
        )

@app.get("/")
async def root():
    """健康检查端点"""
    return {
        "service": "LightShare 内容审核服务",
        "status": "running",
        "version": "1.0.0",
        "ai_enabled": model is not None
    }

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "ok"}

@app.post("/api/moderate", response_model=ModerationResult)
async def moderate_content(post: PostContent):
    """
    内容审核主端点
    接收内容并返回审核结果
    """
    if not post.content or not post.content.strip():
        raise HTTPException(status_code=400, detail="内容不能为空")

    # 第一道防线：本地关键词检查
    is_safe, reason = quick_local_check(post.content)
    if not is_safe:
        return ModerationResult(
            status="blocked",
            message="内容审核未通过",
            reason=reason
        )

    # 第二道防线：AI 审核
    return await ai_moderation(post.content, post.title or "")

@app.post("/api/check-post", response_model=ModerationResult)
async def check_post(post: PostContent):
    """
    兼容旧版 API 端点
    """
    return await moderate_content(post)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
