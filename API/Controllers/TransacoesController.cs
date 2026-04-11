using Microsoft.AspNetCore.Mvc;
using Maxiprod.Api.Models;
using Maxiprod.Api.Repositories;
using System.Data;

namespace Maxiprod.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly TransacaoRepository _repo;
    private readonly PessoaRepository _pessoaRepo;
    private readonly CategoriaRepository _categoriaRepo;

    public TransacoesController(IDbConnection db)
    {
        _repo = new TransacaoRepository(db);
        _pessoaRepo = new PessoaRepository(db);
        _categoriaRepo = new CategoriaRepository(db);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Transacao transacao)
    {
        if (string.IsNullOrWhiteSpace(transacao.Descricao) || transacao.Descricao.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");
        if (transacao.Valor <= 0)
            return BadRequest("Valor deve ser positivo.");
        if (transacao.Tipo != 1 && transacao.Tipo != 2)
            return BadRequest("Tipo deve ser 1 (Receita) ou 2 (Despesa).");

        var pessoa = await _pessoaRepo.GetByIdAsync(transacao.PessoaId);
        if (pessoa is null)
            return BadRequest("Pessoa não encontrada.");

        var categoria = await _categoriaRepo.GetByIdAsync(transacao.CategoriaId);
        if (categoria is null)
            return BadRequest("Categoria não encontrada.");

        // Regra: menor de 18 não pode registrar receita
        if (transacao.Tipo == 1 && pessoa.Idade < 18)
            return BadRequest("Menores de 18 anos não podem registrar receitas.");

        // Regra: tipo deve ser compatível com finalidade da categoria
        // Finalidade 3 (Ambas) aceita qualquer tipo
        if (categoria.Finalidade != 3 && categoria.Finalidade != transacao.Tipo)
            return BadRequest("Tipo da transação não é compatível com a finalidade da categoria.");

        var id = await _repo.CreateAsync(transacao);
        transacao.Id = id;
        return CreatedAtAction(nameof(GetAll), new { id }, transacao);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.DeleteAsync(id);
        return NoContent();
    }
}
