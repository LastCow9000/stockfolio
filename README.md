## 개발 환경

node.js:20, nestjs, sqlite, typeorm, <br>
fluent-ffmpeg, ffmpeg:7.0.2-full_build, <br>
docker(redis)

## 실행 방법

**ffmpeg가 설치되어 있어야 합니다.**

shell에 아래의 명령어를 순차적으로 입력합니다.

```bash
$ git clone https://github.com/LastCow9000/stockfolio-assignment.git

$ cd stockfolio-assignment

$ git checkout develop

$ npm install

$ docker compose up -d

$ npm run start:dev
```

## Api docs

<details>
<summary>접기/펼치기</summary>

### 1. 동영상 업로드

`POST api/v1/videos`

Request:

- Query Parameters:
  - user_id (required): 사용자 아이디
- Body:
  - files (form-data, required): 동영상 파일들

Example Request:

```http
POST http://localhost:3000/api/v1/videos?user_id=1
```

Response:

```json
{
    "success": boolean,
    "data": [
        {
            "id": number,
            "filePath": string
        }
    ]
}
```

Example Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filePath": "/public/origin-videos/video1.mp4"
    }
  ]
}
```

### 2. 업로드된 모든 동영상 리스트

`GET api/v1/videos`

Request:

- Query Parameters:
  - user_id (required): 사용자 아이디

Example Request:

```http
GET http://localhost:3000/api/v1/videos?user_id=1
```

Response:

```json
{
    "success": boolean,
    "data": [
        {
            "id": number,
            "filePath": string
        }
    ]
}

```

Example Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filePath": "/public/origin-videos/video1.mp4"
    }
  ]
}
```

### 3. 동영상 컷 편집 명령

`POST api/v1/trims`

Request:

- Body (JSON):
  - videoId (required): 동영상 ID
  - startTime (required): 시작 시간 (형식: HH:MM:SS)
  - endTime (required): 종료 시간 (형식: HH:MM:SS)

Example Request:

```http
POST http://localhost:3000/api/v1/trims
Content-Type: application/json
{
    "videoId": 1,
    "startTime": "00:00:55",
    "endTime": "00:01:30"
}
```

Response:

```json
{
    "success": boolean
}
```

Example Response:

```json
{
  "success": true
}
```

### 4. 컷 편집 명령 리스트

`GET api/v1/trims`

Request:

- Query Parameters:
  - user_id (required): 사용자 아이디

Example Request:

```http
GET http://localhost:3000/api/v1/trims?user_id=1
```

Response:

```json
{
    "success": boolean,
    "data": [
        {
            "id": number,
            "startTime": string,
            "endTime": string,
            "status": string,
            "createdAt": Date,
            "video": {
                "id": number,
                "filePath": string
            }
        }
    ]
}
```

Example Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "startTime": "00:00:15",
      "endTime": "00:01:20",
      "status": "pending",
      "createdAt": "2024-09-01T11:48:56.000Z",
      "video": {
        "id": 1,
        "filePath": "/public\\origin-videos\\30a69d5d-b6e7-4d7c-814c-156e1117d598.mp4"
      }
    }
  ]
}
```

### 5. 동영상 이어 붙이기 명령

`POST api/v1/concats`

Request:

- Body (JSON):
  - videoIds (required): 동영상 ID 목록 (배열)

Example Request:

```http
POST http://localhost:3000/api/v1/concats
Content-Type: application/json
{
    "videoIds": [3, 1, 2]
}
```

Response:

```json
{
    "success": boolean
}
```

Example Response:

```json
{
  "success": true
}
```

### 6. 이어 붙이기 명령 리스트

`GET api/v1/concats`

Request:

- Query Parameters:
  - user_id (required): 사용자 아이디

Example Request:

```http
GET http://localhost:3000/api/v1/concats?user_id=1

```

Response:

```json
{
  "success": boolean,
  "data": [
    {
      "id": number,
      "status": string,
      "createdAt": Date,
      "commandInfos": [
        {
          "order": number,
          "video": {
            "id": number,
            "filePath": string
          }
        },

      ]
    }
  ]
}
```

Example Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "status": "pending",
      "createdAt": "2024-09-01T11:50:07.000Z",
      "commandInfos": [
        {
          "order": 1,
          "video": {
            "id": 3,
            "filePath": "/public\\origin-videos\\30cc9df9-3950-4445-aa3c-0772fdeb1b64.mp4"
          }
        },
        {
          "order": 2,
          "video": {
            "id": 1,
            "filePath": "/public\\origin-videos\\30a69d5d-b6e7-4d7c-814c-156e1117d598.mp4"
          }
        }
      ]
    }
  ]
}
```

