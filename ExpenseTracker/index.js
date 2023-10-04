document.addEventListener('DOMContentLoaded', () => {

    function addnewExpenses(e) {
        e.preventDefault();

        const expenseDetails = {
            expenseamount: e.target.expenseamount.value,
            description: e.target.description.value,
            category: e.target.category.value,

        };

        console.log(expenseDetails);

        const token = localStorage.getItem('token');

        axios.post('http://localhost:4000/expense/addnewExpenses', expenseDetails, { headers: { "Authorization": token } })
            .then(response => {

                addNewExpensestoUI(response.data.expense)

            }).catch(err => showError(err))
    }

    window.addEventListener('DomContentLoaded', () => {
        axios.post('http://localhost:4000/expense/getexpenses').then(response => {
            response.data.expense.forEach(expense => {

                addNewExpensestoUI(response.data.expense)

            }).catch(err => showError(err))

        })

    });
    const pagination = document.getElementById('pagination')
    function showPagination({
        currentPage,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        lastpage
    }) {
        pagination.innerHTML = "";
        if (hasPreviousPage) {
            const btn2 = document.createElement('button')
            btn2.innerHTML = previousPage
            btn2.addEventListener('click', () => getExpenses(previousPage))
            pagination.appendChild(btn2)
        }
        const btn1 = document.createElement('button')
        btn1.innerHTML = `<h3>${currentPage}</h3>`
        btn1.addEventListener('click', () => getExpenses(currentPage))
        pagination.appendChild(btn1)
        if (hasNextPage) {
            const btn3 = document.createElement('button')
            btn3.innerHTML = nextPage
            btn3.addEventListener('click', () => getExpenses(nextPage))
            pagination.appendChild(btn3)
        }
    }

    function addNewExpensestoUI(expense) {
        const parentElement = document.getElementById('listOfExpenses');
        const expenseElementId = `expense-${expense.id}`;
        parentElement.innerHTML +=
            `<li id=${expenseElementId}>
    ${'Expense Amount: ' + expense.expenseamount} - ${'Description: ' + expense.description} - ${'Category: ' + expense.category}
    <button onclick="deleteExpense(event , ${expense.id})">Delete Expense</button>
    </li>
    `
    }

    function download() {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:4000/user/download', { headers: { "Authorization": token } })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    var a = document.createElement("a");
                    a.href = response.data.fileURl;
                    a.download = 'myexpense.csv';
                    a.click();
                    showFileURl(response.data.fileURl)
                } else {
                    throw new Error(response.data.message)

                }

            })
            .catch((err) => {
                document.body.innerHTML += `<div style="color:red;">${err}</div>`
            });
    }
    function deleteexpense(e, expenseid) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`)
            .then(response => {
                const expenseElement = document.getElementById(`expense-${expenseid}`);
                expenseElement.remove();
            })
            .catch(err => showError(err));
    }
    document.getElementById('rzp-button').onclick = async function (e) {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/purchase/initiatepayment', { headers: { "Authorization": token } });
        console.log(response);
        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,

            "handler": async function (response) {
                await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } })

                alert("You are a premium user now");
            }

        }
    }

})



