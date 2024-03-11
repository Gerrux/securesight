import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiClient from '../ApiClient';
import ReactPlayer from 'react-player';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { Footer, Sidebar } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import '../styles/video_detail.css';

const VideoDetail = () => {
  const { setCurrentMode, currentMode } = useStateContext();
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [hlsManifestUrl, setHlsManifestUrl] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('240p');
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await ApiClient.get(`/videos/${slug}/`);
        setVideo(response.data.video);
        setHlsManifestUrl(response.data.hls_manifest_url);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [slug]);

  const handleVersionChange = (version) => {
    setSelectedVersion(version);
    const newHlsManifestUrl = video.video_versions[version].replaceAll('\\', '/');
    setHlsManifestUrl(`http://localhost:8000/media/${newHlsManifestUrl}`);
  };

  const handleProgress = ({ playedSeconds }) => {
    setCurrentTime(playedSeconds);
  };

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar />
      <Container fluid className={`main-container d-flex p-0 flex-column ${currentMode === 'Dark' ? 'main-dark' : ''}`}>
        <Container className="">
          {video ? (
              <>
                <Row>
                  <Col>
                    <h1>{video.title}</h1>
                  </Col>
                  <Col xs="auto">
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="version-dropdown">
                        {selectedVersion}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {Object.entries(video.video_versions).map(([version, path]) => (
                            <Dropdown.Item key={version} onClick={() => handleVersionChange(version)}>
                              {version}
                            </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
                <div className="player-container">
                  {hlsManifestUrl ? (
                    <ReactPlayer
                      url={hlsManifestUrl}
                      controls
                      className="player"
                      width="100%"
                      height="100%"
                      playing
                      progressInterval={1000}
                      onProgress={handleProgress}
                      currentTime={currentTime}
                    />
                  ) : (
                    <div>Loading video...</div>
                  )}
                </div>
                <Row className="info">
                  <Col>
                    <p>Uploaded by: {video.uploaded_by}</p>
                    <p>Uploaded at: {new Date(video.uploaded_at).toLocaleString()}</p>
                  </Col>
                </Row>
              </>
          ) : (
              <div>Loading video information...</div>
          )}
          <Footer/>
        </Container>
      </Container>
    </Container>
  );
};

export default VideoDetail;
