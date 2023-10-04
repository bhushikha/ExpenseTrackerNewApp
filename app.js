// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const userController = require('./controller/user');
// const userRoutes = require('./routes/user');
// const cors = require('cors');
// const sequelize = require('./util/database');




// const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use('/controller', express.static(path.join(__dirname, 'controller')));

// app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Hello, World!'); // Replace with your desired response
// });



// sequelize
//     .sync({force: true})
//     .then(() => {
//         console.log('Database synced!');
//     })
//     .catch((err) => {
//         console.error('Error syncing database:', err);
//     });

// app.use('/user', userRoutes)


// // app.listen(4000);

// app.listen(4000, () => {
//     console.log('Server listening on port 4000');
//   });



const path = require('path');
const helmet=require('helmet');

const express = require('express');
var cors = require('cors')
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const helmet=require('helmet');

const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')

const app = express();
const dotenv = require('dotenv');

// get config vars
dotenv.config();

app.use(helmet())
app.use(cors());

// app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json());  //this is for handling jsons

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(4000);
        console.log('Server listening on port 4000');
    })
    .catch(err => {
        console.log(err);
    })