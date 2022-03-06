using AutocompleteApp.Model;
using System;
using System.Collections.Generic;

namespace AutocompleteApp.Business
{
  public interface IWorldCitiesService
  {
    /// <summary>
    /// Search cities with a name starting with the specified search term, ignores case.
    /// </summary>
    /// <param name="searchTerm">Search term to match city names.</param>
    /// <returns>All cities found.</returns>
    public IEnumerable<City> SearchCities(string searchTerm);
  }
}
