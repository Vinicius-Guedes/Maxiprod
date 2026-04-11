using Microsoft.AspNetCore.Mvc;
using Maxiprod.Api.Models;
using Maxiprod.Api.Repositories;
using System.Data;

namespace Maxiprod.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly CategoriaRepository _repo;

    public CategoriasController(IDbConnection db) => _repo = new CategoriaRepository(db);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Categoria categoria)
    {
        if (string.IsNullOrWhiteSpace(categoria.Descricao) || categoria.Descricao.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");
        if (categoria.Finalidade < 1 || categoria.Finalidade > 3)
            return BadRequest("Finalidade deve ser 1 (Receita), 2 (Despesa) ou 3 (Ambas).");

        var id = await _repo.CreateAsync(categoria);
        categoria.Id = id;
        return CreatedAtAction(nameof(GetAll), new { id }, categoria);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Categoria categoria)
    {
        if (await _repo.GetByIdAsync(id) is null)
            return NotFound();
        if (string.IsNullOrWhiteSpace(categoria.Descricao) || categoria.Descricao.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");
        if (categoria.Finalidade < 1 || categoria.Finalidade > 3)
            return BadRequest("Finalidade deve ser 1 (Receita), 2 (Despesa) ou 3 (Ambas).");

        categoria.Id = id;
        await _repo.UpdateAsync(categoria);
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
