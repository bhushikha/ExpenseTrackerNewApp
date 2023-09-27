// function loginUser(e) {
//     e.preventDefault();

//     const loginDetails = {
//         email: e.target.email.value,
//         password: e.target.password.value
//     };

//     axios.post('http://localhost:3000/user/login', loginDetails)
//         .then(response => {
//             alert(response.data.message);
//         })
//         .catch(err => {
//             console.log(JSON.stringify(err));
//             document.body.innerHTML += `<div style="color:red;">${err}</div>`;
//         });
// }

function loginUser(e) {
    e.preventDefault();
    console.log('Login form submitted.');

    const emailValue = e.target.email.value;
    const passwordValue = e.target.password.value;

    console.log('Email:', emailValue);
    console.log('Password:', passwordValue);

    const loginDetails = {
        email: emailValue,
        password: passwordValue
    };

    console.log('Sending login request with:', loginDetails);

    axios.post('http://localhost:4000/user/login', loginDetails)
        .then(response => {
            console.log('Login successful. Response:', response);
            alert(response.data.message);
            window.location.href = '../ExpenseTracker/index.html'
        })
        .catch(err => {
            console.error('Error:', err);
            document.body.innerHTML += `<div style="color:red;">${err}</div>`;
        });
}






