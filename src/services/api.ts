const API_URL = '/api';

/**
 * 通用的 fetch 封裝，處理 Token 與錯誤
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error?.message || '發生錯誤');
    }

    return result.data as T;
}

/**
 * 默認導出的 API 對象，提供便捷的 HTTP 方法
 */
export default {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
