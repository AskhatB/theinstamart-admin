import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

import { getShop } from '../controllers/shop';
import { getProductsByShop } from '../controllers/product';

import { ShopMainInfo } from '../types/shopMainInfo';
import { Product as ProductInterface } from '../types/product';

import * as initalValues from '../variables/initialValues';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  df: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    marginRight: theme.spacing(2),
  },
  editButton: {
    width: 'max-content',
    height: 'max-content'
  }
}));

interface MatchParams {
  id: string;
}

const ProductList = (props: RouteComponentProps<MatchParams>) => {
  const classes = useStyles();
  const [shopId, setShopId] = useState<number | undefined>(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductInterface[]>([
    initalValues.product,
  ]);

  const fetchAll = async (): Promise<void> => {
    try {
      const shop: ShopMainInfo = await getShop(+props.match.params.id);
      const products: ProductInterface[] = await getProductsByShop(
        +props.match.params.id
      );
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

  if (loading) return <LinearProgress />;
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
                <Avatar className={classes.avatar} src={v.photos[0]}></Avatar>
                <Typography>{v.good_name}</Typography>
              </CardContent>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
