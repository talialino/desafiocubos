const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.post(`/createUser`, (req, res, next) => {
   mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(            
            'insert into usuario (nome_usu,email_usu,genero_usu) values(?,?,?)',
            [req.body.nome,req.body.email,req.body.genero],
            (error,result,field) => {
            conn.release();
            conn.release();
            if (error) { return res.status(500).send({ error: error})}
            const response = {
                mensagem: 'Usuário cadastrado!',
                Dados:{ 
                    ID: result.insertId,
                    NOME: req.body.nome,
                    EMAIL: req.body.email,
                    GENERO: req.body.genero,
                    request: {
                        tipo: 'POST',
                        descricao:`Você cadastrou a ${result.insertId}º pessoa da fila.`,                       
                    }
                }

            }
            res.status(201).send({response });
        }
    )
    });

});

router.patch(`/addToLine`, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            `update usuario 
            set nome_usu =?, 
            email_usu =?, 
            genero_usu =?
            where cod_usu = ?`,

           [req.body.nome,
            req.body.email,
            req.body.genero,
            req.body.cod],

            (error,result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                    const response = {
                    mensagem: 'Dados atualizados!',  
                    ID: req.body.cod,                          
                            request: {
                                tipo: 'PATCH',
                                descricao: 'Você alterou na fila.',                                
                            }
                        
                    
                }
                return res.status(202).send({response});

            }
        );

    });

});

router.get(`/findPosition`, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            'select (cod_usu) from usuario where email_usu = ?;',
            [req.body.email],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    DADOS: {     
                        EMAIL: req.body.email,                   
                        POSICAO: result[0].cod_usu,                                  
                            request: {
                            tipo: 'GET',
                            descricao: 'Você está vendo a posição na fila, cujo email pertence, da pessoa informado.',
                        } 
                    }       
                    
                }
                return res.status(202).send({response}); 
            }            
            
        );

    });   

});

router.get(`/showLine`, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            'select*from usuario;',
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    DadosTotais: result.map(user => {
                        return {
                            mensagem: 'Filas:',
                            ID: user.cod_usu,
                            NOME: user.nome_usu,
                            EMAIL: user.email_usu,
                            GENERO: user.genero_usu,
                            request: {
                                tipo: 'GET',
                                descricao: 'Você está vendo os dados das pessoas na fila, da primeira posição a última.',                            }
                        }

                    }),
                }
                return res.status(200).send({response});

            }
        );

    });

});

router.get(`/filterLine`, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            'select *  from usuario where genero_usu = ?;',
            [req.body.genero],
            conn.release(),
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    Dados: result.map(user => {
                        return {
                            mensagem: 'Dados:',
                            ID: user.cod_usu,
                            NOME: user.nome_usu,
                            EMAIL: user.email_usu,
                            GENERO: user.genero_usu,
                            request: {
                                tipo: 'GET',
                                descricao: 'Você está vendo os dados da pessoa com o mesmo gênero informado.',
                            }
                        }

                    }),
                }
                return res.status(200).send({response});

            }
        );

    });   

});

router.delete(`/popLine`, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            'delete from usuario where id_produto =?;',
            [req.body.id],
             conn.release(),
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: 'Dados removidos com sucesso!',                            
                            request: {
                                tipo: 'DELETE',
                                descricao: 'Você enviou um ID para ser removido.',
                                url:'http://localhost:3000/usuarios/popLine',

                            }
                        
                }
                return res.status(202).send({response});
            }
        );

    });

})




module.exports = router;