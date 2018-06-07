// @flow
import * as React from "react"
import { Animated } from "react-native"

export default class SlideDownFromTopView extends React.Component<
  Props,
  State
> {
  static defaultProps = {
    duration: 500,
    marginTop: 0
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      marginTop: new Animated.Value(-this.props.height)
    }
  }

  componentDidMount() {
    Animated.spring(this.state.marginTop, {
      toValue: 0,
      duration: this.props.duration
    }).start()
  }

  render() {
    return (
      <Animated.View style={{ marginTop: this.state.marginTop }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

type Props = {
  duration: number,
  height: number,
  children: ?React.Node
}

type State = {
  marginTop: Animated.Value
}
