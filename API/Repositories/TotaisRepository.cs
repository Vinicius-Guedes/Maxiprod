using Dapper;
using Maxiprod.Api.Models;
using System.Data;

namespace Maxiprod.Api.Repositories;

public class TotaisRepository
{
    private readonly IDbConnection _db;

    public TotaisRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<TotalPessoa>> GetTotaisPorPessoaAsync() =>
        await _db.QueryAsync<TotalPessoa>(
            "SELECT Id, Nome, TotalReceitas, TotalDespesas, Saldo FROM vw_TotaisPorPessoa");

    public async Task<IEnumerable<TotalCategoria>> GetTotaisPorCategoriaAsync() =>
        await _db.QueryAsync<TotalCategoria>(
            "SELECT Id, Descricao, Finalidade, TotalReceitas, TotalDespesas, Saldo FROM vw_TotaisPorCategoria");
}
