import React, { useEffect } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import SetItem from '../components/SetItem'
import WahaButton from '../components/WahaButton'
import { colors, scaleMultiplier } from '../constants'
import { addSet } from '../redux/actions/groupsActions'

function SetInfoScreen (props) {
  //// STATE

  //// NAV OPTIONS

  function getNavOptions () {
    return {
      title:
        props.route.params.category === 'core'
          ? props.translations.add_set.header_foundational
          : props.translations.add_set.header_topical,
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  // whenever progress or bookmarks update, update the progress and bookmarks for this set
  useEffect(() => {}, [])

  //// FUNCTIONS

  return (
    <View style={styles.screen}>
      <View style={styles.studySetItemContainer}>
        <SetItem thisSet={props.route.params.thisSet} mode='setinfo' />
      </View>
      <WahaButton
        type='filled'
        color={colors.apple}
        onPress={() => {
          props.addSet(props.activeGroup.name, props.route.params.thisSet.id)
          props.route.params.showSnackbar()
          props.navigation.goBack()
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
        data={props.activeDatabase.lessons.filter(
          lesson => props.route.params.thisSet.id === lesson.setid
        )}
        renderItem={({ item }) => {
          if (item.scripture) {
            var scriptureList = item.scripture[0].header
            item.scripture.forEach((chunk, index) => {
              if (index !== 0) scriptureList += ', ' + chunk.header
            })

            return (
              <View
                style={{
                  height: 64 * scaleMultiplier,
                  justifyContent: 'center',
                  paddingHorizontal: 40
                }}
              >
                <Text
                  style={{
                    color: colors.shark,
                    textAlign: props.isRTL ? 'right' : 'left',
                    fontSize: 16 * scaleMultiplier,
                    fontFamily: props.font + '-medium'
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: colors.chateau,
                    textAlign: props.isRTL ? 'right' : 'left',
                    fontSize: 14 * scaleMultiplier,
                    fontFamily: props.font + '-regular'
                  }}
                >
                  {scriptureList}
                </Text>
              </View>
            )
          } else
            return (
              <View
                style={{
                  height: 64 * scaleMultiplier,
                  justifyContent: 'center',
                  paddingHorizontal: 40
                }}
              >
                <Text
                  style={{
                    color: colors.shark,
                    textAlign: props.isRTL ? 'right' : 'left',
                    fontSize: 16 * scaleMultiplier,
                    fontFamily: props.font + '-medium'
                  }}
                >
                  {item.title}
                </Text>
              </View>
            )
        }}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 10
  },
  studySetItemContainer: {
    width: '100%',
    // height: 80 * scaleMultiplier,
    aspectRatio: 4
  }
})

//// REDUX

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
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetInfoScreen)
