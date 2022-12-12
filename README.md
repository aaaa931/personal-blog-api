# personal-blog-api

## 簡介

用於「個人部落格」後端 api，採用 firestore 作為資料庫，搭配 express 進行 api 開發

## 使用技術

* Firestore
* express

## 檔案說明
```
server.mjs：api 的目錄檔，根據 RESTful api 的類型呼叫各個 function
server-other.mjs：todolist、labels api，原本預計因應資料庫名稱而命名 server-config，後來發現容易混淆就更改成 server-other
server-post.mjs：post api，基本上就是簡單的 get query 跟 post query
server-postlist.mjs：postlist api，主要功能為 FireStore 的分頁功能，目前當頁筆數是前後端分別設定，後續可能更改成由後端發送給前端統一
server-user.mjs：user api，基本上就是簡單的 get query 跟 post query
```

## 資料庫結構
```
config
|-labels
|-todolist
posts
|-個別貼文（id）
users
|-個別使用者（id）
```
