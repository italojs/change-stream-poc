
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

const ChangeStreamTableComponent = ({ 
  logs, 
  title, 
  isLoading = false 
}) => {
  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <div style={{marginTop: 32}}>
        <h2>{title}</h2>
        <table className="change-stream-table">
            <thead>
                <tr>
                    <th>Collection</th>
                    <th>Fields</th>
                    <th>Counter</th>
                    <th>Message</th>
                    <th>Raw Data</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log) => {
                    const randomIdx = Math.floor(Math.random() * 1000000);
                    
                    // Function to generate solid and distinct color based on msg value
                    const generateColorForMsg = (msg) => {
                      if (!msg) return '#C0C0C0'; // medium gray for empty values
                      
                      // Generate simple hash from text
                      let hash = 0;
                      for (let i = 0; i < msg.length; i++) {
                        const char = msg.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash; // Convert to 32-bit integer
                      }
                      
                      // Palette with MEDIUM and ULTRA-DISTINCT colors
                      const colors = [
                        '#E74C3C', // Medium red
                        '#3498DB', // Medium blue
                        '#2ECC71', // Medium green
                        '#F39C12', // Medium orange
                        '#9B59B6', // Medium purple
                        '#1ABC9C', // Medium turquoise
                        '#E67E22', // Medium dark orange
                        '#34495E', // Medium gray blue
                        '#E91E63', // Medium pink
                        '#FF9800', // Medium amber
                        '#607D8B', // Medium steel blue
                        '#795548', // Medium brown
                        '#009688', // Medium teal
                        '#FF5722', // Medium red orange
                        '#8BC34A', // Medium lime green
                        '#FFEB3B', // Medium yellow
                        '#673AB7', // Medium deep purple
                        '#00BCD4', // Medium cyan
                        '#4CAF50', // Medium material green
                        '#FFC107'  // Medium gold
                      ];
                      
                      // Select color based on hash
                      const colorIndex = Math.abs(hash) % colors.length;
                      return colors[colorIndex];
                    };
                    
                    const backgroundColor = generateColorForMsg(log.msg);
                    
                    return (
                        <tr 
                          key={log.counter || randomIdx} 
                          style={{ backgroundColor, color: '#000' }}
                        >
                            <td>{log.collection || 'links'}</td>
                            <td>
                                <ReactJson
                                    src={log.fields || {}}
                                    name={false}
                                    collapsed={true}
                                    enableClipboard={false}
                                    displayDataTypes={false}
                                    style={{fontSize:12}}
                                />
                            </td>
                            <td>{log.counter || '-'}</td>
                            <td><strong>{log.msg || '-'}</strong></td>
                            <td>
                                <ReactJson
                                    src={log || {}}
                                    name={false}
                                    collapsed={true}
                                    enableClipboard={false}
                                    displayDataTypes={false}
                                    style={{fontSize:12}}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );
};

export const ChangeStreamTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Function to be called when new logs arrive
    function handleNewChangeStreamLog(data) {
      if(data.detail.msg === 'ping') return
      setLogs((prevLogs) => [data.detail, ...prevLogs.slice(0, 10)]); // Limit to 10 most recent logs
    }

    // Add listener for custom event
    window.addEventListener('changeStreamLogUpdated', handleNewChangeStreamLog);

    // Cleanup: remove listener when component is unmounted
    return () => {
      window.removeEventListener('changeStreamLogUpdated', handleNewChangeStreamLog);
    };
  }, []);

  return (
    <ChangeStreamTableComponent 
      logs={logs}
      title="Change Stream Logs (WebSocket/DDP)"
    />
  );
};
