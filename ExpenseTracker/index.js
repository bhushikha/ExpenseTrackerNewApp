document.addEventListener('DOMContentLoaded', () => {

function addnewExpenses(e) {
    e.preventDefault();

    const expenseDetails = {
        expenseamount: e.target.expenseamount.value,
        description: e.target.description.value,
        category: e.target.category.value,
        
    };

    console.log( expenseDetails);

    const token= localStorage.getItem('token');

    axios.post('http://localhost:4000/expense/addnewExpenses', expenseDetails, {headers: {"Authorization": token}} )
        .then(response => {
            
                addNewExpensestoUI(response.data.expense)
           
        }).catch(err => showError(err) )
}

window.addEventListener('DomContentLoaded', ()=> {
    axios.post('http://localhost:4000/expense/getexpenses').then(response => {
        response.data.expense.forEach(expense =>{
            
    addNewExpensestoUI(response.data.expense)

}).catch(err => showError(err) )

})

});

function addNewExpensestoUI(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElementId= `expense-${expense.id}`;
    parentElement.innerHTML +=
    `<li id=${expenseElementId}>
    ${'Expense Amount: ' + expense.expenseamount} - ${'Description: ' + expense.description} - ${'Category: ' + expense.category}
    <button onclick="deleteExpense(event , ${expense.id})">Delete Expense</button>
    </li>
    `
}
function deleteexpense(e, expenseid) {
    e.preventDefault();
    const token= localStorage.getItem('token');
    axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`)
        .then(response => {
            const expenseElement = document.getElementById(`expense-${expenseid}`);
            expenseElement.remove();
        })
        .catch(err => showError(err));
}
document.getElementById('rzp-button').onclick= async function(e){
    const token= localStorage.getItem('token');
    const response= await axios.post('http://localhost:4000/purchase/initiatepayment',  {headers: {"Authorization": token}});
    console.log(response);
    var options={
        "key": response.data.key_id,
        "order_id": response.data.order.id,

        "handler" : async function(response){
            await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            },{headers: {"Authorization": token}})

            alert("You are a premium user now");
    }

}
}

})



