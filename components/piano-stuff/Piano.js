import { Audio } from 'expo-av'
import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors, keyColors } from '../../styles/colors'
import { getLanguageFont } from '../../styles/typography'
import KeyLabel from '../piano-stuff/KeyLabel'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state)
  }
}

function Piano ({
  // Props passed from a parent component.
  setPattern,
  isMuted = false,
  // Props passed from redux.
  isRTL,
  font,
  activeGroup
}) {
  // RENDER

  // require keyboard notes
  var C = require('../../assets/pianoNotes/C.mp3')
  var Db = require('../../assets/pianoNotes/Db.mp3')
  var D = require('../../assets/pianoNotes/D.mp3')
  var Eb = require('../../assets/pianoNotes/Eb.mp3')
  var E = require('../../assets/pianoNotes/E.mp3')
  var F = require('../../assets/pianoNotes/F.mp3')
  var Gb = require('../../assets/pianoNotes/Gb.mp3')
  var G = require('../../assets/pianoNotes/G.mp3')
  var Ab = require('../../assets/pianoNotes/Ab.mp3')
  var A = require('../../assets/pianoNotes/A.mp3')
  var Bb = require('../../assets/pianoNotes/Bb.mp3')
  var B = require('../../assets/pianoNotes/B.mp3')

  function playNote (number) {
    if (!isMuted) {
      var note = new Audio.Sound()
      switch (number) {
        case 0:
          note.loadAsync(C).then(() => note.playAsync())
          break
        case 1:
          note.loadAsync(Db).then(() => note.playAsync())
          break
        case 2:
          note.loadAsync(D).then(() => note.playAsync())
          break
        case 3:
          note.loadAsync(Eb).then(() => note.playAsync())
          break
        case 4:
          note.loadAsync(E).then(() => note.playAsync())
          break
        case 5:
          note.loadAsync(F).then(() => note.playAsync())
          break
        case 6:
          note.loadAsync(Gb).then(() => note.playAsync())
          break
        case 7:
          note.loadAsync(G).then(() => note.playAsync())
          break
        case 8:
          note.loadAsync(Ab).then(() => note.playAsync())
          break
        case 9:
          note.loadAsync(A).then(() => note.playAsync())
          break
        case 10:
          note.loadAsync(Bb).then(() => note.playAsync())
          break
        case 11:
          note.loadAsync(B).then(() => note.playAsync())
          break
      }
    }
  }

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'flex-start'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          position: 'absolute',
          zIndex: 2
        }}
      >
        <View style={{ flex: 0.5 }} />
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => {
            setPattern(pattern => pattern + '01')
            playNote(1)
          }}
        >
          <KeyLabel backgroundColor={keyColors['1']} number='1' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => {
            setPattern(pattern => pattern + '03')
            playNote(3)
          }}
        >
          <KeyLabel backgroundColor={keyColors['3']} number='3' />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => {
            setPattern(pattern => pattern + '06')
            playNote(6)
          }}
        >
          <KeyLabel backgroundColor={keyColors['6']} number='6' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => {
            setPattern(pattern => pattern + '08')
            playNote(8)
          }}
        >
          <KeyLabel backgroundColor={keyColors['8']} number='8' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => {
            setPattern(pattern => pattern + '10')
            playNote(10)
          }}
        >
          <KeyLabel backgroundColor={keyColors['10']} number='10' />
        </TouchableOpacity>
        <View style={{ flex: 0.5 }} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%'
        }}
      >
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '00')
            playNote(0)
          }}
        >
          <KeyLabel backgroundColor={keyColors['0']} number='0' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '02')
            playNote(2)
          }}
        >
          <KeyLabel backgroundColor={keyColors['2']} number='2' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '04')
            playNote(4)
          }}
        >
          <KeyLabel backgroundColor={keyColors['4']} number='4' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '05')
            playNote(5)
          }}
        >
          <KeyLabel backgroundColor={keyColors['5']} number='5' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '07')
            playNote(7)
          }}
        >
          <KeyLabel backgroundColor={keyColors['7']} number='7' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '09')
            playNote(9)
          }}
        >
          <KeyLabel backgroundColor={keyColors['9']} number='9' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => {
            setPattern(pattern => pattern + '11')
            playNote(11)
          }}
        >
          <KeyLabel backgroundColor={keyColors['11']} number='11' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  whiteKey: {
    flex: 1,
    height: Dimensions.get('window').height / 2.5,
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: colors.shark,
    borderWidth: 2,
    zIndex: 0,
    color: colors.white,
    borderBottomWidth: 5
  },
  blackKey: {
    flex: 1,
    height: Dimensions.get('window').height / 4,
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: colors.shark,
    borderWidth: 2,
    zIndex: 1,
    backgroundColor: colors.shark
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 10
  },
  circle: {
    width: Dimensions.get('window').width / 10,
    height: Dimensions.get('window').width / 10,
    borderRadius: Dimensions.get('window').width / 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    zIndex: 3,
    marginBottom: 10
  }
})

export default connect(mapStateToProps)(Piano)
