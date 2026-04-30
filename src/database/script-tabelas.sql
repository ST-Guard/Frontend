show databases;
DROP DATABASE smartdata;
CREATE DATABASE smartData;
USE smartData;

CREATE TABLE empresa(
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
razaoSocial VARCHAR(100) NOT NULL,
cnpj CHAR(14) NOT NULL,
telefoneEmpresa CHAR(11) NOT NULL,
tokenEmpresa CHAR(8) NOT NULL
);

CREATE TABLE papel (
idPapel INT PRIMARY KEY AUTO_INCREMENT,
nivel VARCHAR(45),
descricao VARCHAR(80),
fkEmpresa INT,
	CONSTRAINT fkEmpresa
    FOREIGN KEY(fkEmpresa)
    REFERENCES empresa(idEmpresa)
);

CREATE TABLE usuario (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100),
imagem VARCHAR(255),
email VARCHAR(200),
cpf CHAR(11),
telefone CHAR(15),
senha VARCHAR(50),
status VARCHAR(20) DEFAULT 'Ativo',
fkPapel INT,
	CONSTRAINT fkPapel
    FOREIGN KEY(fkPapel)
    REFERENCES papel(idPapel)
);

CREATE TABLE datacenter (
idDataCenter INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45),
capacidadeServidores INT,
fkUsuarioDataCenter INT,
	CONSTRAINT fkUsuarioDataCenter
    FOREIGN KEY(fkUsuarioDataCenter)
	REFERENCES usuario(idUsuario)
);

CREATE TABLE zona (
idZona INT PRIMARY KEY AUTO_INCREMENT,
nome ENUM('Zona A', 'Zona B', 'Zona C') NOT NULL,
fkDataCenter INT,
	CONSTRAINT fkDataCenter
    FOREIGN KEY(fkDataCenter)
	REFERENCES datacenter(idDataCenter)
);

CREATE TABLE regiao(
idRegiao INT PRIMARY KEY AUTO_INCREMENT,
cep CHAR(8),
numero VARCHAR(45),
complemento VARCHAR(45),
estado CHAR(2),
fkRegiaoEmpresa INT,
	CONSTRAINT fkRegiaoEmpresa
    FOREIGN KEY(fkRegiaoEmpresa)
    REFERENCES empresa(idEmpresa),
fkRegiaoDataCenter INT,
	CONSTRAINT fkRegiaoDataCenter
	FOREIGN KEY(fkRegiaoDataCenter)
    REFERENCES datacenter(idDataCenter)
);

CREATE TABLE servidor(
idServidor INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45),
tipo VARCHAR(100),
estado VARCHAR(10) CHECK (estado IN	 ('Ativo', 'Inativo')),
fkZona INT,
	CONSTRAINT fkZona
    FOREIGN KEY(fkZona)
    REFERENCES zona(idZona)
);

CREATE TABLE componentes(
idComponente INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(50),
tipo VARCHAR(45),
unidadeMedida VARCHAR(45),
capacidadeMaxima FLOAT
);

CREATE TABLE componentes_servidor(
idComponenteServidor INT AUTO_INCREMENT,
limite FLOAT,
fkServidor INT,
fkComponentes INT,
	PRIMARY KEY (idComponenteServidor, fkServidor, fkComponentes),
    CONSTRAINT fkServidor
        FOREIGN KEY (fkServidor)
        REFERENCES servidor(idServidor),

    CONSTRAINT fkComponentes
        FOREIGN KEY (fkComponentes)
        REFERENCES componentes(idComponente)
);

CREATE TABLE registro(
idRegistro INT PRIMARY KEY AUTO_INCREMENT,
dataHora DATETIME,
valor FLOAT,
fkRegistroServidor INT,
	CONSTRAINT fkRegistroServidor
    FOREIGN KEY(fkRegistroServidor)
    REFERENCES servidor(idServidor),
fkRegistroComponente INT,
	CONSTRAINT fkRegistroComponente
	FOREIGN KEY(fkRegistroComponente)
    REFERENCES componentes(idComponente)
);

