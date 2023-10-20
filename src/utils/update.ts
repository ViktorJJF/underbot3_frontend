import { addMinutes, isPast, format, fromUnixTime } from 'date-fns';
import update from '@/services/api/updateSite';
import store from '@/store';

const MINUTES_TO_CHECK_FOR_UPDATES: number = 120;

/**
 * Compare two versions and determine if the first is greater than the second.
 * @param latestVersion - version from `version.json`
 * @param localVersion - version in bundle file
 * @returns boolean indicating if latestVersion is greater than localVersion
 */
export const compareVersion = (
  latestVersion: string,
  localVersion: string,
): boolean => {
  const versionsA: string[] = latestVersion.split(/\./g);
  const versionsB: string[] = localVersion.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a: number = Number(versionsA.shift());
    const b: number = Number(versionsB.shift());
    if (a === b) {
      continue;
    }
    return a > b || isNaN(b);
  }
  return false;
};

/**
 * Set the local storage date for when to next check for updates.
 */
export const setLocalStorageDateForUpdates = (): void => {
  if (window.localStorage.getItem('checkForAppUpdatesAt') === null) {
    window.localStorage.setItem(
      'checkForAppUpdatesAt',
      JSON.stringify(format(new Date(), 't')),
    );
  }
};

/**
 * Check if an update to the app is required, and if so, refresh the page.
 * @param latestVersion - version from `version.json`
 * @param localVersion - version in bundle file
 */
export const checkIfUpdateIsNeeded = (
  latestVersion: string,
  localVersion: string,
): void => {
  window.localStorage.setItem(
    'checkForAppUpdatesAt',
    JSON.stringify(
      format(addMinutes(new Date(), MINUTES_TO_CHECK_FOR_UPDATES), 't'),
    ),
  );

  const shouldForceRefresh: boolean = compareVersion(
    latestVersion,
    localVersion,
  );
  if (shouldForceRefresh) {
    window.location.reload();
  }
};

/**
 * Check for updates to the app.
 */
export const checkForUpdates = (): void => {
  setLocalStorageDateForUpdates();
  if (
    isPast(
      new Date(
        fromUnixTime(
          JSON.parse(
            window.localStorage.getItem('checkForAppUpdatesAt') || '0',
          ),
        ),
      ),
    )
  ) {
    update
      .checkIfUpdatedSiteVersion()
      .then((response: any) => {
        if (response.status === 200) {
          const latestVersion: string = response.data.version.trim();
          const localVersion: string = store.getters.appVersion;
          checkIfUpdateIsNeeded(latestVersion, localVersion);
        }
      })
      .catch(() => {
        // handle the error if necessary
      });
  }
};
