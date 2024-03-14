# Use the official CUDA 12.1 image as the base image
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu20.04
LABEL authors="kalinin"

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Update packages and install necessary dependencies
RUN apt-get update && apt-get install -y \
  curl \
  wget \
  git \
  gnupg \
  lsb-release \
  python3 \
  python3-pip \
  python3-dev \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Add the NVIDIA TensorRT GPG key
RUN wget -O - https://nvidia.github.io/libnvidia-container/gpgkey | apt-key add - && \
  wget https://developer.download.nvidia.com/compute/redist/jna/v5.6.0/jna-5.6.0.jar && \
  mkdir -p /usr/share/java && mv jna-5.6.0.jar /usr/share/java/

# Install TensorRT 8
RUN apt-get update && apt-get install -y \
  libnvidia-container-tools \
  tensorrt=8.0.1.6-1+cuda12.1 \
  && rm -rf /var/lib/apt/lists/*

# Create app directory and set working directory
WORKDIR /app

# Clone and install torch2trt
RUN git clone https://github.com/NVIDIA-AI-IOT/torch2trt && \
    cd torch2trt && \
    pip3 install -r requirements.in && \
    python3 setup.py install --plugins && \
    rm -rf torch2trt

# Clone and install trt_pose
RUN git clone https://github.com/NVIDIA-AI-IOT/trt_pose && \
    cd trt_pose && \
    pip3 install -r requirements.txt && \
    python setup.py install && \
    rm -rf trt_pose

# Clone the securesight repository
RUN git clone https://github.com/Gerrux/securesight.git && \
    mv securesight/microservice/* . && \
    rm -rf securesight

# Install FastAPI and other requirements
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Expose the port for the FastAPI application
EXPOSE 9000

# Start the FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9000"]
