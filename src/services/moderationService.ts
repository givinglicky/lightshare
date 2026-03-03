/**
 * 内容审核服务
 * 用于调用 FastAPI 审核服务进行内容检查
 */

const MODERATION_SERVICE_URL = import.meta.env.VITE_MODERATION_SERVICE_URL || 'http://localhost:8000';

/**
 * 审核结果接口
 */
export interface ModerationResult {
  status: 'approved' | 'blocked';
  message: string;
  reason?: string;
  confidence?: number;
}

/**
 * 审核请求接口
 */
export interface ModerationRequest {
  content: string;
  title?: string;
}

/**
 * 内容审核服务类
 */
export class ModerationService {
  private baseUrl: string;

  constructor(baseUrl: string = MODERATION_SERVICE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 审核内容
   * @param content 要审核的内容
   * @param title 标题（可选）
   * @returns 审核结果
   */
  async moderate(content: string, title?: string): Promise<ModerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title: title || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`审核服务请求失败: ${response.status}`);
      }

      const result: ModerationResult = await response.json();
      return result;
    } catch (error) {
      console.error('内容审核失败:', error);
      return {
        status: 'approved',
        message: '审核服务暂时不可用，内容已通过',
      };
    }
  }

  /**
   * 检查内容是否安全
   * @param content 要检查的内容
   * @param title 标题（可选）
   * @returns 是否安全
   */
  async isSafe(content: string, title?: string): Promise<boolean> {
    const result = await this.moderate(content, title);
    return result.status === 'approved';
  }

  /**
   * 健康检查
   * @returns 服务是否正常
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * 默认审核服务实例
 */
export const moderationService = new ModerationService();
