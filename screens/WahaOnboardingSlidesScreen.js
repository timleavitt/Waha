import React, { useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import { connect } from 'react-redux'
import EmojiViewer from '../components/EmojiViewer'
import GroupNameTextInput from '../components/GroupNameTextInput'
import OnboardingPage from '../components/OnboardingPage'
import PageDots from '../components/PageDots'
import WahaButton from '../components/WahaButton'
import { groupNames, scaleMultiplier } from '../constants'
import { changeActiveGroup } from '../redux/actions/activeGroupActions'
import { setHasOnboarded } from '../redux/actions/databaseActions'
import { editGroup } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setHasOnboarded: toSet => dispatch(setHasOnboarded(toSet)),
    editGroup: (oldGroupName, newGroupName, emoji) =>
      dispatch(editGroup(oldGroupName, newGroupName, emoji)),
    changeActiveGroup: groupName => dispatch(changeActiveGroup(groupName))
  }
}

const numPages = 4

const WahaOnboardingSlidesScreen = ({
  // Props passed from navigation.
  navigation: { navigate },
  route: {
    // Props passed from previous screen.
    params: { selectedLanguage }
  },
  // Props passed from redux.
  translations,
  isRTL,
  font,
  setHasOnboarded,
  editGroup,
  changeActiveGroup
}) => {
  const pagerRef = useRef()
  const groupNameInputRef = useRef()

  const [activePage, setActivePage] = useState(0)

  const [emojiInput, setEmojiInput] = useState('default')
  /** Keeps track of the user input for the group name <TextInput />. */
  const [groupNameInput, setGroupNameInput] = useState('')

  /** Edits a group and sets it as the active group. */
  const finishOnboarding = () => {
    // If the name of the new group is a duplicate or blank, don't continue.
    if (groupNameInput === '') {
      skipOnboarding()
      return
    }

    // Change the active group to the newly edited group.
    changeActiveGroup(groupNameInput)

    // Call editGroup() redux function.
    editGroup(groupNames[selectedLanguage], groupNameInput, emojiInput)
    setHasOnboarded(true)
    navigate('Loading', {
      selectedLanguage: selectedLanguage
    })
  }

  const skipOnboarding = () => {
    setHasOnboarded(true)
    navigate('Loading', {
      selectedLanguage: selectedLanguage
    })
  }

  const pages = [
    <OnboardingPage
      key='1'
      title={translations.onboarding.onboarding_1_title}
      message={translations.onboarding.onboarding_1_message}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_2.gif?alt=media'
          }}
        />
      </View>
    </OnboardingPage>,
    <OnboardingPage
      key='2'
      title={translations.onboarding.onboarding_2_title}
      message={translations.onboarding.onboarding_2_message}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_2.gif?alt=media'
          }}
        />
      </View>
    </OnboardingPage>,
    <OnboardingPage
      key='3'
      title={translations.onboarding.onboarding_3_title}
      message={translations.onboarding.onboarding_3_message}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_2.gif?alt=media'
          }}
        />
      </View>
    </OnboardingPage>,
    <OnboardingPage
      key='4'
      title={translations.onboarding.onboarding_4_title}
      message={translations.onboarding.onboarding_4_message}
    >
      <GroupNameTextInput
        groupNameInput={groupNameInput}
        setGroupNameInput={setGroupNameInput}
        groupNameInputRef={groupNameInputRef}
      />
      <EmojiViewer emojiInput={emojiInput} setEmojiInput={setEmojiInput} />
    </OnboardingPage>
  ]

  return (
    <SafeAreaView style={styles.screen}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={isRTL ? numPages - 1 : 0}
        onPageSelected={event => {
          if (
            (!isRTL && event.nativeEvent.position === numPages - 1) ||
            (isRTL && event.nativeEvent.position === 0)
          )
            groupNameInputRef.current.focus()
          setActivePage(event.nativeEvent.position)
        }}
      >
        {isRTL ? pages.reverse() : pages}
      </PagerView>
      <View
        style={{
          alignItems: 'center',
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20
        }}
      >
        <PageDots numDots={numPages} activeDot={activePage} />
        <View
          style={{
            height: 65 * scaleMultiplier,
            flex: 1,
            alignItems: 'center',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'flex-end'
          }}
        >
          <TouchableOpacity
            onPress={skipOnboarding}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'h4',
                'Bold',
                'center',
                colors.shark
              )}
            >
              {translations.general.skip}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 20 }} />
        <WahaButton
          label={translations.general.continue}
          onPress={
            isRTL
              ? activePage === 0
                ? finishOnboarding
                : () => pagerRef.current.setPage(activePage - 1)
              : activePage === 3
              ? finishOnboarding
              : () => pagerRef.current.setPage(activePage + 1)
          }
          type='filled'
          color={colors.apple}
          style={{
            flex: 2
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    justifyContent: 'center'
  },
  pager: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1,
    // width: '100%',
    maxWidth: Dimensions.get('window').width - 60,
    maxHeight: Dimensions.get('window').width - 60,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.athens,
    aspectRatio: 1,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WahaOnboardingSlidesScreen)
