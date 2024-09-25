export default {
    template: `
      <div>
        <h1>Pending Ad Requests (From Influencers)</h1>
        <div v-if="pendingRequests.length === 0">
          <p>No pending ad requests from influencers.</p>
        </div>
        <div v-else>
          <table class="table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Messages</th>
                <th>Requirements</th>
                <th>Payment Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingRequests" :key="request.id">
                <td>{{ request.campaign_name }}</td>
                <td>{{ request.messages }}</td>
                <td>{{ request.requirements }}</td>
                <td>{{ request.payment_amount }}</td>
                <td>{{ request.status }}</td>
                <td>
                  <button @click="updateStatus(request.id, 'Accepted')" class="btn btn-success btn-sm">Accept</button>
                  <button @click="updateStatus(request.id, 'Rejected')" class="btn btn-danger btn-sm">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
      return {
        pendingRequests: []
      };
    },
    async created() {
      try {
        const res = await fetch('/api/get-sponsor-pending-requests', {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.pendingRequests = data;
        } else {
          alert(data.message || 'Failed to fetch pending ad requests');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching pending ad requests');
      }
    },
    methods: {
        async updateStatus(requestId, newStatus) {
          try {
            const res = await fetch(`/api/update-ad-request-status-sponsor/${requestId}`, {
              method: 'PUT',
            
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
              },
              body: JSON.stringify({ status: newStatus }),
            });
    
            if (res.ok) {
              // Remove the updated request from the pendingRequests array
              const requestIndex = this.pendingRequests.findIndex(r => r.id === requestId);
              this.pendingRequests.splice(requestIndex, 1);
              alert(`Ad request has been ${newStatus.toLowerCase()} successfully.`);
            } else {
              const data = await res.json();
              alert(data.message || 'Failed to update status.');
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred while updating the status');
          }
        },
    },
    
   
    
  
}