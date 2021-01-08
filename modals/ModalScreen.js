import Constants from 'expo-constants'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'
import { StandardTypography } from '../styles/typography'

function ModalScreen (props) {
  return (
    <View>
      <Modal
        isVisible={props.isVisible}
        hasBackdrop={true}
        onBackdropPress={props.hideModal}
        onBackButtonPress={props.hideModal}
        backdropOpacity={0.3}
        onSwipeComplete={props.hideModal}
        // swipeDirection={['down']}
        // propagateSwipe={true}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          margin: 0,
          marginTop:
            Platform.OS === 'ios'
              ? Constants.statusBarHeight > 40
                ? 60
                : 30
              : 20
          // marginVertical: 20 * scaleMultiplier
        }}
        onModalWillShow={props.onModalWillShow}
      >
        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          }}
        >
          <View
            style={{
              width: '100%',
              // height: 50 * scaleMultiplier,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.onCancelPress ? props.onCancelPress() : null
                props.hideModal()
              }}
              style={{
                width: 45 * scaleMultiplier,
                height: 45 * scaleMultiplier
              }}
            >
              <Icon
                name='cancel'
                size={45 * scaleMultiplier}
                color={colors.oslo}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={StandardTypography(
                  props,
                  'h3',
                  'Bold',
                  'center',
                  colors.shark
                )}
              >
                {props.title}
              </Text>
            </View>
            <View
              style={{
                width: 45 * scaleMultiplier,
                height: 45 * scaleMultiplier
              }}
            >
              {props.topRightComponent}
            </View>
          </View>
          {props.children}
        </View>
      </Modal>
    </View>
  )
}

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    downloads: state.downloads,
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language)
  }
}

export default connect(mapStateToProps)(ModalScreen)
