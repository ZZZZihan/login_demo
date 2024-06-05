<template>
    <div class="dashboard">
      <h2>Dashboard</h2>
      <div>
        <button @click="controlLED('on')">Turn LED On</button>
        <button @click="controlLED('off')">Turn LED Off</button>
      </div>
      <div>
        <h3>IO Status: {{ ioStatus }}</h3>
        <button @click="fetchIOStatus">Refresh IO Status</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserDashboard',
    props: ['token'],
    data() {
      return {
        ioStatus: ''
      };
    },
    methods: {
      async controlLED(action) {
        try {
          const response = await axios.post(`http://localhost:3000/led/${action}`, {}, {
            headers: { Authorization: this.token }
          });
          alert(response.data.status);
        } catch (error) {
          alert('Error controlling LED');
        }
      },
      async fetchIOStatus() {
        try {
          const response = await axios.get('http://localhost:3000/io/status', {
            headers: { Authorization: this.token }
          });
          this.ioStatus = response.data.status;
        } catch (error) {
          alert('Error fetching IO status');
        }
      }
    },
    mounted() {
      this.fetchIOStatus();
      setInterval(this.fetchIOStatus, 5000); // Fetch IO status every 5 seconds
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
  }
  </style>
   