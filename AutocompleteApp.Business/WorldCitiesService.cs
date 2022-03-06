using AutocompleteApp.Data;
using AutocompleteApp.Model;
using System.Linq;
using System.Collections.Generic;

namespace AutocompleteApp.Business
{
  public class WorldCitiesService : IWorldCitiesService
  {
    private readonly IWorldCitiesRepository _repository;

    public WorldCitiesService(IWorldCitiesRepository repository)
    {
      _repository = repository;
    }

    // In case of querying a database the searchTerm should be sanitized to avoid malicious code.
    public IEnumerable<City> SearchCities(string searchTerm)
    {
      if (!string.IsNullOrWhiteSpace(searchTerm))
        return 
          _repository
          .GetAllWorldCities()
          .Where(x => x.Name.ToLower().StartsWith(searchTerm.ToLower()))
          .OrderBy(x=> x.Name);

      return new List<City>();
    }
  }
}
