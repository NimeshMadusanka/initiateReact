import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  box: {
    backgroundColor: '#fff',
    width: '50%',
    boxShadow: '0px 0px 5px #f5f5f5',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  tittle: {
    color: '#35bfff',
    fontSize: '1.5rem',
    fontWeight: 300,
    lineHeight: '1rem',
    textAlign: 'center',
    marginTop: '1rem',
    marginBottom: '1.5rem',
  },
  para1: {
    color: '#888888',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1rem',
    textAlign: 'center',
    padding: '1.5rem',
  },
  box2: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2rem',
    paddingTop: '1rem',
    paddingBottom: 0,
  },
  para2: {
    color: '#333',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: '1.37rem',
  },
  para3: {
    color: '#999',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.37rem',
  },
  para4: {
    color: '#222',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.37rem',
    marginBottom: '0.3rem',
  },
  para5: {
    color: '#222',
    fontSize: '0.9rem',
    fontWeight: 400,
    lineHeight: '1.37rem',
    padding: 2,
  },
}));
