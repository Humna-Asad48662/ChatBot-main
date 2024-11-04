using Application.Interfaces;
using CoreDataService.Entity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QueryHistoryController : ControllerBase
    {
        public IQueryHistoryService QueryHistoryService { get; set; }
        public QueryHistoryController(IQueryHistoryService queryHistoryService)
        {
            QueryHistoryService = queryHistoryService;
        }
        // GET: api/<QueryHistoryController>
        [HttpGet("GetAll")]
        public async Task<List<QueryHistory>> GetAll()
        {
            var response = await QueryHistoryService.GetAll();
            return response;
        }

        // GET api/<QueryHistoryController>/5
        [HttpGet("{id}")]
        public async Task<QueryHistory> GetQueryHistoryById(int id)
        {
            var response = await QueryHistoryService.GetQueryHistoryById(id);
            return response;
        }

        // POST api/<QueryHistoryController>
        [HttpPost]
        public async Task<bool> InsertQueryHistory(QueryHistory model)
        {
            var response = await QueryHistoryService.InsertQueryHistory(model);
            return response;
        }

        // PUT api/<QueryHistoryController>/5
        [HttpPut("{id}")]
        public async Task<bool> UpdateQueryHistory(QueryHistory model)
        {
            var response = await QueryHistoryService.UpdateQueryHistory(model);
            return response;
        }

        // DELETE api/<QueryHistoryController>/5
        [HttpDelete("{id}")]
        public async Task<bool> Delete(int id)
        {
            var response = await QueryHistoryService.DeleteQueryHistoryById(id);
            return response;
        }
    }
}
