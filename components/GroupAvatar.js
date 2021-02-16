import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/fonts/icons'
import { groupIconSources } from '../assets/groupIcons/_groupIcons'
import { scaleMultiplier } from '../constants'
import { colors } from '../styles/colors'

// component for a group's avatar
function GroupAvatar ({
  style,
  emoji,
  size,
  onPress = null,
  isActive = false
}) {
  //+ RENDER

  // renders the emoji in a group icon
  // if it's default, show the standard group icon
  // otherwise, show the custom icon that's stored in the group redux
  var emoji =
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

  // if we have something for onPress, make the avatar image touchable
  // note: only time it's touchable is when used in the set screen header to
  //  open the drawer
  return onPress ? (
    <TouchableOpacity
      style={[
        style,
        {
          borderColor: isActive ? colors.blue : null,
          borderWidth: isActive ? 2 : null,
          width: size * scaleMultiplier + 5,
          height: size * scaleMultiplier + 5,
          borderRadius: (size * scaleMultiplier) / 2 + 5,
          alignItems: 'center',
          justifyContent: 'center'
        }
      ]}
      onPress={onPress}
    >
      {emoji}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        style,
        {
          borderColor: isActive ? colors.blue : null,
          borderWidth: isActive ? 2 : null,
          width: size * scaleMultiplier + 5,
          height: size * scaleMultiplier + 5,
          borderRadius: (size * scaleMultiplier) / 2 + 5,
          alignItems: 'center',
          justifyContent: 'center'
        }
      ]}
      onPress={onPress}
    >
      {emoji}
    </View>
  )
}

export default GroupAvatar
