let {banco, contas, depositos,saques, transferencias}= require('../bancodedados')
let {numeroConta} =require('../bancodedados')

let encontrarConta = (contas, numeroConta) => {
    return contas.find(conta => conta.numero === Number(numeroConta));
};


const listarContas =(req, res,next)=>{
    const {senha_banco} = req.query;

    if(senha_banco !== banco.senha ){
        return res.status(404).json({mensagem: 'A senha do banco informada é inválida!'})
    }
    next();
        return res.json(contas);
    }

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const dadosImcompletos = (dados) =>{
        for (const campo in dados) {
            if (!dados[campo]) {
             return res.status(400).json({ mensagem: `O campo ${campo} é obrigatório` });
            }
        }
     }
    dadosImcompletos({ nome, cpf, data_nascimento, telefone, email, senha });

    const novaConta={numero: numeroConta++,
    saldo:0,
    usuario:{
    nome: nome,
    cpf: cpf,
    data_nascimento: data_nascimento,
    telefone:telefone,
    email: email,
    senha : senha
    }
    }

    contas.push(novaConta);
    return res.json();
}


const fazerDeposito = (req, res) => {
    const {numero_conta , valor } = req.body;
    contaEncontrada = encontrarConta(contas, Number(numero_conta));

    if (!numeroConta|| !valor) {
        return res.status(400).json({ mensagem: ' O número da conta e valor são obrigatórios.' });
    }
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada.' });
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero.' });
    }

    contaEncontrada.saldo += Number(valor);

    const depositoAtual = {
        data: new Date(),
        numero_conta: Number(numero_conta),
        valor: Number(valor)
    };

    depositos.push(depositoAtual);
  //  console.log(depositoAtual);
    return res.status(204).send();
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;
    const contaEncontrada = encontrarConta(contas,Number(numeroConta))

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Esta conta não existe, verifique o número' });
    }
    if(contaEncontrada.saldo != 0){
        return res.status(403).json({ mensagem: 'É necessário ter saldo 0 antes de excluir a conta' });
    }
    
    contas = contas.filter((conta) => {
        return conta.numero!== Number(numeroConta);
    });

    return res.status(204).send();
}

const fazerSaque= (req,res)=>{
    const {numero_conta, valor, senha} = req.body;

    const contaEncontrada = encontrarConta(contas, Number(numero_conta));
    
    if (!numero_conta) {
    return res.status(404).json({ mensagem: 'O número da conta é obrigatório' });
    }

    if(contaEncontrada.usuario.senha != senha) {
    return res.status(404).json({ mensagem: 'senha incorreta' });
    }

    if(contaEncontrada.saldo < Number(valor)){
    return res.status(404).json({ mensagem: 'Saldo insuficiente para fazer o saque!' });
    } 
    contaEncontrada.saldo = contaEncontrada.saldo - Number(valor);
   
    const saqueatual = {
        data: new Date(),
        numero_conta: Number(numero_conta),
        valor: Number(valor)
    };

    saques.push(saqueatual);
   // console.log(depositoatual);
    return res.status(204).send();


}

const fazerTransferencia= (req,res)=>{
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    const contaOrigem = encontrarConta(contas, Number(numero_conta_origem));
    const contaDestino = encontrarConta(contas, Number(numero_conta_destino));

    if (!numero_conta_origem) {
        return res.status(404).json({ mensagem: 'O número da conta de origem é obrigatório' });
        }
    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'A conta de origem não existe' });
        }
    if (!numero_conta_destino) {
            return res.status(404).json({ mensagem: 'O número da conta de destino é obrigatório' });
         }
    if (!contaDestino) {
            return res.status(404).json({ mensagem: 'A conta de destino não existe' });
         }
     
    if(contaOrigem.usuario.senha != senha) {
            return res.status(404).json({ mensagem: 'senha incorreta' });
        }
     if(contaOrigem.saldo < Number(valor)){
            return res.status(404).json({ mensagem: 'Saldo insuficiente para fazer a transferencia!' });
            } ;
     
    contaOrigem.saldo = contaOrigem.saldo - Number(valor); 
    contaDestino.saldo= contaDestino.saldo + Number(valor);
    
    const transferenciaenviadas = {
        data: new Date(),
        numero_conta_origem: Number(numero_conta_origem),
        numero_conta_destino: Number(numero_conta_destino),
        valor: Number(valor)
    };
     const transferenciarecebida = {
        data: new Date(),
        numero_conta_destino: Number(numero_conta_origem),
        numero_conta_origem: Number(numero_conta_destino),
        valor: Number(valor)
    } 

    transferencias.push(transferenciaenviadas);
    transferencias.push(transferenciarecebida);

   // console.log(depositoatual);
   // return res.json(transferencias);
      return res.status(204).send();
    
}

const consultarSaldo = (req, res) => {
    const {numero_conta,senha} = req.query; 
    const saldo = encontrarConta(contas,Number(numero_conta)).saldo;
   // console.log(saldo);
    return res.json(saldo);
};

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const extrato_depositos = depositos.filter((conta) => conta.numero_conta === Number(numero_conta));
    const extrato_saques = saques.filter((conta) => conta.numero_conta === Number(numero_conta));
    const extrato_transferenciasenviadas = transferencias.filter((conta) => conta.numero_conta_origem === Number(numero_conta));
    const extrato_transferenciasrecebidas = transferencias.filter((conta) => conta.numero_conta_destino === Number(numero_conta));
   
    const extrato = {
        depositos: extrato_depositos,
        saques: extrato_saques,
        transferenciasEnviadas: extrato_transferenciasenviadas,
        transferenciasRecebidas: extrato_transferenciasrecebidas // Corrected variable name here
    };

    return res.json(extrato);
}


module.exports={encontrarConta,listarContas,
criarConta,
fazerDeposito,
deletarConta,
fazerSaque,
fazerTransferencia,
consultarSaldo,
consultarExtrato
}