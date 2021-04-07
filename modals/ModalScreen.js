import Constants from 'expo-constants'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    downloads: state.downloads,
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

const ModalScreen = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  topRightComponent,
  onCancelPress,
  onModalWillShow,
  title,
  children = null,
  // Props passed from redux.
  downloads,
  activeDatabase,
  isRTL,
  activeGroup,
  translations,
  font
}) => {
  return (
    <View>
      <Modal
        isVisible={isVisible}
        hasBackdrop={true}
        useNativeDriver
        onBackdropPress={hideModal}
        onBackButtonPress={hideModal}
        backdropOpacity={0.3}
        onSwipeComplete={hideModal}
        swipeDirection={['down']}
        propagateSwipe={true}
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
        onModalWillShow={onModalWillShow}
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
                onCancelPress ? onCancelPress() : null
                hideModal()
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
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'center',
                  colors.shark
                )}
              >
                {title}
              </Text>
            </View>
            <View
              style={{
                width: 45 * scaleMultiplier,
                height: 45 * scaleMultiplier
              }}
            >
              {topRightComponent}
            </View>
          </View>
          {children}
        </View>
      </Modal>
    </View>
  )
}

export default connect(mapStateToProps)(ModalScreen)
