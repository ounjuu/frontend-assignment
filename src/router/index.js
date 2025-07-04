import { createRouter, createWebHistory } from 'vue-router'
import IssueList from '../pages/IssueList.vue'
import IssueForm from '../pages/IssueForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/issues',
  },
  {
    path: '/issues',
    name: 'IssueList',
    component: IssueList,
  },
  {
    path: '/issues/new',
    name: 'IssueCreate',
    component: IssueForm,
  },
  {
    path: '/issues/:id',
    name: 'IssueEdit',
    component: IssueForm,
    props: (route) => ({ issueId: route.params.id }),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
