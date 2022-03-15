import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  root1: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  center: {
    textAlign: 'center',
  },
  padding: {
    padding: theme.spacing(3),
  },
  formControl: {
    flexGrow: 1,
  },
  flex: {
    display: 'flex',
  },
  button: {
    margin: theme.spacing(1),
  },
  autoCompleat: {
    margin: theme.spacing(1),
  },
  green: {
    backgroundColor: 'green',
    color: 'white',
  },
  tableHead: {
    backgroundColor: 'lightBlue',
  },
  img: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    height: 100,
    width: 100,
  },
  imgSmp: {
    width: '400px',
  },
  viewButton: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  orderNo: {
    fontFamily: 'Montserrat, sans-serif',
  },
  lookupButton: {
    backgroundColor: 'orange',
    color: 'white',
    '&:hover': {
      backgroundColor: 'orange',
    },
  },
  buttonGroup: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  buttonHide: {
    display: 'none',
  },
  buttonEnable: {
    display: 'block',
  },
  icon: {},
  noBorder: {
    border: '0',
  },
  errorRoot: {
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
  },
  errorImg: {
    width: '250px',
    marginBottom: '1.5rem',
    [theme.breakpoints.down('xs')]: {
      width: '200px',
    },
  },
  errorButton: {
    marginTop: '1.5rem',
    borderRadius: '20px',
    textTransform: 'capitalize',
    backgroundColor: 'blue',
    color: '#fff',
    width: '140px',
    '&:hover': {
      backgroundColor: 'blue',
      boxShadow: 'none',
    },
  },
  paperCard: {
    padding: '40px 50px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px',
    },
  },
  welcomeRoot: {
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
  },
  welcomeImg: {
    width: '350px',
    marginBottom: '1.5rem',
    [theme.breakpoints.down('xs')]: {
      width: '200px',
    },
  },
  name: {
    color: '#f55c47',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '400',
  },
  btnDisabled: {
    display: 'none',
  },
  btnEnabled: {
    display: 'inline-block',
  },
  fieldDisabled: {
    display: 'none',
  },
  fieldEnabled: {
    display: 'inline-block',
  },
  componentHide: {
    display: 'none',
  },
  componentShow: {
    display: 'block',
  },
  gpsIcon: {
    color: '#ff5903',
    position: 'absolute',
    borderLeftColor: '3%',
  },
}));

export const DarkerDisabledTextField = withStyles({
  root: {
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.6)', // (default alpha is 0.38)
    },
  },
})(TextField);
