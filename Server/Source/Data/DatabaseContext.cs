using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Source.Models.Entities;

namespace Server.Source.Data
{
    public class DatabaseContext : IdentityDbContext<UserEntity>
    {
        public virtual DbSet<Formula1StandingEntity> Formula1Standings { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Formula1StandingEntity>().ToTable("Formula1Standings");


            builder.Entity<UserEntity>(e =>
            {
                e.Property(p => p.FirstName).IsRequired(required: true).HasMaxLength(50);
                e.Property(p => p.LastName).IsRequired(required: true).HasMaxLength(50);
            });

            builder.Entity<Formula1StandingEntity>(e =>
            {
                e.Property(p => p.Id).HasColumnName("Formula1StandingId");

                e.Property(p => p.Type).IsRequired(required: true).HasMaxLength(50);
                e.Property(p => p.Year).IsRequired(required: true);
                e.Property(p => p.DataJson).IsRequired(required: true);
                e.Property(p => p.EventAt).IsRequired(required: true);                

                e.HasIndex(p => new { p.Type, p.Year }).IsUnique();
            });
        }
    }
}
