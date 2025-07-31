import React from 'react';
import PropTypes from 'prop-types';

const SongCard = ({ name, artist, addedAt, addedByName, addedByImage, albumCover, direction }) => (
  <div className="flex items-center w-full">
    {/* Card on the left or date on the left depending on direction */}
    {direction === 'left' ? (
      <div className='w-full flex justify-end'>
        <div className="song-card flex flex-row">
            <div className=' flex flex-col items-end p-4'>
                <h2>{name}</h2>
                <span>{artist}</span>
            </div>
            <img 
              src={albumCover} 
              alt={`${name} cover`} 
              className="album-cover w-24 object-cover rounded-r-full" 
            />
        </div>
      </div>
    ) : (
      <div className="pl-4 w-full flex flex-col items-end text-sm">
        <span>{new Date(addedAt).toLocaleDateString()}</span>
        <div className="flex flex-row items-end pt-2">
            <span>{addedByName}</span>
            {addedByImage && <img src={addedByImage} alt={addedByName} className="user-image ml-2 w-6 h-6 rounded-full" />}
        </div>
      </div>
    )}

    {/* Dot in the center */}
    <div className="w-4 h-2 rounded-full bg-white mx-4"></div>

    {/* Date on the right */}
    {direction === 'left' ? (
      <div className="pl-4 w-full flex flex-col justify-start items-start text-sm">
        <span>{new Date(addedAt).toLocaleDateString()}</span>
        <div className="flex flex-row items-start pt-2">
            {addedByImage && <img src={addedByImage} alt={addedByName} className="user-image mr-2 w-6 h-6 rounded-full" />}
            <span>{addedByName}</span>
        </div>
      </div>
    ) : (
      <div className='w-full flex justify-start'>
        <div className="song-card flex flex-row">
            <img 
              src={albumCover} 
              alt={`${name} cover`} 
              className="album-cover w-24 object-cover rounded-l-full" 
            />
            <div className=' flex flex-col items-start p-4'>
                <h2>{name}</h2>
                <span>{artist}</span>
            </div>
        </div>
      </div>
    )}

  </div>
);

SongCard.propTypes = {
  name: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  addedAt: PropTypes.string.isRequired,
  addedBy: PropTypes.string.isRequired,
  albumCover: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
};

export default SongCard;
