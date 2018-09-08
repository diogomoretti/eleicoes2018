import $ from 'domtastic'

class Tabs {
  constructor (trigger) {
    this.changeTabs(trigger)
    this.listenClick(trigger)
  }

  changeTabs (trigger) {
    let context = $(trigger)
    let tabActive = context.find('.tab-list__item.active')
    let tab = tabActive.data('tab')

    $('.tab-content__item').removeClass('active')
    context.find(`.tab-content__item[data-tab="${tab}"]`).addClass('active')
  }

  listenClick (trigger) {
    let changeTab = trigger => this.changeTabs(trigger)
    let tab = $('.tab-list__item')

    tab.on('click', function () {
      tab.removeClass('active')
      $(this).addClass('active')
      changeTab(trigger)
    })
  }
}

export default Tabs
