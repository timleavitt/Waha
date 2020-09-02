import { colors, scaleMultiplier } from '../constants'
export const typography = props =>
  StyleSheet.create({
    setTitle: {
      color: props.iconColor,
      fontSize: props.iconSize
    },
    setSubtitle: {},
    lessonTitle: {},
    lessonSubtitle: {},
    blurb: {
      textAlign: 'center',
      fontSize: 14 * scaleMultiplier,
      fontFamily: props.font + '-regular',
      color: colors.shark
    },
    chapterSelectText: {
      fontSize: 14 * scaleMultiplier
    },
    drawerItem: {
      color: colors.tuna,
      textAlign: props.isRTL ? 'right' : 'left',
      fontFamily: props.font + '-medium',
      fontSize: 18 * scaleMultiplier,
      textAlignVertical: 'center',
      paddingHorizontal: 10
    },
    groupName: {
      textAlign: props.isRTL ? 'right' : 'left',
      fontFamily: props.font + '-black',
      color: colors.shark,
      fontSize: 18 * scaleMultiplier
    },
    groupBookmark: {
      textAlign: props.isRTL ? 'right' : 'left',
      fontFamily: props.font + '-regular',
      fontSize: 12 * scaleMultiplier,
      color: colors.chateau
    },
    groupHeader: {
      textAlign: props.isRTL ? 'right' : 'left',
      fontFamily: props.font + '-regular',
      fontSize: 18 * scaleMultiplier,
      color: colors.chateau,
      flex: 1
    },
    groupHeaderMT: {
      textAlign: props.isRTL ? 'right' : 'left',
      fontFamily: props.font + '-medium',
      fontSize: 18 * scaleMultiplier,
      color: colors.chateau
    }
  })
