import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
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
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const BookView = ({
  // Props passed from a parent component.
  thisLesson,
  titleSection,
  // Props passed from redux.
  font,
  activeGroup,
  isRTL
}) => {
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
        data={thisLesson.text.split('\n')}
        renderItem={paragraphList => (
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'h4',
                'Regular',
                'left',
                colors.shark
              ),
              { marginHorizontal: 10 }
            ]}
          >
            {paragraphList.item + '\n'}
          </Text>
        )}
        keyExtractor={item => item}
        ListHeaderComponent={
          <View style={{ marginVertical: 20 }}>{titleSection}</View>
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

export default connect(mapStateToProps)(BookView)
