import { scaleMultiplier } from '../constants'

export default Typography = (props, fontSize, fontFamily, textAlign, color) => {
  const sizes = {
    d: 12 * scaleMultiplier,
    p: 14 * scaleMultiplier,
    h4: 16 * scaleMultiplier,
    h3: 18 * scaleMultiplier,
    h2: 24 * scaleMultiplier,
    h1: 36 * scaleMultiplier
  }

  const families = {
    regular: props.font + '-regular',
    medium: props.font + '-medium',
    black: props.font + '-black'
  }

  const alignments = {
    left: props.isRTL ? 'right' : 'left',
    center: 'center'
  }
  return {
    fontSize: sizes[fontSize],
    fontFamily: props.font ? families[fontFamily] : null,
    textAlign: alignments[textAlign],
    color: color
  }
}

// export default Typography = props => {
//   const sizes = {
//     detail: 12 * scaleMultiplier,
//     body: 14 * scaleMultiplier,
//     heading4: 16 * scaleMultiplier,
//     heading3: 18 * scaleMultiplier,
//     heading2: 24 * scaleMultiplier,
//     heading1: 36 * scaleMultiplier
//   }

//   const families = {
//     regular: props.font + '-regular',
//     medium: props.font + '-medium',
//     black: props.font + '-black'
//   }

//   const alignments = {
//     left: props.isRTL ? 'right' : 'left',
//     center: 'center'
//   }

