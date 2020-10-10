import React, { useEffect } from 'react'
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import SetItem from '../components/SetItem'
import WahaButton from '../components/WahaButton'
import { colors, getLessonInfo, scaleMultiplier } from '../constants'
import { addSet } from '../redux/actions/groupsActions'

function SetInfoScreen (props) {
  //+ STATE

  //+ NAV OPTIONS

  function getNavOptions () {
    return {
      title:
        props.category === 'core'
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

  //+ CONSTRUCTOR

  useEffect(() => {
    // props.navigation.setOptions(getNavOptions())
  }, [])

  //+ FUNCTIONS

  function renderLessonInfoItem (item) {
    if (item.scripture) {
      var scriptureList = item.scripture[0].header
      item.scripture.forEach((chunk, index) => {
        if (index !== 0) scriptureList += ', ' + chunk.header
      })

      return (
        <TouchableOpacity
          style={{
            marginVertical: 10 * scaleMultiplier,
            justifyContent: 'center',
            paddingHorizontal: 40
          }}
        >
          <Text style={Typography(props, 'h4', 'medium', 'left', colors.shark)}>
            {item.title}
          </Text>
          <Text
            style={Typography(props, 'p', 'regular', 'left', colors.chateau)}
          >
            {scriptureList}
          </Text>
        </TouchableOpacity>
      )
    } else
      return (
        <TouchableOpacity
          style={{
            marginVertical: 10 * scaleMultiplier,
            justifyContent: 'center',
            paddingHorizontal: 40
          }}
        >
          <Text style={Typography(props, 'h4', 'medium', 'left', colors.shark)}>
            {item.title}
          </Text>
        </TouchableOpacity>
      )
  }

  return (
    <SafeAreaView>
      <Modal
        isVisible={props.isVisible}
        hasBackdrop={true}
        onBackdropPress={props.hideModal}
        backdropOpacity={0.3}
        onSwipeComplete={props.hideModal}
        swipeDirection={['down']}
        propagateSwipe={true}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          margin: 0,
          marginTop: 30
          // marginVertical: 20 * scaleMultiplier
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          }}
        >
          <View
            style={{
              width: '100%',
              // height: 50 * scaleMultiplier,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.hideModal()
              }}
              style={{
                width: 45 * scaleMultiplier,
                height: 45 * scaleMultiplier
              }}
            >
              <Icon
                name='cancel'
                size={45 * scaleMultiplier}
                color={colors.oslo}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={Typography(
                  props,
                  'h3',
                  'medium',
                  'center',
                  colors.shark
                )}
              >
                {props.type === 'AddGroup'
                  ? props.translations.add_edit_group.header_add
                  : props.translations.add_edit_group.header_edit}
              </Text>
            </View>
            <View
              style={{
                width: 45 * scaleMultiplier,
                height: 45 * scaleMultiplier
              }}
            />
          </View>
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
          {/* <ScrollView> */}
          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center'
            }}
            onStartShouldSetResponder={(): boolean => true}
          >
            <FlatList
              nestedScrollEnabled
              keyExtractor={item => item.id}
              data={props.activeDatabase.lessons.filter(
                lesson => props.thisSet.id === getLessonInfo('setID', lesson.id)
              )}
              renderItem={({ item }) => renderLessonInfoItem(item)}
            />
          </View>
          {/* <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center'
          }}
        >
          <FlatList
            data={groupIcons}
            bounces={false}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <View
                style={{
                  width: 50 * scaleMultiplier,
                  height: 50 * scaleMultiplier,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 2,
                  // borderWidth: 0,
                  // borderColor: item === emoji ? colors.blue : null,
                  borderRadius: 10
                  // backgroundColor: item === emoji ? colors.blue + '38' : null
                }}
                // onPress={() => setEmoji(item)}
              >
                <Image
                  style={{
                    width: 40 * scaleMultiplier,
                    height: 40 * scaleMultiplier
                  }}
                  source={groupIconSources[item]}
                />
              </View>
            )}
            keyExtractor={item => item}
            numColumns={Math.floor(
              (Dimensions.get('window').width - 50) / (50 * scaleMultiplier)
            )}
          />
        </View> */}
          {/* </ScrollView> */}
        </View>
      </Modal>
    </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(SetInfoScreen)
