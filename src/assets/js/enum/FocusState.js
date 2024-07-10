const DIRECTION = {
  UP: 0,
  DOWN: 1
}

const KEYCODES = {
  UP: [38],
  DOWN: [40, 9]
}
export default {
  initialState: -1,
  isArrowOrTab (keyCode) {
    return this.goUp(keyCode) || this.goDown(keyCode)
  },

  goUp (keyCode) {
    return KEYCODES.UP.includes(keyCode)
  },

  goDown (keyCode) {
    return KEYCODES.DOWN.includes(keyCode)
  },

  getDirectionByCode (keyCode) {
    if (!this.isArrowOrTab(keyCode)) { return }
    return this.goDown(keyCode) ? DIRECTION.DOWN : DIRECTION.UP
  },

  getNextState (currentState, keyCode, limit) {
    const direction = this.getDirectionByCode(keyCode)
    if (direction === DIRECTION.DOWN) {
      return currentState < limit ? currentState + 1 : 0
    }
    if (direction === DIRECTION.UP && currentState > 0) {
      return currentState - 1
    }
    return -1
  }
}
