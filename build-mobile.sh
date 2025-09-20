#!/bin/bash

# www 디렉토리 초기화
rm -rf www
mkdir -p www

# HTML 파일 복사
cp hwatu.html www/index.html

# JavaScript 파일들 복사
cp *.js www/

# 리소스 디렉토리들 복사
cp -r bgm www/
cp -r boss www/
cp -r font www/
cp -r "new card" www/
cp -r se www/

echo "Build complete! Files copied to www directory."