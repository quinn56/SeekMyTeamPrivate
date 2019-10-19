#!/bin/bash

printf "\nBuilding angular project...\n\n"
ng build --prod
printf "\nBuild complete.\n"

printf "\nCreating zip file...\n\n"
pushd ../src
zip seekmyteam.zip -r * .[^.]*
popd

printf "\nDone.\n"


