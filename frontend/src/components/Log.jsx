import React, { useEffect, useRef, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import '../styles/log.css';
import {Scrollbars} from "react-custom-scrollbars-2";

const Log = ({ log, videoRef }) => {
  const logRef = useRef(null);
  const [logData, setLogData] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const parsedLogData = JSON.parse(log);
    setLogData(parsedLogData);
  }, [log]);

  const handleTimestampClick = (timestamp) => {
    videoRef.current.seekTo(timestamp);
  };

  const formatActions = (actions) => {
    const filteredActions = filter === 'All' ? actions : actions.filter(([action]) => ['punch', 'kick', 'run'].includes(action));
    return filteredActions.filter((action) => action[1] !== 0).map(([action, probability], i) => (
      <span key={i}>
        {action}: {(probability * 100).toFixed(2)}%{i !== filteredActions.length - 1 && ', '}
      </span>
    ));
  };

  const formatTimestamp = (timestamp) => {
    const intTimestamp = Math.round(timestamp);
    const minutes = Math.floor(intTimestamp / 60);
    const seconds = intTimestamp % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
      <div className="w-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <button className="btn btn-sm btn-secondary" onClick={() => setFilter('All')}>Все</button>
          <button className="btn btn-sm btn-danger mx-1" onClick={() => setFilter('Dangerous')}>Опасные</button>
        </div>
      </div>
  <ListGroup ref={logRef} className="log-container">
  <Scrollbars style={{ height: 700 }} autoHide>
    {[...new Set(logData.map((entry) => entry.Timestamp))].map((timestamp, index) => {
      const entriesAtTimestamp = logData.filter((entry) => entry.Timestamp === timestamp);
      const formattedActions = entriesAtTimestamp.map((entry) => formatActions(entry.Actions));
        return (
          <React.Fragment key={index}>
            {formattedActions.some((actions) => actions.length > 0) && (
              <ListGroup.Item onClick={() => handleTimestampClick(timestamp)} className="log-item">
                <span className="log-timestamp">Время: {formatTimestamp(timestamp)}</span>
                <ListGroup className="log-actions">
                  {formattedActions.map((actions, i) => (
                    <ListGroup.Item key={i}>{actions}</ListGroup.Item>
                  ))}
                </ListGroup>
              </ListGroup.Item>
            )}
          </React.Fragment>
        );
      })}
    </Scrollbars>
    </ListGroup>
        </div>
  );
};

export default Log;
