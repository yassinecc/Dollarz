# Dollarz

Sample playground app for Stripe payments

## Install

- Clone the repo with its submodules with `git clone --recursive https://github.com/yassinecc/Dollarz`

- Install node modules with `cd dollarz-app && yarn && cd ../dollarz-server && yarn`

## Run

### App

You will need to create in the app folder an `app-secret.json` with the following shape:

```
{
  "stripePublishableKey": ... // your Stripe publishable key
}
```

Then run `react-native run-ios` or `react-native run-android` to start the app

### Server

In the dollarz-server folder a `server-secret.json` file with the following shape:

```
{
  "jwtSecret": ..., // a strong password of your choosing
  "stripeSecretKey": ... // your Stripe secret key
}
```

Run `yarn start` to startup the server

TODO: setup server with Docker

## Troubleshooting

You might run into Xcode compilation errors if you're using Xcode 10. This is a [known issue](https://github.com/facebook/react-native/issues/21168) that you can resolve with the following in `dollarz-app`:

- Run `cd node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../..`
- Run `cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh && cd ../../../..`
- Manually link `libfishhook.a` in Xcode > DollarzApp > Libraries > RCTWebSocket.xcodeproj > Build phases > Link binary with libraries

TODO: use patch for automatic re-linking
