import React from 'react';
import { isMobile } from 'react-device-detect';

const ProgressBar = ({ bgcolor, progress, height, text }) => {
  const Parentdiv = {
    height: height,
    width: '50%',
    backgroundColor: 'whitesmoke',
    borderRadius: 40,
    margin: 20,
  };

  const Parentdiv2 = {
    height: height,
    width: '90%',
    backgroundColor: 'whitesmoke',
    borderRadius: 40,
    margin: 20,
  };

  const Childdiv = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
    alginItems: 'center',
    fontSize: '0.8rem',
    fontFamily: '"Lato",sans-serif',
    lineHeight: '1rem',
  };

  const progresstext = {
    padding: 5,
    color: 'white',
    fontWeight: 400,
  };

  return (
    <div style={isMobile ? Parentdiv2 : Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>{`${text}`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
