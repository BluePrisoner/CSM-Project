document.getElementById('admin-login-form').addEventListener('submit', async (event)=> {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch('/admin/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
     })
     try {
        const data  = await response.json();

        if(data.success){
            document.querySelector('.success').style.display = "block";
            setTimeout(()=> {
                window.location.href = '/admin/dashboard'
            },2000)
        }else{
            const failureMessage = document.querySelector(".failure");
            failureMessage.classList.remove("fade-out"); 
            failureMessage.style.opacity = "1"; 
            failureMessage.style.display = "block";
            
            setTimeout(() => {
                failureMessage.style.opacity = "0";
                setTimeout(() => {
                    failureMessage.style.display = "none"; 
                }, 1000); 
            }, 2000);


        }
     } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Server error. Please try again.");
     }
     
})