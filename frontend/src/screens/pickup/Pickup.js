import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../../utils/styles/Calendar.css';
import PageHeader from 'components/UI/PageHeader';
import Progressbar from '../../components/UI/ProgressBar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch } from 'react-redux';
import { pickup } from '../../store/actions/orderAction';
import { useStyles } from '../order/classes';
import axios from '../../utils/lib/axios';
import { useNavigate } from 'react-router-dom';

export default function Pickup() {
  const classes = useStyles();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const myRef = useRef(null);
  const isMounted = useRef(false);
  const [value, onChange] = useState('');
  const [selectedValue, setSelectedValue] = useState('a');
  const [getData, setGetData] = useState([]);
  //eslint-disable-next-line
  const [fData, setFData] = useState([]);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const executeScroll = () => myRef.current.scrollIntoView();

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'size-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const addpickup = async (data) => {
    console.log('test', data);
    await dispatch(pickup(data));
    navigate('/delivery');
  };

  const loadData = async () => {
    const { data } = await axios.get('/datepicker/123');
    setGetData(data);

    console.log('test', data);
  };

  const disabledDates = [
    new Date('2022-03-18T09:50:38.593Z'),
    new Date('2022-03-19T00:00:00.000Z'),
  ];

  const isSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      return disabledDates.find((dDate) => isSameDay(dDate, date));
    }
  }
  const getFilteredData = (data) => {
    let filteredData = getData.availableDates.filter((item) => {
      return item.date === data;
    });
    console.log('filteredData', filteredData);
    setFData(filteredData);
  };

  useEffect(() => {
    executeScroll();
    loadData();
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      getFilteredData('3/16/2022');
    } else {
      isMounted.current = true;
    }
    //eslint-disable-next-line
  }, [value]);
  if (getData.length === 0) {
    return (
      <div ref={myRef} style={{ marginBottom: 50 }}>
        <PageHeader tittle={'Choose Your Pick-up Date and Time'} />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Progressbar
            bgcolor='#35D8F2'
            progress='35'
            text={'PICKUP'}
            height={30}
          />
        </div>
        <div className={classes.textbox}>
          <p className={classes.text}>Services Not Available</p>
        </div>
      </div>
    );
  }
  return (
    <div ref={myRef} style={{ marginBottom: 50 }}>
      <PageHeader tittle={'Choose Your Pick-up Date and Time'} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Progressbar
          bgcolor='#35D8F2'
          progress='35'
          text={'PICKUP'}
          height={30}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {' '}
        <Calendar
          onChange={onChange}
          value={new Date()}
          calendarType={'US'}
          minDate={new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)}
          maxDate={new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000)}
          tileDisabled={tileDisabled}
        />
      </div>
      {value !== '' && (
        <>
          <div className={classes.flex2}>
            <div className={classes.box2}>
              <p
                style={{ padding: '1rem' }}
              >{`Select a pickup time for ${value.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}</p>
            </div>
          </div>
          <div className={classes.flex2}>
            <div className={classes.box3}>
              <RadioGroup
                column
                aria-labelledby='demo-form-control-label-placement'
                name='position'
                defaultValue='top'
              >
                {/* {fData.map((item) => (

                )} */}
                <FormControlLabel
                  style={{ border: '1px solid #75a8dc', margin: 2 }}
                  control={
                    <Radio
                      {...controlProps('a')}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                          color: '#00A3FF',
                        },
                      }}
                    />
                  }
                  label={
                    <span className={classes.spantext2}>
                      {'Between'}
                      <span className={classes.spantext3}> 10 pm - 12 pm</span>
                    </span>
                  }
                />
                <FormControlLabel
                  style={{ border: '1px solid #75a8dc', margin: 2 }}
                  control={
                    <Radio
                      {...controlProps('b')}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                          color: '#00A3FF',
                        },
                      }}
                    />
                  }
                  label={
                    <span className={classes.spantext2}>
                      {'Between'}
                      <span className={classes.spantext3}> 10 pm - 12 pm</span>
                    </span>
                  }
                />
                <FormControlLabel
                  style={{ border: '1px solid #75a8dc', margin: 2 }}
                  control={
                    <Radio
                      {...controlProps('c')}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                          color: '#00A3FF',
                        },
                      }}
                    />
                  }
                  label={
                    <span className={classes.spantext2}>
                      {'Between'}
                      <span className={classes.spantext3}> 10 pm - 12 pm</span>
                    </span>
                  }
                />
              </RadioGroup>
            </div>
          </div>

          <div
            className={classes.divroot2}
            onClick={() =>
              addpickup({
                pickupDate: '2020-01-01',
                pickupTimeSlot: '10:00 - 11:00',
              })
            }
          >
            <div className={classes.continue2}>
              <div className={classes.box}>
                <p>Continue To Delivery</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
