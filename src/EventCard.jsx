import React from 'react';
import PropTypes from 'prop-types';

const EventCard = ({ title, date }) => (
  <div className="event-card border-4 border-white-500 rounded-lg p-6 px-24 m-6 shadow-lg">
    <h1 className="text-xxl font-bold mb-2">{title}</h1>
    <span className="text-s text-white">{new Date(date).toLocaleDateString()}</span>
  </div>
);

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default EventCard;
