import React from 'react';
import Autocomplete from './Autocomplete';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

beforeAll(() => {
  // Add spy on fetch to be able to mock
  jest.spyOn(window, 'fetch')
});

beforeEach(() => {
  // Add fake timers to mock setTimeout behaviour
  jest.useFakeTimers();
});

afterEach(() => {
  // Clear mocks to keep consistency 
  jest.clearAllMocks();
});

test('renders by default an h1 and an input', async () => {
  render(<Autocomplete />);

  // Expects waitFor to timeout to make sure fetch is not called
  await expect(waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1))).rejects.toEqual(expect.anything());

  const h1Element = screen.getByText('Autocomplete');
  expect(h1Element).toBeInTheDocument();

  const inputElement = screen.getByRole('searchbox');
  expect(inputElement).toBeInTheDocument();
});

test('when user clicks the input, the autocomplete list should be empty', async () => {
  render(<Autocomplete />);

  const inputElement = screen.getByRole('searchbox');

  // Emulates an user click in the input field
  userEvent.click(inputElement);

  // Input value should be empty
  expect(inputElement.value).toBe('');

  // Expects waitFor to timeout to make sure fetch is not called
  await expect(waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1))).rejects.toEqual(expect.anything());

  const listElement = screen.getByRole('list');
  expect(listElement).toBeInTheDocument();

  const { queryAllByRole } = within(listElement);

  const items = queryAllByRole("listitem");

  // Autocomplete list items should be empty
  expect(items.length).toEqual(0);
});

test('when user clicks the input and types, the autocomplete list should be filled and a result can be selected', async () => {
  render(<Autocomplete />);

  const fetchResponseData = [
    { "name": "Lisbon", "country": "Portugal", "subCountry": "Lisbon", "geoNameId": "2267057" },
    { "name": "Lisburn", "country": "United Kingdom", "subCountry": "Northern Ireland", "geoNameId": "2644411" }
  ];

  // Mocks fetch response to return data
  window.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => (fetchResponseData)
  });

  const typedValue = 'lis';

  const inputElement = screen.getByRole('searchbox');

  // Emulates an user click in the input field
  userEvent.click(inputElement);

  // Emulates an user typing in the input field
  userEvent.type(inputElement, typedValue[0]);
  userEvent.type(inputElement, typedValue[1]);
  setTimeout(() => userEvent.type(inputElement, typedValue[2]), 150); // setTimeout to 150ms to make sure debounce is working

  // Input value should be the typed value by user
  await waitFor(() => expect(inputElement.value).toBe(typedValue));

  // Waits to make sure fetch has been called 2 times
  await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(2));

  // First fetch should be called with url and query string equal to the first 2 chars
  expect(window.fetch).toHaveBeenNthCalledWith(1, 'WorldCities?searchTerm=' + typedValue[0] + typedValue[1]);
  // Second fetch should be called with url and query string equal to the typed value
  expect(window.fetch).toHaveBeenNthCalledWith(2, 'WorldCities?searchTerm=' + typedValue);

  const listElement = screen.getByRole('list');
  expect(listElement).toBeInTheDocument();

  const { getAllByRole } = within(listElement);

  const items = getAllByRole("listitem");

  // Autocomplete list items count should be equal to fetch response data count
  expect(items.length).toEqual(fetchResponseData.length);

  expect(items[0]).toHaveTextContent(fetchResponseData[0].name);
  expect(items[1]).toHaveTextContent(fetchResponseData[1].name);

  // Emulates an user click in the first result
  userEvent.click(items[0]);

  // Input value should be the selected value name
  expect(inputElement.value).toBe(fetchResponseData[0].name);

  // Waits to make sure fetch has been called for the 3rd time
  await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(3));

  // Fetch should be called with url and query string equal to the selected value name
  expect(window.fetch).toHaveBeenCalledWith('WorldCities?searchTerm=' + fetchResponseData[0].name);

  // After a result is selected the autocomplete list should not be shown
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

test('when user clicks the input and types a not found value, the autocomplete list should have only one item and a result can not be selected', async () => {
  render(<Autocomplete />);

  const fetchResponseData = [];

  // Mocks fetch response to return data
  window.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => (fetchResponseData)
  });

  const typedValue = 'lis';

  const inputElement = screen.getByRole('searchbox');

  // Emulates an user click in the input field
  userEvent.click(inputElement);

  // Emulates an user typing in the input field
  userEvent.type(inputElement, typedValue[0]);
  userEvent.type(inputElement, typedValue[1]);
  userEvent.type(inputElement, typedValue[2]);

  // Input value should be the typed value by user
  expect(inputElement.value).toBe(typedValue);

  // Waits to make sure fetch has been called for the 1st time
  await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

  // Fetch should be called with url and query string equal to the typed value
  expect(window.fetch).toHaveBeenCalledWith('WorldCities?searchTerm=' + typedValue);

  const listElement = screen.getByRole('list');
  expect(listElement).toBeInTheDocument();

  const { getAllByRole } = within(listElement);

  const items = getAllByRole("listitem");

  // Autocomplete list items count should be only 1
  expect(items.length).toEqual(1);

  expect(items[0]).toHaveTextContent('No results found.');

  // Emulates an user click in the not found result
  userEvent.click(items[0]);

  // Input value should still the same
  expect(inputElement.value).toBe(typedValue);

  // Expects waitFor to timeout to make sure fetch is not called for the 2nd time
  await expect(waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(2))).rejects.toEqual(expect.anything());

  // Autocomplete list should not be shown
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

test('when user clicks the input and types, and error occurs in the api, error should be logged and the autocomplete list should be empty', async () => {
  render(<Autocomplete />);

  const rejectResponse = new Error('An error occurred.');

  // Mocks fetch response to return error
  window.fetch.mockRejectedValue(rejectResponse);

  // Mock console log
  console.log = jest.fn();

  const typedValue = 'lis';

  const inputElement = screen.getByRole('searchbox');

  // Emulates an user click in the input field
  userEvent.click(inputElement);

  // Emulates an user typing in the input field
  userEvent.type(inputElement, typedValue[0]);
  userEvent.type(inputElement, typedValue[1]);
  userEvent.type(inputElement, typedValue[2]);

  // Input value should be the typed value by user
  expect(inputElement.value).toBe(typedValue);

  // Waits to make sure fetch has been called for the 1st time
  await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

  // Fetch should be called with url and query string equal to the typed value
  expect(window.fetch).toHaveBeenCalledWith('WorldCities?searchTerm=' + typedValue);

  // Error should be logged
  expect(console.log).toHaveBeenCalledWith(rejectResponse);

  const listElement = screen.getByRole('list');
  expect(listElement).toBeInTheDocument();

  const { queryAllByRole } = within(listElement);

  const items = queryAllByRole("listitem");

  // Autocomplete list items should be empty
  expect(items.length).toEqual(0);
});