import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { ReactComponent as DryCleaning } from '../../utils/assets/drycleaning.svg';
import { ReactComponent as Washdryfold } from '../../utils/assets/washdryfold.svg';
import { ReactComponent as Tailoring } from '../../utils/assets/tailoring.svg';
import { useStyles } from './classes';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { orderType } from '../../store/actions/orderAction';

import PageHeader from 'components/UI/PageHeader';
import Confirmbox from 'components/UI/Confirmbox';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/lib/axios';

const CustomColorCheckbox = withStyles({
  root: {
    color: '#008EFF',
    '&$checked': {
      color: '#008EFF',
    },
  },
  checked: {},
})((props) => <Checkbox color='default' {...props} />);
export default function Order() {
  const classes = useStyles();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleChange1 = (event) => {
    setChecked1(event.target.checked);
  };
  const handleChange2 = (event) => {
    setChecked2(event.target.checked);
  };
  const handleChange3 = (event) => {
    setChecked3(event.target.checked);
  };
  const [selectedValue, setSelectedValue] = useState('a');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'size-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const addOrder = async (data) => {
    console.log('test', data);
    await dispatch(orderType(data));
    navigate('/pickup');
  };

  const loadData = async () => {
    const { data } = await axios.get('/customer/getData');
    setUserData(data);
    console.log('test', data);
  };

  useEffect(() => {
    if (selectedValue === 'c') {
      setOpen(true);
    } else {
      setOpen(false);
    }
    loadData();
  }, [selectedValue]);

  return (
    <div>
      <PageHeader tittle={"Let's get started with today's order!"} />
      <Confirmbox open={open} setOpen={setOpen} />
      <div className={classes.divroot}>
        <div className={classes.divroot}>
          <p className={classes.para1}>Select what services you will need.</p>
          <Divider className={classes.divider} />
          <p className={classes.para2}>
            Pick-up {'&'} Delivery For
            <span style={{ color: '#008EFF', marginLeft: 5 }}>
              700 Boylston St - Boston, MA 02116 Change
            </span>
          </p>
          <div className={classes.flex1}>
            <RadioGroup
              row
              aria-labelledby='demo-form-control-label-placement'
              name='position'
              defaultValue='top'
            >
              <FormControlLabel
                control={
                  <Radio
                    {...controlProps('a')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 35,
                        color: '#63C04F',
                      },
                    }}
                  />
                }
                label={
                  <span className={classes.spantext}>
                    {'Attended (you will meet driver)'}
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Radio
                    {...controlProps('c')}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 35,
                        color: '#63C04F',
                      },
                    }}
                  />
                }
                label={
                  <span className={classes.spantext}>
                    {'Unattended (you will leave laundry out)'}
                  </span>
                }
              />
            </RadioGroup>
          </div>
          <Divider className={classes.divider} />
        </div>
        <div className={classes.layout} style={{ marginTop: '1rem' }}>
          <Grid container>
            <Grid xs={12} sm={12} md={4} style={{ padding: '1rem' }}>
              <div className={classes.maindiv}>
                {checked1 ? (
                  <div className={classes.subdiv1}>
                    <Washdryfold className={classes.csvImage} />
                  </div>
                ) : (
                  <div className={classes.subdiv2}>
                    <Washdryfold className={classes.csvImage} />
                  </div>
                )}

                <div className={classes.box}>
                  <CustomColorCheckbox
                    checked={checked1}
                    onChange={handleChange1}
                    style={{
                      transform: 'scale(1.6)',
                    }}
                  />
                  <p className={classes.boxpara}>Wash/Dry/Fold Service</p>
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={12} md={4} style={{ padding: '1rem' }}>
              <div className={classes.maindiv}>
                {checked2 ? (
                  <div className={classes.subdiv1}>
                    <DryCleaning className={classes.csvImage} />
                  </div>
                ) : (
                  <div className={classes.subdiv2}>
                    <DryCleaning className={classes.csvImage} />
                  </div>
                )}

                <div className={classes.box}>
                  <CustomColorCheckbox
                    checked={checked2}
                    onChange={handleChange2}
                    style={{
                      transform: 'scale(1.6)',
                    }}
                  />
                  <p className={classes.boxpara}>Dry Cleaning</p>
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={12} md={4} style={{ padding: '1rem' }}>
              <div className={classes.maindiv}>
                {checked3 ? (
                  <div className={classes.subdiv1}>
                    <Tailoring className={classes.csvImage} />
                  </div>
                ) : (
                  <div className={classes.subdiv2}>
                    <Tailoring className={classes.csvImage} />
                  </div>
                )}

                <div className={classes.box}>
                  <CustomColorCheckbox
                    checked={checked3}
                    onChange={handleChange3}
                    style={{
                      transform: 'scale(1.6)',
                    }}
                  />
                  <p className={classes.boxpara}>Tailoring {'&'} Alterations</p>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        {(checked1 || checked2 || checked3) && (
          <div
            className={classes.continue}
            onClick={() =>
              addOrder({
                orderNumber: 1,
                zipcode: userData.location[0].zipCode,
              })
            }
          >
            <div className={classes.box}>
              <p>Continue {'&'} Customize My Order</p>
              <ArrowForwardIcon style={{ marginLeft: '0.3rem' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
