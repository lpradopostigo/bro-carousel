import { html, css, LitElement } from 'lit'

// FIXME it feels clunky with one element

export default class BroCarousel extends LitElement {
  constructor () {
    super()
    this.viewbox = null
    this.Action = { next: -1, previous: 1 }
    this.lastAction = null
    this.itemsCount = 0
  }

  get items () {
    return this.shadowRoot.querySelector('slot[name=item]').assignedElements()
  }

  static get styles () {
    return css`
      :host {
        display: block;
        overflow: hidden;
        border-style: solid;
        border-width: 0.2rem;
        border-color: blue;
        position: relative;
      }

      ::slotted(*[slot='item']) {
        width: 100% !important;
      }

      div {
        display: flex;
        justify-content: space-between;
        transition-property: transform;
        transition-duration: 0.5s;
      }

      slot[name='control-right'] {
        display: block;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }

      slot[name='control-left'] {
        display: flex;
        align-content: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    `
  }

  render () {
    return html`
      <div @transitionend=${this.afterItemChange}>
        <slot name="item">No items to show</slot>
      </div>

      <slot
        name="control-left"
        @click=${() => {
          this.changeItem(this.Action.previous)
        }}
      ></slot>
      <slot
        name="control-right"
        @click=${() => {
          this.changeItem(this.Action.next)
        }}
      ></slot>
    `
  }

  firstUpdated () {
    this.viewbox = this.shadowRoot.querySelector('div')
    this.itemsCount = this.items.length
    this.viewbox.style.width = `${this.itemsCount * 100}%`
  }

  changeItem (action) {
    if (action === this.Action.previous) {
      this.insertBefore(this.items[this.itemsCount - 1], this.items[0])
      this.viewbox.style.transitionProperty = 'none'
      this.viewbox.style.transform = `translateX(${-100 / this.itemsCount}%)`
      setTimeout(() => {
        this.viewbox.style.transitionProperty = 'transform'
        this.viewbox.style.transform = 'translateX(0)'
      })
    } else {
      this.viewbox.style.transform = `translateX(${-100 / this.itemsCount}%)`
    }
    this.lastAction = action
  }

  afterItemChange () {
    if (this.lastAction === this.Action.next) {
      this.insertBefore(
        this.items[0],
        this.items[this.itemsCount - 1].nextSibling
      )
      this.viewbox.style.transitionProperty = 'none'
      this.viewbox.style.transform = 'translateX(0)'
      setTimeout(() => {
        this.viewbox.style.transitionProperty = 'transform'
      })
    }
  }
}

window.customElements.define('bro-carousel', BroCarousel)