//   return StyleSheet.create({
//     setTitle: {
//       color: fullyCompleted ? colors.chateau : colors.shark,
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontSize: 18 * scaleMultiplier,
//       textAlignVertical: 'center',
//       flexWrap: 'wrap',
//       fontFamily: props.font + '-black'
//     },
//     setSubtitle: {
//       color: fullyCompleted ? colors.chateau : colors.shark,
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontSize: 12 * scaleMultiplier,
//       textAlignVertical: 'center',
//       flexWrap: 'wrap',
//       fontFamily: props.font + '-regular'
//     },
//     lessonTitle: {
//       fontSize: sizes.heading4,
//       fontFamily: families.medium,
//       textAlign: alignments.left,
//       // if a lesson is complete, render the title as gray
//       color: props.isComplete ? colors.chateau : colors.shark
//     },
//     lessonSubtitle: {
//       fontSize: sizes.detail,
//       fontFamily: families.regular,
//       textAlign: alignments.left,
//       color: colors.chateau
//     },
//     blurb: {
//       fontSize: sizes.body,
//       fontFamily: families.regular,
//       textAlign: alignments.center,
//       color: colors.shark
//     },
//     chapterSelectText: {
//       fontSize: sizes.body
//     },
//     drawerItem: {
//       color: colors.tuna,
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-medium',
//       fontSize: 18 * scaleMultiplier,
//       textAlignVertical: 'center',
//       paddingHorizontal: 10
//     },
//     groupName: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-black',
//       color: colors.shark,
//       fontSize: 18 * scaleMultiplier
//     },
//     groupBookmark: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-regular',
//       fontSize: 12 * scaleMultiplier,
//       color: colors.chateau
//     },
//     groupHeader: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-regular',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.chateau,
//       flex: 1
//     },
//     groupHeaderMT: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-medium',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.chateau
//     },
//     keyLabel: {
//       fontFamily: props.font + '-medium',
//       fontSize: 22 * scaleMultiplier,
//       color: colors.shark
//     },
//     languageNameNative: {
//       color: colors.shark,
//       fontSize: 18 * scaleMultiplier,
//       fontWeight: 'bold',
//       textAlign: 'left'
//     },
//     languageNameLocal: {
//       color: colors.shark,
//       fontSize: 14 * scaleMultiplier
//     },
//     storageHeader: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-regular',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.chateau
//     },
//     mbLabel: {
//       fontFamily: props.font + '-medium',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.tuna
//     },
//     storageUsedLabel: {
//       fontFamily: props.font + '-regular',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.tuna,
//       flex: 1,
//       paddingHorizontal: 20,
//       textAlign: props.isRTL ? 'right' : 'left'
//     },
//     messageModalCancelButton: {
//       fontFamily: props.font + '-medium',
//       fontSize: 24 * scaleMultiplier,
//       color: colors.red
//     },
//     messageModalConfirmButton: {
//       fontFamily: props.font + '-medium',
//       fontSize: 24 * scaleMultiplier,
//       color: colors.apple,
//       textAlign: 'center'
//     },
//     messageModalTitle: {
//       color: colors.shark,
//       fontFamily: props.font + '-black',
//       fontSize: 36 * scaleMultiplier,
//       marginVertical: 10,
//       textAlign: 'center'
//     },
//     messageModalBody: {
//       color: colors.shark,
//       fontFamily: props.font + '-medium',
//       fontSize: 18 * scaleMultiplier,
//       textAlign: 'center',
//       paddingHorizontal: 20
//     },
//     modalButton: {
//       color: colors.shark,
//       textAlign: 'center',
//       fontSize: 19.5 * scaleMultiplier,
//       fontFamily: props.font + '-regular'
//     },
//     onboardingTitle: {
//       fontFamily: props.font ? props.font + '-medium' : null,
//       fontWeight: props.font ? null : 'bold',
//       textAlign: 'center',
//       fontSize: 24 * scaleMultiplier,
//       color: colors.shark
//     },
//     onboardingBody: {
//       textAlign: 'center',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.oslo,
//       marginVertical: 20,
//       fontFamily: props.font ? props.font + '-regular' : null
//     },
//     optionsModalCancelButton: {
//       textAlign: 'center',
//       fontFamily: props.font + '-medium',
//       fontSize: 21 * scaleMultiplier,
//       color: colors.red
//     },
//     smallDrawerItem: {
//       fontSize: 18 * scaleMultiplier,
//       color: colors.chateau,
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-medium'
//     },
//     timeText: {
//       color: colors.shark,
//       fontSize: 12 * scaleMultiplier,
//       fontFamily: props.font + '-regular'
//     },
//     wahaButton: {
//       textAlign: 'center',
//       fontSize: 18 * scaleMultiplier,
//       flex: 1,
//       fontFamily: props.font ? props.font + '-medium' : null,
//       color:
//         props.type === 'outline'
//           ? props.color
//           : props.type === 'filled'
//           ? colors.white
//           : colors.chateau,
//       fontWeight: props.font ? null : 'bold'
//     },
//     groupNameDrawer: {
//       color: colors.white,
//       textAlign: 'center',
//       fontSize: 25 * scaleMultiplier,
//       fontFamily: props.font + '-black'
//     },
//     versionText: {
//       fontSize: 10 * scaleMultiplier,
//       color: colors.chateau,
//       justifyContent: 'center',
//       alignItems: 'center',
//       fontFamily: props.font + '-regular',
//       textAlign: props.isRTL ? 'right' : 'left'
//     },
//     wahaItemTitle: {
//       fontFamily: props.font + '-medium',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.shark
//     },
//     wahaItemDescription: {
//       fontFamily: props.font + '-regular',
//       fontSize: 14 * scaleMultiplier,
//       color: colors.oslo,
//       textAlign: props.isRTL ? 'right' : 'left'
//     },
//     addEditGroupInputLabel: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-regular',
//       fontSize: 14 * scaleMultiplier,
//       color: colors.chateau
//     },
//     noMoreSetsLabel: {
//       fontFamily: props.font + '-regular',
//       color: colors.chateau,
//       fontSize: 14 * scaleMultiplier,
//       textAlign: 'center'
//     },
//     gameTitle: {
//       fontFamily: props.font + '-medium',
//       paddingHorizontal: 10,
//       fontSize: 32 * scaleMultiplier
//     },
//     recordCountdown: {
//       fontFamily: props.font + '-regular',
//       fontSize: 24 * scaleMultiplier,
//       color: colors.white
//     },
//     editButtonText: {
//       fontFamily: props.font + '-regular',
//       color: colors.shark,
//       fontSize: 18 * scaleMultiplier
//     },
//     addGroupButton: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-medium',
//       color: colors.blue,
//       fontSize: 18 * scaleMultiplier
//     },
//     addNewLanguageButton: {
//       textAlign: props.isRTL ? 'right' : 'left',
//       fontFamily: props.font + '-medium',
//       fontSize: 18 * scaleMultiplier,
//       color: colors.chateau
//     }
//   })
// }
