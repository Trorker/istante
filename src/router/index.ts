import { createRouter, createWebHistory } from 'vue-router'
const router=createRouter({history:createWebHistory(import.meta.env.BASE_URL),routes:[
  {path:'/',name:'dashboard',component:()=>import('../views/DashboardView.vue')},
  {path:'/calendar',name:'calendar',component:()=>import('../views/CalendarView.vue')},
  {path:'/project',name:'project',component:()=>import('../views/ProjectView.vue')},
  {path:'/settings',name:'settings',component:()=>import('../views/SettingsView.vue')},
  {path:'/:pathMatch(.*)*',name:'404',component:()=>import('../views/NotFoundView.vue')},
]})
export default router
