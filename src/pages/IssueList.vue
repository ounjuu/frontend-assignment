<template>
  <div>
    <h1>이슈 목록 페이지입니다.</h1>

    <!-- 상태별 필터링 -->
    <div>
      <button
        v-for="option in statusOptions"
        :key="option.value"
        :class="{ active: selectedStatus === option.value }"
        @click="onStatusChange(option.value)"
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
        <tr v-for="issue in issues" :key="issue.id">
          <td @click="goToIssueDetail(issue.id)" style="cursor: pointer">{{ issue.title }}</td>

          <!-- 상태 드롭다운 -->
          <td>
            <select
              :value="issue.status"
              @change="onStatusChangeHandler(issue, $event.target.value)"
              :disabled="issue.status === 'COMPLETED' || issue.status === 'CANCELLED'"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
                :disabled="isStatusOptionDisabled(issue, option.value)"
              >
                {{ option.label }}
              </option>
            </select>
          </td>

          <!-- 담당자 드롭다운 -->
          <td>
            <select
              :value="issue.user ? issue.user.id : ''"
              @change="onUserChangeHandler(issue, $event.target.value)"
              :disabled="isUserChangeDisabled(issue)"
            >
              <option value="">담당자 없음</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </td>

          <td>{{ new Date(issue.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchIssues, fetchUsers, updateIssueStatus, updateIssueUser } from '@/api/api'

export default {
  name: 'IssueList',
  data() {
    return {
      issues: [],
      users: [],
      selectedStatus: '',
      statusOptions: [
        { label: '전체', value: '' },
        { label: 'PENDING', value: 'PENDING' },
        { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
        { label: 'COMPLETED', value: 'COMPLETED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
      ],
    }
  },
  methods: {
    async loadData() {
      try {
        this.issues = await fetchIssues(this.selectedStatus || null)
        this.users = await fetchUsers()
      } catch (error) {
        console.error(error)
        alert('데이터 불러오기 실패')
      }
    },
    onStatusChange(status) {
      this.selectedStatus = status
      this.loadData()
    },

    goToIssueDetail(issueId) {
      this.$router.push(`/issues/${issueId}`)
    },

    createNewIssue() {
      this.$router.push('/issues/new')
    },

    isStatusChangeDisabled(issue) {
      if (issue.status === 'COMPLETED' || issue.status === 'CANCELLED') return true
      return false
    },
    isStatusOptionDisabled(issue, optionValue) {
      if (!issue.user) {
        return optionValue !== 'PENDING'
      }
      return false
    },

    isUserChangeDisabled(issue) {
      return issue.status === 'COMPLETED' || issue.status === 'CANCELLED'
    },

    filteredStatusOptions(issue) {
      if (!issue.user) {
        // 담당자가 없으면 PENDING만 보이게
        return this.statusOptions.filter((option) => option.value === 'PENDING')
      }
      // 담당자가 있으면 모든 상태 옵션 보여줌
      return this.statusOptions.filter((option) => option.value !== '')
    },

    async onStatusChangeHandler(issue, newStatus) {
      if (this.isStatusChangeDisabled(issue)) {
        alert('담당자가 없거나 완료/취소된 이슈는 상태를 변경할 수 없습니다.')
        return
      }

      try {
        // 실제 API 호출
        await updateIssueStatus(issue.id, newStatus)

        // 로컬 상태 변경
        issue.status = newStatus
        alert('상태가 변경되었습니다.')
      } catch (error) {
        console.error(error)
        alert('상태 변경 실패')
      }
    },

    async onUserChangeHandler(issue, newUserId) {
      if (this.isUserChangeDisabled(issue)) {
        alert('완료 또는 취소된 이슈는 담당자를 변경할 수 없습니다.')
        return
      }

      try {
        // 실제 API 호출
        await updateIssueUser(issue.id, newUserId || null)

        // 로컬 상태 변경
        const newUser = this.users.find((u) => u.id === Number(newUserId)) || null
        issue.user = newUser

        if (newUser && issue.status === 'PENDING') {
          issue.status = 'IN_PROGRESS'
        }

        alert('담당자가 변경되었습니다.')
      } catch (error) {
        console.error(error)
        alert('담당자 변경 실패')
      }
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
