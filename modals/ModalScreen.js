import Constants from 'expo-constants'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

/**
 * A component that renders a fullscreen modal with a header.
 * @param {boolean} isVisible - Whether the modal is visible or not.
 * @param {Function} hideMopdal - Function to hide the modal.
 * @param {Component} topRightComponent - (Optional) Component to display in the upper right corner of the modal. The upper left is always the x button to close.
 * @param {Function} onCancelPress - (Optional) Function to fire when the user presses the upper-left close button. Supplements closing the modal.
 * @param {Function} onModalWillShow - Function to fire when the modal first opens.
 * @param {string} title - The title of the screen to display at the very top of the component.
 * @param {Component} children - The component to display as the content of the modal screen.
 */
const ModalScreen = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  topRightComponent = null,
  onCancelPress = () => {},
  onModalWillShow,
  title,
  children,
  // Props passed from redux.
  downloads,
  activeDatabase,
  isRTL,
  activeGroup,
  t,
  font
}) => (
  // Outer view is here because of some weird scrolling issues that occur when there's nested scrollable content inside the modal.
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
        marginBottom: 0,
        marginHorizontal: 0,
        // Need to make the modal have 20px of space above it from the header. The way to do that is different between iOS and Android.
        marginTop:
          Platform.OS === 'ios'
            ? Constants.statusBarHeight > 40
              ? 60
              : 30
            : 20
      }}
      onModalWillShow={onModalWillShow}
    >
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.headerContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              onCancelPress()
              hideModal()
            }}
            style={styles.headerButtonContainer}
          >
            <Icon
              name='cancel'
              size={45 * scaleMultiplier}
              color={colors.oslo}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
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
          <View style={styles.headerButtonContainer}>{topRightComponent}</View>
        </View>
        {children}
      </View>
    </Modal>
  </View>
)

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.aquaHaze,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center'
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10 * scaleMultiplier
  },
  headerTitleContainer: { flex: 1 },
  headerButtonContainer: {
    width: 45 * scaleMultiplier,
    height: 45 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(ModalScreen)
