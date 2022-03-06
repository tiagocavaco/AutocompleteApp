using AutocompleteApp.Model;
using System.Collections.Generic;

namespace AutocompleteApp.Data
{
  public interface IWorldCitiesRepository
  {
    /// <summary>
    /// Reads all cities from csv file.
    /// </summary>
    /// <returns>List of cities.</returns>
    public IEnumerable<City> GetAllWorldCities();
  }
}
