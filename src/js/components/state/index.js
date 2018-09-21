import Geocoder from './Geocoder'
import currentLocation from './currentLocation'
import ufByCep from 'ufByCep'

const REGEXP_CEP = /[0-9]{5}-[0-9]{3}/

const getUfCode = () =>
  new Promise((resolve) => {
    Geocoder().then((geocoder) => {
      currentLocation.then((coords) => {
        geocoder.geocode(
          { location: coords },
          data => ufByCep(data[0].formatted_address.match(REGEXP_CEP)[0])
            .then(({ uf }) => resolve(uf))
        )
      })
    })
  })

export default getUfCode
