export default {
    template: `

    <div>
        <input type="text" placeholder="Campaign Name" v-model="campaign.name"/>
        <input type="text" placeholder="Description" v-model="campaign.description"/>
        <input type="date" placeholder="Start Date" v-model="campaign.start_date"/>
        <input type="date" placeholder="End Date" v-model="campaign.end_date"/>
        <input type="number" placeholder="Budget" v-model="campaign.budget"/>
        <select v-model="campaign.visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
        </select>
        <input type="text" placeholder="Goals" v-model="campaign.goals"/>
        <input type="text" placeholder="Niche" v-model="campaign.niche"/>
        <button @click="createCampaign">Create Campaign</button>
  
    </div>
    `,
    data() {
        return {
            campaign: {
                name: null,
                description: null,
                start_date: null,
                end_date: null,
                budget: null,
                visibility: 'public',
                goals: null,
                niche: null,
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async createCampaign() {
            console.log(this.campaign);
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.campaign),
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
            } else {
                alert(data.message);
            }
        },
    },
};
