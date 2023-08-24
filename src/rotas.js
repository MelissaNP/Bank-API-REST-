const express=require('express');

const rotas=express();

const  intermediarios = require('./middlewares.js');


const contas= require('./controladores/contas.js');

//rotas.use(validaSenha);

rotas.get('/contas',intermediarios.validaSenha,contas.listarContas);

rotas.post('/contas',contas.criarConta);

rotas.post('/transacoes/depositar',contas.fazerDeposito);

rotas.delete('/contas/:numeroConta',contas.deletarConta)

rotas.post('/contas/transacoes/sacar',contas.fazerSaque)

rotas.post('/contas/transacoes/transferir',contas.fazerTransferencia)

rotas.get('/contas/saldo',intermediarios.validaConta,intermediarios.validaSenhaConta, contas.consultarSaldo)

rotas.get('/contas/extrato',intermediarios.validaConta,intermediarios.validaSenhaConta, contas.consultarExtrato )
module.exports= rotas;
