import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getSystemIsRTL, scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'
import { SystemTypography } from '../../styles/typography'

function LanguageSelectItem ({
  // passed from parent
  nativeName,
  localeName,
  font,
  logoSource,
  onPress,
  isSelected,
  playAudio
}) {
  // FUNCTIONS
  var iconComponent = isSelected ? (
    <View style={{ marginHorizontal: 20 }}>
      <Icon name='check' size={30} color={colors.apple} />
    </View>
  ) : (
    <TouchableOpacity
      onPress={playAudio}
      style={{
        height: '100%',
        width: 70,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Icon name='volume' size={30} color={colors.tuna} />
    </TouchableOpacity>
  )

  return (
    <View
      style={{
        height: 80 * scaleMultiplier,
        // aspectRatio: 5,
        width: '100%',
        flexDirection: getSystemIsRTL() ? 'row-reverse' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: isSelected ? '#BFE5AF' : colors.white
      }}
    >
      {iconComponent}
      <TouchableOpacity
        style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: getSystemIsRTL() ? 'row-reverse' : 'row'
        }}
        onPress={onPress}
      >
        <View
          style={{
            justifyContent: 'center',
            flex: 1
          }}
        >
          <Text
            style={SystemTypography(
              false,
              'h3',
              'Bold',
              'left',
              colors.shark,
              font
            )}
          >
            {nativeName}
          </Text>
          <Text
            style={SystemTypography(
              false,
              'p',
              'Regular',
              'left',
              colors.shark
            )}
          >
            {localeName}
          </Text>
        </View>
        <Image
          style={styles.headerImage}
          source={{
            uri: logoSource
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
    marginHorizontal: 20
  }
})

export default LanguageSelectItem
