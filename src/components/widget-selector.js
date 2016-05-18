
import { document, HTMLDivElement } from 'window'
import app from 'app'

const template = app.util.getCurrentDocument().querySelector('template')

function createRadioEntryForComponent (tag, description) {

  const div = document.createElement('div')
  div.classList.add('radio')

  const label = document.createElement('label')

  const input = document.createElement('input')
  input.setAttribute('type', 'radio')
  input.setAttribute('name', 'widget')
  input.setAttribute('value', tag)

  const span = document.createElement('strong')
  span.innerText = tag

  const p = document.createElement('p')
  p.innerText = description

  div.appendChild(label)
  div.appendChild(p)
  label.appendChild(input)
  label.appendChild(span)

  return div
}

class AppWidgetSelectorElement extends HTMLDivElement {

  createdCallback () {

    const clone = document.importNode(template.content, true)
    this.appendChild(clone)

    this.dom = {
      modal: this.querySelector('*[is="x-modal-window"]'),
      form: this.querySelector('form'),
      selections: this.querySelector('.form-group > div:nth-child(2)'),
      attributes: this.querySelector('.form-group > div:nth-child(3)')
    }
  }

  displayAvailableComponentsForm (avalilableComponentDescriptors) {

    const radios = this.dom.selections

    while (radios.hasChildNodes()) {
      radios.removeChild(radios.firstChild)
    }

    avalilableComponentDescriptors.forEach(descriptor => {

      radios.appendChild(
        createRadioEntryForComponent(descriptor.tagName,
                                     descriptor.description))
        // build attribute form, show on select
    })
    this.selectFirstRadio()
  }

  selectFirstRadio () {
    const first = this.dom.selections.querySelector('input[type="radio"]')
    if (first) {
      first.checked = true
      this.dom.modal.dom.btnAccept.disabled = false
    } else {
      this.dom.modal.dom.btnAccept.disabled = true
    }
  }

  /**
   * @param {Array<Object>} availableWidgets
   * @return {Promise<[string, Object]>}
   */
  showModal (avalilableComponentDescriptors) {
    this.displayAvailableComponentsForm(avalilableComponentDescriptors)
    return this.dom.modal.showModal(() => {

      const tag = this.dom.form['widget'].value
      const descriptor
        = avalilableComponentDescriptors.find(x => x.tagName === tag)

      const attributeMap = {}

      // TODO show form to fill values

      return Promise.resolve([descriptor, attributeMap])

    })
  }
}

const constructor = document.registerElement('tjp-widget-selector', {
  prototype: AppWidgetSelectorElement.prototype
})

export { constructor as AppWidgetSelectorElement }