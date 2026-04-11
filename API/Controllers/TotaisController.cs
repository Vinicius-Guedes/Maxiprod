using Microsoft.AspNetCore.Mvc;
using Maxiprod.Api.Repositories;
using System.Data;

namespace Maxiprod.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly TotaisRepository _repo;

    public TotaisController(IDbConnection db) => _repo = new TotaisRepository(db);

    [HttpGet("pessoas")]
    public async Task<IActionResult> GetTotaisPorPessoa() =>
        Ok(await _repo.GetTotaisPorPessoaAsync());

    [HttpGet("categorias")]
    public async Task<IActionResult> GetTotaisPorCategoria() =>
        Ok(await _repo.GetTotaisPorCategoriaAsync());
}
