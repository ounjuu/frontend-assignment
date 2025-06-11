// src/api/api.js

import { issues, users } from '../data/mockData'
import axios from 'axios'

// 개발 모드에 따라 실제 서버 호출 또는 mock 데이터 반환
const mode = import.meta.env.VITE_MODE || 'DEV'
export async function fetchIssues(status) {
  if (mode === 'DEV') {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!status) {
          resolve(issues)
        } else {
          resolve(issues.filter((issue) => issue.status === status))
        }
      }, 300)
    })
  } else {
    const url = status ? `/api/issues?status=${status}` : '/api/issues'
    const res = await fetch(`http://localhost:8080${url}`)
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

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 운영 모드 base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// 상태 변경 API 호출 함수
export async function updateIssueStatus(issueId, status) {
  if (mode === 'DEV') {
    // mock 모드면 issues 배열 업데이트 (간단하게 직접 변경)
    const issue = issues.find((i) => i.id === issueId)
    if (issue) issue.status = status
    return issue
  } else {
    const response = await api.patch(`/api/issues/${issueId}`, { status })
    return response.data
  }
}

// 담당자 변경 API 호출 함수
export async function updateIssueUser(issueId, userId) {
  if (mode === 'DEV') {
    const issue = issues.find((i) => i.id === issueId)
    if (issue) {
      issue.user = users.find((u) => u.id === userId) || null
      // 담당자가 있으면 상태 IN_PROGRESS로 자동 변경
      if (userId && issue.status === 'PENDING') issue.status = 'IN_PROGRESS'
      // 담당자 없으면 상태 PENDING으로 변경
      if (!userId && issue.status === 'IN_PROGRESS') issue.status = 'PENDING'
    }
    return issue
  } else {
    const response = await api.patch(`/api/issues/${issueId}`, {
      userId: userId || null,
    })
    return response.data
  }
}

export default api
