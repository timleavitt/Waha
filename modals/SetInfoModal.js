import React from 'react'
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import SetItem from '../components/list-items/SetItem'
import WahaButton from '../components/standard/WahaButton'
import { scaleMultiplier } from '../constants'
import { addSet } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import ModalScreen from './ModalScreen'

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

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    }
  }
}

/**
 * A modal that displays the various lessons in a set and their scripture references. Uses <ModalScreen /> under the hood.
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Function} hideModal - Function to hide the modal.
 * @param {Object} thisSet - The object for the set we're displaying the information about.
 * @param {boolean} showSnackbar - Whether to show the "Set Added!" Snackbar component or not.
 */
const SetInfoModal = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
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
}) => {
  /** Renders a item with the information for a lesson. */
  const renderLessonInfoItem = ({ item }) => {
    // If lesson has scripture, format the list of scripture to be a string with the scripture addresses separated by commas.
    if (item.scripture) {
      var scriptureList = item.scripture[0].header

      item.scripture.forEach((passage, index) => {
        if (index !== 0) scriptureList += ', ' + passage.header
      })
    }

    return (
      // These use <TouchableOpacity /> instead of <View /> because scrolling a FlatList within a modal only works when the items are touchable. Wack.
      <TouchableOpacity
        style={{
          marginVertical: 10 * scaleMultiplier,
          justifyContent: 'center',
          paddingHorizontal: 40,
          width: Dimensions.get('window').width
        }}
        // This disables the touchable feedback so it appears like a <View />.
        activeOpacity={1}
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

        {/* Display list of scripture below the title if this lesson has scripture (not all of them do). */}
        {item.scripture && (
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
        )}
      </TouchableOpacity>
    )
  }

  const keyExtractor = item => item.id

  return (
    <ModalScreen
      title={translations.add_set.header_set_details}
      hideModal={hideModal}
      isVisible={isVisible}
    >
      <View style={styles.setItemContainer}>
        <SetItem thisSet={thisSet} screen='SetInfo' />
      </View>
      <WahaButton
        type='filled'
        color={colors.apple}
        onPress={() => {
          addSet(activeGroup.name, activeGroup.id, thisSet)
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
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={keyExtractor}
          data={thisSet.lessons}
          renderItem={renderLessonInfoItem}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
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
  setItemContainer: {
    width: '100%',
    height: 100 * scaleMultiplier
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SetInfoModal)
