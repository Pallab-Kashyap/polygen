import React from 'react'

const BackgroundLayout = ({z = "0"}: {z: string}) => {
  return (
    <div className={`fixed inset-0 bg-black opacity-25 z-${z}`}></div>
  );
}

export default BackgroundLayout
