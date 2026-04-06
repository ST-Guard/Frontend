show databases;

drop database smartData;

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
email VARCHAR(200),
cpf CHAR(11),
senha VARCHAR(50),
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
nome VARCHAR(45),
fkDataCenter INT,
	CONSTRAINT fkDataCenter
    FOREIGN KEY(fkDataCenter)
	REFERENCES datacenter(idDataCenter),
fkUsuarioZona INT,
	CONSTRAINT fkUsuarioZona
    FOREIGN KEY(fkUsuarioZona)
    REFERENCES usuario(idUsuario)
);

CREATE TABLE regiao(
idRegiao INT PRIMARY KEY AUTO_INCREMENT,
cep CHAR(8),
numero VARCHAR(45),
complemento VARCHAR(45),
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
cep CHAR(8),
numero VARCHAR(45),
complemento VARCHAR(45),
fkRegistroServidor INT,
	CONSTRAINT fkRegistroServidor
    FOREIGN KEY(fkRegistroServidor)
    REFERENCES servidor(idServidor),
fkRegistroComponente INT,
	CONSTRAINT fkRegistroComponente
	FOREIGN KEY(fkRegistroComponente)
    REFERENCES componentes(idComponente)
);

INSERT INTO empresa (razaoSocial, cnpj, telefoneEmpresa, tokenEmpresa) VALUES
	('Steam', '12345678910119 ', '11123456789', 'STE12345');
    
INSERT INTO papel (nivel, descricao, fkEmpresa) VALUES
	('Gestor', 'Acesso total ao sistema', 1),
	('Analista', 'Monitoramento de servidores', 1);
    
INSERT INTO usuario (nome, email, cpf, senha, fkPapel) VALUES
	('Carlos Gestor', 'carloss@gmail.com', '12345678910', '123456', 1),
	('Ana Analista', 'anaa@gmail.com', '10987654321', '123456', 2);

INSERT INTO datacenter (nome, capacidadeServidores, fkUsuarioDataCenter) VALUES
	('ST-SP-01', 100, 1);
    
INSERT INTO zona (nome, fkDataCenter, fkUsuarioZona) VALUES
	('Zona A', 1, 1);
    
INSERT INTO regiao (cep, numero, complemento, fkRegiaoEmpresa, fkRegiaoDataCenter) VALUES
	('12345678', '9101', 'Steam Sp', 1, 1);
    
INSERT INTO servidor (nome, tipo, estado, fkZona) VALUES
	('SERVIDOR-DC01-WEB-05', 'Web Server', 'Ativo' , 1);
    
INSERT INTO componentes (nome, tipo, unidadeMedida, capacidadeMaxima) VALUES
	('CPU', 'Processador', '%', 100),
	('RAM', 'Memoria', 'GB', 20),
	('DISCO', 'Armazenamento', 'GB', 512);
    
INSERT INTO componentes_servidor (limite, fkServidor, fkComponentes) VALUES
	(90, 1, 1),
	(16, 1, 2),
	(450, 1, 3);
    
INSERT INTO registro (cep, numero, complemento, fkRegistroServidor, fkRegistroComponente) VALUES
('12345678', '9101', 'Deck 01', 1, 1);