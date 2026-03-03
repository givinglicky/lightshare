/**
 * 内容审核 Hook
 * 提供内容审核功能的 React Hook
 */

import { useState, useCallback } from 'react';
import { moderationService, ModerationResult } from '../services/moderationService';

/**
 * Hook 返回值接口
 */
interface UseModerationReturn {
  isChecking: boolean;
  result: ModerationResult | null;
  checkContent: (content: string, title?: string) => Promise<ModerationResult>;
  isSafe: (content: string, title?: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * 内容审核 Hook
 * @returns 审核功能对象
 */
export function useModeration(): UseModerationReturn {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ModerationResult | null>(null);

  /**
   * 检查内容
   */
  const checkContent = useCallback(async (content: string, title?: string): Promise<ModerationResult> => {
    setIsChecking(true);
    try {
      const moderationResult = await moderationService.moderate(content, title);
      setResult(moderationResult);
      return moderationResult;
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * 检查内容是否安全
   */
  const isSafe = useCallback(async (content: string, title?: string): Promise<boolean> => {
    const moderationResult = await checkContent(content, title);
    return moderationResult.status === 'approved';
  }, [checkContent]);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setResult(null);
    setIsChecking(false);
  }, []);

  return {
    isChecking,
    result,
    checkContent,
    isSafe,
    reset,
  };
}
