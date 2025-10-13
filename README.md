# ShopAppWebsite

### Note:

#### front_end and back_end build by docker (but i didnt build run front_end (new_update_soon))

#### branch_name: feature/(backend?fontend)/(page/table working)/name

#### ex: feature/backend/users/HoangVanDuong

#### sau mỗi màn cần note anh và tạo pull request để check conflict để merge

#### mỗi khi merge xong anh báo lại bọn em cần pull code mới về để code tránh bị conflict

#### BE

##### version: Python 3.11.13 (python:3.11-slim trong docker) y/c đúng phiên bản để tránh xung đột

##### running back_end: docker compose up -d --build (có thể build bằng local python)

##### add framework: add to requirements.txt for docker run

##### need to checkback by running docker before put to branch

##### fileName: tableWorking+Pattern

##### ex: userRepo,...

##### api: common/tableWorking/action

##### vd: common/users/login (riêng thằng này cần một con auth) sau phải chuyển thành auth/login (auth/resgister)

##### luồng Controller <- Response <- Dto,Model <- Service <- Repositories



#### FE

##### version: yarn_lastest (yarn)

##### running back_end: yarn dev

##### add framework: yarn add +framework

##### 2 bạn cần thống nhất về css để cho web mình đồng bộ css tránh việc 2 màn 2 giao diện khác nhau

##### name: Mỗi một page cần tạo ra trong page 1 forder name page và trong đó gồm 2 file Condition(logic) và index(hiển thị)

##### api call thì hỏi backend trả về nhé các hàm fe dùng chung thì cho ra contants để bạn khác nếu cùng logic có thể sài lại vv

##### luồng user <- index <- Condition <- stores, css, vv <- api <- BE

#### những cái note hoặc log để debug sau khi debug xong cần clean code
