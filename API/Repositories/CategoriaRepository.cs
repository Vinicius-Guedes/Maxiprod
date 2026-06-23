using Dapper;
using Maxiprod.Api.Models;
using System.Data;

namespace Maxiprod.Api.Repositories;

public class CategoriaRepository
{
    private readonly IDbConnection _db;

    public CategoriaRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<Categoria>> GetAllAsync() =>
        await _db.QueryAsync<Categoria>("SELECT Id, Descricao, Finalidade FROM Categorias");

    public async Task<Categoria?> GetByIdAsync(int id) =>
        await _db.QuerySingleOrDefaultAsync<Categoria>(
            "SELECT Id, Descricao, Finalidade FROM Categorias WHERE Id = @Id", new { Id = id });

    public async Task<int> CreateAsync(Categoria categoria) =>
        await _db.ExecuteScalarAsync<int>(
            "INSERT INTO Categorias (Descricao, Finalidade) VALUES (@Descricao, @Finalidade); SELECT last_insert_rowid();",
            new { categoria.Descricao, categoria.Finalidade });

    public async Task UpdateAsync(Categoria categoria) =>
        await _db.ExecuteAsync(
            "UPDATE Categorias SET Descricao = @Descricao, Finalidade = @Finalidade WHERE Id = @Id",
            new { categoria.Id, categoria.Descricao, categoria.Finalidade });

    public async Task DeleteAsync(int id) =>
        await _db.ExecuteAsync("DELETE FROM Categorias WHERE Id = @Id", new { Id = id });
}
