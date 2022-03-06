using AutocompleteApp.Business;
using AutocompleteApp.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace AutocompleteApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorldCitiesController : ControllerBase
    {
        private readonly IWorldCitiesService _service;

        public WorldCitiesController(IWorldCitiesService service)
        {
            _service = service;
        }

        [HttpGet]
        
        public IEnumerable<City> Get(string searchTerm)
        {
            return _service.SearchCities(searchTerm);
        }
    }
}
