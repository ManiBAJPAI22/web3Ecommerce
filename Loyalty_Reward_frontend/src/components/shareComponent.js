import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

export const ShareComponent = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard: ', error);
    }
  };

  const shareUrl = 'https://google.com';

  const styles = {
    container: {
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      width: '100%',
      textAlign: 'center',
    },
    button: {
      margin: '10px',
      padding: '10px 20px',
      cursor: 'pointer',
      background: '#007bff',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
    },
    socialButton: {
      margin: '5px',
      borderRadius: '5px',
    },
    icon: {
      borderRadius: '50%',
      overflow: 'hidden',
    },
    shareText: {
      marginLeft: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Your Referral Code</h2>
      <p>{code}</p>
      <button onClick={handleCopy} style={styles.button}>
        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
      <h3>Share on Social Media</h3>
      <FacebookShareButton
        style={styles.socialButton}
        url={shareUrl}
        quote={`Use my referral code: ${code}`}
      >
        <FacebookIcon style={styles.icon} />
        <span style={styles.shareText}>Share on Facebook</span>
      </FacebookShareButton>
      <TwitterShareButton
        style={styles.socialButton}
        url={shareUrl}
        title={`Use my referral code: ${code}`}
      >
        <TwitterIcon style={styles.icon} />
        <span style={styles.shareText}>Share on Twitter</span>
      </TwitterShareButton>
      <WhatsappShareButton
        style={styles.socialButton}
        title={`Use my referral code: ${code}`}
      >
        <WhatsappIcon style={styles.icon} />
        <span style={styles.shareText}>Share on Whatsapp</span>
      </WhatsappShareButton>
    </div>
  );
};
