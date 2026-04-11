namespace Maxiprod.Api.Models;

public class Categoria
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int Finalidade { get; set; } // 1=Receita, 2=Despesa, 3=Ambas
}
