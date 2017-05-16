import React, {Component} from 'react'
import {
    View,
    Image,
    ListView,
    ScrollView,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native'
// import ThemeProvider, {CHANNEL} from './theme-provider'

/**
 * This the React Native Glamorous Implementation
 *
 * It accepts a component which can be a string or a React Component and returns
 * a "glamorousComponentFactory"
 * @param {String|ReactComponent} Comp the component to render
 * @return {Function} the glamorousComponentFactory
 */
function glamorous(Comp) {
    return glamorousComponentFactory
    /**
     * This returns a React Component that renders the comp (closure)
     * with the given glamor styles object(s)
     * @param {...Object|Function} styles the styles to create with glamor.
     *   If any of these are functions, they are invoked with the component
     *   props and the return value is used.
     * @return {ReactComponent} the ReactComponent function
     */
    function glamorousComponentFactory(...styles) {
        /**
         * This is a component which will render the comp (closure)
         * with the glamorous styles (closure). Forwards any valid
         * props to the underlying component.
         * @param {Object} theme the theme object
         * @return {ReactElement} React.createElement
         */
        class GlamorousComponent extends Component {
            // state = {theme: null}
            // setTheme = theme => this.setState({theme})

            componentWillMount() {
                // const {theme} = this.props
                // if (this.context[CHANNEL]) {
                //     // if a theme is provided via props, it takes precedence over context
                //     this.setTheme(theme ? theme : this.context[CHANNEL].getState())
                // } else {
                //     this.setTheme(theme || {})
                // }
                this.cachedStyles = {}
            }

            componentWillReceiveProps(nextProps) {
                // if (this.props.theme !== nextProps.theme) {
                //     this.setTheme(nextProps.theme)
                // }
            }

            componentDidMount() {
                // if (this.context[CHANNEL] && !this.props.theme) {
                //     // subscribe to future theme changes
                //     this.unsubscribe = this.context[CHANNEL].subscribe(this.setTheme)
                // }
            }

            componentWillUnmount() {
                // // cleanup subscription
                // this.unsubscribe && this.unsubscribe()
            }

            /**
             * This is a function which will cache the styles
             * differently depending on if in DEV mode or not.
             * Caching styles on instance won't work for hot-reloading.
             * Memoizing the static styles solves this.
             * @param {Object} staticStyles
             */
            _cacheStaticStyles(staticStyles) {
                if (module.hot) {
                    const index = JSON.stringify(staticStyles)
                    if (index in this.cachedStyles) {
                        this.cachedStylesNumber = this.cachedStyles[index]
                    } else {
                        this.cachedStylesNumber = StyleSheet.create({
                            key: staticStyles,
                        }).key
                        this.cachedStyles[index] = this.cachedStylesNumber
                    }
                } else {
                    this.cachedStylesNumber = this.cachedStylesNumber ||
                        StyleSheet.create({key: staticStyles}).key
                }
            }

            /**
             * This is a function which will split the
             * style rules (functions) from the styles passed to
             * the glamorous component factory as args
             * @param {...Object|Function} styles
             * @return {Object}
             */
            _splitArgs(args){
                return args.reduce((split, arg) => {
                    if (typeof arg === 'function') {
                        if(arg.length === 1) {
                            split['staticGlamorRules'] = arg(this.props)
                        } else {
                            split['dynamicGlamorRules'] = arg(this.props)
                        }
                    } else if (typeof arg === 'object') {
                        split['glamorStyles'] = arg
                    }
                    return split
                }, {})
            }

            /**
             * This is a function which will split the props
             * that were passed to the component in JSX
             * @param {...Object} props
             * @return {Object}
             */
            _splitProps({style, ...rest}) {
                const hasItem = (list, name) => list.indexOf(name) !== -1
                const isRNStyle = name => hasItem(RNStyles, name)
                const returnValue = {toForward: {}, styleProps: {}, style}
                return Object.keys(rest).reduce(
                    (split, propName) => {
                        if (isRNStyle(propName)) {
                            split.styleProps[propName] = rest[propName]
                        } else {
                            split.toForward[propName] = rest[propName]
                        }
                        return split
                    },
                    returnValue,
                )
            }

            render() {
                const {...rest} = this.props
                const {
                    staticGlamorRules,
                    dynamicGlamorRules,
                    glamorStyles,
                } = this._splitArgs(styles)
                const {
                    toForward,
                    styleProps,
                    style,
                } = this._splitProps(rest)
                const staticStyles = {
                    ...glamorStyles,
                    ...styleProps,
                    ...staticGlamorRules,
                }
                this._cacheStaticStyles(staticStyles)

                const mergedStyles = Array.isArray(style) ?
                    [this.cachedStylesNumber, ...style] :
                    [this.cachedStylesNumber, style]

                return <Comp style={[mergedStyles, dynamicGlamorRules]} {...toForward} />
            }
        }

        // GlamorousComponent.propTypes = {
        //     theme: PropTypes.object,
        // }

        // GlamorousComponent.contextTypes = {
        //     [CHANNEL]: PropTypes.object,
        // }

        return GlamorousComponent
    }
}

glamorous.view = glamorous(View)
glamorous.image = glamorous(Image)
glamorous.listView = glamorous(ListView)
glamorous.scrollView = glamorous(ScrollView)
glamorous.text = glamorous(Text)
glamorous.touchableHighlight = glamorous(TouchableHighlight)
glamorous.touchableNativeFeedback = glamorous(TouchableNativeFeedback)
glamorous.touchableOpacity = glamorous(TouchableOpacity)
glamorous.touchableWithoutFeedback = glamorous(TouchableWithoutFeedback)

glamorous.View = glamorous.view()
glamorous.Image = glamorous.image()
glamorous.ListView = glamorous.listView()
glamorous.ScrollView = glamorous.scrollView()
glamorous.Text = glamorous.text()
glamorous.TouchableHighlight = glamorous.touchableHighlight()
glamorous.TouchableNativeFeedback = glamorous.touchableNativeFeedback()
glamorous.TouchableOpacity = glamorous.touchableOpacity()
glamorous.TouchableWithoutFeedback = glamorous.touchableWithoutFeedback()

/**
 * should-forward-native-property substitute
 */

// This list is not complete. View and Text styles only.
const RNStyles = [
    'alignItems',
    'alignSelf',
    'backfaceVisibility',
    'backgroundColor',
    'borderBottomColor',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderBottomWidth',
    'borderColor',
    'borderLeftColor',
    'borderLeftWidth',
    'borderRadius',
    'borderRightColor',
    'borderRightWidth',
    'borderStyle',
    'borderTopColor',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderTopWidth',
    'borderWidth',
    'bottom',
    'color',
    'decomposedMatrix',
    'elevation',
    'flex',
    'flexBasis',
    'flexDirection',
    'flexGrow',
    'flexShrink',
    'flexWrap',
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'height',
    'justifyContent',
    'left',
    'letterSpacing',
    'lineHeight',
    'margin',
    'marginBottom',
    'marginHorizontal',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginVertical',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'opacity',
    'overflow',
    'overlayColor',
    'padding',
    'paddingBottom',
    'paddingHorizontal',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingVertical',
    'position',
    'resizeMode',
    'right',
    'rotation',
    'scaleX',
    'scaleY',
    'shadowColor',
    'shadowOffset',
    'shadowOpacity',
    'shadowRadius',
    'textAlign',
    'textAlignVertical',
    'textDecorationColor',
    'textDecorationLine',
    'textDecorationStyle',
    'textShadowColor',
    'textShadowOffset',
    'textShadowRadius',
    'tintColor',
    'top',
    'transform',
    'transformMatrix',
    'translateX',
    'translateY',
    'width',
    'writingDirection',
    'zIndex',
]


export default glamorous
// export {ThemeProvider}

