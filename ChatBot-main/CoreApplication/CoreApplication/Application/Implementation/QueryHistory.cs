using Application.Interfaces;
using CoreDataService;
using CoreDataService.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementation
{
    public class QueryHistoryService : IQueryHistoryService
    {
        public CoreDataContext CoreDataContext { get; set; }
        public QueryHistoryService(CoreDataContext coreDataContext)
        {
            CoreDataContext = coreDataContext;
        }

        public async Task<List<QueryHistory>> GetAll()
        {
            var data = await CoreDataContext.QueryHistories.Where(x => x.IsActive == true).ToListAsync();
            return data;
        }

        public async Task<QueryHistory> GetQueryHistoryById(int Id)
        {
            var data = await CoreDataContext.QueryHistories.Where(x => x.Id == Id).FirstOrDefaultAsync();
            return data;
        }

        public async Task<bool> UpdateQueryHistory(QueryHistory model)
        {
            var data = await CoreDataContext.QueryHistories.Where(x => x.Id == model.Id && x.IsActive == true).FirstOrDefaultAsync();
            if (data != null)
            {
                data.Query = model.Query;
                data.Answer = model.Answer;
                data.CreatedDate = DateTime.Now;
                CoreDataContext.Update(data);
                await CoreDataContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> DeleteQueryHistoryById(int Id)
        {
            var data = await CoreDataContext.QueryHistories.Where(x => x.Id == Id && x.IsActive == true).FirstOrDefaultAsync();
            if (data != null)
            {
                data.IsActive = false;
                data.CreatedDate = DateTime.Now;
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> InsertQueryHistory(QueryHistory model)
        {
            if (model != null && !string.IsNullOrEmpty(model?.Query) && model.Id == 0)
            {
                model.CreatedDate = DateTime.Now;
                model.IsActive = true;
                CoreDataContext.Add(model);
                await CoreDataContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
