export default {
    template: `
    <div>
        <div v-if="error">{{ error }}</div>

        <div v-if="allUsers.admin.length">
            <h3>Admins</h3>
            <div v-for="(user, index) in allUsers.admin" :key="user.id">
                {{ user.email }}
                <button class="btn btn-primary" v-if='!user.active' @click="approve(user.id)">Approve</button>
            </div>
        </div>

        <div v-if="allUsers.sponsor.length">
            <h3>Sponsors</h3>
            <div v-for="(user, index) in allUsers.sponsor" :key="user.id">
                {{ user.email }}
                <button class="btn btn-primary" v-if='!user.active' @click="approve(user.id)">Approve</button>
            </div>
        </div>

        <div v-if="allUsers.influencer.length">
            <h3>Influencers</h3>
            <div v-for="(user, index) in allUsers.influencer" :key="user.id">
                {{ user.email }}
                <button class="btn btn-primary" v-if='!user.active' @click="approve(user.id)">Approve</button>
            </div>
        </div>
    </div>`,
    data() {
        return {
            allUsers: {
                admin: [],
                sponsor: [],
                influencer: []
            },
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async approve(instId) {
            const res = await fetch(`/activate/instructor/${instId}`, {
                headers: {
                    "Authentication-Token": this.token,
                }
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                // Optionally refresh the user list here
                this.fetchUsers();
            }
        },
        async fetchUsers() {
            const res = await fetch('/users', {
                headers: { 'Authentication-Token': this.token },
            });
            const data = await res.json().catch((e) => {});

            if (res.ok) {
                this.allUsers = data;
            } else {
                this.error = res.status;
            }
        }
    },
    async mounted() {
        this.fetchUsers();
    },
}

