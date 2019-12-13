const { connect } = require('mongoose');

connect('mongodb://localhost/pinterest_tutorial', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(db => console.log('DB is Connected'))
    .catch(error => console.log(error));