export default {
  template: `
    <div>
      <h1>Ad Requests History</h1>
      <div v-if="adRequests.length === 0">
        <p>No ad requests found.</p>
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
              <th>Delivery Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in adRequests" :key="request.id">
              <td>{{ request.campaign_name }}</td>
              <td>{{ request.messages }}</td>
              <td>{{ request.requirements }}</td>
              <td>{{ request.payment_amount }}</td>
              <td>{{ request.status }}</td>
              <td>
                    <span v-if="request.status === 'Rejected'">NA</span>

                    <button 
                      v-else-if="request.delivery === 'Pending'" 
                      @click="updateDeliveryStatus(request.id)" 
                      class="btn btn-info btn-sm">

                      Mark as Done
                    </button>

                    <span v-else>Done</span>
                </td>
                  <td>
                    <span v-if="request.status === 'Rejected'">NA</span>

                    <button 
                      v-else-if="request.payment_status === 'Pending'" 
                      @click="updatePaymentStatus(request.id)" 
                      class="btn btn-info btn-sm">
                      
                      Mark as Done
                    </button>

                    <span v-else>Done</span>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  data() {
    return {
      adRequests: [],
    };
  },

  async created() {
    try {
      const res = await fetch('/api/get-ad-requests-history', {
        headers: {
          'Authentication-Token': localStorage.getItem('auth-token'),
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.adRequests = data;
      } else {
        alert(data.message || 'Failed to fetch ad requests history');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching ad requests history');
    }
  },

  methods: {
    async updateDeliveryStatus(requestId) {
      try {
        const res = await fetch('/api/update-delivery-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify({ requestId, deliveryStatus: 'Done' }),
        });

        const data = await res.json();
        if (res.ok) {
          const updatedRequest = this.adRequests.find(
            (req) => req.id === requestId
          );
          if (updatedRequest) {
            updatedRequest.delivery = 'Done';
          }
        } else {
          alert(data.message || 'Failed to update delivery status');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while updating delivery status');
      }
    },

    async updatePaymentStatus(requestId) {
      try {
        const res = await fetch('/api/update-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify({ requestId, paymentStatus: 'Done' }),
        });

        const data = await res.json();
        if (res.ok) {
          const updatedRequest = this.adRequests.find(
            (req) => req.id === requestId
          );
          if (updatedRequest) {
            updatedRequest.payment_status = 'Done';
          }
        } else {
          alert(data.message || 'Failed to update payment status');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while updating payment status');
      }
    },
  },
};
