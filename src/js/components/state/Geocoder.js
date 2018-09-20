import Google from 'google-maps'

Google.VERSION = 'weekly'

export const Geocoder = () =>
  new Promise((res) => {
    Google.load(({ maps }) => res(maps.Geocoder()))
  })