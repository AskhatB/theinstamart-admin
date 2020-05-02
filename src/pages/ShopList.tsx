import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { allShops } from '../controllers/shop';

import { ShopMainInfo } from '../types/shopMainInfo';

import { shop as shotInitialValue } from '../variables/initialValues';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginBottom: theme.spacing(2),
  },
  df: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const ShopList = () => {
  const classes = useStyles();
  const [shops, setShops] = useState<ShopMainInfo[]>([shotInitialValue]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async (): Promise<void> => {
    const res: ShopMainInfo[] = await allShops();
    setShops(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <LinearProgress />;
  return (
    <div>
      <Link to="/create-shop?step=1">
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 15 }}
        >
          Добавить магазин
        </Button>
      </Link>
      {shops.map((v: ShopMainInfo) => {
        return (
          <Card className={classes.root} key={v.shop_name}>
            <CardContent className={classes.df}>
              <div className={classes.df}>
                <Avatar style={{ marginRight: 15 }} src={v.logo_path}></Avatar>
                <Typography>{v.shop_name}</Typography>
              </div>
              <Link to={`/product-list/${v.shop_id}`}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: 15 }}
                >
                  Список товаров
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ShopList;
