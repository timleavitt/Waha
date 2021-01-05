import React from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import SetItem from '../components/list-items/SetItem'
import WahaButton from '../components/standard/WahaButton'
import { colors, scaleMultiplier } from '../constants'
import { addSet } from '../redux/actions/groupsActions'
import { StandardTypography } from '../styles/typography'
import ModalScreen from './ModalScreen'

function SetInfoModal (props) {
  //+ FUNCTIONS

  function renderLessonInfoItem (item) {
    if (item.scripture) {
      var scriptureList = item.scripture[0].header
      item.scripture.forEach((chunk, index) => {
        if (index !== 0) scriptureList += ', ' + chunk.header
      })

      return (
        <View
          style={{
            marginVertical: 10 * scaleMultiplier,
            justifyContent: 'center',
            paddingHorizontal: 40,
            width: Dimensions.get('window').width
          }}
        >
          <Text
            style={StandardTypography(
              props,
              'h4',
              'medium',
              'left',
              colors.shark
            )}
          >
            {item.title}
          </Text>
          <Text
            style={StandardTypography(
              props,
              'p',
              'regular',
              'left',
              colors.chateau
            )}
          >
            {scriptureList}
          </Text>
        </View>
      )
    } else
      return (
        <View
          style={{
            marginVertical: 10 * scaleMultiplier,
            justifyContent: 'center',
            paddingHorizontal: 40,
            width: Dimensions.get('window').width
          }}
        >
          <Text
            style={StandardTypography(
              props,
              'h4',
              'medium',
              'left',
              colors.shark
            )}
          >
            {item.title}
          </Text>
        </View>
      )
  }

  return (
    <ModalScreen
      title={props.translations.add_set.header_set_details}
      hideModal={props.hideModal}
      isVisible={props.isVisible}
    >
      <View style={styles.studySetItemContainer}>
        <SetItem thisSet={props.thisSet} mode='setinfo' />
      </View>
      <WahaButton
        type='filled'
        color={colors.apple}
        onPress={() => {
          props.addSet(props.activeGroup.name, props.thisSet)
          props.showSnackbar()
          props.hideModal()
        }}
        style={{ marginHorizontal: 20, marginVertical: 10 }}
        label={props.translations.add_set.add_new_story_set_button_label}
        extraComponent={
          <Icon
            style={{ marginHorizontal: 10 }}
            color={colors.white}
            size={36 * scaleMultiplier}
            name='playlist-add'
          />
        }
      />
      <FlatList
        keyExtractor={item => item.id}
        data={props.thisSet.lessons}
        renderItem={({ item }) => renderLessonInfoItem(item)}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </ModalScreen>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 10
  },
  studySetItemContainer: {
    width: '100%',
    height: 100 * scaleMultiplier
  }
})

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
    font: state.database[activeGroup.language].font
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, set) => {
      dispatch(addSet(groupName, set))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetInfoModal)
