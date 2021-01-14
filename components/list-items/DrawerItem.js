import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../../constants'
import { StandardTypography } from '../../styles/typography'

// renders a simple touchable item within the main navigation drawer
function DrawerItem ({
  // passed from parent
  onPress,
  iconName,
  text,
  // passed from redux
  isRTL,
  font,
  activeGroup
}) {
  // RENDER

  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={45 * scaleMultiplier} color={colors.tuna} />
      </View>
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'left',
            colors.shark
          ),
          { paddingHorizontal: 10 }
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

// STYLES

const styles = StyleSheet.create({
  settingsItem: {
    height: 55 * scaleMultiplier,
    // aspectRatio: 5.5,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50 * scaleMultiplier
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(DrawerItem)
