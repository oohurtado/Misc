using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Source.Data;
using Server.Source.Data.Interfaces;
using Server.Source.Logic;
using Server.Source.Models.Entities;
using Server.Source.Services.Scrap;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            ConfigureServices(builder);
            ConfigureApp(builder);            
        }

        private static void ConfigureServices(WebApplicationBuilder builder)
        {
            #region cors
            builder.Services.AddCors(o => o.AddPolicy(name: "OriginAngular", policy =>
            {
                policy
                .WithOrigins("http://localhost:4200")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            }));
            #endregion

            #region data base
            builder.Services
                .AddIdentity<UserEntity, IdentityRole>(p =>
                {
                    p.User.RequireUniqueEmail = true;
                    p.Password.RequireDigit = false;
                    p.Password.RequiredUniqueChars = 0;
                    p.Password.RequireLowercase = false;
                    p.Password.RequireNonAlphanumeric = false;
                    p.Password.RequireUppercase = false;
                    p.Password.RequiredLength = 3;
                })
                .AddEntityFrameworkStores<DatabaseContext>()
                .AddDefaultTokenProviders();

                string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
                builder.Services.AddDbContext<DatabaseContext>(p =>
                {
                    //p.UseSqlServer(connectionString);
                    p.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
                });
            #endregion

            #region logs
            // Habilita logging a consola
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            #endregion

            #region repositories
            builder.Services.AddScoped<IScrapDataRepository, ScrapDataRepository>();
            #endregion

            #region logic
            builder.Services.AddScoped<ScrapLogic>();
            #endregion

            #region services
            builder.Services.AddScoped<IScrapService, ScrapService>();
            #endregion

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // Add services to the container.
            builder.Services.AddScoped<IScrapService, ScrapService>();
        }

        private static void ConfigureApp(WebApplicationBuilder builder)
        {
            var app = builder.Build();

            #region cors
            app.UseCors("OriginAngular"); 
            #endregion

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}


/*
https://localhost:7243/openapi/v1.json
https://localhost:7243/WeatherForecast/v1
https://localhost:7243/WeatherForecast/v2
*/