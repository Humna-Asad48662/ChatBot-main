using CoreDataService.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace CoreDataService
{
    public class CoreDataContext : DbContext
    {
        public CoreDataContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }
        public DbSet<QueryHistory> QueryHistories { get; set; }
    }
}
