import 'babel-polyfill';
import * as Sentry from '@sentry/browser';
import ErrorBoundary from 'component/errorBoundary';
import App from 'component/app';
// import LoadingBarOneOff from 'component/loadingBarOneOff';
import SnackBar from 'component/snackBar';
import * as ACTIONS from 'constants/action_types';
// @if TARGET='app'
import SplashScreen from 'component/splash';
// @endif
import { ipcRenderer, remote, shell } from 'electron';
import moment from 'moment';
import * as MODALS from 'constants/modal_types';
import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { doLbryReady, doAutoUpdate, doOpenModal, doHideModal, doToggle3PAnalytics, doSignOut } from 'redux/actions/app';
import Lbry, { apiCall } from 'lbry';
import { isURIValid } from 'util/lbryURI';
import { setSearchApi } from 'redux/actions/search';
import { doSetLanguage, doFetchLanguage, doUpdateIsNightAsync, doFetchHomepages } from 'redux/actions/settings';
import { doFetchUserLocale } from 'redux/actions/user';
import { Lbryio, doBlackListedOutpointsSubscribe, doFilteredOutpointsSubscribe } from 'lbryinc';
import rewards from 'rewards';
import { store, persistor, history } from 'store';
import app from './app';
import doLogWarningConsoleMessage from './logWarningConsoleMessage';
import { ConnectedRouter, push } from 'connected-react-router';
import { formatLbryUrlForWeb, formatInAppUrl } from 'util/url';
import { PersistGate } from 'redux-persist/integration/react';
import analytics from 'analytics';
import { doToast } from 'redux/actions/notifications';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { initOptions } from 'util/keycloak';
import { getAuthToken, setAuthToken, getTokens, deleteAuthToken } from 'util/saved-passwords';
import { AUTHORIZATION, X_LBRY_AUTH_TOKEN } from 'constants/token';
import { PROXY_URL, DEFAULT_LANGUAGE, LBRY_API_URL } from 'config';

// Import 3rd-party styles before ours for the current way we are code-splitting.
import 'scss/third-party.scss';

// Import our app styles
// If a style is not necessary for the initial page load, it should be removed from `all.scss`
// and loaded dynamically in the component that consumes it
import 'scss/all.scss';

// @if TARGET='web'
// These overrides can't live in web/ because they need to use the same instance of `Lbry`
import apiPublishCallViaWeb from 'web/setup/publish';
import { doSendPastRecsysEntries } from 'redux/actions/content';

// Sentry error logging setup
// Will only work if you have a SENTRY_AUTH_TOKEN env
// We still add code in analytics.js to send the error to sentry manually
// If it's caught by componentDidCatch in component/errorBoundary, it will not bubble up to this error reporter
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://1f3c88e2e4b341328a638e138a60fb73@sentry.odysee.tv/2',
    whitelistUrls: [/\/public\/ui.js/],
  });
}

if (process.env.SDK_API_URL) {
  console.warn('SDK_API_URL env var is deprecated. Use SDK_API_HOST instead'); // @eslint-disable-line
}

Lbry.setDaemonConnectionString(PROXY_URL);

Lbry.setOverride('publish', (params) => {
  // We can probably just query from getTokens(), but retaining the original
  // code of always grabbing from getApiRequestHeaders():
  const requestHeaders = Lbry.getApiRequestHeaders();
  const token = requestHeaders[X_LBRY_AUTH_TOKEN] || requestHeaders[AUTHORIZATION] || '';

  return new Promise((resolve, reject) => {
    apiPublishCallViaWeb(apiCall, token, 'publish', params, resolve, reject);
  });
});
// @endif

analytics.initAppStartTime(Date.now());

// @if TARGET='app'
const { autoUpdater } = remote.require('electron-updater');
autoUpdater.logger = remote.require('electron-log');
// @endif

if (LBRY_API_URL) {
  Lbryio.setLocalApi(LBRY_API_URL);
}

if (process.env.SEARCH_API_URL) {
  setSearchApi(process.env.SEARCH_API_URL);
}

Lbryio.setOverride('setAuthToken', (authToken) => {
  setAuthToken(authToken);
  return authToken;
});

Lbryio.setOverride(
  'deleteAuthToken',
  () =>
    new Promise((resolve) => {
      resolve(deleteAuthToken());
    })
);

Lbryio.setOverride(
  'getTokens',
  () =>
    new Promise((resolve) => {
      resolve(getTokens());
    })
);

Lbryio.setOverride(
  'getAuthToken',
  () =>
    new Promise((resolve) => {
      resolve(getAuthToken());
    })
);

rewards.setCallback('claimFirstRewardSuccess', () => {
  app.store.dispatch(doOpenModal(MODALS.FIRST_REWARD));
});

rewards.setCallback('claimRewardSuccess', (reward) => {
  if (reward && reward.type === rewards.TYPE_REWARD_CODE) {
    app.store.dispatch(doHideModal());
  }
});

// @if TARGET='app'
ipcRenderer.on('open-uri-requested', (event, url, newSession) => {
  function handleError() {
    app.store.dispatch(
      doToast({
        message: __('Invalid LBRY URL requested'),
      })
    );
  }

  const path = url.slice('lbry://'.length);
  if (path.startsWith('?')) {
    const redirectUrl = formatInAppUrl(path);
    return app.store.dispatch(push(redirectUrl));
  }

  if (isURIValid(url)) {
    const formattedUrl = formatLbryUrlForWeb(url);
    analytics.openUrlEvent(formattedUrl);
    return app.store.dispatch(push(formattedUrl));
  }

  // If nothing redirected before here the url must be messed up
  handleError();
});

