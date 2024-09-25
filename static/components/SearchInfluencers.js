export default {
    template: `
    <div class="container mt-4">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        
        <div class="form-group">
            <input type="text" v-model="searchParams.niche" placeholder="Search by Niche" class="form-control mb-2" />
            <input type="text" v-model="searchParams.industry" placeholder="Search by Industry" class="form-control mb-2" />
            <button @click="fetchUsers" class="btn btn-primary">Search</button>
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
                    <button class="btn btn-success" @click="openAdRequestForm(user)">Send Ad Request</button>
                </div>
            </div>
        </div>



        
        <!-- Ad Request Modal -->
        <!-- Ad Request Modal -->
        <!-- Ad Request Modal -->
        <!-- Ad Request Modal -->
        <div v-if="showAdRequestForm" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Send Ad Request to {{ selectedUser.username }}</h5>
                        <button type="button" class="close" @click="closeAdRequestForm">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group">
                            <label for="campaignSelect">Select Campaign</label>
                            <select v-model="adRequestDetails.campaign_id" class="form-control" id="campaignSelect">
                                <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                                    {{ campaign.name }}
                                </option>
                            </select>
                        </div>

                    </div>
                    <div class="modal-body">
                    <div class="form-group">
                        <label for="adDetails">Ad Details</label>
                        <input type="text" v-model="adRequestDetails.messages" class="form-control" id="adDetails" />
                    </div>

                    <div class="form-group">
                        <label for="requirements">Requirements</label>
                        <input type="text" v-model="adRequestDetails.requirements" class="form-control" id="requirements" />
                    </div>

                    <div class="form-group">
                        <label for="paymentAmount">Payment Amount</label>
                        <input type="number" v-model="adRequestDetails.payment_amount" class="form-control" id="paymentAmount" />
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeAdRequestForm">Close</button>
                        <button type="button" class="btn btn-primary" @click="sendAdRequest">Send Request</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showOverlay" class="modal-backdrop fade show"></div>



    </div>`,
    data() {
        return {
            

            searchParams: {
                niche: '',
                industry: ''
            },
            campaigns: [],  // Array to hold the list of campaigns
            allUsers: {
                influencer: []
            },
            token: localStorage.getItem('auth-token'),
            error: null,
            showAdRequestForm: false,
            selectedUser: null,
            adRequestDetails: {
                messages: '',        // Ad message details
                requirements: '',     // Ad request requirements
                payment_amount: '',   // Payment amount for the ad request
                campaign_id: ''       // Campaign ID for the ad request
            },
            showOverlay: false
        }
    },
    methods: {
        async fetchCampaigns() {
            const res = await fetch('/api/get-campaigns', {
                headers: { 'Authentication-Token': localStorage.getItem('auth-token') }
            });  // Ensure the token is sent in the header
            const data = await res.json();
            if (res.ok) {
                this.campaigns = data.campaigns;  // Assuming your API returns an array of campaigns 
            } else {
                console.error('Error fetching campaigns:', data.message);
            }
        },

        async fetchUsers() {
            const queryParams = new URLSearchParams(this.searchParams).toString();
            const res = await fetch(`/search-influencers-query?${queryParams}`, {
                headers: { 'Authentication-Token': this.token },
            });
            const data = await res.json();
  
            if (res.ok) {
                this.allUsers.influencer = data.influencer;
            } else {
                this.error = res.status;
            }
        },
        openAdRequestForm(user) {
            this.selectedUser = user;
            this.showAdRequestForm = true;
            this.showOverlay = true;
        },
        closeAdRequestForm() {
            this.selectedUser = null;
            this.adRequestDetails = '';
            this.showAdRequestForm = false;
            this.showOverlay = false;
        },
        async sendAdRequest() {
            // ADD CONDITION TO CHECK FOR THE ADREQUEST FIELD IS EMPTY OR NOT BEFORE SENDING>>>>

            // if (this.adRequestDetails.trim() === '') {
            // if(!this.adRequestDetails || !this.adRequestDetails.messages ===''){-
                
            //     alert("Please enter all details before sending.");
            //     return;
            // }

            const res = await fetch(`/send-ad-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                // body: JSON.stringify({
                //     userId: this.selectedUser.id,
                //     adDetails: this.adRequestDetails
                // })
                body: JSON.stringify({
                    userId: this.selectedUser.id,
                    adDetails: {
                        messages: this.adRequestDetails.messages,
                        requirements: this.adRequestDetails.requirements
                    },
                    campaignId: this.adRequestDetails.campaign_id,
                    paymentAmount: this.adRequestDetails.payment_amount
                })
            });

            if (res.ok) {
                alert("Ad request sent successfully!");
                this.closeAdRequestForm();
            } else {
                alert("Failed to send ad request. Please try again.");
            }
        }
    },
    async mounted() {
        this.fetchCampaigns();
    },
}
