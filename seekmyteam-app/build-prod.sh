#!/bin/bash

printf "\nBuilding angular project...\n\n"
ng build --prod
printf "\nFinished building project.\n\n"

printf "\nCreating AWS zipfile...\n\n"
pushd ../src
zip seekmyteam.zip -r * .[^.]*
popd

printf "\nDone.\n"


