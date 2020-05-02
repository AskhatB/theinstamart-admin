import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

import * as categoryController from '../controllers/category';

import { Category as CategoryInterface } from '../types/category';

import { category as categoryInitalValue } from '../variables/initialValues';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
    },
    title: {
      fontWeight: 'bold',
      marginRight: theme.spacing(1),
    },
    image: {
      marginBottom: theme.spacing(1),
    },
    button: {
      marginBottom: theme.spacing(2),
    },
    cardContent: {
      display: 'flex',
    },
    cardContentSide: {
      marginRight: theme.spacing(2),
    },
    editButton: {
      width: 'max-content',
      height: 'max-content',
    },
  })
);

const CategoryList = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<CategoryInterface[]>([
    categoryInitalValue,
  ]);

  const fetchCategories = async (): Promise<void> => {
    try {
      const res: CategoryInterface[] = await categoryController.getAllCategories();
      setCategories(res);
    } catch (err) {
      setError(err.toString());
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <LinearProgress />;
  if (!!error) return <div>Произошла ошибка: {error}</div>;
  return (
    <div>
      <Link to="/create-category">
        <Button variant="contained" color="primary" className={classes.button}>
          Добавить категрию
        </Button>
      </Link>
      {categories.map((category: CategoryInterface) => (
        <Card className={classes.cardWrapper}>
          <CardContent className={classes.cardContent}>
            <div className={classes.cardContentSide}>
              <Avatar className={classes.image} src={category.image}></Avatar>
              <Avatar className={classes.image} src={category.icon}></Avatar>
            </div>
            <div>
              <Typography>
                <span className={classes.title}>Название категории:</span>
                {category.category_name}
              </Typography>
              <Typography>
                <span className={classes.title}>Приставка:</span>
                {category.category_name_single}
              </Typography>
              <Typography>
                <span className={classes.title}>SLUG:</span>
                {category.slug || 'Нет'}
              </Typography>
            </div>
          </CardContent>
          <Link to={`/create-category/${category.category_id}`}>
            <IconButton color="primary" className={classes.editButton}>
              <EditIcon />
            </IconButton>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
