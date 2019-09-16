export default class Shortcut {

  constructor() {
    this.listeners = []
    this.specialKeys = []
    this.keys = []
    this.keydownHandler = this.handleKeydown.bind(this)
    window.addEventListener('keydown', this.keydownHandler)
  }

  listen(callback) {
    this.listeners.push({
      callback,
    })
  }

  stop() {
    this.listeners = []
    this.reset()
  }

  setSpecialKeys(event) {
    const keys = []

    if (event.shiftKey) {
      keys.push('shift')
    }

    if (event.ctrlKey) {
      keys.push('control')
    }

    if (event.altKey) {
      keys.push('alt')
    }

    if (event.metaKey) {
      keys.push('meta')
    }

    this.specialKeys = keys
  }

  getKeys() {
    return [...this.specialKeys, ...this.keys]
  }

  handleKeydown(event) {
    console.log(this.listeners.length)
    if (!this.listeners.length) {
      return
    }

    this.setSpecialKeys(event)
    const name = event.key.toLowerCase()
    const isSpecialKey = this.specialKeys.includes(name)
    const isPressed = this.isPressed(name)

    if (isSpecialKey || isPressed) {
      return
    }

    this.keys.push(name)
    const keys = this.getKeys()

    this.listeners.forEach(listener => {
      listener.callback({ event, keys })
    })

    this.reset()
  }

  is(keys) {
    const pressedKeys = this.getKeys()
    console.log({ pressedKeys })
    const match = keys.every(key => pressedKeys.includes(key))
    return match
  }

  isPressed(name) {
    return !!this.keys.find(key => key === name)
  }

  reset() {
    this.keys = []
    this.specialKeys = []
  }

  destroy() {
    this.stop()
    window.removeEventListener('keydown', this.keydownHandler)
  }

}