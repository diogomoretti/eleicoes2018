const currentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        res({
          lat: parseFloat(coords.latitude),
          lng: parseFloat(coords.longitude)
        })
      })
    }
    return rej(new Error('Navigator Geolocation not suported in your browser'))
  })
}

export default currentLocation
