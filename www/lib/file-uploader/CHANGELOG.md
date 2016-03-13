
0.9.0 / 2015-05-29
==================

  * Adding a validate function to allow advanced validations

0.8.1 / 2015-05-04
==================

  * Removing call to reset form since it breaks iframe validation.

0.8.0 / 2015-05-04
==================

  * Added events when mouse hovered upload area.
  * Added ability to upload another file after first one fails or completes.

0.7.2 / 2015-02-17
==================

  * Merge pull request #11 from firstandthird/feature/override-show
  * Added ability to override showProgress and showComplete

0.7.1 / 2015-02-04
==================

  * Merge pull request #9 from firstandthird/feature/invalid-notice
  * Added method for onInvalidFileType

0.7.0 / 2015-02-04
==================

  * Using new framejax capabilities
  * Updating required framejax version
  * Invoking custom function when upload returns an error

0.6.1 / 2015-01-28
==================

  * fixed scoping issue

0.6.0 / 2015-01-28
==================

  * updated example
  * renamed default postKey to file and fixed drag/drop bug
  * renamed jquery plugin to fileUploader

0.5.0 / 2015-01-25
==================

 * Renaming to file-uploader
 * Adding back the allow array and checking them before submitting the file
 * Allowing file submissions

0.4.1 / 2013-08-28
==================

 * Merge branch 'dev'
 * Release 0.4.0
 * little bit of cleanup and added over and out events
 * changed port for grunt connect

0.4.0 / 2013-08-28
==================

  * little bit of cleanup and added over and out events
  * changed port for grunt connect
  * Added some basic error checking for filetype and only allow one image.
  * Added working dragndrop. Needs error handing, file type check, and general cleanup.
  * Cleaned up code.
  * Converted to fidel.
  * [tools] updated build to use latest grunt

0.3.4 / 2013-01-15
==================

  * [lib] if nothing returned from server, don't try and drop image
  * [lib] changed copy on not-allowed file
  * [example] added jpeg to git ignore
  * [lib] added jpeg to allow

0.3.3 / 2013-01-15
==================

  * [lib] added processData option to intercept data from server

0.3.2 / 2013-01-15
==================

  * [lib] added zIndex option

0.3.1 / 2013-01-14
==================

  * [example] updated for express 3.0 and lib changes
  * [lib] renamed imgUp to imageUploader
  * [example] added upload folder

0.3.0 / 2013-01-14
==================

  * [tools] added bower support
  * [tools] added grunt support
  * [lib] renamed to image-uploader

0.2.0 / 2012-05-22
==================

  * custom port for example server
  * check file extension before uploading

0.1.2 / 2012-05-09
==================

  * set cursor to pointer, trigger on complete, changed progress to div

0.1.1 / 2012-05-09
==================

  * fix for firefox and ie7

0.1.0 / 2012-04-26
==================

  * rewrote as jquery plugin
  * renamed to imgup

# v0.0.1
- initial release
