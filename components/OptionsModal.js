import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
function OptionsModal (props) {
  //// RENDER
  return (
    <Modal
      isVisible={props.isVisible}
      hasBackdrop={true}
      onBackdropPress={props.hideModal}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end' }}
    >
      <View>
        <View style={styles.buttonsContainer}>{props.children}</View>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            onPress={props.hideModal}
            style={styles.closeButtonContainer}
          >
            <Text
              style={{
                textAlign: 'center',
                fontFamily: props.font + '-medium',
                fontSize: 21 * scaleMultiplier,
                color: colors.red
              }}
            >
              {props.closeText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: colors.white,
    borderRadius: 10
  },
  closeButtonContainer: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 5
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

export default connect(mapStateToProps)(OptionsModal)
