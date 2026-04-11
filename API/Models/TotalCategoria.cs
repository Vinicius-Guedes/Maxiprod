namespace Maxiprod.Api.Models;

public class TotalCategoria
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int Finalidade { get; set; }
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}
