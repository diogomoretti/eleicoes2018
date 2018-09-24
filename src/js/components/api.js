import { ELECTION, STATE } from './config'

const makeAPIUrl = (state, type) => {
  return `http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2018/${state}/${ELECTION}/${type}/candidatos`
}

const getList = type =>
  STATE().then((state) => {
    let api = ''

    switch (type) {
      case 'presidente':
        api = makeAPIUrl('BR', '1')
        break
      case 'governador':
        api = makeAPIUrl(state, '3')
        break
      case 'senador':
        api = makeAPIUrl(state, '5')
        break
      case 'federal':
        api = makeAPIUrl(state, '6')
        break
      case 'estadual':
        api = makeAPIUrl(state, '7')
        break
    }
    return fetch(api).then(response => response.json()) // eslint-disable-line
  })

const getPhoto = (id, state) => {
  return fetch(`http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2018/${state}/${ELECTION}/candidato/${id}`).then(response => response.json()) // eslint-disable-line
}

export { getList, getPhoto }
