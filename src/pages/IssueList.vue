<template>
  <div>
    <h1>이슈 목록 페이지입니다.</h1>

    <!-- 상태별 필터링 -->
    <div>
      <button
        v-for="option in statusOptions"
        :key="option.value"
        :class="{ active: selectedStatus === option.value }"
        @click="selectedStatus = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- 새 이슈 생성 버튼 -->
    <button @click="createNewIssue">새 이슈 생성</button>

    <!-- 이슈 목록 -->
    <table>
      <thead>
        <tr>
          <th>제목</th>
          <th>상태</th>
          <th>담당자</th>
          <th>생성일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="issue in filteredIssues"
          :key="issue.id"
          @click="goToIssueDetail(issue.id)"
          style="cursor: pointer"
        >
          <td>{{ issue.title }}</td>
          <td>{{ issue.status }}</td>
          <td>{{ issue.user ? issue.user.name : '담당자 없음' }}</td>
          <td>{{ issue.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchIssues, fetchUsers } from '@/api/api'

export default {
  name: 'IssueList',
  data() {
    return {
      issues: [],
      users: [],
      selectedStatus: 'ALL',
      statusOptions: [
        { label: '전체', value: 'ALL' },
        { label: 'PENDING', value: 'PENDING' },
        { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
        { label: 'COMPLETED', value: 'COMPLETED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
      ],
    }
  },
  computed: {
    filteredIssues() {
      if (this.selectedStatus === 'ALL') {
        return this.issues
      }
      return this.issues.filter((issue) => issue.status === this.selectedStatus)
    },
  },
  methods: {
    async loadData() {
      this.issues = await fetchIssues()
      this.users = await fetchUsers()
    },
    goToIssueDetail(issueId) {
      this.$router.push(`/issues/${issueId}`)
    },
    createNewIssue() {
      this.$router.push('/issues/new')
    },
  },
  mounted() {
    this.loadData()
  },
}
</script>

<style scoped>
button {
  margin-right: 8px;
  padding: 4px 8px;
  cursor: pointer;
}
button.active {
  background-color: #007bff;
  color: white;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
tr:hover {
  background-color: #f0f0f0;
}
</style>
