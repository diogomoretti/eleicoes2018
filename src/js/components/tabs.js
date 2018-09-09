import $ from 'domtastic'

class Tabs {
  constructor (trigger) {
    this.trigger = trigger
    this.listenClick(trigger)
  }

  render () {
    let context = $(this.trigger)
    let tabActive = context.find('.tab-list__item.active')
    let tab = tabActive.data('tab')

    $('.tab-content__item').removeClass('active')
    context.find(`.tab-content__item[data-tab="${tab}"]`).addClass('active')
  }

  listenClick () {
    let changeTab = () => this.render()
    let tab = $('.tab-list__item')

    tab.on('click', function () {
      tab.removeClass('active')
      $(this).addClass('active')
      changeTab()
    })
  }
}

export default Tabs
