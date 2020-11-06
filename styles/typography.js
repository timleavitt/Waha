import { scaleMultiplier } from '../constants'

export default Typography = (props, fontSize, fontFamily, textAlign, color) => {
  const sizes = {
    d: 12 * scaleMultiplier,
    p: 14 * scaleMultiplier,
    h4: 16 * scaleMultiplier,
    h3: 18 * scaleMultiplier,
    h2: 24 * scaleMultiplier,
    h1: 36 * scaleMultiplier
  }

  const families = {
    regular: props.font + '-regular',
    medium: props.font + '-medium',
    black: props.font + '-black'
  }

  const alignments = {
    left: props.isRTL ? 'right' : 'left',
    center: 'center'
  }
  return {
    fontSize: sizes[fontSize],
    fontFamily: props.font ? families[fontFamily] : null,
    textAlign: alignments[textAlign],
    color: color
  }
}
