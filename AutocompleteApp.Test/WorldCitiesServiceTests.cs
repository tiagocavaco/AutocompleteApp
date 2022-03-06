using AutocompleteApp.Business;
using AutocompleteApp.Data;
using AutocompleteApp.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;

namespace AutocompleteApp.Test
{
  [TestClass]
  public class WorldCitiesServiceTests
  {
    [TestMethod]
    public void SearchWorldCities_EmptySearchTerm_EmptyResult()
    {
      //Arrange
      var city = new City
      {
        Name = "Lisbon",
        Country = "Portugal",
        SubCountry = "Lisbon",
        GeoNameId = "2267057"
      };

      var repositoryMock = new Mock<IWorldCitiesRepository>();

      repositoryMock.Setup(e => e.GetAllWorldCities()).Returns(
        new List<City>
        {
          city,
        }
      );

      var service = new WorldCitiesService(repositoryMock.Object);

      var searchTerm = "";

      //Act
      var cities = service.SearchCities(searchTerm);

      //Assert
      Assert.AreEqual(0, cities.Count(), "Should return empty list.");
    }

    [TestMethod]
    public void SearchWorldCities_SearchTermNotMatch_EmptyResult()
    {
      //Arrange
      var city = new City
      {
        Name = "Lisbon",
        Country = "Portugal",
        SubCountry = "Lisbon",
        GeoNameId = "2267057"
      };

      var repositoryMock = new Mock<IWorldCitiesRepository>();

      repositoryMock.Setup(e => e.GetAllWorldCities()).Returns(
        new List<City>
        {
          city,
        }
      );

      var service = new WorldCitiesService(repositoryMock.Object);

      var searchTerm = "lisboa";

      //Act
      var cities = service.SearchCities(searchTerm);

      //Assert
      Assert.AreEqual(0, cities.Count(), "Should return empty list.");
    }


    [TestMethod]
    public void SearchWorldCities_ValidSearchTerm_ListResult()
    {
      //Arrange
      var firstCity = new City
      {
        Name = "Luanda",
        Country = "Angola",
        SubCountry = "Luanda",
        GeoNameId = "2240449"
      };

      var secondCity = new City
      {
        Name = "Lismore",
        Country = "Australia",
        SubCountry = "New South Wales",
        GeoNameId = "2160063"
      };

      var thirdCity = new City
      {
        Name = "Lisbon",
        Country = "Portugal",
        SubCountry = "Lisbon",
        GeoNameId = "2267057"
      };

      var repositoryMock = new Mock<IWorldCitiesRepository>();

      repositoryMock.Setup(e => e.GetAllWorldCities()).Returns(
        new List<City>
        {
          firstCity,
          secondCity,
          thirdCity
        }
      );

      var service = new WorldCitiesService(repositoryMock.Object);

      var searchTerm = "LiS";

      //Act
      var cities = service.SearchCities(searchTerm);

      //Assert
      Assert.AreEqual(2, cities.Count(), "Did not found the right number of cities.");

      Assert.AreEqual(thirdCity.Name, cities.FirstOrDefault().Name, "Found cities not in the right order.");
      Assert.AreEqual(secondCity.Name, cities.LastOrDefault().Name, "Found cities not in the right order.");
    }
  }
}
