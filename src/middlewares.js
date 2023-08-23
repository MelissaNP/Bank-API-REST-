
let {banco, contas}= require('./bancodedados')
let {identificadorContas} =require('./bancodedados');
const {encontrarConta} = require('./controladores/contas');
const contasJs= require('./controladores/contas.js');

let encontrarConta2 = (contas, numeroConta) => {
    return contas.find(conta => conta.numero === Number(numeroConta));
}

const validaSenha =  (req,res,next) =>{
    const {senha_banco} = req.query;

    if(senha_banco !== banco.senha ){
        return res.status(404).json({mensagem: 'A senha do banco informada é inválida!'})
    }
    next();
}
/* const validaConta = (req, res, next) => {
    const { numero_conta } = req.query;

    if (!encontrarConta(contas, Number(numero_conta))) {
        return res.status(400).json({ mensagem: 'Conta não encontrada' });
    }
    next();
} */

const validaConta = (req, res, next) => {
    const { numero_conta } = req.query;
    const contaEncontrada = encontrarConta(contas, Number(numero_conta));

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Esta conta não existe, verifique o número' });
    }

    req.contaEncontrada = contaEncontrada; // Attach the found account to the request object
    next(); // Move to the next middleware or route handler
}

const validaSenhaConta = (req, res, next) => {
    const { numero_conta, senha} = req.query;
    const contaEncontrada = encontrarConta(contas, Number(numero_conta));
    
    if (!senha) {
        return res.status(400).json({ mensagem: 'Favor, digitar a senha' });
    }
    if (contaEncontrada.usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta' });
    }
    next();
}

module.exports = {validaSenha, validaConta, validaSenhaConta}