This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## TODO list/proposals (not sorted)

1. tsconfig: `"baseUrl": "src"` can leads to name collisions `import foo from "isItFileOrPackagName"`;
2. I personally do not like re-exporting external components (like bootstrap), nothing special against it, I just had bad experience.
3. Payload of redux actions must be serializable (plain array  and object, not classes).
 Serializable actions makes code easier to debug. In the best case we will even be able to mirror client's
 state to our logger/supports system
4. `export default ConnectedComponent` allows to use React.lazy which is good way to reduce bundle size
5. `export const Component` allows to test not connected component as well as using Storybook
6. Dependencies of react hooks is not set. Dependencies can not be set yet: functions used in hooks are not stable (not memoized).
7.  Pollution to prototypes of basic types is an anti-pattern. It can lead to unexpected behavior with third-party libraries.

