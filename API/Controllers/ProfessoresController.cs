using Microsoft.AspNetCore.Mvc;
using Maxiprod.Api.Models;
using Maxiprod.Api.Repositories;
using System.Data;
using System.Text.RegularExpressions;

namespace Maxiprod.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessoresController : ControllerBase
{
    private readonly ProfessorRepository _repo;

    public ProfessoresController(IDbConnection db) => _repo = new ProfessorRepository(db);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Professor professor)
    {
        var error = Validate(professor);
        if (error is not null) return BadRequest(error);

        if (await _repo.ExistsByEmailAsync(professor.Email))
            return BadRequest("Já existe um professor com este e-mail.");
        if (await _repo.ExistsByCpfAsync(professor.Cpf))
            return BadRequest("Já existe um professor com este CPF.");

        var id = await _repo.CreateAsync(professor);
        professor.Id = id;
        return CreatedAtAction(nameof(GetAll), new { id }, professor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Professor professor)
    {
        if (await _repo.GetByIdAsync(id) is null)
            return NotFound();

        var error = Validate(professor);
        if (error is not null) return BadRequest(error);

        if (await _repo.ExistsByEmailAsync(professor.Email, id))
            return BadRequest("Já existe um professor com este e-mail.");
        if (await _repo.ExistsByCpfAsync(professor.Cpf, id))
            return BadRequest("Já existe um professor com este CPF.");

        professor.Id = id;
        await _repo.UpdateAsync(professor);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (await _repo.GetByIdAsync(id) is null)
            return NotFound();
        await _repo.DeleteAsync(id);
        return NoContent();
    }

    private static string? Validate(Professor p)
    {
        if (string.IsNullOrWhiteSpace(p.Nome) || p.Nome.Length > 200)
            return "Nome é obrigatório e deve ter no máximo 200 caracteres.";
        if (string.IsNullOrWhiteSpace(p.Email) || p.Email.Length > 200)
            return "E-mail é obrigatório e deve ter no máximo 200 caracteres.";
        if (!Regex.IsMatch(p.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            return "E-mail inválido.";
        if (string.IsNullOrWhiteSpace(p.Telefone) || p.Telefone.Length > 20)
            return "Telefone é obrigatório e deve ter no máximo 20 caracteres.";
        if (string.IsNullOrWhiteSpace(p.Cpf) || p.Cpf.Length > 14)
            return "CPF é obrigatório e deve ter no máximo 14 caracteres.";
        if (string.IsNullOrWhiteSpace(p.Disciplina) || p.Disciplina.Length > 200)
            return "Disciplina é obrigatória e deve ter no máximo 200 caracteres.";
        return null;
    }
}
