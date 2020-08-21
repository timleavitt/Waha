import React, { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import SetItem from '../components/SetItem'
import { colors, scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'
function SetScreen (props) {
  //// STUFF FOR TESTING

  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
  //   console.log(contents)
  // })
  // console.log(scaleMultiplier)

  //// STATE

  // shows the add new set modal
  const [addNewSetLabel, setAddNewSetLabel] = useState('')
  const [setCategory, setSetCategory] = useState('')

  //// CONSTRUCTOR

  useEffect(() => {
    // console.log(props.route.name)
    if (props.route.name === 'Core') {
      setAddNewSetLabel(
        props.translations.sets.add_foundational_story_set_button_label
      )
      setSetCategory('core')
    } else if (props.route.name === 'Topical') {
      setAddNewSetLabel(props.translations.sets.add_topical_set_button_label)
      setSetCategory('topical')
    } else {
      setAddNewSetLabel(
        props.translations.sets.add_mobilization_tool_button_label
      )
      setSetCategory('mt')
    }
  }, [])

  //// NAV OPTIONS

  //// RENDER

  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        isSmall={false}
        mode='shown'
        onSetSelect={() =>
          props.navigation.navigate('LessonList', {
            thisSet: setList.item
          })
        }
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={
          // if we're adding core sets, display them in numerical order
          props.route.name === 'Core'
            ? props.activeDatabase.sets
                .filter(set => set.category === setCategory)
                .filter(set =>
                  props.activeGroup.addedSets.some(
                    addedSet => addedSet.id === set.id
                  )
                )
            : // if we're displaying topical/mt sets, display them in the order added
              props.activeDatabase.sets
                .filter(set => set.category === setCategory)
                .filter(set =>
                  props.activeGroup.addedSets.some(
                    addedSet => addedSet.id === set.id
                  )
                )
                .sort((a, b) => {
                  return a.index - b.index
                })
                .sort((a, b) => {
                  return (
                    props.activeGroup.addedSets.indexOf(
                      props.activeGroup.addedSets.filter(
                        addedSet => addedSet.id === a.id
                      )[0]
                    ) -
                    props.activeGroup.addedSets.indexOf(
                      props.activeGroup.addedSets.filter(
                        addedSet => addedSet.id === b.id
                      )[0]
                    )
                  )
                })
        }
        renderItem={renderStudySetItem}
        extraData={props.activeGroup}
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.addNewSetContainer,
              { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
            ]}
            onPress={() =>
              props.navigation.navigate('AddSetStack', {
                screen: 'AddSet',
                params: {
                  category: setCategory
                }
              })
            }
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80 * scaleMultiplier,
                height: 80 * scaleMultiplier
              }}
            >
              <Icon
                name='plus'
                size={60 * scaleMultiplier}
                color={colors.chateau}
                style={styles.addNewSetIcon}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'column',
                marginRight: props.isRTL ? 20 : 0,
                marginLeft: props.isRTL ? 0 : 20
              }}
            >
              <Text
                style={{
                  fontFamily: props.font + '-regular',
                  fontSize: 14 * scaleMultiplier,
                  color: colors.chateau,
                  textAlign: props.isRTL ? 'right' : 'left'
                }}
              >
                {addNewSetLabel}
              </Text>
            </View>
          </TouchableOpacity>
        }
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.porcelain
  },
  headerImage: {
    resizeMode: 'contain',
    width: 120,
    height: 40,
    alignSelf: 'center'
  },
  addNewSetContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 20
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup
  }
}
function mapDispatchToProps (dispatch) {
  return {
    resumeDownload: (lessonID, downloadSnapshotJSON) => {
      dispatch(resumeDownload(lessonID, downloadSnapshotJSON))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetScreen)
