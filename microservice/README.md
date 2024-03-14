# SecureSight Assisstant
## Описание проекта
**SecureSight Assistant** - это микросервис, построенный на FastAPI, который использует библиотеки **NVIDIA TensorRT** и **CUDA** для оптимизации производительности и скорости обработки видеоданных.

Этот конвейер распознавания действий работает нескольких человек в три этапа. Он достигает реальной производительности в 33 кадра в секунду для всего конвейера распознавания действий с видео одного человека. Шаги включают в себя:

1. Оценка позы с помощью trtpose
2. Отслеживание людей с помощью deepsort
3. Классификатор действий с помощью dnn

# Скорость обработки
Спецификация компьютера

- **OS**: Windows 11
- **CPU**: Ryzen 5 5600 @3.50GHz
- **GPU**:  Geforce RTX 4060
- **CUDA**: 12.3
- **TensorRT**: 8

| Pipeline Step |  Model  | Step's Model Input Size (H, W) | `Pytorch` FPS| `TensorRT` FPS|
| -  | - | - | - | - |
| Pose Estimation  | densenet121 |(256x256) | 25 fps  | 38 fps |
||
| Pose Estimation + Tracking  | densenet121 + deepsort `siamese` reid | (256x256) + (256x128) | 22 fps | 34 fps
| Pose Estimation + Tracking  | densenet121 + deepsort `wideresnet` reid | (256x256) + (256x128) | 22 fps | 31 fps
||
| Pose Estimation + Tracking + Action | densenet121 + deepsort `siamese` reid + dnn | (256x256) + (256x128) + (--) | 21 fps | 33 fps |
| Pose Estimation + Tracking + Action | densenet121 + deepsort `wideresnet` reid + dnn | (256x256) + (256x128) + (--) | 21 fps | 30 fps|

Обучающий датасет классификатора действий [здесь](https://drive.google.com/open?id=1V8rQ5QR5q5zn1NHJhhf-6xIeDdXVtYs9).

## Основные особенности
Быстрая и точная обработка видеопотоков благодаря **TensorRT** и **CUDA**
Модульное решение, основанное на микросервисах, позволяющее легко масштабировать и интегрировать с другими системами
**RESTful API** для взаимодействия с другими приложениями и сервисами
Современные алгоритмы компьютерного зрения для обнаружения и классификации объектов
## Требования
`Docker`

`NVIDIA GPU с поддержкой CUDA 12.1`

`cuDNN 8.9.7`

`TensorRT 8`

## Установка
Склонируйте репозиторий:

`git clone https://github.com/Gerrux/securesight.git`

Перейдите в каталог микросервиса:

`cd securesight/microservice`

Создайте Docker-изображение:

`docker build -t securesight:latest .`

Запустите Docker-контейнер:

`docker run --gpus all -p 9000:9000 securesight:latest`

### Запуск в DEV
Установка torch2trt

```bash
git clone https://github.com/NVIDIA-AI-IOT/torch2trt
cd torch2trt
sudo python3 setup.py install --plugins
```
Установка trt_pose

```bash
git clone https://github.com/NVIDIA-AI-IOT/trt_pose
cd trt_pose
sudo python setup.py install
```
Другие библиотеки находятся в  [`requirements.txt`](requirements.txt).

Run below command to install them.
```bash
pip install -r requirements.txt
```
Запускать из корневой директории микросервиса 
```
cd .\microservice\ 

uvicorn app.main:app --port 9000
```

## Использование
После успешного запуска контейнера, ваш микросервис будет доступен по адресу http://localhost:9000. Вы можете использовать любой REST-клиент, такой как Postman или curl, для взаимодействия с API.

Авторы
------

* Калинин Илья ([Gerrux](https://github.com/Gerrux))
* Покрышкин Даниил ([dstish](https://github.com/dstish))
