namespace Maxiprod.Api.Models;

public class Transacao
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int Tipo { get; set; } // 1=Receita, 2=Despesa
    public int CategoriaId { get; set; }
    public int PessoaId { get; set; }
}
