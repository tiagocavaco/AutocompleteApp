using AutocompleteApp.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace AutocompleteApp.Test
{
  [TestClass]
  public class WorldCitiesRepositoryTests
  {
    [TestMethod]
    public void GetAllWorldCities_Success()
    {
      //Arrange
      var repository = new WorldCitiesRepository();

      //Act
      var cities = repository.GetAllWorldCities();

      //Assert
      Assert.AreEqual(23018, cities.Count(), "Did not load all cities corretly.");

      var firstCity = cities.FirstOrDefault();

      Assert.IsNotNull(firstCity, "First city is null.");
      Assert.IsFalse(string.IsNullOrWhiteSpace(firstCity.Name), "First city Name is null or white space.");
      Assert.IsFalse(string.IsNullOrWhiteSpace(firstCity.Country), "First city Country is null or white space.");
      Assert.IsFalse(string.IsNullOrWhiteSpace(firstCity.SubCountry), "First city SubCountry is null or white space.");
      Assert.IsFalse(string.IsNullOrWhiteSpace(firstCity.GeoNameId), "First city GeoNameId is null or white space.");
    }
  }
}
