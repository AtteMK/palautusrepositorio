import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, countries, setFilter, weather }) => {
  const filtered = countries.filter(country => 
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <div>
      <CountryList countries={filtered} setFilter={setFilter} weather={weather} />
    </div>
  )
}

const CountryDetails = ({ country, weather }) => {
  console.log(weather)
  let languages = []
  if (country.languages) {
    languages = Object.values(country.languages);
  }
  return (
  <div>
    <h1>{country.name.common}</h1>
    <p>
      Capital: {country.capital}
    </p>
    <p>
      Area: {country.area}
    </p>
    <h2>Languages:</h2>
    <ul>
      {languages.map(languages => (
        <li key={languages}>{languages}</li>
      ))}
    </ul>
    <img src={country.flags.png} />
    <p>Current temperature: {weather.temperature}°C</p>
    <p>Current windspeed: {weather.windspeed}m/s</p>
  </div>
  )
}

const CountryList = ({ countries, setFilter, weather }) => {
  if (countries.length > 10) {
    return(
      <p>Too many matches, specify another filter.</p>
    )
  } else if (countries.length === 1) {
    return <CountryDetails country={countries[0]} weather={weather} />
  }
  return (
    <ul>
      {countries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => setFilter(country.name.common)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [countries, setCoutries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState([])

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCoutries(response.data)
      })
      .catch(error => console.error('Countries fetch error', error))
  }, [])

  useEffect(() => {
    const selectedCountry = countries.find( country => 
      country.name.common.toLowerCase() === filter.toLowerCase())
    if (selectedCountry !== undefined) {
    const [lat, lon] = selectedCountry.latlng
    console.log('weather')
    axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(response => {
    setWeather(response.data.current_weather)
    })
    .catch(error => console.error('Weather fetch error', error))
    }}, [filter, countries])
    

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      <Filter 
      filter={filter} 
      countries={countries} 
      setFilter={setFilter} 
      weather={weather} />
    </div>
  )
}

export default App