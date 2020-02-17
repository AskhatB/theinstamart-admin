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
import { Category as CategoryInterface } from '../types/category';
import * as variables from '../variables';
import { ShopMainInfo } from '../types/shopMainInfo';

const CreateShop = (props: RouteComponentProps) => {
  const drawerWidth = 240;
  const inputWidth = 350;
  const { step } = qs.parse(props.location.search);

  const [loading, setLoading] = useState(true);
  const [instagramLogin, setInstagramLogin] = useState('');
  const [categories, setCategories] = useState<CategoryInterface[]>([]);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [followersCount, setFollowersCount] = useState();
  const [goodsCount, setGoodCount] = useState();
  const [wpp, setWpp] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [addresses, setAddresses] = useState(['']);
  const [categoriesForm, setCategoriesForm] = useState(['']);
  const [cities, setCities] = useState([]);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      input: {
        marginBottom: theme.spacing(2),
        width: inputWidth
      },
      logo: {
        width: theme.spacing(12),
        height: theme.spacing(12)
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
      const {
        full_name,
        description,
        followers_count
      } = await getShopInstagram(instagramLogin);
      setName(full_name);
      setDescription(description);
      setFollowersCount(followers_count);
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

  const onCreateShop = async () => {
    const shopInfo: ShopMainInfo = {
      shop_name: name,
      description: description,
      cities: [1],
      logo_path: 'example',
      goods_count: goodsCount,
      followers_count: followersCount,
      phone_numbers: phoneNumbers,
      whatsapp: wpp,
      addresses: addresses,
      categories: [1,2],
      instagram: 'stepup.kaz'
    };
    setLoading(true);
    try {
      const res = await createShop(shopInfo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        multiple
        type="file"
      />
      <Avatar variant="square" className={classes.logo}></Avatar>
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
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <br />
      <Input
        variant="filled"
        label="Описание"
        className={classes.input}
        value={description}
        multiline
        onChange={e => setDescription(e.target.value)}
      />
      <br />
      <Input
        variant="filled"
        label="Количество подписчиков"
        className={classes.input}
        value={followersCount}
        onChange={e => setFollowersCount(e.target.value)}
      />
      <br />
      <Input
        variant="filled"
        label="Количество продуктов"
        className={classes.input}
        value={goodsCount}
        onChange={e => setGoodCount(e.target.value)}
      />
      <br />
      <Input
        variant="filled"
        label="Whats'app"
        className={classes.input}
        value={wpp}
        onChange={e => setWpp(e.target.value)}
      />
      <br />
      <Input
        variant="filled"
        label="Ссылка на Instagram"
        className={classes.input}
        value={instagramLink}
        onChange={e => setInstagramLink(e.target.value)}
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
                name={`phone${i + 1}`}
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
