import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
import { StandardTypography } from '../styles/typography'

function BookView (props) {
  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: colors.porcelain,
        borderWidth: 4,
        borderColor: colors.chateau,
        marginHorizontal: 10,
        marginTop: 10,
        flex: 1
      }}
    >
      <FlatList
        data={props.thisLesson.text.split('\n')}
        renderItem={paragraphList => (
          <Text
            style={[
              StandardTypography(props, 'h4', 'regular', 'left', colors.shark),
              { marginHorizontal: 10 }
            ]}
          >
            {paragraphList.item + '\n'}
          </Text>
        )}
        keyExtractor={item => item}
        ListHeaderComponent={
          <View style={{ marginVertical: 20 }}>{props.titleSection}</View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topPortion: {
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    resizeMode: 'contain',
    height: 170 * scaleMultiplier,
    alignSelf: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(BookView)
