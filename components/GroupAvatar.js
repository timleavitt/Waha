import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { groupIconSources } from '../assets/groupIcons/_groupIcons'
import { scaleMultiplier } from '../constants'
import { colors } from '../styles/colors'

/**
 * Component to display a group's avatar (emoji) in a little circle.
 * @param {Object} style - Extra style props for the component. Generally used to set the background color.
 * @param {string} emoji - The name of this group's emoji. Full list can be found in `../assets/groupIcons/_groupIcons.js`.
 * @param {number} size - The size of the component.
 * @param {Function} onPress - Function to trigger when the user taps on the component. Optional, so defaults to null.
 * @param {boolean} isActive - Whether the group we're displaying the avatar for is the currently active group or not. We display a blue circle around it if it is.
 */
const GroupAvatar = ({
  style,
  emoji,
  size,
  onPress = null,
  isActive = false
}) => {
  // The component for the emoji itself. We have to have conditional logic here because the default group emoji is an icon but the rest are all images.
  const emojiComponent =
    emoji === 'default' ? (
      <Icon
        name='group'
        size={(size / 1.7) * scaleMultiplier}
        color={colors.tuna}
      />
    ) : (
      <View
        style={{
          width: size * 0.65 * scaleMultiplier,
          height: size * 0.65 * scaleMultiplier,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          style={{
            width: size * 0.65 * scaleMultiplier,
            height: size * 0.65 * scaleMultiplier
          }}
          source={groupIconSources[emoji]}
        />
      </View>
    )

  // Style object for the group avatar container. We define it here instead of in a StyleSheet object because most of it requires information from props.
  const groupAvatarContainerStyle = {
    borderColor: isActive ? colors.blue : null,
    borderWidth: isActive ? 2 : null,
    borderRadius: (size * scaleMultiplier) / 2 + 5,
    width: size * scaleMultiplier + 5,
    height: size * scaleMultiplier + 5,
    alignItems: 'center',
    justifyContent: 'center'
  }

  // If we have an onPress function, render the component as a <TouchableOpacity/>. Otherwise, render it as a <View/>.
  return onPress ? (
    <TouchableOpacity
      style={[style, groupAvatarContainerStyle]}
      onPress={onPress}
    >
      {emojiComponent}
    </TouchableOpacity>
  ) : (
    <View style={[style, groupAvatarContainerStyle]} onPress={onPress}>
      {emojiComponent}
    </View>
  )
}

export default GroupAvatar
