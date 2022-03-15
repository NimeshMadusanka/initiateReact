import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import '../../utils/styles/Calendar.css';
import PageHeader from 'components/UI/PageHeader';
import Progressbar from '../../components/UI/ProgressBar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useStyles } from '../order/classes';
import { useDispatch } from 'react-redux';
import { delivery } from '../../store/actions/orderAction';
import axios from '../../utils/lib/axios';
import { useNavigate } from 'react-router-dom';

export default function Pickup() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const myRef = useRef(null);
  const [value, onChange] = useState('');
  let navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState('a');
  const [getData, setGetData] = useState([]);

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

  const adddelivery = async (data) => {
    console.log('test', data);
    await dispatch(delivery(data));
    navigate('/checkout');
  };

  const loadData = async () => {
    const { data } = await axios.get('/datepicker/123');
    setGetData(data);
    console.log('test', data);
  };

  useEffect(() => {
    executeScroll();
    loadData();
  }, []);

  if (getData.length === 0) {
    return (
      <div ref={myRef} style={{ marginBottom: 50 }}>
        <PageHeader
          tittle={'Choose Your Wash/dry/fold Delivery Date and Time'}
        />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Progressbar
            bgcolor='#35D8F2'
            progress='75'
            text={'DELIVERY'}
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
      <PageHeader tittle={'Choose Your Wash/dry/fold Delivery Date and Time'} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Progressbar
          bgcolor='#35D8F2'
          progress='75'
          text={'DELIVERY'}
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
          maxDate={new Date(getData.endDate)}
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
              adddelivery({
                diliverDate: '2020-01-05',
                diliverTimeSlot: '10:00 - 11:00',
              })
            }
          >
            <div className={classes.continue2}>
              <div className={classes.box}>
                <p>Continue</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
