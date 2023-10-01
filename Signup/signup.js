document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');

    if (signupForm) {
        signupForm.addEventListener('submit', signup);
    }
});


async function signup(e) {
    console.log('Signup function called.');
    try {
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value

        }

        console.log(signupDetails);
        const response = await axios.post('http://localhost:4000/user/signup', signupDetails);
        
      
            window.location.href = '../Login/login.html'
        
    } catch (err) {
        document.body.innerHTML += `<div style ="color:red;">${err}<div>`;
    }


}