#! /bin/bash
set -e

echo "Packing app..."

cp ./package.json ./build/app
cp ./app/assets/* ./build

cd build/app

yarn install --production

zip -r -X app-package.zip .
mv app-package.zip ../
