import Tabs from './components/tabs'
import Render from './components/render'

const tabs = new Tabs('.tabs')
tabs.render()

let statez = document.querySelectorAll('#map .state')
for (let stz of statez) {
  stz.addEventListener('click', (e) => {
    e.preventDefault()
    Render()
  })
}
