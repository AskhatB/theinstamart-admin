import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

interface PropTypes {
  images: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2),
      display: 'flex'
    },
    imageRoot: {
      width: 300,
      height: 300,
      marginRight: theme.spacing(2),
      '& > img': {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    }
  })
);

const ImageUploader = (props: PropTypes) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.images.map(v => {
        return (
          <div className={classes.imageRoot}>
            <img src={v} alt="some alt"/>
          </div>
        );
      })}
    </div>
  );
};

export default ImageUploader;
