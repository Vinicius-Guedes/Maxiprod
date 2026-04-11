using Dapper;
using Maxiprod.Api.Models;
using System.Data;

namespace Maxiprod.Api.Repositories;

public class TransacaoRepository
{
    private readonly IDbConnection _db;

    public TransacaoRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<Transacao>> GetAllAsync() =>
        await _db.QueryAsync<Transacao>(
            "SELECT Id, Descricao, Valor, Tipo, CategoriaId, PessoaId FROM Transacoes");

    public async Task<int> CreateAsync(Transacao transacao) =>
        await _db.ExecuteScalarAsync<int>(
            @"INSERT INTO Transacoes (Descricao, Valor, Tipo, CategoriaId, PessoaId)
              VALUES (@Descricao, @Valor, @Tipo, @CategoriaId, @PessoaId);
              SELECT SCOPE_IDENTITY();",
            new { transacao.Descricao, transacao.Valor, transacao.Tipo, transacao.CategoriaId, transacao.PessoaId });

    public async Task DeleteAsync(int id) =>
        await _db.ExecuteAsync("DELETE FROM Transacoes WHERE Id = @Id", new { Id = id });
}
