#!/bin/bash
cd 
cd frontend/your repo folder name
git pull 
git checkout <branch name>
npm install &&
npm build &&
pm2 start index.js || pm2 restart index.js
