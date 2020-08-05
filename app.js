const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');


const app = express();

const endepoints= require(`./routes/usuarios`);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origem', '*');
    res.header('Access-Control-Allow-Header','Origin, X-Requrested-With,Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Header', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).send({});
    }
    next();
});


app.use(`/usuarios`, endepoints);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;