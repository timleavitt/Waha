import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import WahaButton from '../components/standard/WahaButton'
import { scaleMultiplier } from '../constants'
import db from '../firebase/db'
import { appVersion } from '../modeSwitch'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations,
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

const ContactUsScreen = ({
  navigation: { setOptions, goBack },
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  translations,
  primaryColor
}) => {
  /** The text for the email input component. */
  const [emailTextInput, setEmailTextInput] = useState(null)

  /** The text for the message input component. */
  const [messageTextInput, setMessageTextInput] = useState('')

  /** The text for the reproduction steps input component. */
  const [reproductionStepsTextInput, setReproductionStepsTextInput] = useState(
    ''
  )

  /** The value of the checkbox that keeps track of whether or not the message describes a bug. */
  const [isBugChecked, setIsBugChecked] = useState(false)

  /** Keeps track of whether the message is actively being submitted to Firestore or not. */
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Keeps track of whether the email address is valid or not. */
  const [emailError, setEmailError] = useState(null)

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => {},
      headerLeft: isRTL
        ? () => {}
        : () => <BackButton onPress={() => goBack()} />
    })
  }, [])

  /** useEffect function that checks the validity of an email address any time the email input changes. */
  useEffect(() => {
    if (emailTextInput !== null) {
      checkEmail()
    }
  }, [emailTextInput])

  /** Checks whether an email address is valid using a regular expression. If it's valid, set the email error state to false. Otherwise, set it to true.*/
  function checkEmail () {
    if (emailTextInput.match(/^.+@.+\..+$/)) setEmailError(false)
    else setEmailError(true)
  }

  /** Sends the form information to Firestore and pops up an appropriate alert. */
  function submit () {
    setIsSubmitting(true)
    db.collection('feedback')
      .add({
        language: activeGroup.language,
        contactEmail: activeDatabase.contactEmail,
        email: emailTextInput,
        message: messageTextInput,
        isABug: isBugChecked,
        reproductionSteps: reproductionStepsTextInput,
        appVersion: appVersion,
        OS: Platform.OS,
        timeSubmitted: new Date().toString()
      })
      .then(() => {
        setIsSubmitting(false)
        Alert.alert(
          translations.contact_us &&
            translations.contact_us.popups.submitted_successfully_title,
          translations.contact_us &&
            translations.contact_us.popups.submitted_successfully_message,
          [
            {
              text: translations.general.ok,
              onPress: () => {
                goBack()
              }
            }
          ]
        )
      })
      .catch(() => {
        setIsSubmitting(false)
        Alert.alert(
          translations.contact_us &&
            translations.contact_us.popups.submit_error_title,
          translations.contact_us &&
            translations.contact_us.popups.submit_error_message,
          [
            {
              text: translations.general.ok,
              onPress: () => {}
            }
          ]
        )
      })
  }

  // Determine what to render for the asterisk components based on isRTL. They need to be conditional because in LTR, the asterisk goes on the right of the word whereas in RTL, it goes on the left. The asterisk indicates a required field.
  var asteriskComponent = isRTL ? (
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h3', 'Bold', 'left', colors.red)
      ]}
    >
      {'* '}
    </Text>
  ) : (
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h3', 'Bold', 'left', colors.red)
      ]}
    >
      {' *'}
    </Text>
  )
  var leftAsterisk = isRTL ? asteriskComponent : null
  var rightAsterisk = isRTL ? null : asteriskComponent

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView bounces={false} style={styles.scrollViewContainer}>
        <View style={{ width: '100%', height: 20 * scaleMultiplier }} />
        {/* Email input area. */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'h3',
                'Bold',
                'left',
                colors.shark
              ),
              { marginVertical: 10 }
            ]}
          >
            {leftAsterisk}
            {translations.contact_us && translations.contact_us.email_label}
            {rightAsterisk}
          </Text>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TextInput
              onChangeText={text => setEmailTextInput(text)}
              autoCapitalize='none'
              autoCorrect={false}
              spellCheck={false}
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Regular',
                  'left',
                  colors.shark
                ),
                styles.textInputContainer,
                { paddingTop: 0, paddingBottom: 0 }
              ]}
              keyboardType='email-address'
              placeholder='name@email.com'
              placeholderTextColor={colors.chateau}
            />
            {emailError !== null ? (
              <View style={styles.emailStatusIconContainer}>
                <Icon
                  name={emailError ? 'cancel' : 'check'}
                  color={emailError ? colors.red : colors.apple}
                  size={
                    emailError ? 45 * scaleMultiplier : 40 * scaleMultiplier
                  }
                />
              </View>
            ) : null}
          </View>
        </View>
        {/* Message input area. */}
        <View style={styles.sectionContainer}>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'left',
                  colors.shark
                ),
                { marginVertical: 10 * scaleMultiplier }
              ]}
            >
              {leftAsterisk}
              {translations.contact_us && translations.contact_us.message_label}
              {rightAsterisk}
            </Text>
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h4',
                  'regular',
                  'left',
                  messageTextInput.length > 1000 ? colors.red : colors.chateau
                )
              ]}
            >
              {messageTextInput.length + '/1000'}
            </Text>
          </View>
          <TextInput
            onChangeText={text => setMessageTextInput(text)}
            style={[
              StandardTypography(
                { font, isRTL },
                'h3',
                'Regular',
                'left',
                colors.shark
              ),
              styles.textInputContainer,
              { height: 200 * scaleMultiplier, textAlignVertical: 'top' }
            ]}
            multiline
            placeholder={
              translations.contact_us &&
              translations.contact_us.message_placeholder
            }
            placeholderTextColor={colors.chateau}
          />
        </View>
        {/* Bug checkmark input area. */}
        <View
          style={[
            styles.bugSectionContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <TouchableOpacity
            onPress={() => setIsBugChecked(old => !old)}
            style={styles.checkIconContainer}
          >
            {isBugChecked ? (
              <Icon name='check' size={25} color={colors.tuna} />
            ) : null}
          </TouchableOpacity>
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'h3',
                'Regular',
                'left',
                colors.shark
              ),
              { marginHorizontal: 10 }
            ]}
          >
            {translations.contact_us &&
              translations.contact_us.bug_checkmark_label}
          </Text>
        </View>
        {/* Reproduction steps input area. */}
        {isBugChecked ? (
          <View style={styles.sectionContainer}>
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'left',
                  colors.shark
                ),
                { marginVertical: 10 * scaleMultiplier }
              ]}
            >
              {translations.contact_us &&
                translations.contact_us.reproduce_label}
            </Text>
            <TextInput
              onChangeText={text => setReproductionStepsTextInput(text)}
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Regular',
                  'left',
                  colors.shark
                ),
                styles.textInputContainer,
                { height: 200 * scaleMultiplier, textAlignVertical: 'top' }
              ]}
              multiline
            />
          </View>
        ) : null}
        {/* Submit button. */}
        <WahaButton
          type={
            // Potential error states are if the email is invalid, the email is blank, or the message length is over 1000 characters.
            emailError ||
            emailTextInput === null ||
            messageTextInput.length > 1000
              ? 'inactive'
              : 'filled'
          }
          color={
            emailError ||
            emailTextInput === null ||
            messageTextInput.length > 1000
              ? colors.geyser
              : colors.apple
          }
          useDefaultFont={false}
          label={
            isSubmitting
              ? ''
              : translations.contact_us &&
                translations.contact_us.submit_button_label
          }
          width={Dimensions.get('window').width / 3}
          onPress={submit}
          style={{
            height: 68 * scaleMultiplier,
            alignSelf: isRTL ? 'flex-start' : 'flex-end',
            marginTop: 10 * scaleMultiplier,
            marginBottom: 20 * scaleMultiplier
          }}
          extraComponent={
            // If we're in the middle of submitting, change the submit button to show an activity indicator.
            isSubmitting ? (
              <View>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.aquaHaze
  },
  scrollViewContainer: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20
  },
  sectionContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20 * scaleMultiplier
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 10,
    height: 60 * scaleMultiplier,
    backgroundColor: colors.porcelain,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  emailStatusIconContainer: {
    width: 50 * scaleMultiplier,
    height: 50 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bugSectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20 * scaleMultiplier,
    marginTop: 10 * scaleMultiplier
  },
  checkIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.porcelain,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(ContactUsScreen)
