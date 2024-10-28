using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreDataService.Entity
{
    public class QueryHistory
    {
        [Key]
        public int Id { get; set; }
        public string? Query { get; set; }
        public string? Answer { get; set; }
        public bool? IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
