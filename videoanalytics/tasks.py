import json
import os
import subprocess
from time import sleep
import requests
from django.conf import settings
from django.core.files.base import ContentFile

from securesight.celery import app


def generate_thumbnail(file_path):
    print("Generating thumbnail for:", file_path)

    # Set the time for the thumbnail (in seconds)
    time = 5

    # Set the size for the thumbnail
    size = '200x150'

    # Set the output file name
    output_file = 'thumbnail.jpg'

    # Generate thumbnail command
    command = f'ffmpeg -i {file_path} -ss {time} -s {size} -vframes 1 {output_file}'

    # Execute command
    subprocess.call(command, shell=True)

    # Open output file as ContentFile
    with open(output_file, 'rb') as f:
        thumbnail = ContentFile(f.read())

    # Remove output file
    os.remove(output_file)

    return thumbnail


def get_video_resolution(video_path):
    command = f'ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 {video_path}'
    output = subprocess.check_output(command, shell=True).decode('utf-8').strip()
    width, height = map(int, output.split('x'))
    return width, height


@app.task
def convert_video_to_hls(video_id):
    from videoanalytics.models import Video
    # Путь к выходному файлу
    sleep(1)
    video = Video.objects.get(id=video_id)
    video_path = video.file.path
    print(video_path)
    output_path = os.path.splitext(video_path)[0]

    # Разрешения для различных версий видео
    resolutions = {'240p': (426, 240), '360p': (640, 360), '720p': (1280, 720)}

    # Получить разрешение исходного видео
    video_width, video_height = get_video_resolution(video_path)

    # Команда для конвертации видео в HLS с использованием ffmpeg
    hls_paths = {}
    for version, (width, height) in resolutions.items():
        if video_width >= width and video_height >= height:
            hls_file_name = f"{output_path}_{version}.m3u8"
            command = f'ffmpeg -i {video_path} -profile:v baseline -level 3.0 -s {width}x{height} -start_number 0 -hls_time 10 -hls_list_size 0 -f hls {hls_file_name}'
            subprocess.call(command, shell=True)
            hls_paths[version] = os.path.relpath(hls_file_name, settings.MEDIA_ROOT)

    thumbnail = generate_thumbnail(video_path)

    if thumbnail is not None:
        thumbnail_path = os.path.join(os.path.dirname(video_path), f"{video.slug}.jpg")
        video.thumbnail.save(os.path.basename(thumbnail_path), thumbnail, save=False)

    video.video_versions = hls_paths
    video.processed = True
    video.task_id = None
    video.save()


@app.task
def send_video_to_fastapi(video_id):
    from videoanalytics.models import Video
    sleep(1)
    video = Video.objects.get(id=video_id)
    video_file_path = video.file.path
    with open(video_file_path, 'rb') as video_file:
        fastapi_url = f'{settings.FASTAPI_URL}/process_video'
        files = {'file': (video.file.name, video_file)}
        response = requests.post(fastapi_url, files=files)

    if response.status_code != 200:
        return {"error": "Failed to send video to FastAPI backend for processing."}

    processed_video = response.content
    log = json.loads(response.headers['Log'])

    # Save the processed video and log to the Video model
    video.file = ContentFile(processed_video, name=f'ai_{video.slug}.mp4')
    video.ai_processed = True
    video.log = log
    video.save()

    convert_video_to_hls(video_id)
    return {"video_id": video.id}
