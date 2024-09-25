export default {
    template: `
    <div class="container mt-4">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        
        <div class="mb-4">
            <button @click="redirectToSearch" class="btn btn-secondary">Search Influencers by Niche or Industry</button>
        </div>
        <div v-if="allUsers.influencer.length">
            <h3>Influencers</h3>
            <div v-for="(user, index) in allUsers.influencer" :key="user.id" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">{{ user.username }}</h5>
                    <p class="card-text">
                        <strong>Email:</strong> {{ user.email }}<br>
                        <strong>Industry:</strong> {{ user.industry }}<br>
                        <strong>Niche:</strong> {{ user.niche }}<br>
                        <strong>Reach:</strong> {{ user.reach }}<br>
                        <strong>Platform:</strong> {{ user.platform }}<br>
                    </p>
                    <button class="btn btn-primary" v-if='!user.active' @click="approve(user.id)">Approve</button>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            allUsers: {
                influencer: []
            },
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async fetchUsers() {
            const queryParams = new URLSearchParams(this.searchParams).toString();
            const res = await fetch(`/search-influencers?${queryParams}`, {
                headers: { 'Authentication-Token': this.token },
            });
            const data = await res.json();
  
            if (res.ok) {
                this.allUsers.influencer = data.influencer;
            } else {
                this.error = res.status;
            }
        },
        async approve(userId) {
            // Logic to approve the user
        },
        redirectToSearch() {
            this.$router.push('/search-influencers-query');
        },
    },
    async mounted() {
        this.fetchUsers();
    },
  }
  