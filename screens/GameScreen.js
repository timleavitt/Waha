import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert,
  Switch
} from 'react-native'

function GameScreen (props) {
  //// STATE

  const [pattern, setPattern] = useState('')

  //// CONSTRUCTOR

  useEffect(() => {
    console.log(pattern)
    if (pattern.includes('brownblueyellow'))
      props.navigation.replace('SetsRoot')
  }, [pattern])

  //// RENDER

  return (
    <View style={styles.screen}>
      <View style={{ flexDirection: 'row', flex: 1, width: '66%', margin: 10 }}>
        <TouchableOpacity
          style={[styles.key, { backgroundColor: '#3362F2' }]}
          onPress={() => setPattern(pattern => pattern + 'blue')}
        />
        <TouchableOpacity
          style={[styles.key, { backgroundColor: '#CB36FF' }]}
          onPress={() => setPattern(pattern => pattern + 'purple')}
        />
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity
          style={[styles.key, { backgroundColor: '#E84E3C' }]}
          onPress={() => setPattern(pattern => pattern + 'red')}
        />
        <TouchableOpacity
          style={[styles.key, { backgroundColor: '#CF912D' }]}
          onPress={() => setPattern(pattern => pattern + 'brown')}
        />
        <TouchableOpacity
          style={[styles.key, { backgroundColor: '#FFFD51' }]}
          onPress={() => setPattern(pattern => pattern + 'yellow')}
        />
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    padding: 50
  },
  key: {
    flex: 1,
    height: '100%',
    margin: 5,
    borderRadius: 10
  }
})

export default GameScreen
