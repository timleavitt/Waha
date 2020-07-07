import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { scaleMultiplier, languageT2S } from '../constants'
import * as FileSystem from 'expo-file-system'

function LanguageSelectItem (props) {
  // FUNCTIONS

  iconComponent = props.isSelected ? (
    <View>
      <Icon name='check' size={30} color='#60C239' />
    </View>
  ) : (
    <TouchableOpacity onPress={props.playAudio}>
      <Icon name='volume' size={30} color='black' />
    </TouchableOpacity>
  )

  return (
    <View
      style={{
        height: 70 * scaleMultiplier,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#EFF2F4',
        backgroundColor: props.isSelected ? '#BFE5AF' : '#FFFFFF'
      }}
    >
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
            style={{
              fontSize: 18 * scaleMultiplier,
              fontWeight: 'bold',
              textAlign: 'left'
            }}
          >
            {props.nativeName}
          </Text>
          <Text
            style={{
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
      {iconComponent}
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  headerImage: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 40 * scaleMultiplier,
    alignSelf: 'center',
    marginHorizontal: 20
  }
})

export default LanguageSelectItem