CREATE TABLE contato_inicial(
idContato_inicial INT PRIMARY KEY AUTO_INCREMENT,
nome_usuario VARCHAR(45),
email_usuario VARCHAR(45),
mensagem_usuario VARCHAR(45)
);

ALTER TABLE usuario
ADD COLUMN fkZona INT,
ADD CONSTRAINT fkUsuarioZona
FOREIGN KEY (fkZona) REFERENCES zona(idZona);

INSERT INTO empresa (razaoSocial, cnpj, telefoneEmpresa, tokenEmpresa) VALUES
	('Steam', '12345678910119', '11123456789', 'STE12345');
    
INSERT INTO papel (nivel, descricao, fkEmpresa) VALUES
	('Gestor', 'Acesso total ao sistema', 1),
	('Analista', 'Monitoramento de servidores', 1);


INSERT INTO usuario (nome, email, cpf, telefone, senha, status, fkPapel, fkZona) VALUES
('Maria Gestora', 'maria@gmail.com', '12345678910','(11) 9999-8888', '123456', 'Ativo', 1, NULL);

INSERT INTO datacenter (nome, capacidadeServidores, fkUsuarioDataCenter) VALUES
('ST-SP-01', 100, 1);

INSERT INTO zona (nome, fkDataCenter) VALUES
('Zona A', 1),
('Zona B', 1),
('Zona C', 1);

INSERT INTO usuario (nome, email, cpf, telefone, senha, status, fkPapel, fkZona) VALUES
('Erick Analista', 'erick@gmail.com', '10987654321', '(11) 9999-7777', '123456', 'Ativo', 2, 1),
('Miguel Analista', 'miguel@gmail.com', '14985559347', '(11) 9999-6666', '123456', 'Ativo', 2, 1);
    
INSERT INTO regiao (cep, numero, complemento, estado, fkRegiaoEmpresa, fkRegiaoDataCenter) VALUES
	('12345678', '9101', 'Steam Sp', 'SP', 1, 1);
    
INSERT INTO servidor (nome, tipo, estado, fkZona) VALUES
	('SRV-DC01-WEB-05', 'Web', 'Ativo', 1),
    ('SRV-DC01-DB-12', 'DB', 'Ativo', 1),
    ('SRV-FK02-GM-02', 'GM', 'Ativo', 1),
    ('SRV-DC01-WEB-08', 'WEB', 'Ativo', 1);
    
INSERT INTO componentes (nome, tipo, unidadeMedida, capacidadeMaxima) VALUES
	('CPU', 'Processador', '%', 100),
	('RAM', 'Memoria', 'GB', 20),
	('DISCO', 'Armazenamento', 'GB', 512),
    ('REDE', 'LATENCIA', 'MBps', 50);
    
INSERT INTO componentes_servidor (limite, fkServidor, fkComponentes) VALUES
	(90, 1, 1),
	(16, 1, 2),
	(450, 1, 3),
	(40, 1, 4);
    
INSERT INTO registro (dataHora, valor, fkRegistroServidor, fkRegistroComponente) VALUES
    ('2025-08-19 10:00:00', 52, 1, 1),
    ('2025-08-19 10:00:00', 6.8, 1, 2),
    ('2025-08-19 10:00:00', 238, 1, 3);
    
create view vwBuscarDados AS
	select u.idUsuario,
		u.nome as nomePessoa,
		u.imagem,
		u.telefone,
		u.email,
		u.cpf,
		p.nivel as cargo,
		p.descricao as bio,
		d.nome as nomeDataCenter,
		z.nome as nomeZona
        from usuario u
        join papel p
			on  p.idPapel = u.fkPapel
		left join zona z
			on z.idZona = u.fkZona
		LEFT JOIN datacenter d
			ON (
				(p.nivel = 'Analista' AND d.idDataCenter = z.fkDataCenter)
				OR
				(p.nivel = 'Gestor' AND d.fkUsuarioDataCenter = u.idUsuario)
			);
            
select * from contato_inicial;

select * from vwBuscarDados