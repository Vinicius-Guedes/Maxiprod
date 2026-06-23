using Microsoft.Data.Sqlite;
using System.Data;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Inicializar banco SQLite na primeira execução
using (var initConn = new SqliteConnection(connectionString))
{
    initConn.Open();
    initConn.Execute("PRAGMA journal_mode=WAL;");
    initConn.Execute("PRAGMA foreign_keys=ON;");
    var initSql = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "init.sql"));
    initConn.Execute(initSql);
}

builder.Services.AddScoped<IDbConnection>(_ =>
{
    var conn = new SqliteConnection(connectionString);
    conn.Open();
    conn.Execute("PRAGMA foreign_keys=ON;");
    return conn;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
app.MapControllers();
app.Run();
