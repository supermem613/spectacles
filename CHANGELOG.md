# Change Log

All notable changes to the "spectacles" extension will be documented in this file.

## [Unreleased]

## [0.0.18] - 2026-07-26
### Security
- Fixed all `npm audit` findings (12 high). Upgraded `eslint` to 10.x and pinned `minimatch` to `^10.2.5` and `brace-expansion` to `>=5.0.8` via overrides, resolving GHSA-mh99-v99m-4gvg (brace-expansion DoS).
### Changed
- Updated `eslint.config.cjs` to pass the parser object instead of a module path, required by ESLint 10.

## [0.0.5] - 2021-05-24
### Added
- Fixed security issue with ;odash and y18n

## [0.0.4] - 2020-08-06
### Removed
- Removed time interval logic which was causing the extension to fail loading in some cases. It would make
the sidebar empty.
- Removed unfinished trim command.

## [0.0.3] - 2020-08-01
### Added
- Fixed security issue with lodash

## [0.0.2] - 5/31/2020

- Add interval status bar item to easily see elapsed time when analyzing logs
- Added tests

## [0.0.1] - 5/23/2020
### Added
- Initial release