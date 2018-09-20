import Google from 'google-maps'

Google.VERSION = 'weekly'

export const Geocoder = () => 
  new Promise((res) => {
    Google.load((google) => res(google.maps.Geocoder()))
  })