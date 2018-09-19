const ELECTION = '2022802018'
let STATE = 'MG'
let STATE_NAME = 'Minas Gerais'

let statesFromMap = document.querySelectorAll('#map .state')
for (let stt of statesFromMap) {
  stt.addEventListener('click', (e) => {
    e.preventDefault()
    STATE = stt.getAttribute('data-state')
    STATE_NAME = stt.querySelector('desc').textContent
    document.querySelector('.header-description').textContent = `${STATE_NAME}`
  })
}

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
