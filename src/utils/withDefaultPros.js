import React, { Component } from 'react';

const withDefaultPros = (ContentComponent) => {
    return class WithPropWrapper extends Component {

        render() {
            // Add extra props here
            return <ContentComponent />
        }

    }
}
export default withDefaultPros;