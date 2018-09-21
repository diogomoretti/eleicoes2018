
const get = url => window.fetch(url).then(o => o.json())

const ufByCep = cep => get(`https://viacep.com.br/ws/${cep}/json/`)

export default ufByCep
