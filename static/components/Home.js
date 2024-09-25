import AdminHome from "./AdminHome.js"
import StudyResource from "./StudyResource.js"
import SponsorHome from "./SponsorHome.js"
export default { 
     // template:<div>Welcome Home {{$route.query}}</div>
    //  {{this.$route.query.role }}
    //2.{{$route.query}}
    template:`<div>Welcome Home 
   

    
    <AdminHome v-if="userRole=='admin' "/>
    <SponsorHome v-if="userRole=='sponsor'" :username="username" />
    
   
    
    <StudyResource v-for="(resource, index) in resources" :key="index" :resource="resource" />
    </div>`,

    // <StudyResource v-for="(resource,index) in resources":key='index': resource="resource" />
    data(){
        return{
            // userRole: this.$route.query.role,
            userRole:localStorage.getItem('role') ,
            authToken:localStorage.getItem('auth-token'),
            resources:[],
            username: '',  // Add a new data property for the username
        }
    },
    components:{
        AdminHome,
        SponsorHome,
        StudyResource,
    },
    async mounted(){
        const res=await fetch('/api/study_material',{
            headers:{
                'Authentication-Token':this.authToken,
            },
        })
        const data=await res.json()
        console.log(data)
        if (res.ok){
            this.resources=data
        }
        else{
            alert(data.message)
        }
         // Fetch the username
         const userRes = await fetch('/api/user_info', {  // Adjust the endpoint accordingly
            headers: {
                'Authentication-Token': this.authToken,
            },
        });
        const userData = await userRes.json();
        if (userRes.ok) {
            this.username = userData.username;  // Assume the response contains a 'username' field
        } else {
            console.error("Failed to fetch user info");
        }
    },
}