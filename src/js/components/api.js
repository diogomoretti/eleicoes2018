import { ELECTION, STATE } from './config'

const makeAPIUrl = (state, type) => {
  return `http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2018/${state}/${ELECTION}/${type}/candidatos`
}

const getList = type => {
  let api = ''

  switch (type) {
    case 'presidente':
      api = makeAPIUrl('BR', '1')
      break
    case 'governador':
      api = makeAPIUrl(STATE, '3')
      break
    case 'senador':
      api = makeAPIUrl(STATE, '5')
      break
    case 'federal':
      api = makeAPIUrl(STATE, '6')
      break
    case 'estadual':
      api = makeAPIUrl(STATE, '7')
      break
  }

  return fetch(api).then(response => response.json()) // eslint-disable-line
}

const getPhoto = (id, state) => {
  return fetch(`http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2018/${state}/${ELECTION}/candidato/${id}`).then(response => response.json()) // eslint-disable-line
}

export { getList, getPhoto }
