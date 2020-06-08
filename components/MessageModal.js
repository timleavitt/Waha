import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import Modal from 'react-native-modal'
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'

// modal variant that shows some information
function MessageModal (props) {
  //// RENDER
  return (
    <Modal
      isVisible={props.isVisible}
      hasBackdrop={true}
      onBackdropPress={props.hideModal}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end', flex: 1, margin: 0 }}
    >
      <View style={styles.buttonsContainer}>
        <Image
          source={props.imageSource}
          style={{
            height: 200,
            margin: 20,
            padding: 20,
            resizeMode: 'center'
          }}
        />
        <Text
          style={{
            fontFamily: props.font + '-black',
            fontSize: 36 * scaleMultiplier,
            marginVertical: 20,
            marginHorizontal: 15,
            textAlign: 'center'
          }}
        >
          {props.title}
        </Text>
        <Text
          style={{
            fontFamily: props.font + '-medium',
            fontSize: 18 * scaleMultiplier,
            marginHorizontal: 15,
            textAlign: 'center'
          }}
        >
          {props.body}
        </Text>
        <TouchableOpacity
          style={{ marginBottom: 40, marginTop: 80 * scaleMultiplier }}
          onPress={props.hideModal}
        >
          <Text
            style={{
              fontFamily: props.font + '-medium',
              fontSize: 24 * scaleMultiplier,
              color: '#60C239'
            }}
          >
            Got it!
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(MessageModal)
