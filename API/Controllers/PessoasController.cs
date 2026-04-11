using Microsoft.AspNetCore.Mvc;
using Maxiprod.Api.Models;
using Maxiprod.Api.Repositories;
using System.Data;

namespace Maxiprod.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly PessoaRepository _repo;

    public PessoasController(IDbConnection db) => _repo = new PessoaRepository(db);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Pessoa pessoa)
    {
        if (string.IsNullOrWhiteSpace(pessoa.Nome) || pessoa.Nome.Length > 200)
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");
        if (pessoa.Idade < 0)
            return BadRequest("Idade deve ser maior ou igual a zero.");

        var id = await _repo.CreateAsync(pessoa);
        pessoa.Id = id;
        return CreatedAtAction(nameof(GetAll), new { id }, pessoa);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Pessoa pessoa)
    {
        if (await _repo.GetByIdAsync(id) is null)
            return NotFound();
        if (string.IsNullOrWhiteSpace(pessoa.Nome) || pessoa.Nome.Length > 200)
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");
        if (pessoa.Idade < 0)
            return BadRequest("Idade deve ser maior ou igual a zero.");

        pessoa.Id = id;
        await _repo.UpdateAsync(pessoa);
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
}
