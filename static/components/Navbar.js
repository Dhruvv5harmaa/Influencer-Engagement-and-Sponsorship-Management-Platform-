export default {
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Live Session</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
   
    <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
        </li>
        <li class="nav-item" v-if="role=='admin' ">
          <router-link class="nav-link" to="/users">Users</router-link>
        </li>
        <li class="nav-item" v-if="role=='influencer'">
              <router-link class="nav-link" to="/pending-requests">Advertisement Requests</router-link>
        </li>
        <li class="nav-item" v-if="role=='influencer'">
              <router-link class="nav-link" to="/ad-request-history">Ad Request History</router-link> <!-- New item for history -->
        </li>
        <li class="nav-item" v-if="role=='influencer'">
            <router-link class="nav-link" to="/search-campaigns">Search Ongoing Campaigns</router-link> <!-- New item for searching campaigns -->
        </li>
        <li class="nav-item" v-if="role=='sponsor'">
          <router-link class="nav-link" to="/pending-ad-requests-sponsor">Pending Ad Requests</router-link>
        </li>
     
         <li class="nav-item" v-if="role=='sponsor' ">
          <router-link class="nav-link" to="/create-campaign">Create Campaign</router-link>
        </li>
        </li>
         <li class="nav-item" v-if="role=='sponsor' ">
          <router-link class="nav-link" to="/search-influencers">Search Influencer</router-link>
        </li>
        <li class="nav-item" v-if='is_login'>
          <button class="nav-link" @click='logout'>Logout</button>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown link
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>`,
  data() {
    return {
      role: localStorage.getItem("role"),
      is_login: localStorage.getItem("auth-token"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("role")
      this.$router.push({path:'/login'})
    },
  },
};


