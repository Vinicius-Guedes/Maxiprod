-- ===========================================
-- Maxiprod - Controle de Gastos Residenciais
-- Schema SQLite
-- ===========================================

-- -------------------------------------------
-- Pessoas
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS Pessoas (
    Id       INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome     TEXT    NOT NULL CHECK (LENGTH(TRIM(Nome)) > 0),
    Idade    INTEGER NOT NULL CHECK (Idade >= 0)
);

-- -------------------------------------------
-- Categorias
-- Finalidade: 1 = Receita, 2 = Despesa, 3 = Ambas
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS Categorias (
    Id         INTEGER PRIMARY KEY AUTOINCREMENT,
    Descricao  TEXT    NOT NULL CHECK (LENGTH(TRIM(Descricao)) > 0),
    Finalidade INTEGER NOT NULL CHECK (Finalidade IN (1, 2, 3))
);

-- -------------------------------------------
-- Transacoes
-- Tipo: 1 = Receita, 2 = Despesa
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS Transacoes (
    Id          INTEGER PRIMARY KEY AUTOINCREMENT,
    Descricao   TEXT    NOT NULL CHECK (LENGTH(TRIM(Descricao)) > 0),
    Valor       REAL    NOT NULL CHECK (Valor > 0),
    Tipo        INTEGER NOT NULL CHECK (Tipo IN (1, 2)),
    CategoriaId INTEGER NOT NULL REFERENCES Categorias(Id),
    PessoaId    INTEGER NOT NULL REFERENCES Pessoas(Id) ON DELETE CASCADE
);

-- -------------------------------------------
-- Professores
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS Professores (
    Id          INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome        TEXT NOT NULL CHECK (LENGTH(TRIM(Nome)) > 0),
    Email       TEXT NOT NULL CHECK (LENGTH(TRIM(Email)) > 0) UNIQUE,
    Telefone    TEXT NOT NULL CHECK (LENGTH(TRIM(Telefone)) > 0),
    Cpf         TEXT NOT NULL CHECK (LENGTH(TRIM(Cpf)) > 0) UNIQUE,
    Disciplina  TEXT NOT NULL CHECK (LENGTH(TRIM(Disciplina)) > 0)
);

-- -------------------------------------------
-- View: Totais por Pessoa
-- -------------------------------------------
CREATE VIEW IF NOT EXISTS vw_TotaisPorPessoa AS
SELECT
    p.Id,
    p.Nome,
    IFNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0) AS TotalReceitas,
    IFNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS TotalDespesas,
    IFNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0)
      - IFNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS Saldo
FROM Pessoas p
LEFT JOIN Transacoes t ON t.PessoaId = p.Id
GROUP BY p.Id, p.Nome;

-- -------------------------------------------
-- View: Totais por Categoria
-- -------------------------------------------
CREATE VIEW IF NOT EXISTS vw_TotaisPorCategoria AS
SELECT
    c.Id,
    c.Descricao,
    c.Finalidade,
    IFNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0) AS TotalReceitas,
    IFNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS TotalDespesas,
    IFNULL(SUM(CASE WHEN t.Tipo = 1 THEN t.Valor END), 0)
      - IFNULL(SUM(CASE WHEN t.Tipo = 2 THEN t.Valor END), 0) AS Saldo
FROM Categorias c
LEFT JOIN Transacoes t ON t.CategoriaId = c.Id
GROUP BY c.Id, c.Descricao, c.Finalidade;
