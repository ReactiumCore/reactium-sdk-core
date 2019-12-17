[![Build Status](https://travis-ci.org/Atomic-Reactor/reactium-sdk-core.svg?branch=master)](https://travis-ci.org/Atomic-Reactor/reactium-sdk-core)

# Reactium SDK Core

Core subset of Reactium SDK singleton and named exports.

## Install

```
npm install --save @atomic-reactor/reactium-sdk-core
```

There are a number of peer dependencies in use in the Core SDK. Because these are dependencies
provided in Reactium, they are not required explicitly in this repository. If you
plan to use this on another project, install them:

```
npm install --save-dev action-sequence
npm install --save-dev react-redux
npm install --save-dev memory-cache
npm install --save-dev moment
npm install --save-dev object-path
npm install --save-dev react
npm install --save-dev redux
npm install --save-dev react-dom
npm install --save-dev shallow-equals
npm install --save-dev underscore
npm install --save-dev uuid
```

## Usage
import Reactium from `@atomic-reactor/reactium-sdk-core`;

For full SDK documentation, clone this project and run:

```
npm run apidoc
```
