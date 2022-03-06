using AutocompleteApp.Model;
using CsvHelper;
using CsvHelper.Configuration;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace AutocompleteApp.Data
{
  public class WorldCitiesRepository : IWorldCitiesRepository
  {
    //Memory cache can be added to avoid reading file from disk everytime.
    public IEnumerable<City> GetAllWorldCities()
    {
      var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
      {
        PrepareHeaderForMatch = args => args.Header.ToLower()
      };

      using var reader = new StreamReader("Files\\world-cities_csv.csv"); //Path can be fetched from config file.
      using var csv = new CsvReader(reader, csvConfig);

      return csv.GetRecords<City>().ToList();
    }
  }
}
