# 台灣旅遊網 -後端 -  APIs

## 1. 獲取全站用戶
* 呼叫方式: GET /users
* BODY參數: 無
* 回傳範例: 
```json=
[
  {
    "_id": "6395f34cae18c304ae4f1f14",
    "id": 0,
    "role": "admin",
    "name": "管理員",
    "mail": "admin@mail.com",
    "spotList": []
  },
  {
    "_id": "6395f367ae18c304ae4f1f15",
    "id": 1,
    "role": "user",
    "name": "小明",
    "mail": "ming@mail.com",
    "spotList": [
      "6395ef5aae18c304ae4f1f12",
      "6395eed5ae18c304ae4f1f0e",
      "6395ef1bae18c304ae4f1f0f"
    ]
  },
  .....
]
```

---------------------------
## 2. 會員登入
* 呼叫方式: POST /users
* BODY參數: mail, password
* 回傳範例: 
```json=
{
  "msg": "登入成功",
  "info": {
    "id": 1,
    "tId": "6395f367ae18c304ae4f1f15",
    "name": "小明",
    "mail": "ming@mail.com",
    "role": "user",
    "spotList": [
      "6395ef5aae18c304ae4f1f12",
      "6395eed5ae18c304ae4f1f0e",
      "6395ef1bae18c304ae4f1f0f"
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0SWQiOiI2Mzk1ZjM2N2FlMThjMzA0YWU0ZjFmMTUiLCJpYXQiOjE2NzA5MDA5NDksImV4cCI6MTY3MDk4NzM0OX0.4q0e8iU14D6obEhATOfOWcO2zVI9zxJIik4lSYDoRpc"
  }
}
```

---------------------------
## 3. 批量修改個人收藏景點資料
* 呼叫方式: PATCH /users
* BODY參數: token, spotList:string[]
* 回傳範例: 
```json=
{
  "msg": "修改成功"
}
```
---------------------------
## 4. 新增單一收藏景點
* 呼叫方式: POST /pushSpot
* BODY參數: token, objectId
* 回傳範例: 
```json=
{
  "msg": "景點收藏成功"
}
```

---------------------------
## 5.刪除單一收藏景點
* 呼叫方式: POST /pullSpot
* BODY參數: token, objectId
* 回傳範例: 
```json=
{
  "msg": "景點移除成功"
}
```

---------------------------
## 6. 註冊會員
* 呼叫方式: POST /register
* BODY參數: mail, password, name, role 
* 回傳範例: 
```
{
  "msg": "註冊成功"
}
```

---------------------------
## 7. 驗證身分後，回傳個人資料
* 呼叫方式: POST /auth
* BODY參數: token
* 回傳範例: 
```json=
{
  "auth": true,
  "msg": "驗證成功",
  "info": {
    "tId": "6397ee9dae40059936753f45",
    "name": "test-man",
    "mail": "test@mail.com",
    "role": "user",
    "spotList": []
  }
}
```

---------------------------
## 8. 獲取全站景點
* 呼叫方式: GET /spots
* BODY參數: 無
* 回傳範例:
```json=
[
  {
    "_id": "6395eed5ae18c304ae4f1f0e",
    "id": 1,
    "name": "港子老榕樹",
    "description": "港子老榕樹位在澎湖白沙港子村，203線道上，往澎湖水族館路口，就在保定宮廟埕。是澎湖第二老榕樹，因在兩側各一棵，又有情人樹之稱。兩株榕樹環抱著廟宇，像似在為保定宮遮風避雨，這裡也是村內老人下棋、小孩嬉戲，閒話家常的好去處。",
    "pictureUrl": "https://penghutravel.com/FileDownload/TravelInformation/NotSet/Scenery/378/039-03.jpg"
  }, ....
]
```

---------------------------
## 9. 新增一個景點 (管理者)
* 呼叫方式: POST /spots
* BODY參數: name, description, pictureUrl [可空值]
* 回傳範例: 
```json=
{
  "msg": "新增成功"
}
```

---------------------------
## 10. 刪除一個景點 (管理者)
* 呼叫方式: DELETE /spots
* BODY參數: objectId
* 回傳範例: 
```json=
{
  "msg": "刪除成功"
}
```
---------------------------
## 11. 修改一個景點 (管理者)
* 呼叫方式: PATCH /spots
* BODY參數: objectId, name, description
* 回傳範例: 
```json=
{
  "msg": "修改成功"
}
```
---------------------------

