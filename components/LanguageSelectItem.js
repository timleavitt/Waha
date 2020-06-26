import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { scaleMultiplier, languageT2S } from '../constants'
import * as FileSystem from 'expo-file-system'
import { Audio } from 'expo-av'

function LanguageSelectItem (props) {
  // FUNCTIONS

  const soundObject = new Audio.Sound()

  async function playAudio () {
    soundObject.unloadAsync()
    await soundObject.loadAsync(languageT2S[props.id]).then(() => {
      soundObject.playAsync()
    })
  }

  return (
    <View
      style={[
        props.style,
        {
          height: 50 * scaleMultiplier,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      ]}
    >
      <Text
        style={{
          fontSize: 24 * scaleMultiplier
        }}
      >
        {props.label}
      </Text>
      <Image
        style={styles.headerImage}
        source={{
          uri: FileSystem.documentDirectory + props.id + '-header.png'
        }}
      />
      <TouchableOpacity onPress={playAudio}>
        <Icon name='volume' size={30} color='black' />
      </TouchableOpacity>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  headerImage: {
    resizeMode: 'contain',
    width: 120,
    height: 40,
    alignSelf: 'center'
  }
})

export default LanguageSelectItem
