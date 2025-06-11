<template>
  <div>
    <h1>{{ isEditMode ? '이슈 상세/수정' : '새 이슈 생성' }}</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label>제목</label>
        <input v-model="form.title" required />
      </div>

      <div>
        <label>설명</label>
        <textarea v-model="form.description" required></textarea>
      </div>

      <div>
        <label>상태</label>
        <select v-model="form.status" required>
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div>
        <label>담당자</label>
        <select v-model="form.assigneeId" required>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <button type="submit">저장</button>
      <button type="button" @click="goBack">목록으로 돌아가기</button>
    </form>
  </div>
</template>

<script>
import { users, issues } from '@/data/mockData.js'

export default {
  name: 'IssueForm',
  props: {
    issueId: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      users, // mock 유저 데이터
      form: {
        title: '',
        description: '',
        status: 'PENDING',
        assigneeId: users.length ? users[0].id : null, // 기본값 첫 유저
      },
    }
  },
  computed: {
    isEditMode() {
      return !!this.issueId
    },
  },
  methods: {
    loadIssue() {
      if (!this.isEditMode) return

      const issue = issues.find((i) => i.id === Number(this.issueId))
      if (issue) {
        this.form = {
          title: issue.title,
          description: issue.description,
          status: issue.status,
          assigneeId: issue.assigneeId,
        }
      }
    },
    handleSubmit() {
      if (this.isEditMode) {
        // 수정 로직 (여기서는 콘솔 출력)
        console.log('이슈 수정:', this.issueId, this.form)
        alert('이슈가 수정되었습니다.')
      } else {
        // 생성 로직 (여기서는 콘솔 출력)
        console.log('새 이슈 생성:', this.form)
        alert('새 이슈가 생성되었습니다.')
      }
      this.goBack()
    },
    goBack() {
      this.$router.push({ name: 'IssueList' })
    },
  },
  mounted() {
    console.log('issueId:', this.issueId)
    this.loadIssue()
  },
}
</script>

<style scoped>
form > div {
  margin-bottom: 12px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}
input,
textarea,
select {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}
button {
  margin-right: 8px;
  padding: 6px 12px;
  cursor: pointer;
}
</style>

<!-- <template>
  <div>
    <p>이슈 생성/상세/수정 페이지입니다.</p>
  </div>
</template>

<script>
/*
  TODO: 이 컴포넌트를 재사용 가능하게 설계해보세요.
  - 같은 폼 구조와 로직을 재사용하여 코드 중복을 방지하세요.
*/
export default {
  name: 'IssueForm',
}
</script> -->
