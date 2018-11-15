# Pollo Web App

## Setup

### 1) Semantic UI
After cloning the project, with the latest version of [Yarn](https://yarnpkg.com), run `yarn install` to install dependencies.

In using Semantic UI, we wish to customize the theming, so naturally we cannot use their CDNs or install the CSS node packages. We must install the `semantic-ui` package and create our own theme. After installing dependencies, the `./semantic` folder under the project directory should be populated with the Semantic UI library files along with our git-tracked theme under `./semantic/src/themes/clicker`.

Now build Semantic UI with gulp by running `gulp build` under the `./semantic` directory. You can also have it watch for changes with `gulp watch` but be aware that it will build the entire library every time.

### 2) Environment
Copy the environment template to `.env` by running the following:
```bash
cp env.template .env
```

## Development
Run `yarn start` to start the development server.

Once again, to edit the Semantic themes make sure to build with `gulp build` under `./semantic`.

## Production
Run `yarn build` to create a production ready build.
