using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Source.Models.Entities.Relationships;
using Server.Source.Models.Entities.WebScraping;

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
            builder.Entity<PersonalInformationEntity>().ToTable("PersonalInformation");
            builder.Entity<UserColorEntity>().ToTable("UserColors");
            builder.Entity<ColorEntity>().ToTable("Colors");

            builder.Entity<UserEntity>(e =>
            {
                e.Property(p => p.FirstName).IsRequired(required: true).HasMaxLength(50);
                e.Property(p => p.LastName).IsRequired(required: true).HasMaxLength(50);

                e.HasOne(p => p.PersonalInformation).WithOne(p => p.User).OnDelete(DeleteBehavior.Cascade);                
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

            builder.Entity<PersonalInformationEntity>(e =>
            {
                e.Property(p => p.Id).HasColumnName("PersonalInformationId");

                e.Property(p => p.Birthdate).HasColumnType("datetime");
                e.Property(p => p.Gender).HasMaxLength(1);
                e.Property(p => p.MartialStatus).HasMaxLength(50);
                e.Property(p => p.CountryOfBirth).HasMaxLength(100);
                e.Property(p => p.StateOfBirth).HasMaxLength(100);
                e.Property(p => p.CityOfBirth).HasMaxLength(100);
                e.Property(p => p.Picture).HasMaxLength(100);

                e.HasOne(p => p.User).WithOne(p => p.PersonalInformation).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<ColorEntity>(e =>
            {
                e.Property(p => p.Id).HasColumnName("ColorId");

                e.Property(p => p.Name).HasMaxLength(50);
                e.Property(p => p.Code).HasMaxLength(20);
            });

            builder.Entity<UserColorEntity>(e =>
            {
                e.Property(p => p.Id).HasColumnName("UserColorId");

                e.HasOne(p => p.User).WithMany(p => p.UserColors).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(p => p.Color).WithMany(p => p.UserColors).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
