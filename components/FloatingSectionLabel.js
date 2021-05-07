// import SvgUri from 'expo-svg-uri'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 *
 */
const FloatingSectionLabel = ({
  // Props passed from a parent component.
  section,
  totalTextContentHeight,
  textAreaHeight,
  scrollBarSize,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => (
  <View
    style={[
      styles.floatingSectionLabelContainer,
      {
        marginRight: scrollBarSize / 2,
        top:
          totalTextContentHeight !== 0
            ? (section.offset * (textAreaHeight - scrollBarSize)) /
              (totalTextContentHeight - textAreaHeight)
            : 0
      }
    ]}
  >
    <View style={styles.sectionTextContainer}>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'p',
          'Bold',
          'center',
          colors.white
        )}
      >
        {section.name}
      </Text>
    </View>
    <Icon
      name='triangle-right'
      size={25 * scaleMultiplier}
      color={colors.tuna}
    />
  </View>
)

const styles = StyleSheet.create({
  floatingSectionLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  sectionTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tuna,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 3,
    marginRight: -10,
    height: 30 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(FloatingSectionLabel)
