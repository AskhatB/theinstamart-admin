import React, { useState } from 'react';

import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';

import { Category as CategoryInterface } from '../types/category';

const CreateCategory = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [form, setForm] = useState({
    category_name: '',
    category_name_single: '',
    icon: '',
    image: '',
    parent_id: ''
  });

  const formHandler = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };



  console.log(form);
  return (
    <div>
      <Input
        variant="filled"
        label="Название"
        value={form.category_name}
        onChange={formHandler}
        name="category_name"
      />
      <Input
        variant="filled"
        label="Префикс"
        value={form.category_name_single}
        onChange={formHandler}
        name="category_name_single"
      />
      
    </div>
  );
};

export default CreateCategory;
