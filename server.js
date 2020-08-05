//importando dependências
const http = require('http');
const app = require('./app');

const port = process.env.PORT || '3000';
app.set('port',port);

const server = http.createServer(app);

//chama rota
server.listen(port);


