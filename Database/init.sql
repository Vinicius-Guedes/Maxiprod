-- ===========================================
-- Maxiprod - Controle de Gastos Residenciais
-- Schema inicial
-- ===========================================

CREATE DATABASE Maxiprod;
GO

USE Maxiprod;
GO

-- -------------------------------------------
-- Pessoas
-- -------------------------------------------
CREATE TABLE Pessoas (
    Id       INT           IDENTITY(1,1) PRIMARY KEY,
    Nome     NVARCHAR(200) NOT NULL,
    Idade    INT           NOT NULL,

    CONSTRAINT CK_Pessoas_Nome_NotEmpty CHECK (LEN(LTRIM(Nome)) > 0),
    CONSTRAINT CK_Pessoas_Idade_Positiva CHECK (Idade >= 0)
);
GO

-- -------------------------------------------
-- Categorias
-- Finalidade: 1 = Receita, 2 = Despesa, 3 = Ambas
-- -------------------------------------------
CREATE TABLE Categorias (
    Id         INT           IDENTITY(1,1) PRIMARY KEY,
    Descricao  NVARCHAR(400) NOT NULL,
    Finalidade INT           NOT NULL,

    CONSTRAINT CK_Categorias_Descricao_NotEmpty CHECK (LEN(LTRIM(Descricao)) > 0),
    CONSTRAINT CK_Categorias_Finalidade CHECK (Finalidade IN (1, 2, 3))
);
GO

-- -------------------------------------------
-- Transacoes
-- Tipo: 1 = Receita, 2 = Despesa
-- -------------------------------------------
CREATE TABLE Transacoes (
    Id          INT           IDENTITY(1,1) PRIMARY KEY,
    Descricao   NVARCHAR(400) NOT NULL,
    Valor       DECIMAL(18,2) NOT NULL,
    Tipo        INT           NOT NULL,
    CategoriaId INT           NOT NULL,
    PessoaId    INT           NOT NULL,

    CONSTRAINT CK_Transacoes_Descricao_NotEmpty CHECK (LEN(LTRIM(Descricao)) > 0),
    CONSTRAINT CK_Transacoes_Valor_Positivo CHECK (Valor > 0),
    CONSTRAINT CK_Transacoes_Tipo CHECK (Tipo IN (1, 2)),

    CONSTRAINT FK_Transacoes_Categorias FOREIGN KEY (CategoriaId)
        REFERENCES Categorias(Id),

    CONSTRAINT FK_Transacoes_Pessoas FOREIGN KEY (PessoaId)
        REFERENCES Pessoas(Id)
        ON DELETE CASCADE  -- Deletar pessoa remove suas transações
);
GO

-- -------------------------------------------
-- View: Totais por Pessoa
-- -------------------------------------------
CREATE VIEW vw_TotaisPorPessoa AS
SELECT
    p.Id,
    p.Nome,
    ISNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0) AS TotalReceitas,
    ISNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS TotalDespesas,
    ISNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0)
      - ISNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS Saldo
FROM Pessoas p
LEFT JOIN Transacoes t ON t.PessoaId = p.Id
GROUP BY p.Id, p.Nome;
GO

-- -------------------------------------------
-- View: Totais por Categoria
-- -------------------------------------------
CREATE VIEW vw_TotaisPorCategoria AS
SELECT
    c.Id,
    c.Descricao,
    c.Finalidade,
    ISNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0) AS TotalReceitas,
    ISNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS TotalDespesas,
    ISNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0)
      - ISNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS Saldo
FROM Categorias c
LEFT JOIN Transacoes t ON t.CategoriaId = c.Id
GROUP BY c.Id, c.Descricao, c.Finalidade;
GO
