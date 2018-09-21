import Google from 'google-maps'

Google.VERSION = 'weekly'

export const Geocoder = () =>
  new Promise((resolve) => Google.load(({ maps }) => resolve(new maps.Geocoder())))
