using AutocompleteApp.Business;
using AutocompleteApp.Controllers;
using AutocompleteApp.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;

namespace AutocompleteApp.Test
{
  [TestClass]
  public class WorldCitiesControllerTests
  {
    [TestMethod]
    public void Get_ReturnsResponse()
    {
      //Arrange
      var city = new City
      {
        Name = "Lisbon",
        Country = "Portugal",
        SubCountry = "Lisbon",
        GeoNameId = "2267057"
      };

      var serviceMock = new Mock<IWorldCitiesService>();

      serviceMock.Setup(e => e.SearchCities(It.IsAny<string>())).Returns(
        new List<City>
        {
          city,
        }
      );

      var controller = new WorldCitiesController(serviceMock.Object);

      var searchTerm = "any";

      //Act
      var response = controller.Get(searchTerm);

      //Assert
      Assert.AreEqual(1, response.Count(), "Should return 1 item.");
    }
  }
}
