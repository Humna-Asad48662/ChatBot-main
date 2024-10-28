using CoreDataService.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public  interface IQueryHistoryService
    {
        Task<List<QueryHistory>> GetAll();
        Task<QueryHistory> GetQueryHistoryById(int Id);
        Task<bool> UpdateQueryHistory(QueryHistory model);
        Task<bool> InsertQueryHistory(QueryHistory model);
        Task<bool> DeleteQueryHistoryById(int Id);
    }
}
