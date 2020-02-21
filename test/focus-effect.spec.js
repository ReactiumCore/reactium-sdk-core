import React from 'react';
import { expect } from 'chai';
import { mount } from './enzyme';
import Component, { Focused } from './components/focus-effect';

describe('useFocusEffect', () => {
    const wrapper = mount(<Component />);

    it('true', () => {
        expect(wrapper.find(Focused)).to.have.lengthOf(1);
    });
});
