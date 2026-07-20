import { describe, it, expect, vi, beforeEach } from 'vitest'
import AxiosMockAdapter from 'axios-mock-adapter'

// removeLocalStorage 호출을 단언하기 위해 storage-cache 전체를 mock한다.
// (실제 모듈은 import 시점에 window 이벤트 리스너를 등록하므로 node 환경에서도 안전해진다.)
vi.mock('@/shared/lib/storage-cache', () => ({
  removeLocalStorage: vi.fn(),
}))

// refreshAccessToken은 전역 axios로 `${API_BASE_URL}/auth/refresh`를 호출한다.
const REFRESH_MATCHER = /\/auth\/refresh$/

// 모듈 상태(isRefreshing/failedQueue) 격리: 매 테스트마다 fresh module graph를 로드한다.
async function loadClient() {
  vi.resetModules()
  const axios = (await import('axios')).default
  const storage = await import('@/shared/lib/storage-cache')
  const mod = await import('@/shared/lib/api-client')
  return {
    apiClient: mod.apiClient,
    ApiError: mod.ApiError,
    removeLocalStorage: vi.mocked(storage.removeLocalStorage),
    instanceMock: new AxiosMockAdapter(mod.apiClient),
    globalMock: new AxiosMockAdapter(axios),
  }
}

describe('apiClient response interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('unwraps a SUCCESS envelope to its inner data', async () => {
    const { apiClient, instanceMock } = await loadClient()
    instanceMock.onGet('/users/1').reply(200, { result: 'SUCCESS', data: { id: 1 }, error: null })
    await expect(apiClient.get('/users/1')).resolves.toEqual({ id: 1 })
  })

  it('throws ApiError for an ERROR envelope on HTTP 200', async () => {
    const { apiClient, ApiError, instanceMock } = await loadClient()
    instanceMock
      .onGet('/x')
      .reply(200, { result: 'ERROR', data: null, error: { message: 'nope', type: 'BAD' } })

    const err = await apiClient.get('/x').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ message: 'nope', code: 'BAD', status: 200 })
  })

  it('supports the legacy fallback shape (success field)', async () => {
    const { apiClient, instanceMock } = await loadClient()
    instanceMock.onGet('/legacy').reply(200, { success: 'ok' })
    await expect(apiClient.get('/legacy')).resolves.toBe('ok')
  })

  it('returns raw data when neither result nor success is present', async () => {
    const { apiClient, instanceMock } = await loadClient()
    instanceMock.onGet('/raw').reply(200, [1, 2, 3])
    await expect(apiClient.get('/raw')).resolves.toEqual([1, 2, 3])
  })
})

describe('apiClient 401 refresh flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('refreshes once and retries the original request on 401', async () => {
    const { apiClient, instanceMock, globalMock, removeLocalStorage } = await loadClient()
    instanceMock.onGet('/protected').replyOnce(401)
    instanceMock.onGet('/protected').replyOnce(200, { result: 'SUCCESS', data: 'ok' })
    globalMock.onPost(REFRESH_MATCHER).reply(200, { result: 'SUCCESS' })

    await expect(apiClient.get('/protected')).resolves.toBe('ok')
    expect(globalMock.history.post).toHaveLength(1)
    expect(removeLocalStorage).not.toHaveBeenCalled()
  })

  it('logs out (removeLocalStorage) when refresh returns 401', async () => {
    const { apiClient, instanceMock, globalMock, removeLocalStorage } = await loadClient()
    instanceMock.onGet('/protected').reply(401)
    globalMock.onPost(REFRESH_MATCHER).reply(401)

    await expect(apiClient.get('/protected')).rejects.toBeDefined()
    expect(removeLocalStorage).toHaveBeenCalledWith('auth-storage')
    // refresh는 전역 axios(인터셉터 미경유)라 재귀 없이 정확히 1회만 호출된다.
    expect(globalMock.history.post).toHaveLength(1)
  })

  it('does NOT log out on a refresh network error', async () => {
    const { apiClient, instanceMock, globalMock, removeLocalStorage } = await loadClient()
    instanceMock.onGet('/protected').reply(401)
    globalMock.onPost(REFRESH_MATCHER).networkError()

    await expect(apiClient.get('/protected')).rejects.toBeDefined()
    expect(removeLocalStorage).not.toHaveBeenCalled()
  })

  it('does NOT log out when refresh responds 200 without SUCCESS', async () => {
    const { apiClient, instanceMock, globalMock, removeLocalStorage } = await loadClient()
    instanceMock.onGet('/protected').reply(401)
    globalMock.onPost(REFRESH_MATCHER).reply(200, { result: 'ERROR' })

    await expect(apiClient.get('/protected')).rejects.toBeDefined()
    expect(removeLocalStorage).not.toHaveBeenCalled()
  })

  it('does not trigger a refresh for the /auth/refresh endpoint itself', async () => {
    const { apiClient, instanceMock, globalMock } = await loadClient()
    instanceMock.onPost('/auth/refresh').reply(401)
    await expect(apiClient.post('/auth/refresh')).rejects.toBeDefined()
    expect(globalMock.history.post).toHaveLength(0)
  })

  it('refreshes only once for concurrent 401s (queue)', async () => {
    const { apiClient, instanceMock, globalMock } = await loadClient()
    instanceMock.onGet('/a').replyOnce(401)
    instanceMock.onGet('/a').replyOnce(200, { result: 'SUCCESS', data: 'a' })
    instanceMock.onGet('/b').replyOnce(401)
    instanceMock.onGet('/b').replyOnce(200, { result: 'SUCCESS', data: 'b' })
    globalMock.onPost(REFRESH_MATCHER).reply(200, { result: 'SUCCESS' })

    const [a, b] = await Promise.all([apiClient.get('/a'), apiClient.get('/b')])
    expect(a).toBe('a')
    expect(b).toBe('b')
    expect(globalMock.history.post).toHaveLength(1)
  })
})
