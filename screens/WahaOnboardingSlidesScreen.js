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

/**
 * Screen that takes the user through a couple onboarding slides describing what Waha is and allows them to customize their first group.
 * @param {string} selectedLanguage - The language that the user selected just before going into the onboarding slides.
 */
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
  /** The ref for the pager view. Used to manually swipe pages. */
  const pagerRef = useRef()

  /** Ref for the group name text input. */
  const groupNameInputRef = useRef()

  /** Keeps track of onboarding page we're currently on. */
  const [activePage, setActivePage] = useState(0)

  /** Keeps track of the user's group name input and emoji selection. */
  const [groupNameInput, setGroupNameInput] = useState('')
  const [emojiInput, setEmojiInput] = useState('default')

  /** Edits a group and sets it as the active group. */
  const editGroupAndFinish = () => {
    // If the name of the new group is blank, just finish onboarding and leave the group as default.
    if (groupNameInput === '') {
      skipOnboarding()
      return
    }

    // Change the active group to the newly edited group.
    changeActiveGroup(groupNameInput)

    // Call editGroup() redux function.
    editGroup(groupNames[selectedLanguage], groupNameInput, emojiInput)

    // Finish up onboarding and go to the loading screen.
    setHasOnboarded(true)
    navigate('Loading', {
      selectedLanguage: selectedLanguage
    })
  }

  /** Skips onboarding and just goes straight to the loading screen. */
  const skipOnboarding = () => {
    setHasOnboarded(true)
    navigate('Loading', {
      selectedLanguage: selectedLanguage
    })
  }

  // The 4 onboarding pages. These are stored here in an array so that we can call pages.reverse() to reverse the order of the pages for RTL languages.
  const pages = [
    <OnboardingPage
      key='1'
      title={translations.onboarding.onboarding_1_title}
      message={translations.onboarding.onboarding_1_message}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageContainer}
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_1.gif?alt=media'
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
              'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_3.gif?alt=media'
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
          // Focus the group name text input when the user reaches the last page. Note: it's numPages - 1 because the indices for the pages start at 0.
          if (
            (!isRTL && event.nativeEvent.position === numPages - 1) ||
            (isRTL && event.nativeEvent.position === 0)
          )
            groupNameInputRef.current.focus()

          // Set the active page to the new page.
          setActivePage(event.nativeEvent.position)
        }}
      >
        {isRTL ? pages.reverse() : pages}
      </PagerView>
      <View
        style={[
          styles.bottomControlsContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
      >
        <PageDots numDots={numPages} activeDot={activePage} />
        <View
          style={[
            styles.skipButtonContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
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
            // This button goes to the next page or finishes onboarding if we're on the last page.
            isRTL
              ? activePage === 0
                ? editGroupAndFinish
                : () => pagerRef.current.setPage(activePage - 1)
              : activePage === 3
              ? editGroupAndFinish
              : () => pagerRef.current.setPage(activePage + 1)
          }
          type='filled'
          color={colors.apple}
          style={{
            // Make the continue button twice as big as the skip button.
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
    maxWidth: Dimensions.get('window').width - 40,
    maxHeight: Dimensions.get('window').width - 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.athens,
    aspectRatio: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  },
  bottomControlsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  skipButtonContainer: {
    height: 65 * scaleMultiplier,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WahaOnboardingSlidesScreen)
