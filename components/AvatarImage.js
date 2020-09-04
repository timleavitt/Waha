import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/fonts/icons'
import { colors, groupIconSources, scaleMultiplier } from '../constants'
// component for a group's avatar
function AvatarImage (props) {
  //+ RENDER

  // renders the emoji in a group icon
  // if it's default, show the standard group icon
  // otherwise, show the custom icon that's stored in the group redux
  var emoji =
    props.emoji === 'default' ? (
      <Icon
        name='group'
        size={(props.size / 1.7) * scaleMultiplier}
        color={colors.tuna}
      />
    ) : (
      <View
        style={{
          width: props.size * 0.65 * scaleMultiplier,
          height: props.size * 0.65 * scaleMultiplier,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          style={{
            width: props.size * 0.65 * scaleMultiplier,
            height: props.size * 0.65 * scaleMultiplier
          }}
          source={groupIconSources[props.emoji]}
        />
      </View>
    )

  // if we have something for props.onPress, make the avatar image touchable
  // note: only time it's touchable is when used in the set screen header to
  //  open the drawer
  return props.onPress ? (
    <TouchableOpacity
      style={[
        props.style,
        {
          borderColor: props.isActive ? colors.blue : null,
          borderWidth: props.isActive ? 2 : null,
          width: props.size + 5,
          height: props.size + 5,
          borderRadius: props.size / 2 + 5,
          alignItems: 'center',
          justifyContent: 'center'
        }
      ]}
      onPress={props.onPress}
    >
      {emoji}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        props.style,
        {
          borderColor: props.isActive ? colors.blue : null,
          borderWidth: props.isActive ? 2 : null,
          width: props.size * scaleMultiplier + 5,
          height: props.size * scaleMultiplier + 5,
          borderRadius: (props.size * scaleMultiplier) / 2 + 5,
          alignItems: 'center',
          justifyContent: 'center'
        }
      ]}
      source={{ uri: props.source }}
      onPress={props.onPress}
    >
      {emoji}
    </View>
  )
}

export default AvatarImage
