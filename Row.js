import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import glamorous from 'glamorous-native'

const Row = glamorous.view(
        {
            flexDirection: "row"
        },
        (props) => ({
            justifyContent: props.centered ? "center" : "flex-start"
        }),
    (props, s) => {
    const {top, right, bottom, left} = props
    const isAbsolute = [top, right, bottom, left].filter(p => typeof p === "number").length > 0
    return {
        position: isAbsolute ? "absolute" : "relative",
        top,
        right,
        bottom,
        left,
    }
}
)

const incrementThings = (state, props) => {
    return {
        top: state.top + 1,
        height: state.height + 1
    }
}

export default class Example extends Component {

    constructor(props) {
        this.state = {top: 0, height: 50}
    }

    componentWillMount(){
        setTimeout(() => this.setState(incrementThings), 50)
    }

    render(){
        return(
            <Row centered top={this.state.top} style={[Styles.row, {backgroundColor: "green"}]} height={this.state.height} >
                <Text>I'm sliding down</Text>
            </Row>
        )
    }
}

const Styles = StyleSheet.create({
    row: {
        borderWidth: 3,
    },
})