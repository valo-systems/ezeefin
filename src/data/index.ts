import type { DataRepo } from './types'
import { mockRepo } from './mock'
import { apiRepo } from './api'

export const DATA_MODE = (import.meta.env.VITE_DATA_MODE ?? 'mock') as 'mock' | 'api'
export const repo: DataRepo = DATA_MODE === 'api' ? apiRepo : mockRepo
export * from './types'
export * from './concierge'
