import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiClient from '../ApiClient';

const VideoDetail = () => {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await ApiClient.get(`/videos/${slug}/`);
        setVideo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideo();
  }, [slug]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{video.title}</h1>
      <video src={video.file} controls />
      {/* Добавьте другие поля, которые вы хотите отобразить */}
    </div>
  );
};

export default VideoDetail;
