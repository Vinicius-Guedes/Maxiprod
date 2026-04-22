using Dapper;
using Maxiprod.Api.Models;
using System.Data;

namespace Maxiprod.Api.Repositories;

public class ProfessorRepository
{
    private readonly IDbConnection _db;

    public ProfessorRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<Professor>> GetAllAsync() =>
        await _db.QueryAsync<Professor>("SELECT Id, Nome, Email, Telefone, Cpf, Disciplina FROM Professores");

    public async Task<Professor?> GetByIdAsync(int id) =>
        await _db.QuerySingleOrDefaultAsync<Professor>(
            "SELECT Id, Nome, Email, Telefone, Cpf, Disciplina FROM Professores WHERE Id = @Id", new { Id = id });

    public async Task<bool> ExistsByEmailAsync(string email, int? excludeId = null) =>
        await _db.ExecuteScalarAsync<bool>(
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM Professores WHERE Email = @Email AND (@ExcludeId IS NULL OR Id != @ExcludeId)) THEN 1 ELSE 0 END",
            new { Email = email, ExcludeId = excludeId });

    public async Task<bool> ExistsByCpfAsync(string cpf, int? excludeId = null) =>
        await _db.ExecuteScalarAsync<bool>(
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM Professores WHERE Cpf = @Cpf AND (@ExcludeId IS NULL OR Id != @ExcludeId)) THEN 1 ELSE 0 END",
            new { Cpf = cpf, ExcludeId = excludeId });

    public async Task<int> CreateAsync(Professor professor) =>
        await _db.ExecuteScalarAsync<int>(
            "INSERT INTO Professores (Nome, Email, Telefone, Cpf, Disciplina) VALUES (@Nome, @Email, @Telefone, @Cpf, @Disciplina); SELECT CAST(SCOPE_IDENTITY() AS INT);",
            new { professor.Nome, professor.Email, professor.Telefone, professor.Cpf, professor.Disciplina });

    public async Task UpdateAsync(Professor professor) =>
        await _db.ExecuteAsync(
            "UPDATE Professores SET Nome = @Nome, Email = @Email, Telefone = @Telefone, Cpf = @Cpf, Disciplina = @Disciplina WHERE Id = @Id",
            new { professor.Id, professor.Nome, professor.Email, professor.Telefone, professor.Cpf, professor.Disciplina });

    public async Task DeleteAsync(int id) =>
        await _db.ExecuteAsync("DELETE FROM Professores WHERE Id = @Id", new { Id = id });
}
