const currentLocation = () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      return resolve({
        lat: parseFloat(coords.latitude),
        lng: parseFloat(coords.longitude)
      })
    })
  })
}

export default currentLocation
