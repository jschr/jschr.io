#! /bin/bash
set -e

echo "Packing app..."

cp ./package.json ./build/app
cp -R ./app/assets ./build/app

cd build/app

yarn install --production

zip -r -X app-package.zip .
mv app-package.zip ../
