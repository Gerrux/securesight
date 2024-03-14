import json

from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse
from uvicorn.protocols.utils import ClientDisconnected
from app.src.video_processing import process_video

router = APIRouter()


@router.post("/process_video")
async def process_video_route(file: UploadFile):
    try:
        processed_video_path, log = process_video(file)

        def stream_video_file():
            with open(processed_video_path, "rb") as f:
                while True:
                    data = f.read(4096)
                    if not data:
                        break
                    yield data

        response = StreamingResponse(stream_video_file(), media_type="video/mp4")
        response.headers["Content-Disposition"] = f"attachment; filename=processed_video.mp4"
        response.headers["Log"] = json.dumps(log)
        return response
    except ClientDisconnected:
        print("Client disconnected before response was fully sent")
        # Perform any necessary cleanup here
        raise