### 7. 명령 작업 수행

`GET api/v1/videos/execute`

Request:

- Query Parameters:
  - user_id (required): 사용자 아이디

Example Request:

```http
GET http://localhost:3000/api/v1/videos/execute?user_id=1
```

Response:

```json
{
    "success": boolean,
    "message": string
}
```

Example Response:

```json
{
  "success": true,
  "message": "작업 명령이 요청되었습니다."
}
```

### 8. 최종 동영상 다운로드 링크

`GET api/v1/final-videos/:final_video_id/downloadlink`

Request:

- Path Variables:
  - final_video_id (required): 최종 동영상 ID

Example Request:

```http
GET http://localhost:3000/api/v1/final-videos/1/downloadlink
```

Response:

```json
{
    "success": boolean,
    "downloadLink": string
}
```

Example Response:

```json
{
  "success": true,
  "downloadLink": "localhost:3000/api/v1/final-videos/trimmed_1725191504902.mp4"
}
```

### 9. 최종 동영상 리스트

`GET api/v1/final-videos`

Request:

- none

Example Request:

```http
GET http://localhost:3000/api/v1/final-videos
```

Response:

```json
{
    "success": boolean,
    "data": [
        {
            "id": number,
            "filePath": string,
            "status": string,
            "createdAt": Date,
            "concatCommandInfo": {
                "id": number,
                "originalVideos": [
                    {
                        "id": number,
                        "order": number,
                        "filePath": string
                    },
                    {
                        "id": number,
                        "order": number,
                        "filePath": string
                    }
                ]
            }
        },
        {
            "id": number,
            "filePath": string,
            "status": string,
            "createdAt": Date,
            "trimCommand": {
                "id": number,
                "startTime": string,
                "endTime": string
            }
        }
    ]
}
```

Example Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filePath": "public\\final-videos\\concated_1725191504903.mp4",
      "status": "done",
      "createdAt": "2024-09-01T11:51:44.000Z",
      "concatCommandInfo": {
        "id": 1,
        "originalVideos": [
          {
            "id": 3,
            "order": 1,
            "filePath": "/public\\origin-videos\\30cc9df9-3950-4445-aa3c-0772fdeb1b64.mp4"
          },
          {
            "id": 1,
            "order": 2,
            "filePath": "/public\\origin-videos\\30a69d5d-b6e7-4d7c-814c-156e1117d598.mp4"
          }
        ]
      }
    },
    {
      "id": 2,
      "filePath": "public\\final-videos\\trimmed_1725191504902.mp4",
      "status": "done",
      "createdAt": "2024-09-01T11:51:44.000Z",
      "trimCommand": {
        "id": 1,
        "startTime": "00:00:15",
        "endTime": "00:01:20"
      }
    }
  ]
}
```

  </details>
  
## ERD

## 과제 내용

### 분석 내용

- 여러 동영상을 업로드 할 수 있어야 함
- trim api와 concat api를 호출했을 때 동영상이 편집되는 것이 아니고 계속 명령을 쌓아둠
- `명령 작업 수행` api를 호출했을 때 쌓아둔 명령들을 한번에 수행함
- 편집된 동영상의 다운로드 링크를 제공해야 함
- 각각의 정보들을 조회할 수 있어야 함

### 핵심 문제 해결 전략

- 동시에 여러 파일 업로드를 위해 nestjs에서 제공하는 FilesInterceptor를 사용하였습니다.
- 동시에 여러 처리 요청을 처리할 수 있도록 nestjs에서 제공하는 bull queue(redis)를 사용하였습니다.

  - 비동기 처리 및 작업을 큐에 추가하여 백그라운드에서 작업할 수 있도록 하였습니다.
  - 큐 설정을 통해 consume 재시도 처리를 하였고 동영상 처리 성공/실패 시 finalVideo의 status를 변경하여 결과를 알도록 하였습니다.

### 기타

- 회원가입 기능 및 로그인 기능이 없는 관계로 각 API 호출 시 queryString 으로 userId값을 같이 보내도록 구현하였습니다.
  - server 시작 시 userId: 1번과 2번에 해당하는 dummy data를 넣어두었습니다.
  - 만약 로그인 기능이 있다면 session 혹은 token에서 user정보를 가져오므로 userId를 따로 보내지 않아도 됩니다.
