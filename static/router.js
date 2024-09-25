import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"
import StudyResourceForm from "./components/StudyResourceForm.js"
import CampaignForm from "./components/CampaignForm.js"
import InfluencerList from "./components/InfluencerList.js"
import SearchInfluencers from "./components/SearchInfluencers.js"
import PendingRequestsInfluencer from "./components/PendingRequestsInfluencer.js"
import AdRequestHistory from "./components/AdRequestHistory.js"
import SearchCampaigns from "./components/SearchCampaigns.js"
import SponsorPendingRequest from "./components/SponsorPendingRequest.js"

const routes=[
    {path:'/',component:Home}, //this '/'path is linked to Home component.
    {path:'/login',component:Login,name:'Login'},//this '/login'path is linked to Home component.
    {path:'/users',component:Users},
    {path:'/create-resource',component:StudyResourceForm},
    { path: '/create-campaign', component: CampaignForm },
    { path: '/search-influencers-query', component: SearchInfluencers },
    { path: '/search-influencers', component: InfluencerList },
    { path: '/pending-requests', component: PendingRequestsInfluencer },
    { path: '/ad-request-history', component: AdRequestHistory },
    { path: '/search-campaigns', component: SearchCampaigns },
    { path: '/pending-ad-requests-sponsor', component: SponsorPendingRequest },

   
]


// router instance below
export default new VueRouter({
    routes,

})