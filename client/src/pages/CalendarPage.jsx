import React from 'react';
import Calendar from '../components/Calendar';
import Slider from '../components/Slider';
import Sliderup from '../components/Sliderup';
import '../style/calendar.css';
import '../style/pages.css';

const CalendarPage = () => {
  return (
    <div className="wrapper">
      <div className="Homepage">
        <Sliderup />
        <div className="calendar-view">
          <Calendar />
        </div>
      </div>
      <Slider />
    </div>
  );
};

export default CalendarPage;
