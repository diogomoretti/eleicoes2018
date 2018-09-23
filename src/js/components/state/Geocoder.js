import Google from 'google-maps'

Google.VERSION = 'weekly'

const Geocoder = () =>
  new Promise(resolve => Google.load(({ maps }) => resolve(new maps.Geocoder())))

export default Geocoder
