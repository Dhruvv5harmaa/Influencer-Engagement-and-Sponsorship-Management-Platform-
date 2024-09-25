export default {
  template: `
    <div>
      <h1>Pending Ad Requests</h1>
      <div v-if="pendingRequests.length === 0">
        <p>No pending ad requests.</p>
      </div>
      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Messages</th>
              <th>Requirements</th>
              <th>Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in pendingRequests" :key="request.id">
              <td>{{ request.campaign_name }}</td>
              <td>{{ request.messages }}</td>
              <td>{{ request.requirements }}</td>
              <td>{{ request.payment_amount }}</td>
              <td>
                  <button @click="updateStatus(request.id, 'Accepted')" class="btn btn-success btn-sm">Accept</button>
                  <button @click="updateStatus(request.id, 'Rejected')" class="btn btn-danger btn-sm">Reject</button>
                  <button @click="openNegotiationForm(request)" class="btn btn-warning btn-sm">Negotiate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Negotiation Modal -->
      <div v-if="showNegotiationModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Negotiate Ad Request</h5>
                      <button type="button" class="close" @click="closeNegotiationModal">
                          <span>&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <div class="form-group">
                          <label for="newMessage">Edit Message</label>
                          <textarea v-model="negotiationData.message" id="newMessage" class="form-control"></textarea>
                      </div>
                      <div class="form-group">
                          <label for="newPaymentAmount">New Payment Amount</label>
                          <input v-model="negotiationData.payment_amount" type="number" id="newPaymentAmount" class="form-control" />
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" @click="closeNegotiationModal">Cancel</button>
                      <button type="button" class="btn btn-primary" @click="submitNegotiation">Submit</button>
                  </div>
              </div>
          </div>
      </div>

      <div v-if="showOverlay" class="modal-backdrop fade show"></div>
    </div>
  `,
  data() {
    return {
      pendingRequests: [],  // List of pending ad requests
      showNegotiationModal: false,  // Toggle negotiation modal visibility
      showOverlay: false,  // To show an overlay when modal is active
      negotiationData: {  // Data for the negotiation
        id: null,
        message: '',
        payment_amount: 0
      },
    };
  },
  async created() {
    try {
      const res = await fetch('/api/get-pending-requests', {
        headers: {
          'Authentication-Token': localStorage.getItem('auth-token'),
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.pendingRequests = data;
      } else {
        alert(data.message || 'Failed to fetch pending requests');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching pending requests');
    }
  },
  methods: {
      async updateStatus(requestId, newStatus) {
        try {
          const res = await fetch(`/api/update-ad-request-status/${requestId}`, {
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

      // Open the negotiation modal with the selected request's data
      openNegotiationForm(request) {
        this.negotiationData = { 
          id: request.id,
          message: request.messages,
          payment_amount: request.payment_amount
        };
        this.showNegotiationModal = true;
        this.showOverlay = true;
      },

      // Close the negotiation modal and reset data
      closeNegotiationModal() {
        this.negotiationData = { id: null, message: '', payment_amount: 0 };
        this.showNegotiationModal = false;
        this.showOverlay = false;
      },

      // Submit the negotiation changes to the server
      async submitNegotiation() {
        try {
          const res = await fetch(`/api/negotiate-ad-request/${this.negotiationData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token'),
            },
            body: JSON.stringify({
              message: this.negotiationData.message,
              payment_amount: this.negotiationData.payment_amount,
            }),
          });
  
          if (res.ok) {
            alert('Negotiation submitted successfully.');
            this.closeNegotiationModal();
          } else {
            const data = await res.json();
            alert(data.message || 'Failed to submit negotiation.');
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred while submitting the negotiation');
        }
      },
    }
};
