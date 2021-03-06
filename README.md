# spectacles

## Description 

A Visual Studio Code Extension for Microsoft's ULS Log Analysis and Visualization. This extension is meant to help with the analysis of ULS logs, which are generated by Microsoft SharePoint or Office Apps for diagnostics purposes.

![](https://github.com/supermem613/spectacles/blob/master/resources/sample.PNG)

## Features

### Syntax Highlight
When choosing the 'ULS' language for open ULS log files, syntax will be highlighted based on the ULS schema. This specifically means coloring of WARNING and ERROR lines as well.

### Sidebar
A sidebar is provided with the list of Error and Warning lines. By clicking on each line, the log scrolls to the position in question. This allows for easily spotting all the errors and warnings in a log file.

Additionally, a regex expression that can be set in the extension settings will also yield occurences in the sidebar. This can be used to locate specific errors or patterns.
