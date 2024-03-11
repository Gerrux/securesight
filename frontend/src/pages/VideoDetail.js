import React, {useEffect, useRef, useState} from 'react';
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
  const playerRef = useRef(null);
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
    const currentTime = playerRef.current?.getCurrentTime() || 0;

    setSelectedVersion(version);
    const newHlsManifestUrl = video.video_versions[version].replaceAll('\\', '/');
    setHlsManifestUrl(`http://localhost:8000/media/${newHlsManifestUrl}`);
    setCurrentTime(currentTime);
  };

  const handleProgress = ({ playedSeconds }) => {
    setCurrentTime(playedSeconds);
  };

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar />
      <Container fluid className={`d-flex p-0 flex-column ${currentMode === 'Dark' ? 'main-dark' : ''}`}>
        <div className="video-wrapper pt-5 mx-5">
          {video ? (
            <>
              <Row>
                <Col md={9}>
                  <div className="player-container rounded">
                    {hlsManifestUrl ? (
                      <ReactPlayer
                        ref={playerRef}
                        url={hlsManifestUrl}
                        controls
                        className="player"
                        width="100%"
                        height="100%"
                        playing
                        progressInterval={1000}
                        onProgress={handleProgress}
                        onReady={() => {
                          playerRef.current.seekTo(currentTime);
                        }}
                      />
                    ) : (
                      <div>Loading video...</div>
                    )}
                  </div>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center bg-primary rounded mb-3">
                  <div>
                    <h2>LOG</h2>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={9}>
                  <Row>
                  <Col>
                    <h3 className={` ${currentMode === 'Dark' ? 'text-light' : 'text-dark'}`}>{video.title}</h3>
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
                </Col>
              </Row>
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
        </div>
      </Container>
    </Container>
  );
};

export default VideoDetail;
