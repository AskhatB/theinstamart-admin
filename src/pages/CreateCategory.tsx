import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import {
  Category as CategoryInterface,
  CategoryCreation as CategoryCreationInterface,
} from '../types/category';

import * as categoryController from '../controllers/category';

import * as imageToBase from '../services/imageToBase';

import { category as categoryInitalValue } from '../variables/initialValues';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
    uploadButton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    field: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  })
);

interface MatchParams {
  id: string;
}

const CreateCategory = (props: RouteComponentProps<MatchParams>) => {
  console.log("props ---> ", props);
  const classes = useStyles();
  const [categories, setCategories] = useState<CategoryInterface[]>([
    categoryInitalValue,
  ]);
  const [loading, setLoading] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [form, setForm] = useState({
    category_name: '',
    category_name_single: '',
    icon: '',
    image: '',
    parent_id: '',
  });

  const fetchCategories = async (): Promise<void> => {
    const categories: CategoryInterface[] = await categoryController.getAllCategories();
    categories.unshift({ category_id: 0, category_name: 'Нет' });
    setCategories(categories);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formHandler = (e: any): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.toString(),
    }));
  };

  const clearForm = (): void => {
    setForm({
      category_name: '',
      category_name_single: '',
      icon: '',
      image: '',
      parent_id: '',
    });
  };

  const onUploadImage = async (e: any): Promise<void> => {
    const res: string = await imageToBase.convertFromFile(e.target.files[0]);
    setForm((prev) => ({
      ...prev,
      image: res,
    }));
  };

  const onSuccesCreation = (): void => {
    setSuccessOpen(true);
    clearForm();
  };

  const onErrorCreation = (): void => {
    setErrorOpen(true);
  };

  const onSubmitForm = async (): Promise<void> => {
    setLoading(true);
    try {
      const categoryInfo: CategoryCreationInterface = {
        category_name: form.category_name,
        category_name_single: form.category_name_single,
        icon: '',
        image: form.image,
      };

      if (form.parent_id !== '' && form.parent_id !== '0') {
        categoryInfo.parent_id = +form.parent_id;
      }
      await categoryController.createCategory(categoryInfo);
      onSuccesCreation();
    } catch (err) {
      onErrorCreation();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LinearProgress />;
  return (
    <div>
      <input
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        onChange={onUploadImage}
        style={{ display: 'none' }}
      />
      <Avatar
        variant="square"
        className={classes.logo}
        src={form.image}
      ></Avatar>
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.uploadButton}
        >
          Загрузить логотип
        </Button>
      </label>
      <br />
      <Input
        variant="filled"
        label="Название"
        value={form.category_name}
        onChange={formHandler}
        name="category_name"
        className={classes.field}
      />
      <br />
      <Input
        variant="filled"
        label="Префикс"
        value={form.category_name_single}
        onChange={formHandler}
        name="category_name_single"
        className={classes.field}
      />
      <br />
      <FormControl>
        <InputLabel htmlFor="age-native-simple">Категория</InputLabel>
        <Select
          native
          value={form.parent_id}
          onChange={formHandler}
          className={classes.field}
          inputProps={{
            name: 'parent_id',
            id: 'age-native-simple',
          }}
        >
          {categories.map((v: CategoryInterface) => (
            <option value={v.category_id}>{v.category_name}</option>
          ))}
        </Select>
      </FormControl>
      <br />
      <Button
        variant="contained"
        color="primary"
        component="span"
        className={classes.uploadButton}
        onClick={onSubmitForm}
      >
        Создать категорию
      </Button>
      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={() => setSuccessOpen(false)}
        >
          Категория создана
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={errorOpen}
        autoHideDuration={2500}
        onClose={() => setErrorOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setErrorOpen(false)}
        >
          Произошла ошибка
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CreateCategory;
