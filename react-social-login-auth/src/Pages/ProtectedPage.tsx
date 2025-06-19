import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/useAuth";
import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ProtectedPage = () => {
  const { callProtectedRoute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [token, setToken] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [copied, setCopied] = useState({ token: false, response: false });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const res = await callProtectedRoute();
        setApiResponse(res);
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
      } catch (err) {
        console.error('Authentication failed:', err);
      }
    };

    handleCallback();
  }, [location, navigate, callProtectedRoute]);

  const copyToClipboard = (text: string, type: 'token' | 'response') => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  // Updated function to render left-aligned JSON with line numbers
  const renderJsonWithLines = (data: any) => {
  if (!data) return null;
  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split('\n');
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Line numbers column */}
      <Box sx={{ 
        color: theme.palette.text.secondary,
        textAlign: 'right',
        pr: 2,
        userSelect: 'none',
        borderRight: `1px solid ${theme.palette.divider}`,
        mr: 2
      }}>
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </Box>
      
      {/* JSON content with proper indentation */}
      <Box component="pre" sx={{ 
        flex: 1,
        m: 0,
        overflowX: 'auto',
        '& .json-key': { color: '#7dd3fc' },
        '& .json-string': { color: '#86efac' },
        '& .json-number': { color: '#fca5a5' },
        '& .json-boolean': { color: '#fca5a5' },
        '& .json-null': { color: '#d8b4fe' }
      }}>
        {lines.map((line, i) => {
          // Calculate indentation based on the line content
          const indentMatch = line.match(/^\s+/);
          const indent = indentMatch ? indentMatch[0] : '';
          
          return (
            <div key={i} style={{ 
              textAlign: 'left',
              paddingLeft: indent.length > 0 ? `${indent.length * 8}px` : '0' 
            }} dangerouslySetInnerHTML={{ 
              __html: line
                .replace(/"([^"]+)"/g, '<span class="json-string">"$1"</span>')
                .replace(/(\s*)([^:]+):/g, (match, spaces, key) => 
                  `${spaces}<span class="json-key">${key}</span>:`)
                .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
                .replace(/\b(null)\b/g, '<span class="json-null">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="json-number">$1</span>')
            }} />
          );
        })}
      </Box>
    </Box>
  );
};

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: theme.palette.grey[900],
      minHeight: '100vh'
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 4,
        color: theme.palette.common.white
      }}>
        Very Secret Page
      </Typography>

      {/* Token Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          color: theme.palette.common.white
        }}>
          <Typography variant="h6" component="strong">
            Token from localStorage:
          </Typography>
          {token && (
            <Button
              size="small"
              startIcon={<ContentCopyIcon fontSize="small" />}
              onClick={() => copyToClipboard(token, 'token')}
              sx={{ ml: 2 }}
              variant="outlined"
              color="secondary"
            >
              {copied.token ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </Box>
        <Paper elevation={3} sx={{ 
          p: 2, 
          backgroundColor: theme.palette.grey[800],
          overflowX: 'auto',
          border: '1px solid #333'
        }}>
          {token ? (
            <Box
              component="pre"
              sx={{
                m: 0,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                color: theme.palette.common.white
              }}
            >
              {token}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No token found in localStorage.
            </Typography>
          )}
        </Paper>
      </Box>

      {/* API Response Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          color: theme.palette.common.white
        }}>
          <Typography variant="h6" component="strong">
            Response from Protected API:
          </Typography>
          {apiResponse && (
            <Button
              size="small"
              startIcon={<ContentCopyIcon fontSize="small" />}
              onClick={() => copyToClipboard(JSON.stringify(apiResponse, null, 2), 'response')}
              sx={{ ml: 2 }}
              variant="outlined"
              color="secondary"
            >
              {copied.response ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </Box>
        <Paper elevation={3} sx={{ 
          p: 2, 
          backgroundColor: theme.palette.grey[800],
          overflowX: 'auto',
          border: '1px solid #333'
        }}>
          {apiResponse ? (
            renderJsonWithLines(apiResponse)
          ) : (
            <Typography variant="body1" color="text.secondary">
              No API response yet.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProtectedPage;