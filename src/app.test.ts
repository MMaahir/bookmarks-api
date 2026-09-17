import { app } from './app.js'
import { describe, expect, test } from 'vitest'

describe("app", () => {
  test("GET /healthz", async () => {
    const res = await app.request('/healthz')
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    expect(await res.json()).toEqual({
      status: 'ok',
    })
  })
})
