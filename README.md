# University of Minnesota Coding Boot Camp - Fall 2020 
## Assignment #06 Server-Side APIs: Weather Dashboard
<br/>

### Overview

The focus of this assignment was to build a dynamically updated weather dashboard integrating the OpenWeather API, utilizing what we have learned in class so far to achieve the following acceptance criteria:

* Build weather dashboard UI with form inputs.
* Search box for user to enter a city name.
* User is presented with current weather conditions in the city they searched.
* Current weather data includes: temperature, humidity, wind speed, and UV index.
* The UV index will be color coded depnding on the conditions: green for favorable, yellow for moderate, or red for severe.
* Additionally, a five day forecast will appear below the current weather conditions, informing the user of what the weather will be like in the next five days.
* When a user searches a city name, that name is added to a search history view located below the search box and button, which will hold up to the last eight city names that were searched.
* Each city listed in the search history view is clickable for another instant update.


### Review of Tasks

In anticipation for the transition to learning React later in the course, I purchased a book by Eve Porcello and Alex Banks entitled "Learning React" (Second Edition) from O'Reilly Books.  

I spent the majority of my week reviewing the early chapters of this book, learning modern ES6 techniques, and trying to wrap my head around the concept of "functional programming".  It's confusing to say the least, but I'm slowly beginning to wrap my head around it.

In addition to really mastering the fundamentals of ajax, this week also brought the integration of geolocation.

#### Here are the steps taken to achieve this complete this week's homework project:

* Built initial file system structure and deployed basic blueprint to Github to complete repository construction.
* Sketched out pseudo code logic and transcribed them into the code as comments.
* Created constants for our API call queries.
* Initiated basic ajax calls to our API OpenWeather and mapped out variables to display on HTML elements.
* Created kevinToFarenheight() function to convert temperatures.
* Built search history functionality by utilizing an unorganized list, and dynamically generated list items based on the user's search keywords.
* Added click functionality to the search history to popular main display with current weather data.
* Created five day forecast by iterating over the received data, and extracting the hottest temperatures for each day.
* Added geolocation search when user connects to site.  if they decline, the site will default search to the Minneapolis/ St. Paul area.


After multiple trial and error debugging sessions, all applied logic appears sound and no bugs can be generated from purposeful negligent entries.  From this point, it was time to clean up:

* Refactor reduntant and worthless code.
* Removed multiple, annoying console.log commands used for debugging.
* Double-checked to ensured code was properly formatted and commented before submission.
* Used code validation service.
* Wrote README.MD file.
* Added screenshots to README.
 

### Installation

Installation should be fairly straightforward, but here's a quick guide to get up and running, assuming you have **Visual Studio Code** and **Git** (with the accompanying interface **Git Bash**) installed.

* from your shell input the command: `git clone https://github.com/infiniteoo/homework_week_06_server-side_apis`
* once downloaded, from the working directory in the shell, input the command: `code .`


### Live Example

This project can be previewed live via Github Pages at: https://infiniteoo.github.io/homework_week_06_server-side_apis/

# Screenshots of Deployed Website

## 992px Width 
![screenshot 992px width](/img/992_1.PNG)
![screenshot 992px width](/img/992_2.PNG)
![screenshot 992px width](/img/992_3.PNG)

## 768px Width 
![screenshot 768px width](/img/768_1.PNG)
![screenshot 768px width](/img/768_2.PNG)
![screenshot 768px width](/img/768_3.PNG)

## 400px Width 
![screenshot 400px width](/img/400_1.PNG)
![screenshot 400px width](/img/400_2.PNG)
![screenshot 400px width](/img/400_3.PNG)


### License

Copyright 2020 T. Dorman, distrubuted under the **GNU Public License** for the Univeristy of Minnesota Part-Time Full Stack Coding Boot Camp.














