import cv2
from PIL import Image
import io


def generate_thumbnail(file_path):
    print("Generating thumbnail for:", file_path)

    # Open video file
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        print("Error opening video file")
        return None

    # Get video frame
    ret, frame = cap.read()
    if not ret:
        print("Error reading frame from video")
        return None

    # Close video file
    cap.release()

    # Convert frame to RGB
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Resize frame
    frame = cv2.resize(frame, (200, 150))

    # Convert frame to JPEG
    _, buffer = cv2.imencode('.jpg', frame)

    # Convert buffer to BytesIO
    thumbnail = io.BytesIO(buffer)

    return thumbnail
