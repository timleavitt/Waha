import React from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import SetItem from '../components/list-items/SetItem'
import WahaButton from '../components/standard/WahaButton'
import { scaleMultiplier } from '../constants'
import { addSet } from '../redux/actions/groupsActions'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import ModalScreen from './ModalScreen'

function SetInfoModal ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  category,
  thisSet,
  showSnackbar,
  // Props passed from redux.
  downloads,
  activeDatabase,
  isRTL,
  activeGroup,
  translations,
  font,
  addSet
}) {
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
              { font, isRTL },
              'h4',
              'Bold',
              'left',
              colors.shark
            )}
          >
            {item.title}
          </Text>
          <Text
            style={StandardTypography(
              { font, isRTL },
              'p',
              'Regular',
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
              { font, isRTL },
              'h4',
              'Bold',
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
      title={translations.add_set.header_set_details}
      hideModal={hideModal}
      isVisible={isVisible}
    >
      <View style={styles.studySetItemContainer}>
        <SetItem thisSet={thisSet} mode='setinfo_modal' />
      </View>
      <WahaButton
        type='filled'
        color={colors.apple}
        onPress={() => {
          addSet(props.activeGroup.name, props.activeGroup.id, props.thisSet)
          showSnackbar()
          hideModal()
        }}
        style={{ marginHorizontal: 20, marginVertical: 10 }}
        label={translations.add_set.add_new_story_set_button_label}
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
        data={thisSet.lessons}
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
    font: getLanguageFont(activeGroup.language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetInfoModal)
