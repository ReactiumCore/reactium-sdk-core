import React from 'react';
import { expect } from 'chai';
import { mount } from './enzyme';
import Component, { Matched, UnMatched } from './components/is-container';

describe('useIsContainer', () => {
    const wrapper = mount(<Component />);

    it('true', () => {
        expect(wrapper.find(Matched)).to.have.lengthOf(1);
    });

    it('false', () => {
        expect(wrapper.find(UnMatched)).to.have.lengthOf(1);
    });
});
