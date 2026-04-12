using Dapper;
using Maxiprod.Api.Models;
using System.Data;

namespace Maxiprod.Api.Repositories;

public class PessoaRepository
{
    private readonly IDbConnection _db;

    public PessoaRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<Pessoa>> GetAllAsync() =>
        await _db.QueryAsync<Pessoa>("SELECT Id, Nome, Idade FROM Pessoas");

    public async Task<Pessoa?> GetByIdAsync(int id) =>
        await _db.QuerySingleOrDefaultAsync<Pessoa>(
            "SELECT Id, Nome, Idade FROM Pessoas WHERE Id = @Id", new { Id = id });

    public async Task<int> CreateAsync(Pessoa pessoa) =>
        await _db.ExecuteScalarAsync<int>(
            "INSERT INTO Pessoas (Nome, Idade) VALUES (@Nome, @Idade); SELECT CAST(SCOPE_IDENTITY() AS INT);",
            new { pessoa.Nome, pessoa.Idade });

    public async Task UpdateAsync(Pessoa pessoa) =>
        await _db.ExecuteAsync(
            "UPDATE Pessoas SET Nome = @Nome, Idade = @Idade WHERE Id = @Id",
            new { pessoa.Id, pessoa.Nome, pessoa.Idade });

    public async Task DeleteAsync(int id) =>
        await _db.ExecuteAsync("DELETE FROM Pessoas WHERE Id = @Id", new { Id = id });
}