ipcRenderer.on('language-set', (event, language) => {
  app.store.dispatch(doSetLanguage(language));
});

ipcRenderer.on('open-menu', (event, uri) => {
  if (uri && uri.startsWith('/help')) {
    app.store.dispatch(push('/$/help'));
  }
});

const { dock } = remote.app;

ipcRenderer.on('window-is-focused', () => {
  if (!dock) return;
  app.store.dispatch({ type: ACTIONS.WINDOW_FOCUSED });
  dock.setBadge('');
});

ipcRenderer.on('devtools-is-opened', () => {
  doLogWarningConsoleMessage();
});

// Force exit mode for html5 fullscreen api
// See: https://github.com/electron/electron/issues/18188
remote.getCurrentWindow().on('leave-full-screen', (event) => {
  document.webkitExitFullscreen();
});

document.addEventListener('click', (event) => {
  let { target } = event;

  while (target && target !== document) {
    if (target.matches('a[href^="http"]') || target.matches('a[href^="mailto"]')) {
      event.preventDefault();
      shell.openExternal(target.href);
      return;
    }
    target = target.parentNode;
  }
});
// @endif

document.addEventListener('dragover', (event) => {
  event.preventDefault();
});
document.addEventListener('drop', (event) => {
  event.preventDefault();
});

function AppWrapper() {
  // Splash screen and sdk setup not needed on web
  const [readyToLaunch, setReadyToLaunch] = useState(IS_WEB);
  const [persistDone, setPersistDone] = useState(false);
  const [keycloakReady, setKeycloakReady] = useState(false);

  const onKeycloakEvent = (event, error) => {
    console.warn('onKeycloakEvent:', event, error || '');

    switch (event) {
      case 'onReady':
        setKeycloakReady(true);
        break;

      case 'onInitError':
      case 'onAuthSuccess':
        // TODO SSO: anything to do?
        break;

      case 'onAuthError':
      case 'onAuthRefreshError':
        app.store.dispatch({ type: ACTIONS.AUTHENTICATION_FAILURE });
        break;

      case 'onAuthRefreshSuccess':
        app.store.dispatch({ type: ACTIONS.OAUTH_REFRESH_SUCCESS });
        break;

      case 'onTokenExpired':
        // Nothing to do here; it should auto-refresh
        break;

      case 'onAuthLogout':
        app.store.dispatch(doSignOut());
        break;
    }
  };

  const onKeycloakTokens = (tokens) => {
    console.warn('onKeycloakTokens:', tokens);
  };

  useEffect(() => {
    // @if TARGET='app'
    moment.locale(remote.app.getLocale());

    autoUpdater.on('error', (error) => {
      console.error(error.message); // eslint-disable-line no-console
    });

    if (['win32', 'darwin'].includes(process.platform) || !!process.env.APPIMAGE) {
      autoUpdater.on('update-available', () => {
        console.log('Update available'); // eslint-disable-line no-console
      });
      autoUpdater.on('update-not-available', () => {
        console.log('Update not available'); // eslint-disable-line no-console
      });
      autoUpdater.on('update-downloaded', () => {
        console.log('Update downloaded'); // eslint-disable-line no-console
        app.store.dispatch(doAutoUpdate());
      });
    }
    // @endif
  }, []);

  useEffect(() => {
    if (persistDone) {
      app.store.dispatch(doToggle3PAnalytics(null, true));
      app.store.dispatch(doSendPastRecsysEntries());
    }
  }, [persistDone]);

  useEffect(() => {
    if (readyToLaunch && persistDone && keycloakReady) {
      app.store.dispatch(doLbryReady());

      const timer = setTimeout(() => {
        if (DEFAULT_LANGUAGE) {
          app.store.dispatch(doFetchLanguage(DEFAULT_LANGUAGE));
        }
        app.store.dispatch(doFetchHomepages());
        app.store.dispatch(doUpdateIsNightAsync());
        app.store.dispatch(doBlackListedOutpointsSubscribe());
        app.store.dispatch(doFilteredOutpointsSubscribe());
        app.store.dispatch(doFetchUserLocale());
      }, 25);

      analytics.startupEvent(Date.now());

      return () => clearTimeout(timer);
    }
  }, [readyToLaunch, persistDone, keycloakReady]);

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
      // LoadingComponent={<LoadingBarOneOff />}
    >
      <Provider store={store}>
        <PersistGate
          persistor={persistor}
          onBeforeLift={() => setPersistDone(true)}
          loading={<div className="main--launching" />}
        >
          <Fragment>
            {readyToLaunch ? (
              <ConnectedRouter history={history}>
                <ErrorBoundary>
                  <App />
                  <SnackBar />
                </ErrorBoundary>
              </ConnectedRouter>
            ) : (
              <Fragment>
                <SplashScreen onReadyToLaunch={() => setReadyToLaunch(true)} />
                <SnackBar />
              </Fragment>
            )}
          </Fragment>
        </PersistGate>
      </Provider>
    </ReactKeycloakProvider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('app'));
