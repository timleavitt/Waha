import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
import {
  addLanguage,
  changeLanguage,
  setFinishedOnboarding
} from '../redux/actions/databaseActions'
import { changeActiveGroup } from '../redux/actions/groupsActions'
import ar from '../translations/ar.json'
// translations import
import en from '../translations/en.json'
import fr from '../translations/fr.json'
function OnboardingSlidesScreen (props) {
  //// STATE

  // translations for language select
  i18n.translations = {
    en,
    fr,
    ar
  }

  //// CONSTRUCTOR

  useEffect(() => {
    var language = props.route.params.selectedLanguage
    props.addLanguage(language)
  }, [])

  // //// FUNCTIONS

  // tells redux that we're ready to go to loading screen once onboarding is finished
  function finishOnboarding () {
    props.setFinishedOnboarding(true)
    props.navigation.navigate('Loading')
  }

  //// RENDER

  const onboardingData = [
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding1.png')}
        />
      ),
      title: i18n.t('title0'),
      subtitle: i18n.t('body0')
    },
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding2.png')}
        />
      ),
      title: i18n.t('title1'),
      subtitle: i18n.t('body1')
    },
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding3.png')}
        />
      ),
      title: i18n.t('title2'),
      subtitle: i18n.t('body2')
    },
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding4.png')}
        />
      ),
      title: i18n.t('title3'),
      subtitle: i18n.t('body3')
    }
  ]

  return (
    <View style={styles.screen}>
      <Onboarding
        pages={onboardingData}
        showSkip={false}
        onDone={finishOnboarding}
        nextLabel={i18n.t('next')}
        containerStyles={{ marginTop: 0 }}
        imageContainerStyles={{
          paddingBottom: Dimensions.get('window').width < 700 ? 0 : 60
        }}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  image: {
    resizeMode: 'center',
    width:
      Dimensions.get('window').width < 700
        ? 241 * scaleMultiplier
        : 321 * scaleMultiplier,
    height:
      Dimensions.get('window').width < 700
        ? 204 * scaleMultiplier
        : 272 * scaleMultiplier
  }
})

////REDUX

function mapStateToProps (state) {
  return {
    isFetching: state.database.isFetching
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
    setFinishedOnboarding: toSet => dispatch(setFinishedOnboarding(toSet)),
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingSlidesScreen)

// function renderOnboardingSlide (slideList) {
//   return (
//     <View style={styles.pageContainer}>
//       <View style={styles.titleContainer}>
//         <Text style={styles.title}>{slideList.item.title}</Text>
//       </View>
//       <View style={styles.bodyContainer}>
//         <Text style={styles.body}>{slideList.item.body}</Text>
//       </View>
//       <View style={styles.imageContainer}>
//         <Image source={slideList.item.imageSource} style={styles.image} />
//       </View>
//     </View>
//   )
// }

/* <View style={styles.onboardingSequence}>
        <FlatList
          renderItem={renderOnboardingSlide}
          data={onboardingData}
          ref={ref => {
            setFlatListRef(ref)
          }}
          horizontal={true}
          pagingEnabled={true}
          snapToAlignment={'start'}
          snapToInterval={Dimensions.get('window').width - 64}
          decelerationRate={'fast'}
          getItemLayout={(data, index) => ({
            length: Dimensions.get('window').width - 64,
            offset: Dimensions.get('window').width - 64 * index,
            index
          })}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.buttonsContainer}>
          <View>
            {pageNumber > 0 ? (
              <TouchableOpacity onPress={() => incrementPageNumber('prev')}>
                <Text>{i18n.t('prev')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View>
            <TouchableOpacity
              onPress={
                pageNumber !== 3
                  ? () => incrementPageNumber('next')
                  : finishOnboarding
              }
            >
              <Text>
                {pageNumber !== 3 ? i18n.t('next') : i18n.t('finish')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View> */

// // updates scroll when page number updates
// useEffect(() => {
//   if (flatListRef) {
//     flatListRef.scrollToIndex({ index: pageNumber })
//   }
// }, [pageNumber])

// // decrements / increments page number
// function incrementPageNumber (direction) {
//   if (direction === 'next') {
//     setPageNumber(oldPageNumber => (oldPageNumber += 1))
//   } else {
//     setPageNumber(oldPageNumber => (oldPageNumber -= 1))
//   }
// }

// // stuff for flatlist
// const onViewRef = useRef(info => {
//   console.log(info)
//   // if (viewableItems) {
//   //   setPageNumber(viewableItems[0].index)
//   // }
// })
// const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 })

// // keeps track of current onboarding page number
// const [pageNumber, setPageNumber] = useState(0)

// // reference to change flatlist
// const [flatListRef, setFlatListRef] = useState()
