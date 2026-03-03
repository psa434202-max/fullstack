import { useState, useEffect } from "react"
import axios from "axios"

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    const capital = country.capital[0]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log("Weather fetch error:", error)
      })
  }, [country, apiKey])

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p><strong>Capital:</strong> {country.capital}</p>
      <p><strong>Area:</strong> {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
          <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  )
}

const Countries = ({ countries, setSearch }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => setSearch(country.name.common)}>
              show
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return <p>No matches found</p>
}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log("Countries fetch error:", error)
      })
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Country Finder</h1>

      <div>
        find countries{" "}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Countries
        countries={filteredCountries}
        setSearch={setSearch}
      />
    </div>
  )
}

export default App