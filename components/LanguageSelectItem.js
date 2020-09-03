import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, scaleMultiplier } from '../constants'
function LanguageSelectItem (props) {
  // FUNCTIONS

  var iconComponent = props.isSelected ? (
    <View style={{ marginHorizontal: 20 }}>
      <Icon name='check' size={30} color={colors.apple} />
    </View>
  ) : (
    <TouchableOpacity
      onPress={props.playAudio}
      style={{ marginHorizontal: 20 }}
    >
      <Icon name='volume' size={30} color={colors.tuna} />
    </TouchableOpacity>
  )

  return (
    <View
      style={{
        // height: 80 * scaleMultiplier,
        aspectRatio: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: props.isSelected ? '#BFE5AF' : colors.white
      }}
    >
      {iconComponent}
      <TouchableOpacity
        style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: 'row'
        }}
        onPress={props.onPress}
      >
        <View
          style={{
            justifyContent: 'center',
            flex: 1
          }}
        >
          <Text
            style={[
              Typography(props, 'h3', '', 'left', colors.shark),
              { fontWeight: 'bold' }
            ]}
          >
            {props.nativeName}
          </Text>
          <Text
            style={{
              color: colors.shark,
              fontSize: 14 * scaleMultiplier
            }}
          >
            {props.localeName}
          </Text>
        </View>
        <Image
          style={styles.headerImage}
          source={{
            uri: props.logoSource
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  headerImage: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier,
    marginRight: 20
  }
})

export default LanguageSelectItem
