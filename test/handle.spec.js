import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import { HandleRegisterer, HandleConsumer, someHandleState } from './components';

test('useHandle', () => {
    const registerer = document.createElement("div");
    const consumer = document.createElement("div");
    ReactDOM.render(<>
        <HandleRegisterer />
    </>, registerer);

    ReactDOM.render(<>
        <HandleConsumer />
    </>, consumer);

    expect(registerer.innerHTML).toEqual(someHandleState);
    expect(consumer.innerHTML).toEqual(registerer.innerHTML);

    ReactDOM.unmountComponentAtNode(registerer);
    ReactDOM.unmountComponentAtNode(consumer);
})
