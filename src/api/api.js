// src/api/api.js

import { issues, users } from '../data/mockData'

// 개발 모드에 따라 실제 서버 호출 또는 mock 데이터 반환
const mode = import.meta.env.VITE_MODE || 'DEV'

export async function fetchIssues() {
  if (mode === 'DEV') {
    // mock 데이터 바로 반환 (실제 서버 호출 없이)
    return new Promise((resolve) => setTimeout(() => resolve(issues), 300))
  } else {
    // 운영 모드: 실제 API 서버에 요청 (예시)
    const res = await fetch('http://localhost:8080/api/issues')
    if (!res.ok) throw new Error('API 호출 실패')
    return res.json()
  }
}

export async function fetchUsers() {
  if (mode === 'DEV') {
    return new Promise((resolve) => setTimeout(() => resolve(users), 300))
  } else {
    const res = await fetch('http://localhost:8080/api/users')
    if (!res.ok) throw new Error('API 호출 실패')
    return res.json()
  }
}
