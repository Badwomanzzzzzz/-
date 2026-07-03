import { defineStore } from 'pinia';
import api from '../services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    userInfo: (state) => state.user,
    isAdmin: (state) => state.user?.roles?.includes('管理员') || false,
    hasRole: (state) => (role) => state.user?.roles?.includes(role) || false
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/auth/login', { username, password });
        this.token = response.token;
        this.user = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async register(username, password, name, email, phone) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/auth/register', { username, password, name, email, phone });
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || '注册失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});
