// src/api/issueService.js
import api from './api'

export const fetchIssues = async (status = null) => {
  if (process.env.NODE_ENV === 'development') {
    const { issues } = await import('@/data/mockData.js')
    return status ? issues.filter((i) => i.status === status) : issues
  }

  const response = await api.get('/issues', {
    params: status ? { status } : {},
  })
  return response.data.issues
}
