import $ from 'domtastic'
import { getList, getPhoto } from './api'

export default function render () {
  let candidates = $('[data-candidate]')

  candidates.each(item => {
    let candidateDiv = $(item)
    let candidate = candidateDiv.data('candidate')

    candidateDiv.html('<img class="loading" src="assets/img/loading.gif" />')

    getList(candidate).then(res => {
      candidateDiv.html(renderCandidates(res.candidatos, res.unidadeEleitoral.sigla))
    })
  })
}

const renderCandidates = (data, state) => {
  let renderized = ''

  data.map(item => {
    if (item.descricaoSituacao === 'Deferido') {
      renderized += `
        <div class="candidate-item">
          <div class="candidate-item-column__photo">
            <img class="candidate-item__photo" data-photo-candidate="${item.id}" />
          </div>
          <div class="candidate-item-column__content">
            <span class="candidate-item__number">${item.numero}</span>
            <h3 class="candidate-item__name">${item.nomeUrna} <span</h3>
            <p class="candidate-item__coalition">${item.partido.sigla} • ${item.nomeColigacao}</p>
          </div>
        </div>
      `
    }

    getPhoto(item.id, state)
      .then(res => {
        $(`[data-photo-candidate="${res.id}"]`).attr('src', res.fotoUrl)
      })
  })

  return renderized
}
