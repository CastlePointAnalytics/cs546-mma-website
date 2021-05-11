# CS 546 Final Project Group 18

## Installing
```bash
npm install
```

## Seeding
```bash
npm run seedDB
```

## Running
```bash
npm start
```

These scripts can be run from either within the project's directories or from the project root directory.

## Team Members
- Elias Frieling (efrielin@stevens.edu)
- Tayler Marin (tmarin@stevens.edu)
- Luke McEvoy (lmcevoy@stevens.edu)
- Ryan Perretta (rperrett@stevens.edu)
- Eleonora Savova (esavova@stevens.edu)

## Introduction

- We are developing an MMA website that provides analytics on fighter combinations, expected values of betting strategy portfolios, and forums for fighter match up debates. 
- The fighter statistics will be static, but the combinations, conversation, and portfolio possibilities are limitless.

## Motivation

- The MMA market lacks data driven discussion regarding fighter matchups. Furthermore, there is no medium to quantify a portfolio spread through different betting strategies.
- We are looking to fill that void with our project

## Core Features

1. **(Ryan)** Landing page
    - [X] Allows users to pick fighter combinations using two drop downs
    - [X] Shows upcoming fights (fighter, location, date, odds)
2. **(Luke)** Betting Strategy
    - [X] Expected value of betting portfolio based on average returns
    - [X] Basic Betting
    - [X] Parlays 
    - [X] Set-and-Forget bet allocation
    - [X] Advanced betting Kelly
3. **(Elias)** Match Up Statistic Page
    - [X] Newsletter format (contains information of fighters in match up)
    - [X] Record, Age, Height, Weight, Reach
    - [X] Win probability, Vegas Money Lines, By Decision, etc.
    - [X] Pick ems
4. **(Tayler)** Forum exclusively for this fight
    - [X] Ability to edit and delete messages
5. **(Ellie)** User Profile Page
    - [X] Name
    - [X] Age
    - [X] Supporting info
    - [ ] Show their pick ems
    - [ ] Show thread of messages from users in all forums (out of context? With context?
6. Preview history page
    - [ ] Last fight weekend (stats + analytics performance)
7. Global user analytics

## Extra Features

1. Filter fighter matchups based on
    - [ ] Gender
    - [ ] Weight class
2. Video fight previews
    - [ ] Embed URLs to video content that we call (pop up in the site)
3. Merge player into one player (hypothetical hybrid)
    - [ ] Create your own player (half + half fighter)

## Coding Coventions
1. CamelCase
2. Indentation

## Agile Conventions
[Our Trello Board over 6 Sprints](https://trello.com/b/sXB0dNd6/cs546-x-cpa)

## Workflow (Git) Conventions

#### How to rebase with Main branch
Start in ```main``` branch<br />
-> ```(main): git pull```<br />
-> ```(main): git checkout develop```<br />
<br />
Move to ```develop``` branch<br />
-> ```(develop): git merge main```<br />
-> ```(develop): git checkout YOUR_BRANCH```<br />
<br />
Move to ```YOUR_BRANCH``` branch<br />
-> ```(YOUR_BRANCH): git merge develop```<br />
<br />
Start Coding!

#### Branches
1. Main
2. Develop
3. Ryan
4. Elias
5. Tayler
6. Ellie
7. Luke



## Data convetions
1. Github Gist provided by CPA
2. All percentages will be represented as decimals
3. All heights will be represented in inches
4. All weights will be represented in pounds
5. All reaches will be represented in inches

Github: https://github.com/CastlePointAnalytics/cs546-mma-website


