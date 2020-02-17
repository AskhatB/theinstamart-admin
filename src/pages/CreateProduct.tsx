import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

import ImageUploader from '../components/ImageUploader';
import { getAllCategories } from '../controllers/category';
import { createProduct as createProductController } from '../controllers/product';
import { Category as CategoryInterface } from '../types/category';
import { Product as ProductInterface } from '../types/product';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginBottom: theme.spacing(2),
      width: 350
    }
  })
);

interface MatchParams {
  shop: string;
}

const CreateProduct = (props: RouteComponentProps<MatchParams>) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState();
  const [subcategories, setSubcategories] = useState();
  const [form, setForm] = useState({
    good_name: '',
    shop_id: '',
    category_id: '',
    subcategory_id: '',
    description: '',
    price: '',
    photos: [],
    is_available: false
  });

  const classes = useStyles();

  const fetchAll = async (): Promise<void> => {
    try {
      const res: CategoryInterface[] = await getAllCategories();
      const subcategories = res.filter(x => !!x.parent_id);
      const categories = res.filter(x => !x.parent_id);
      setCategories(categories);
      setSubcategories(subcategories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const formHandler = (e: any): void => {
    let { value, name, type, checked } = e.target;
    if (type === 'checkbox') {
      value = checked;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    setLoading(true);
    const submitForm: ProductInterface = {
      good_name: form.good_name,
      shop_id: +props.match.params.shop,
      category_id: +form.category_id,
      subcategory_id: +form.subcategory_id,
      description: form.description,
      price: +form.price,
      photos: form.photos,
      is_available: form.is_available
    };
    try {
      const res = await createProductController(submitForm);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div>
      <ImageUploader />
      <Input
        variant="filled"
        label="Название"
        value={form.good_name}
        onChange={formHandler}
        className={classes.input}
        name="good_name"
      />
      <br />
      <Input
        variant="filled"
        label="Описание"
        multiline
        value={form.description}
        onChange={formHandler}
        className={classes.input}
        name="description"
      />
      <br />
      <Input
        variant="filled"
        label="Цена"
        value={form.price}
        onChange={formHandler}
        className={classes.input}
        name="price"
      />
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.is_available}
            onChange={formHandler}
            value={form.is_available}
            color="primary"
            name="is_available"
          />
        }
        label="В наличии"
      />
      <br />
      <FormControl variant="filled" className={classes.input}>
        <InputLabel>Категория</InputLabel>
        <Select
          value={form.category_id}
          onChange={formHandler}
          name="category_id"
        >
          {categories.map((v: CategoryInterface) => (
            <MenuItem value={v.category_id}>{v.category_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      {form.category_id !== '' && (
        <FormControl variant="filled" className={classes.input}>
          <InputLabel>Подкатегория</InputLabel>
          <Select
            value={form.subcategory_id}
            onChange={formHandler}
            name="subcategory_id"
          >
            {subcategories
              .filter(
                (x: CategoryInterface) => x.parent_id === +form.category_id
              )
              .map((v: CategoryInterface) => (
                <MenuItem value={v.category_id}>{v.category_name}</MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      <br />
      <Button variant="contained" color="primary" onClick={submitForm}>
        Добавить продукт
      </Button>
    </div>
  );
};

export default CreateProduct;
