import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { getShop } from '../controllers/shop';
import { getShop as getInstagramShop } from '../controllers/parser';
import { ShopMainInfo } from '../types/shopMainInfo';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(1)
  },
  df: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

interface MatchParams {
  id: string;
}

const ParsedProducts = (props: RouteComponentProps<MatchParams>) => {
  const [loading, setLoading] = useState(true);
  const [instagram, setInstagram] = useState();
  const classes = useStyles();

  const fetchAll = async () => {
    try {
      const shop: ShopMainInfo = await getShop(+props.match.params.id);
      const response = await getInstagramShop(shop.instagram);
      setInstagram(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <div>
      <Link to={`/create-product/${props.match.params.id}`}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 15 }}
        >
          Добавить с нуля
        </Button>
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {instagram.image_posts.map((v: any) => {
          return (
            <Card className={classes.root}>
              <CardContent className={classes.df}>
                <div className={classes.df}>
                  <Avatar
                    style={{ marginRight: 15, width: 150, height: 150 }}
                    src={v.post_images_urls[0]}
                  ></Avatar>
                  <Typography>{v.post_text}</Typography>
                </div>
                <Link to={`/create-product/${props.match.params.id}`}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: 15 }}
                  >
                    Добавить товар
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ParsedProducts;
