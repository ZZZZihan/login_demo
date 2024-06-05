<template>
  <div id="app">
    <RegisterForm v-if="!isLoggedIn && showRegister" @register-success="handleRegisterSuccess" />
    <LoginForm v-if="!isLoggedIn && !showRegister" @login="handleLogin" />
    <UserDashboard v-if="isLoggedIn" :token="token" />
    <button v-if="!isLoggedIn" @click="toggleRegister">{{ showRegister ? 'Back to Login' : 'Register' }}</button>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import UserDashboard from './components/UserDashboard.vue';

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      token: null,
      showRegister: false
    };
  },
  methods: {
    handleLogin(token) {
      this.token = token;
      this.isLoggedIn = true;
      this.showRegister = false;
    },
    toggleRegister() {
      this.showRegister = !this.showRegister;
    },
    handleRegisterSuccess() {
      this.showRegister = false;
      alert('Registration successful! Please login.');
    }
  },
  components: {
    LoginForm,
    RegisterForm,
    UserDashboard
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
