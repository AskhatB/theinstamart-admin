import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { getShop } from '../controllers/shop';
import { getShop as getInstagramShop } from '../controllers/parser';
import { getProductsByShop } from '../controllers/product';
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
    alignItems: 'center'
  }
}));

interface MatchParams {
  id: string;
}

const ProductList = (props: RouteComponentProps<MatchParams>) => {
  const classes = useStyles();
  const [shopId, setShopId] = useState();
  const [loading, setLoading] = useState(true);
  const [instagram, setInstagram] = useState();
  const [products, setProducts] = useState();

  const fetchAll = async () => {
    try {
      const shop: ShopMainInfo = await getShop(+props.match.params.id);
      const products = await getProductsByShop(+props.match.params.id);
      setProducts(products);
      setShopId(shop.shop_id);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }
  console.log(instagram);

  return (
    <div>
      <Link to={`/parsed-products/${shopId}`}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 15 }}
        >
          Добавить продукт
        </Button>
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map((v: any) => {
          return (
            <Card className={classes.root}>
              <CardContent className={classes.df}>
                <Avatar
                  style={{ marginRight: 15, width: 150, height: 150 }}
                  src={v.photos[0]}
                ></Avatar>
                <Typography>{v.good_name}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
