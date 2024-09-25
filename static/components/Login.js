export default { 
    template:`
    <div class='d-flex justify-content-center' style="margin-top:25vh">
        
        <div class="mb-3 p-5 bg-light">
            <div class='text-danger'>*{{error}}</div>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com"
            v-model="cred.email">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password">
            <button class="btn btn-primary mt-2" @click='login' >Login</button>

            <!-- Sign Up Button -->
          
                
            
            
            </div>
    </div>`
    ,
    data(){
        return{
            cred:{
                email:null,
                password:null,
            },
            error:null,
        }
       
    },
    methods:{
        async login(){
            // console.log(this.cred)
            const res=await fetch('/user-login',
                {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(this.cred),
            
                })
                const data=await res.json()
                if(res.ok){
                   
                    // console.log(data)
                    // this.userRole=data.role
                    localStorage.setItem('auth-token',data.token)
                    localStorage.setItem('role',data.role)
                    this.$router.push({path:'/'})   //this is the path where we want to push the user to url after login 
                    // this.$router.push({path:'/',query:{role:data.role}})   //this is the path where we want to push the user to url after login 

                }
                else{
                    this.error=data.message
                }
        },
      
       
    },
}
