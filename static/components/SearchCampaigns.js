export default {
    template: `
    <div class="container mt-4">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        
        <div class="form-group">
            <input type="text" v-model="searchParams.niche" placeholder="Search by Niche" class="form-control mb-2" />
            <input type="number" v-model="searchParams.budget" placeholder="Search by Budget" class="form-control mb-2" />
            <button @click="searchCampaigns" class="btn btn-primary">Search</button>
        </div>
  
        <div v-if="campaigns.length">
            <h3>Ongoing Campaigns</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Budget</th>
                        <th>Goals</th>
                        <th>Niche</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="campaign in campaigns" :key="campaign.id">
                        <td>{{ campaign.name }}</td>
                        <td>{{ campaign.description }}</td>
                        <td>{{ campaign.start_date }}</td>
                        <td>{{ campaign.end_date }}</td>
                        <td>{{ campaign.budget }}</td>
                        <td>{{ campaign.goals }}</td>
                        <td>{{ campaign.niche }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,

    data() {
        return {
            searchParams: {
                niche: '',
                budget: ''
            },
            campaigns: [],
            error: null
        };
    },

    methods: {
        async searchCampaigns() {
            try {
                const queryParams = new URLSearchParams(this.searchParams).toString();
                const res = await fetch(`/api/search-ongoing-campaigns?${queryParams}`, {
                    headers: { 'Authentication-Token': localStorage.getItem('auth-token') }
                });
                const data = await res.json();
                
                if (res.ok) {
                    this.campaigns = data.campaigns; // Assuming your API returns an array of campaigns
                } else {
                    this.error = data.message || 'Failed to fetch campaigns';
                }
            } catch (error) {
                console.error('An error occurred while searching for campaigns:', error);
                this.error = 'An error occurred while searching for campaigns';
            }
        }
    }
};
