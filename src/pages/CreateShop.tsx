import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import qs from 'query-string';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/TextField';
import Loader from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';

import { createShop } from '../controllers/shop';
import { getShop as getShopInstagram } from '../controllers/parser';
import { getAllCategories } from '../controllers/category';
import { uploadToStore } from '../controllers/image';

import * as imageToBase from '../services/imageToBase';

import { Category as CategoryInterface } from '../types/category';
import { ShopMainInfo } from '../types/shopMainInfo';

import * as variables from '../variables';

const CreateShop = (props: RouteComponentProps) => {
  const drawerWidth = 240;
  const inputWidth = 350;
  const { step } = qs.parse(props.location.search);

  const [loading, setLoading] = useState(true);
  const [instagramLogin, setInstagramLogin] = useState('');
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [form, setForm] = useState({
    shopName: '',
    description: '',
    cities: [],
    logoPath: '',
    goodsCount: '',
    followersCount: '',
    phoneNumbers: [],
    whatsapp: '',
    addresses: [],
    categories: [],
    instagram: ''
  });
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [addresses, setAddresses] = useState(['']);
  const [categoriesForm, setCategoriesForm] = useState(['']);
  const [cities, setCities] = useState([]);
  const [logo, setLogo] = useState();

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      input: {
        marginBottom: theme.spacing(2),
        width: inputWidth
      },
      logo: {
        width: theme.spacing(25),
        height: theme.spacing(25)
      },
      drawerPaper: {
        width: drawerWidth
      },
      uploadButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
      }
    })
  );

  const classes = useStyles();

  const fetchAll = async (): Promise<void> => {
    try {
      const res: CategoryInterface[] = await getAllCategories();
      setCategories(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const formHander = (e: any) => {
    const { value, name } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const phoneNumbersHandler = (value: string, index: number): void => {
    setPhoneNumbers(prev => {
      prev[index] = value;
      return prev;
    });
  };

  const addressesHandler = (value: string, index: number): void => {
    setAddresses(prev => {
      prev[index] = value;
      return prev;
    });
  };

  const categoriesHandler = (_: any, values: any) => {
    setCategoriesForm(values);
  };

  const citiesHandler = (_: any, values: any) => {
    setCities(values);
  };

  const addPhone = () => {
    setPhoneNumbers(prev => [...prev, '']);
  };

  const addAddress = () => {
    setAddresses(prev => [...prev, '']);
  };

  const parseInstagram = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getShopInstagram(instagramLogin);
      const image = await imageToBase.convertFromUrl(
        response.profile_pic_url_hd
      );
      setForm(prev => ({
        ...prev,
        shopName: response.full_name,
        description: response.description,
        followersCount: response.followers_count,
        whatsapp: response.whatsapp,
        instagram: response.username
      }));
      setLogo(image);
      props.history.push({
        pathname: '/create-shop',
        search: '?step=2'
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  console.log(categoriesForm);
  console.log();

  const onCreateShop = async () => {
    const shopInfo: ShopMainInfo = {
      shop_name: form.shopName,
      description: form.description,
      cities: [1],
      logo_path: '',
      goods_count: +form.goodsCount,
      followers_count: +form.followersCount,
      phone_numbers: phoneNumbers,
      whatsapp: form.whatsapp,
      addresses: addresses,
      categories: [],
      instagram: form.instagram
    };
    setLoading(true);
    try {
      const image = await uploadToStore([imageToBase.cutPrefix(logo)]);
      shopInfo.logo_path = image[0];
      shopInfo.categories = categories
        .filter(x => categoriesForm.indexOf(x.category_name) > -1)
        .map(v => v.category_id);
      const res = await createShop(shopInfo);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onUploadImage = async (e: any) => {
    const res = await imageToBase.convertFromFile(e.target.files[0]);
    setLogo(res);
  };

  if (loading) {
    return <Loader />;
  }

  if (step === '1') {
    return (
      <div>
        <Input
          variant="filled"
          label="Введите instagram логин"
          className={classes.input}
          value={instagramLogin}
          onChange={e => setInstagramLogin(e.target.value)}
        />
        <br />
        <Button variant="contained" color="primary" onClick={parseInstagram}>
          Далее
        </Button>
        <br />
        <Link to="/create-shop?step=2">Добавить вручную</Link>
      </div>
    );
  }

  console.log(form);

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        multiple
        type="file"
        onChange={onUploadImage}
      />
      <Avatar variant="square" className={classes.logo} src={logo}></Avatar>
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
        className={classes.input}
        value={form.shopName}
        onChange={formHander}
        name="shopName"
      />
      <br />
      <Input
        variant="filled"
        label="Описание"
        className={classes.input}
        value={form.description}
        multiline
        onChange={formHander}
        name="description"
      />
      <br />
      <Input
        variant="filled"
        label="Количество подписчиков"
        className={classes.input}
        value={form.followersCount}
        onChange={formHander}
        name="followersCount"
      />
      <br />
      <Input
        variant="filled"
        label="Количество продуктов"
        className={classes.input}
        value={form.goodsCount}
        onChange={formHander}
        name="goodsCount"
      />
      <br />
      <Input
        variant="filled"
        label="Whats'app"
        className={classes.input}
        value={form.whatsapp}
        onChange={formHander}
        name="whatsapp"
      />
      <br />
      <Input
        variant="filled"
        label="Ссылка на Instagram"
        className={classes.input}
        value={form.instagram}
        onChange={formHander}
        name="instagram"
      />
      <br />
      <div>
        {phoneNumbers.map((v: string, i: number) => {
          return (
            <>
              <Input
                variant="filled"
                label={`Телефон ${i + 1}`}
                className={classes.input}
                name="phoneNumbers"
                onChange={e => phoneNumbersHandler(e.target.value, i)}
              />
              <br />
            </>
          );
        })}
        <br />
        <Button variant="contained" color="primary" onClick={addPhone}>
          + Добавить телефон
        </Button>
        <br />
        <br />
        <div>
          {addresses.map((v: string, i: number) => {
            return (
              <>
                <Input
                  variant="filled"
                  label={`Адрес ${i + 1}`}
                  className={classes.input}
                  name={`phone${i + 1}`}
                  onChange={e => addressesHandler(e.target.value, i)}
                />
                <br />
              </>
            );
          })}
          <br />
          <Button variant="contained" color="primary" onClick={addAddress}>
            + Добавить адрес
          </Button>
        </div>
        <br />
        <div>
          <Autocomplete
            multiple
            id="tags-filled"
            className={classes.input}
            options={categories.map(v => v.category_name)}
            freeSolo
            onChange={categoriesHandler}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={params => (
              <Input
                {...params}
                variant="filled"
                label="Категории"
                placeholder="Категории"
                fullWidth
              />
            )}
          />
        </div>
        <div>
          <Autocomplete
            multiple
            id="tags-filled"
            className={classes.input}
            options={variables.cities}
            freeSolo
            onChange={citiesHandler}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={params => (
              <Input
                {...params}
                variant="filled"
                label="Города"
                placeholder="Города"
                fullWidth
              />
            )}
          />
        </div>
        <Button variant="contained" color="secondary" onClick={onCreateShop}>
          Добавить магазин
        </Button>
      </div>
    </div>
  );
};

export default CreateShop;
